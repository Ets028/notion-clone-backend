// src/routes/tag.routes.js
import { Router } from 'express';
import { createTag, getTags, updateTag, deleteTag } from '../controllers/tag.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createTagSchema, updateTagSchema } from '../schemas/tag.schema.js';
import { noteIdParamSchema } from '../schemas/note.schema.js'; // Bisa digunakan ulang

const router = Router();
router.use(isAuthenticated);

router.route('/')
  .post(validateRequest(createTagSchema), createTag)
  .get(getTags);

router.route('/:id')
  .put(validateRequest(updateTagSchema), updateTag)
  .delete(validateRequest(noteIdParamSchema), deleteTag);

export default router;
