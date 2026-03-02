import createHttpError from 'http-errors';
import prisma from '../db/connectPostgreDB.js';
import {
  createNoteSchema,
  updateNoteSchema,
} from '../db/validation/notesValidation.js';
import { getUserId } from '../services/user.js';

export const getAllNotes = async (req, res) => {
  const { refreshToken } = req.cookies;

  const userId = await getUserId(refreshToken);

  const notes = await prisma.note.findMany({
    where: { userId },
  });

  if (!notes) {
    throw createHttpError(404, 'Notes not found');
  }

  res.status(200).json({ notes });
};

export const getNoteById = async (req, res) => {
  const { refreshToken } = req.cookies;

  const userId = await getUserId(refreshToken);
  const { noteId } = req.params;

  const note = await prisma.note.findUnique({
    where: { id: noteId, userId },
  });

  if (!note) throw createHttpError(404, 'Note not found');

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const { refreshToken } = req.cookies;

  const userId = await getUserId(refreshToken);

  const result = createNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  result.data.userId = userId;

  const newNote = await prisma.note.create({ data: result.data });

  res.status(201).json(newNote);
};

export const updateNoteById = async (req, res) => {
  const { refreshToken } = req.cookies;

  const userId = await getUserId(refreshToken);
  const { noteId } = req.params;

  const result = updateNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const updatedNote = await prisma.note.update({
    where: { id: noteId, userId },
    data: result.data,
  });

  res.status(200).json(updatedNote);
};

export const deleteNoteById = async (req, res) => {
  const { refreshToken } = req.cookies;

  const userId = await getUserId(refreshToken);
  const { noteId } = req.params;

  const deletedNote = await prisma.note.delete({
    where: { id: noteId, userId },
  });

  if (!deletedNote) throw createHttpError(404, 'Note not found');

  res.status(200).json(deletedNote);
};
