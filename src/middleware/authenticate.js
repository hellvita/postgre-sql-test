import createHttpError from 'http-errors';
import { getSession } from '../services/auth.js';
import { getUserId } from '../services/user.js';
import { verifyAccessToken } from '../helpers/tokens.js';

export const authenticate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    throw createHttpError(401, 'Missing access token');
  }

  const session = await getSession(refreshToken);
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isValidAccessToken = verifyAccessToken(accessToken);

  if (!isValidAccessToken) {
    throw createHttpError(401, 'Token is invalid');
  }

  const userId = await getUserId(refreshToken);

  req.userId = userId;

  next();
};
