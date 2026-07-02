import { Router } from 'express';

import { chatWithAgent } from '../controllers/agentController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const agentRoutes = Router();

agentRoutes.post('/chat', asyncHandler(chatWithAgent));
