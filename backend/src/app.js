import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { agentRoutes } from './routes/agentRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { entryRoutes } from './routes/entryRoutes.js';
import { jogoMemoriaRoutes } from './routes/jogoMemoriaRoutes.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/agent', agentRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/entries', entryRoutes);
  app.use('/api/jogo-memoria', jogoMemoriaRoutes);
  app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));
  app.use(errorHandler);
  return app;
}
