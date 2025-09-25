import express from 'express';
import {
  getUserStickyNotes,
  createStickyNote,
  updateStickyNote,
  deleteStickyNote,
  bringToFront
} from '../controller/stickyNoteController.js';
import jwtAuth from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
// Temporarily was commented out for testing; re-enable for production
router.use(jwtAuth);

// GET /api/sticky-notes - Get all sticky notes for the authenticated user
router.get('/', getUserStickyNotes);

// POST /api/sticky-notes - Create a new sticky note
router.post('/', createStickyNote);

// PUT /api/sticky-notes/:id - Update a sticky note
router.put('/:id', updateStickyNote);

// DELETE /api/sticky-notes/:id - Delete a sticky note
router.delete('/:id', deleteStickyNote);

// PUT /api/sticky-notes/:id/bring-to-front - Bring sticky note to front
router.put('/:id/bring-to-front', bringToFront);

export default router;
