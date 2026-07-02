import { Router } from 'express';

import { listarResultadosMemoria, salvarResultadoMemoria } from '../controllers/jogoMemoriaController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

export const jogoMemoriaRoutes = Router();

jogoMemoriaRoutes.get('/', asyncHandler(requireAuth), asyncHandler(listarResultadosMemoria));
jogoMemoriaRoutes.post('/', asyncHandler(requireAuth), asyncHandler(salvarResultadoMemoria));
