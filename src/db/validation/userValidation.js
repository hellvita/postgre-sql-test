import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email().toLowerCase(),
  username: z.string().min(1).max(40),
  password: z.string().min(6),
});
