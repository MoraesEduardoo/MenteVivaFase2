import { Router } from 'express';

import { createEntry, deleteEntry, listEntries, updateEntry } from '../controllers/entryController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

export const entryRoutes = Router();
entryRoutes.get('/', asyncHandler(requireAuth), asyncHandler(listEntries));
entryRoutes.post('/', asyncHandler(requireAuth), asyncHandler(createEntry));
entryRoutes.patch('/:id', asyncHandler(requireAuth), asyncHandler(updateEntry));
entryRoutes.delete('/:id', asyncHandler(requireAuth), asyncHandler(deleteEntry));
