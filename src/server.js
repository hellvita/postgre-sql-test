import { getEnv } from './helpers/getEnv.js';
import { ENV_VARS } from './constants/env.js';

import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import createHttpError from 'http-errors';

import { createNoteSchema } from './db/validation/notesValidation.js';
import prisma from './db/connectPostgreDB.js';

export const startServer = () => {
  const app = express();
  const PORT = Number.parseInt(getEnv(ENV_VARS.app.PORT)) || 3000;

  app.use(logger);
  app.use(express.json({ limit: '5mb' }));
  app.use(cors());

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'this is home' });
  });

  app.post('/notes', async (req, res) => {
    const result = createNoteSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const newNote = await prisma.note.create({ data: result.data });

    res.status(201).json(newNote);
  });

  app.get('/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;

    const note = await prisma.note.findUnique({ where: { id: noteId } });

    if (!note) {
      return createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  });

  app.listen(PORT, (error) => {
    if (error) {
      console.error(error);
    }
    console.log(`🔗 Server is running on port: ${PORT}`);
  });
};
