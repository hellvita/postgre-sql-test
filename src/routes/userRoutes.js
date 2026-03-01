import { Router } from 'express';

import { createUser, deleteUserById } from '../controllers/userController.js';

const router = Router();

router.post('/user/register', createUser);

router.delete('/user', deleteUserById);

export default router;
