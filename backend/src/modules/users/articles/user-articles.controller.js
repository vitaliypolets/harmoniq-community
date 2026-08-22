import { HttpError } from '../../../utils/HttpError.js';
import { getUserArticles } from './user-articles.service.js';

export const getUserArticlesController = async (req, res) => {
  const { userId } = req.params;

  if (typeof userId !== 'string') {
    throw new HttpError(400, 'Invalid userId');
  }

  const query = res.locals.userArticlesQuery;
  const result = await getUserArticles(userId, query);

  res.status(200).json(result);
};
