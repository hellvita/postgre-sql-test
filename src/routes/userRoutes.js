import { Router } from 'express';

import { createUser } from '../controllers/userController.js';

const router = Router();

router.post('/user/register', createUser);

export default router;
