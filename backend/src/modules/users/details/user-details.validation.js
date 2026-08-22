// TODO (учасник №7): request validation
import mongoose from 'mongoose';
import { HttpError } from '../../../utils/HttpError.js';

export const validateUserId = (req, _res, next) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    return next(new HttpError(400, 'Invalid user id format'));
  }

  next();
};
