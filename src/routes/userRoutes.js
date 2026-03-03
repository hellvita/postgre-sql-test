import { Router } from 'express';

import { authenticate } from '../middleware/authenticate.js';
import { deleteUserByIdController } from '../controllers/userController.js';

const router = Router();

router.delete('/user', authenticate, deleteUserByIdController);

export default router;
