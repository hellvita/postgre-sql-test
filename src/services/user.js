import {
  registerUserSchema,
  loginUserSchema,
} from '../db/validation/authValidation.js';
import bcrypt from 'bcrypt';
import prisma from '../db/connectPostgreDB.js';

export const createUser = async (payload) => {
  const username = payload.email ? payload.email.split('@')[0] : null;
  const password = payload.password
    ? await bcrypt.hash(payload.password, 10)
    : null;

  payload.username = username;

  const result = registerUserSchema.safeParse(payload);

  if (!result.success) {
    return null;
  }

  result.data.password = password;

  const newUser = await prisma.user.create({ data: result.data });

  delete newUser.password;

  return newUser;
};

export const getUserById = async (userId) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  delete user.password;

  return user;
};

export const deleteUserById = async (userId) => {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  delete deletedUser.password;

  return deletedUser;
};

export const preLoginUser = async (payload) => {
  const result = loginUserSchema.safeParse(payload);

  if (!result.success) {
    return null;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
  });

  return user;
};

export const getUserId = async (refreshToken) => {
  const session = await prisma.session.findUniqueOrThrow({
    where: { refreshToken },
  });

  return session.userId;
};
