import { Router } from 'express';

import { getNoteById, createNote } from '../controllers/notesController.js';

const router = Router();

router.get('/notes/:noteId', getNoteById);

router.post('/notes', createNote);

export default router;
