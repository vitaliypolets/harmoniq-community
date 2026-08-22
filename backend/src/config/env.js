import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  frontendUrl: required('FRONTEND_URL'),
  mongoUrl: required('MONGO_URL'),
  accessTokenSecret: required('ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: required('REFRESH_TOKEN_SECRET'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
