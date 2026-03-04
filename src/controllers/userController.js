import createHttpError from 'http-errors';
import { deleteUserById, getUserById } from '../services/user.js';
import { clearSessionCookies } from '../services/auth.js';
import { handlePrismaError } from '../middleware/prismaErrorHandler.js';

export const getCurrentUserController = async (req, res) => {
  try {
    const user = await getUserById(req.userId);

    res.status(200).json(user);
  } catch (error) {
    handlePrismaError(error);
  }
};

export const deleteUserByIdController = async (req, res) => {
  try {
    if (!req.userId) throw createHttpError(404, 'User not found');

    const deletedUser = await deleteUserById(req.userId);

    clearSessionCookies(res);

    res.status(200).json(deletedUser);
  } catch (error) {
    handlePrismaError(error);
  }
};
