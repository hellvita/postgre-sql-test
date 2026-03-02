import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.email().toLowerCase(),
  username: z.string().min(1).max(40),
  password: z.string().min(6),
});

export const loginUserSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string(),
});
