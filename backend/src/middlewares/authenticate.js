import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';

export const authenticate = async (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new HttpError(401, 'Authorization header is missing');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new HttpError(401, 'Authorization header must use Bearer token');
    }

    let payload;

    try {
      payload = jwt.verify(token, env.accessTokenSecret);
    } catch {
      throw new HttpError(401, 'Access token is invalid or expired');
    }

    if (typeof payload !== 'object' || !payload.userId) {
      throw new HttpError(401, 'Invalid access token payload');
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      throw new HttpError(401, 'User not found');
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
