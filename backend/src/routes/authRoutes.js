import { Router } from 'express';

import { login, register } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const authRoutes = Router();
authRoutes.post('/login', asyncHandler(login));
authRoutes.post('/register', asyncHandler(register));
