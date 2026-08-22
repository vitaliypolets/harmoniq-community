import { getArticleDetails } from './article-details.service.js';
import createHttpError from 'http-errors';

const getArticleById = async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user?._id || req.user?.id || null;
  const skipView = req.headers['x-skip-view'] === 'true' || req.query.noView === 'true';

  const article = await getArticleDetails(articleId, userId, skipView);

  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  res.status(200).json({
    data: article,
    message: 'Success',
  });
};

export { getArticleById };
