import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    env.accessTokenSecret,
    {
      expiresIn: '15m',
    },
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
    },
    env.refreshTokenSecret,
    {
      expiresIn: '30d',
    },
  );
};
