import bcrypt from 'bcrypt';
import { Session } from '../../../models/Session.js';

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const createAuthSession = async (userId, refreshToken) => {
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  const session = await Session.create({
    userId,
    refreshTokenHash,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return session;
};
