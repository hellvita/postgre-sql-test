import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import createHttpError from 'http-errors';

import { getEnv } from './getEnv.js';
import { ENV_VARS } from '../constants/env.js';

export const generateTokens = (
  userId,
  accessTokenExpiresInSec,
  refreshTokenExpiresInMs,
) => {
  const accessToken = jwt.sign({ userId }, getEnv(ENV_VARS.token.JWT_SECRET), {
    expiresIn: accessTokenExpiresInSec,
  });

  const refreshToken = crypto.randomBytes(30).toString('base64');

  const rtExpiresAt = new Date(Date.now() + refreshTokenExpiresInMs);

  const tokens = { accessToken, refreshToken, rtExpiresAt };

  return tokens;
};

export const verifyAccessToken = (accessToken) => {
  try {
    const verified = jwt.verify(accessToken, getEnv(ENV_VARS.token.JWT_SECRET));

    return verified ? true : false;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Access token expired');
    } else {
      throw createHttpError(401, 'Token is invalid');
    }
  }
};

export const getRefreshToken = (cookie) => {
  const { refreshToken } = cookie;

  if (!refreshToken) {
    throw createHttpError(401, 'Missing refresh token');
  }

  return refreshToken;
};
