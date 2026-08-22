import { z as zod } from 'zod';
import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

const getArticleByIdSchema = zod.object({
  articleId: zod.string().refine((id) => isValidObjectId(id), {
    message: "Invalid article ID format",
  }),
});

const validateArticleParams = (req, res, next) => {
  const result = getArticleByIdSchema.safeParse(req.params);

  if (!result.success) {
    const firstErrorMessage = result.error.issues[0].message;
    return next(createHttpError(400, firstErrorMessage));
  }

  req.params = result.data;
  next();
}

export { getArticleByIdSchema, validateArticleParams };
