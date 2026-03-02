import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { getEnv } from '../helpers/getEnv.js';
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
