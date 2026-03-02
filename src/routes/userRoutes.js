import { Router } from 'express';

import { deleteUserByIdController } from '../controllers/userController.js';

const router = Router();

router.delete('/user', deleteUserByIdController);

export default router;
