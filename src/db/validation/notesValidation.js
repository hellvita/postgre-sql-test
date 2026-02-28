import { TAGS } from '../../constants/tags.js';

import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().optional().default(''),
  tag: z.enum(TAGS).default('Todo'),
});
