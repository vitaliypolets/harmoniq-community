// TODO (учасник №13): controllers

import { HttpError } from '../../../utils/HttpError.js';
import { createArticle } from './article-create.service.js';

export const createArticleController = async (req, res) => {
  if (!req.file) {
    throw new HttpError(400, 'Article image is required');
  }

  const article = await createArticle({
    data: req.body,
    file: req.file,
    user: req.user,
  });

  res.status(201).json({
    data: article,
    message: 'Article created successfully',
});
};

