import { env } from '../../../config/env.js';

const COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict',
  expires: new Date(Date.now() + COOKIE_TTL_MS),
});

export const setAuthCookies = (res, refreshToken, sessionId) => {
  const cookieOptions = getAuthCookieOptions();

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.cookie('sessionId', sessionId, cookieOptions);
};

export const clearAuthCookies = (res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
};
