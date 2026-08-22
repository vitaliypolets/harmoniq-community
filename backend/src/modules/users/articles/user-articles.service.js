import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';

export const getUserArticles = async (
  authorId,
  { page, perPage },
) => {
  const authorExists = await User.exists({ _id: authorId });

  if (!authorExists) {
    throw new HttpError(404, 'User not found');
  }

  const skip = (page - 1) * perPage;

  const [articles, totalItems] = await Promise.all([
    Article.find({ authorId })
      .sort({ publicationDate: -1 })
      .skip(skip)
      .limit(perPage)
      .lean(),
    Article.countDocuments({ authorId }),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: {
      items: articles.map((article) => ({
        id: article._id.toString(),
        title: article.title,
        description: article.description,
        imageUrl: article.imageUrl,
        publicationDate: article.publicationDate,
      })),
      meta: {
        page,
        perPage,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    },
    message: 'Success',
  };
};
