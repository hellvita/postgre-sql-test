import { authenticate } from '../middleware/authenticate.js';

import { Router } from 'express';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNoteById,
  deleteNoteById,
} from '../controllers/notesController.js';

const router = Router();

router.use('/notes', authenticate);

router.get('/notes', getAllNotes);

router.get('/notes/:noteId', getNoteById);

router.post('/notes', createNote);

router.patch('/notes/:noteId', updateNoteById);

router.delete('/notes/:noteId', deleteNoteById);

export default router;
