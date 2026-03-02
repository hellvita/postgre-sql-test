import { getEnv } from './helpers/getEnv.js';
import { ENV_VARS } from './constants/env.js';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logger } from './middleware/logger.js';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

export const startServer = () => {
  const app = express();
  const PORT = Number.parseInt(getEnv(ENV_VARS.app.PORT)) || 3000;

  app.use(logger);
  app.use(express.json({ limit: '5mb' }));
  app.use(cors());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'this is home' });
  });

  app.use(authRoutes);
  app.use(userRoutes);
  app.use(notesRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      console.error(error);
    }
    console.log(`🔗 Server is running on port: ${PORT}`);
  });
};
