import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { HttpError } from '../../../utils/HttpError.js';

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(12),
});

const bookmarkBodySchema = z.object({
  articleId: z.string().refine(isValidObjectId, 'Invalid articleId'),
});

export const validateBookmarksQuery = (req, res, next) => {
  const result = paginationQuerySchema.safeParse(req.query);

  if (!result.success) {
    next(new HttpError(400, 'Invalid pagination query', result.error.flatten()));
    return;
  }

  res.locals.bookmarksQuery = result.data;
  next();
};

export const validateBookmarkBody = (req, res, next) => {
  const result = bookmarkBodySchema.safeParse(req.body);

  if (!result.success) {
    next(new HttpError(400, 'Invalid bookmark data', result.error.flatten()));
    return;
  }

  res.locals.bookmarkBody = result.data;
  next();
};

export const validateBookmarkParams = (req, res, next) => {
  const { articleId } = req.params;

  if (!articleId || !isValidObjectId(articleId)) {
    next(new HttpError(400, 'Invalid articleId'));
    return;
  }

  next();
};
