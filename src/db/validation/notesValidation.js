import { TAGS } from '../../constants/tags.js';

import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().optional().default(''),
  tag: z.enum(TAGS).default('Todo'),
});

export const updateNoteSchema = z
  .object({
    title: z.string().trim().optional(),
    content: z.string().trim().optional().optional(),
    tag: z.enum(TAGS).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
