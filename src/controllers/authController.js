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
import { handlePrismaError } from '../middleware/prismaErrorHandler.js';
import { getRefreshToken } from '../helpers/tokens.js';

export const registerUserController = async (req, res) => {
  try {
    const newUser = await createUser(req.body);

    if (!newUser) {
      throw createHttpError(400, 'Invalid credentials');
    }

    const tokens = await createSession(newUser.id);

    setSessionCookies(tokens, res);

    res.status(201).json(newUser);
  } catch (error) {
    handlePrismaError(error);
  }
};

export const loginUserController = async (req, res) => {
  try {
    if (!req.cookies.refreshToken) {
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

      delete user.password;

      res.status(200).json(user);
    }

    res.status(200).json({ message: 'User already logged in' });
  } catch (error) {
    handlePrismaError(error);
  }
};

export const logoutUserController = async (req, res) => {
  try {
    const refreshToken = getRefreshToken(req.cookies);

    const session = await getSession(refreshToken);

    if (!session || session.expiresAt < new Date()) {
      throw createHttpError(400, 'No active session found');
    }

    await deleteSessionByToken(refreshToken);

    clearSessionCookies(res);

    res.status(204).send();
  } catch (error) {
    handlePrismaError(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = getRefreshToken(req.cookies);

    const session = await getSession(refreshToken, req.userId);

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
    handlePrismaError(error);
  }
};
