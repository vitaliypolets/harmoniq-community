import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';

const toArticleDto = (article) => ({
  id: article._id.toString(),
  title: article.title,
  description: article.description,
  imageUrl: article.imageUrl,
  publicationDate: article.publicationDate,
  author: {
    id: article.authorId._id.toString(),
    name: article.authorId.name,
    avatarUrl: article.authorId.avatarUrl ?? null,
    articlesAmount: article.authorId.articlesAmount,
  },
  isBookmarked: true,
});

export const getBookmarks = async (userId, { page, perPage }) => {
  const user = await User.findById(userId).select('savedArticles').lean();

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const savedIds = [...user.savedArticles].reverse();
  const savedArticles = savedIds.length
    ? await Article.find({ _id: { $in: savedIds } })
        .populate('authorId', 'name avatarUrl articlesAmount')
        .lean()
    : [];

  const articleById = new Map(
    savedArticles
      .filter((article) => article.authorId)
      .map((article) => [article._id.toString(), article]),
  );
  const orderedArticles = savedIds.map((id) => articleById.get(id.toString())).filter(Boolean);
  const totalItems = orderedArticles.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const skip = (page - 1) * perPage;
  const articles = orderedArticles.slice(skip, skip + perPage).map(toArticleDto);

  return {
    items: articles,
    meta: {
      page,
      perPage,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
    },
  };
};

export const addBookmark = async (userId, articleId) => {
  const article = await Article.findById(articleId)
    .populate('authorId', 'name avatarUrl articlesAmount')
    .lean();

  if (!article || !article.authorId) {
    throw new HttpError(404, 'Article not found');
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, savedArticles: { $ne: articleId } },
    { $push: { savedArticles: articleId } },
    { new: true },
  ).select('_id');

  if (!user) {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) throw new HttpError(404, 'User not found');
    throw new HttpError(409, 'Article is already bookmarked');
  }

  return toArticleDto(article);
};

export const removeBookmark = async (userId, articleId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, savedArticles: articleId },
    { $pull: { savedArticles: articleId } },
    { new: true },
  ).select('_id');

  if (!user) {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) throw new HttpError(404, 'User not found');
    throw new HttpError(404, 'Bookmark not found');
  }

  return { articleId };
};
