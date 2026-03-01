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
