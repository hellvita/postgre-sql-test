import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.email({ required_error: 'Email is required' }).toLowerCase(),
  username: z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username must be at least 1 characters long')
    .max(40, 'Username must be up to 40 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginUserSchema = z.object({
  email: z.email({ required_error: 'Email is required' }).toLowerCase(),
  password: z.string({ required_error: 'Password is required' }),
});
