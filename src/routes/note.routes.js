// src/routes/note.routes.js
import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  archiveNote,
  updateNotePositions,
  getArchivedNotes, 
  restoreNote, 
  deleteNotePermanently, 
} from '../controllers/note.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createNoteSchema,
  updateNoteSchema,
  noteIdParamSchema,
  reorderNotesSchema,
  getNotesQuerySchema
} from '../schemas/note.schema.js';

const router = Router();

router.use(isAuthenticated);

router.get('/archived', getArchivedNotes);

router.patch('/reorder', validateRequest(reorderNotesSchema), updateNotePositions);

router.route('/')
  .get(validateRequest(getNotesQuerySchema), getNotes)
  .post(validateRequest(createNoteSchema), createNote);

router.post('/:id/restore', validateRequest(noteIdParamSchema), restoreNote);

router.delete('/:id/permanent', validateRequest(noteIdParamSchema), deleteNotePermanently);

router.route('/:id')
  .get(validateRequest(noteIdParamSchema), getNoteById)
  .put(validateRequest(updateNoteSchema), updateNote)
  // Rute DELETE sekarang mengarah ke archiveNote
  .delete(validateRequest(noteIdParamSchema), archiveNote);

export default router;
