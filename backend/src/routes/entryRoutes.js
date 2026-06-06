import { Router } from 'express';

import { createEntry, listEntries } from '../controllers/entryController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

export const entryRoutes = Router();
entryRoutes.get('/', asyncHandler(requireAuth), asyncHandler(listEntries));
entryRoutes.post('/', asyncHandler(requireAuth), asyncHandler(createEntry));
