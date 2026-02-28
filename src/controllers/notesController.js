import createHttpError from 'http-errors';
import prisma from '../db/connectPostgreDB.js';
import { createNoteSchema } from '../db/validation/notesValidation.js';

export const createNote = async (req, res) => {
  const result = createNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const newNote = await prisma.note.create({ data: result.data });

  res.status(201).json(newNote);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await prisma.note.findUnique({ where: { id: noteId } });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
