import { TEMPORARY_USER_ID } from '../constants/user.js';

import createHttpError from 'http-errors';
import prisma from '../db/connectPostgreDB.js';
import bcrypt from 'bcrypt';

import { createUserSchema } from '../db/validation/userValidation.js';

export const createUser = async (req, res) => {
  const username = req.body.email.split('@')[0];
  const password = await bcrypt.hash(req.body.password, 10);

  req.body.username = username;
  req.body.password = password;

  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    throw createHttpError(400, result.error);
  }

  const newUser = await prisma.user.create({ data: result.data });

  res.status(201).json(newUser);
};

export const deleteUserById = async (req, res) => {
  const deletedUser = await prisma.user.delete({
    where: { id: TEMPORARY_USER_ID },
  });

  if (!deletedUser) throw createHttpError(404, 'User not found');

  res
    .status(200)
    .json({
      id: deletedUser.id,
      email: deletedUser.email,
      username: deletedUser.username,
    });
};
