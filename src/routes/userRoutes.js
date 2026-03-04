import { Router } from 'express';

import { authenticate } from '../middleware/authenticate.js';
import {
  deleteUserByIdController,
  getCurrentUserController,
} from '../controllers/userController.js';

const router = Router();

router.get('/user', authenticate, getCurrentUserController);

router.delete('/user', authenticate, deleteUserByIdController);

export default router;
