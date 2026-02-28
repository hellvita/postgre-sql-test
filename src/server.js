import { getEnv } from './helpers/getEnv.js';
import { ENV_VARS } from './constants/env.js';

import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';

export const startServer = () => {
  const app = express();
  const PORT = Number.parseInt(getEnv(ENV_VARS.app.PORT)) || 3000;

  app.use(logger);
  app.use(express.json({ limit: '5mb' }));
  app.use(cors());

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'this is home' });
  });

  app.listen(PORT, (error) => {
    if (error) {
      console.error(error);
    }
    console.log(`🔗 Server is running on port: ${PORT}`);
  });
};
