import createHttpError from 'http-errors';
import { deleteUserById, getUserId } from '../services/user.js';
import { clearSessionCookies } from '../services/auth.js';

export const deleteUserByIdController = async (req, res) => {
  const { refreshToken } = req.cookies;

  const userId = await getUserId(refreshToken);

  if (!userId) throw createHttpError(404, 'User not found');

  const deletedUser = await deleteUserById(userId);

  if (!deletedUser) throw createHttpError(404, 'User not found');

  clearSessionCookies(res);

  res.status(200).json({
    id: deletedUser.id,
    email: deletedUser.email,
    username: deletedUser.username,
  });
};
