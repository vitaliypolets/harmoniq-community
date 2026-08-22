import { HttpError } from '../../../utils/HttpError.js';

export const validateSessionCookies = (req, _res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next(new HttpError(401, 'Refresh token is missing in cookies'));
  }
  next();
};
