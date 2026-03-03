import createHttpError from 'http-errors';
import { deleteUserById } from '../services/user.js';
import { clearSessionCookies } from '../services/auth.js';

export const deleteUserByIdController = async (req, res) => {
  if (!req.userId) throw createHttpError(404, 'User not found');

  const deletedUser = await deleteUserById(req.userId);

  if (!deletedUser) throw createHttpError(404, 'User not found');

  clearSessionCookies(res);

  res.status(200).json({
    id: deletedUser.id,
    email: deletedUser.email,
    username: deletedUser.username,
  });
};
