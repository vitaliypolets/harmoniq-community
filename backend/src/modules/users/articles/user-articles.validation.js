import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { HttpError } from '../../../utils/HttpError.js';

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(8),
});

export const validateUserArticlesRequest = (req, res, next) => {
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    next(new HttpError(400, 'Invalid userId'));
    return;
  }

  const queryResult = paginationQuerySchema.safeParse(req.query);

  if (!queryResult.success) {
    next(new HttpError(400, 'Invalid pagination query', queryResult.error.flatten()));
    return;
  }

  res.locals.userArticlesQuery = queryResult.data;

  next();
};
