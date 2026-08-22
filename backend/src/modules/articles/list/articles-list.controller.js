import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { getArticlesListService } from './articles-list.service.js';
import { parseGetArticlesQuery } from './articles-list.validation.js';

export const getArticlesListController = async (req, res) => {
  const { page, perPage, limit, authorId, excludeId } = req.query;

  if (page !== undefined && (!/^\d+$/.test(page) || Number(page) <= 0)) {
    throw createHttpError(400, 'Parameter "page" must be a positive integer');
  }

  if (perPage !== undefined && (!/^\d+$/.test(perPage) || Number(perPage) <= 0)) {
    throw createHttpError(400, 'Parameter "perPage" must be a positive integer');
  }

  if (limit !== undefined && (!/^\d+$/.test(limit) || Number(limit) <= 0)) {
    throw createHttpError(400, 'Parameter "limit" must be a positive integer');
  }

  if (authorId !== undefined && !mongoose.Types.ObjectId.isValid(authorId)) {
    throw createHttpError(400, 'Invalid authorId format');
  }

  if (excludeId !== undefined && !mongoose.Types.ObjectId.isValid(excludeId)) {
    throw createHttpError(400, 'Invalid excludeId format');
  }

  const userId = req.user?.userId || null;
  const parsedQuery = parseGetArticlesQuery(req.query);
  const result = await getArticlesListService(parsedQuery, userId);

  res.status(200).json(result);
};
