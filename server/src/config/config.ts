import dotenv from 'dotenv';
dotenv.config();

export const config = Object.freeze({
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  TOKEN_EXPIRATION_DURATION: '1h',
  TOKEN_EXPIRATION_DURATION_MILLISEC: 1 * 60 * 60 * 1000,
  HASH_SALT: 10,
});
