import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import authMiddleware   from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// GET  /api/auth/me  (protected)
router.get('/me', authMiddleware, getMe);

export default router;
