import createHttpError from 'http-errors';
import prisma from '../db/connectPostgreDB.js';
import {
  createNoteSchema,
  updateNoteSchema,
} from '../db/validation/notesValidation.js';
import { handlePrismaError } from '../middleware/prismaErrorHandler.js';
import { handleValidationError } from '../helpers/handleValidationError.js';

export const getAllNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.userId },
    });

    if (!notes) {
      throw createHttpError(404, 'Notes not found');
    }

    res.status(200).json({ notes });
  } catch (error) {
    handlePrismaError(error);
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await prisma.note.findUniqueOrThrow({
      where: { id: noteId, userId: req.userId },
    });

    res.status(200).json(note);
  } catch (error) {
    handlePrismaError(error);
  }
};

export const createNote = async (req, res) => {
  try {
    const result = createNoteSchema.safeParse(req.body);

    if (!result.success) {
      handleValidationError(result);
    }

    result.data.userId = req.userId;

    const newNote = await prisma.note.create({ data: result.data });

    res.status(201).json(newNote);
  } catch (error) {
    handlePrismaError(error);
  }
};

export const updateNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const result = updateNoteSchema.safeParse(req.body);

    if (!result.success) {
      handleValidationError(result);
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId, userId: req.userId },
      data: result.data,
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    handlePrismaError(error);
  }
};

export const deleteNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await prisma.note.delete({
      where: { id: noteId, userId: req.userId },
    });

    res.status(200).json(deletedNote);
  } catch (error) {
    handlePrismaError(error);
  }
};
