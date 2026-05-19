import { Router } from 'express';
import {
  checkControlNumber,
  submitSurvey,
  getMyArchetype,
  retakeSurvey,
} from '../controllers/archetype.controller.js';
import authMiddleware, { authorize } from '../middleware/auth.middleware.js';

const router = Router();

// ── Rutas públicas (no requieren login) ───────────────────────────────────────
// El cuestionario está antes del login, por eso son públicas
router.post('/check',  checkControlNumber);
router.post('/submit', submitSurvey);

// ── Rutas protegidas (requieren JWT de estudiante) ────────────────────────────
router.get('/me',      authMiddleware, authorize('student'), getMyArchetype);
router.post('/retake', authMiddleware, authorize('student'), retakeSurvey);

export default router;
