import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { createUser, preLoginUser } from '../services/user.js';
import {
  clearSessionCookies,
  createSession,
  deleteSessionByToken,
  getSession,
  setSessionCookies,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const newUser = await createUser(req.body);

  if (!newUser) {
    throw createHttpError(400);
  }

  const tokens = await createSession(newUser.id);

  setSessionCookies(tokens, res);

  res.status(201).json(newUser);
};

export const loginUserController = async (req, res) => {
  const { password } = req.body;

  const user = await preLoginUser(req.body);

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const tokens = await createSession(user.id);

  setSessionCookies(tokens, res);

  res.status(200).json(user);
};

export const logoutUserController = async (req, res) => {
  console.log('req.cookies: ', req.cookies);
  console.log('req.cookie: ', req.cookie);
  console.log('req: ', req);

  const { refreshToken } = req.cookies;

  const session = await getSession(refreshToken);

  if (!session || session.expiresAt < new Date()) {
    throw createHttpError(400, 'No active session found');
  }

  await deleteSessionByToken(refreshToken);

  clearSessionCookies(res);

  res.status(204).send();
};

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Unauthorized');
    }

    const session = await getSession(refreshToken);

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (session.expiresAt < new Date()) {
      throw createHttpError(401, 'Session token expired');
    }

    const userId = session.userId;

    await deleteSessionByToken(refreshToken);

    const tokens = await createSession(userId);

    setSessionCookies(tokens, res);

    return res
      .status(200)
      .json({ success: true, message: 'Session refreshed' });
  } catch (error) {
    next(error);
  }
};
