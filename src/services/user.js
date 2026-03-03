import {
  registerUserSchema,
  loginUserSchema,
} from '../db/validation/authValidation.js';
import bcrypt from 'bcrypt';
import prisma from '../db/connectPostgreDB.js';

export const createUser = async (payload) => {
  const username = payload.email.split('@')[0];
  const password = await bcrypt.hash(payload.password, 10);

  payload.username = username;

  const result = registerUserSchema.safeParse(payload);

  if (!result.success) {
    return null;
  }

  result.data.password = password;

  const newUser = await prisma.user.create({ data: result.data });

  return newUser;
};

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return user;
};

export const deleteUserById = async (userId) => {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  return deletedUser;
};

export const preLoginUser = async (payload) => {
  const result = loginUserSchema.safeParse(payload);

  if (!result.success) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  return user;
};

export const getUserId = async (refreshToken) => {
  const session = await prisma.session.findUnique({ where: { refreshToken } });

  return session.userId;
};
