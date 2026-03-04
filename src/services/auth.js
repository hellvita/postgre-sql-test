import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import prisma from '../db/connectPostgreDB.js';
import { generateTokens } from '../helpers/tokens.js';

export const getSession = async (refreshToken, userId) => {
  const session = await prisma.session.findUniqueOrThrow({
    where: { refreshToken, userId },
  });

  return session;
};

export const createSession = async (userId) => {
  const { accessToken, refreshToken, rtExpiresAt } = generateTokens(
    userId,
    FIFTEEN_MINUTES,
    ONE_DAY,
  );

  await prisma.session.create({
    data: { userId, refreshToken, expiresAt: rtExpiresAt },
  });

  const tokens = { accessToken, refreshToken };

  return tokens;
};

export const setSessionCookies = (tokens, res) => {
  const { accessToken, refreshToken } = tokens;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: FIFTEEN_MINUTES * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

export const deleteSessionByToken = async (refreshToken) => {
  await prisma.session.delete({ where: { refreshToken } });
};
