// src/routes/auth.routes.js
import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

// Terapkan middleware validasi sebelum controller
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/me', me);

export default router;
