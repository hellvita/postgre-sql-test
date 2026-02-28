import createHttpError from 'http-errors';
import prisma from '../db/connectPostgreDB.js';
import {
  createNoteSchema,
  updateNoteSchema,
} from '../db/validation/notesValidation.js';

export const getAllNotes = async (req, res) => {
  const notes = await prisma.note.findMany();

  if (!notes) {
    throw createHttpError(404, 'Notes not found');
  }

  res.status(200).json({ notes });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await prisma.note.findUnique({ where: { id: noteId } });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const result = createNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const newNote = await prisma.note.create({ data: result.data });

  res.status(201).json(newNote);
};

export const updateNoteById = async (req, res) => {
  const { noteId } = req.params;

  const noteToUpdate = await prisma.note.findUnique({ where: { id: noteId } });

  if (!noteToUpdate) {
    throw createHttpError(404, 'Note not found');
  }

  const result = updateNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: result.data,
  });

  res.status(200).json(updatedNote);
};
