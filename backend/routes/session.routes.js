import { Router } from 'express';
import { getSessions, getSessionById, createSession, updateSession, deleteSession } from '../controllers/session.controller.js';
import authMiddleware, { authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/',      getSessions);
router.get('/:id',   getSessionById);
router.post('/',     authorize('tutor'), createSession);
router.put('/:id',   authorize('tutor'), updateSession);
router.delete('/:id',authorize('tutor'), deleteSession);

export default router;
