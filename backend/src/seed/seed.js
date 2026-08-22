import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import { connectMongoDB, disconnectMongoDB } from '../db/connectMongoDB.js';
import { User } from '../models/User.js';
import { Article } from '../models/Article.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.resolve(__dirname, '../../../docs/harmoniq.users.json');

const ARTICLES_FILE = path.resolve(__dirname, '../../../docs/harmoniq.articles.json');

const readJson = async (filePath) => {
  const content = await readFile(filePath, 'utf8');
  return JSON.parse(content);
};

const getObjectId = (value) => {
  if (typeof value === 'string') {
    return new Types.ObjectId(value);
  }

  if (value?.$oid) {
    return new Types.ObjectId(value.$oid);
  }

  throw new Error(`Invalid ObjectId value: ${JSON.stringify(value)}`);
};

const seed = async () => {
  await connectMongoDB();

  try {
    const sourceUsers = await readJson(USERS_FILE);
    const sourceArticles = await readJson(ARTICLES_FILE);

    console.log(`Source users: ${sourceUsers.length}`);
    console.log(`Source articles: ${sourceArticles.length}`);

    // --------------------------------------------------
    // 1. Build source user map
    // --------------------------------------------------

    const sourceUserMap = new Map(sourceUsers.map((user) => [user._id.$oid, user]));

    // --------------------------------------------------
    // 2. Validate Article -> User references
    // --------------------------------------------------

    const brokenReferences = sourceArticles.filter((article) => {
      const ownerId = article.ownerId?.$oid;

      return !ownerId || !sourceUserMap.has(ownerId);
    });

    if (brokenReferences.length > 0) {
      console.error(`Broken author references: ${brokenReferences.length}`);

      for (const article of brokenReferences.slice(0, 10)) {
        console.error({
          articleId: article._id?.$oid,
          ownerId: article.ownerId?.$oid,
          title: article.title,
        });
      }

      throw new Error('Seed aborted because some articles reference missing users.');
    }

    // --------------------------------------------------
    // 3. Calculate articlesAmount from actual articles
    // --------------------------------------------------

    const articlesAmountByUser = new Map();

    for (const article of sourceArticles) {
      const ownerId = article.ownerId.$oid;

      articlesAmountByUser.set(ownerId, (articlesAmountByUser.get(ownerId) ?? 0) + 1);
    }

    // --------------------------------------------------
    // 4. Transform and upsert Users
    // --------------------------------------------------

    const userOperations = [];

    for (const sourceUser of sourceUsers) {
      const sourceUserId = sourceUser._id.$oid;

      const randomPassword = randomUUID();
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      const userDocument = {
        name: sourceUser.name,

        // Technical seed account.
        // It is not intended for normal login.
        email: `${sourceUserId}@seed.harmoniq.local`,

        passwordHash,

        avatarUrl: sourceUser.avatarUrl ?? null,
        avatarPublicId: null,

        savedArticles: [],

        // Source of truth = actual Article documents.
        articlesAmount: articlesAmountByUser.get(sourceUserId) ?? 0,
      };

      userOperations.push({
        updateOne: {
          filter: {
            _id: getObjectId(sourceUser._id),
          },
          update: {
            $set: userDocument,
          },
          upsert: true,
        },
      });
    }

    if (userOperations.length > 0) {
      await User.bulkWrite(userOperations);
    }

    // --------------------------------------------------
    // 5. Transform and migrate Articles
    // --------------------------------------------------

    const articleOperations = sourceArticles.map((sourceArticle) => {
      const now = new Date();

      const articleDocument = {
        title: sourceArticle.title,
        description: sourceArticle.desc,
        article: sourceArticle.article,

        imageUrl: sourceArticle.img,

        // Legacy images are hosted outside Cloudinary.
        imagePublicId: null,

        publicationDate: new Date(sourceArticle.date),

        authorId: getObjectId(sourceArticle.ownerId),

        // Migration mapping from provided source data.
        viewsCount: typeof sourceArticle.rate === 'number' ? sourceArticle.rate : 0,

        category: 'general',
      };

      return {
        updateOne: {
          filter: {
            _id: getObjectId(sourceArticle._id),
          },

          update: {
            $set: {
              ...articleDocument,
              updatedAt: now,
            },

            $setOnInsert: {
              createdAt: now,
            },

            // Remove fields from the legacy Article contract.
            $unset: {
              img: '',
              desc: '',
              rate: '',
              ownerId: '',
              date: '',
            },
          },

          upsert: true,
        },
      };
    });

    if (articleOperations.length > 0) {
      // Native collection is used intentionally here.
      // It guarantees that legacy fields not present in the
      // current Mongoose schema can still be removed via $unset.
      await Article.collection.bulkWrite(articleOperations);
    }

    // --------------------------------------------------
    // 6. Final verification
    // --------------------------------------------------

    const seededUserIds = sourceUsers.map((user) => getObjectId(user._id));

    const seededArticleIds = sourceArticles.map((article) => getObjectId(article._id));

    const usersCount = await User.countDocuments({
      _id: {
        $in: seededUserIds,
      },
    });

    const articlesCount = await Article.countDocuments({
      _id: {
        $in: seededArticleIds,
      },
    });

    // Check whether legacy fields still exist.
    const legacyArticlesCount = await Article.collection.countDocuments({
      $or: [
        { img: { $exists: true } },
        { desc: { $exists: true } },
        { rate: { $exists: true } },
        { ownerId: { $exists: true } },
        { date: { $exists: true } },
      ],
    });

    console.log('');
    console.log('Seed completed successfully');
    console.log(`Users: ${usersCount}`);
    console.log(`Articles: ${articlesCount}`);
    console.log('Broken author references: 0');
    console.log(`Articles with legacy fields: ${legacyArticlesCount}`);

    if (legacyArticlesCount > 0) {
      throw new Error(
        `Migration incomplete: ${legacyArticlesCount} articles still contain legacy fields.`,
      );
    }
  } finally {
    await disconnectMongoDB();
  }
};

seed().catch((error) => {
  console.error('Seed failed');
  console.error(error);

  process.exit(1);
});
