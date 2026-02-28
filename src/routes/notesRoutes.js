import { Router } from 'express';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNoteById,
} from '../controllers/notesController.js';

const router = Router();

router.get('/notes', getAllNotes);

router.get('/notes/:noteId', getNoteById);

router.post('/notes', createNote);

router.patch('/notes/:noteId', updateNoteById);

export default router;
