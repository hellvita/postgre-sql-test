import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshSession,
  registerUserController,
} from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', registerUserController);

router.post('/auth/login', loginUserController);

router.post('/auth/logout', logoutUserController);

router.get('/auth/session', refreshSession);

export default router;
