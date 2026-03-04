import createHttpError from 'http-errors';
import { Prisma } from '@prisma/client';

export const handlePrismaError = (error) => {
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw createHttpError(400, 'Invalid or missing request parameters');
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw createHttpError(409, 'User with this email already registered');
    }

    if (error.code === 'P2025') {
      throw createHttpError(404, 'Resource not found');
    }

    throw createHttpError(
      400,
      `Database Error ${error.code}: ${error.message}`,
    );
  }

  if (error instanceof TypeError) {
    throw createHttpError(400, `Validation Error: ${error.message}`);
  }

  throw error;
};
