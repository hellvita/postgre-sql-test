import { TAGS } from '../../constants/tags.js';

import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title must be at least 1 characters long'),
  content: z.string().trim().optional().default(''),
  tag: z.enum(TAGS).default('Todo'),
});

export const updateNoteSchema = z
  .object({
    title: z.string().trim().optional(),
    content: z.string().trim().optional().optional(),
    tag: z.enum(TAGS).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "At least one field must be provided for update: 'title', 'content', 'tag'",
  });
