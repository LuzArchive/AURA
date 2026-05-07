import { Router } from 'express';
import { getMyProfile, updateMyProfile, getTutorById, registerTutor, assignStudent } from '../controllers/tutor.controller.js';
import authMiddleware, { authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerTutor);

router.use(authMiddleware);

router.get('/me',        authorize('tutor'),           getMyProfile);
router.put('/me',        authorize('tutor'),           updateMyProfile);
router.post('/assign',   authorize('tutor'),           assignStudent);
router.get('/:id',       authorize('student', 'tutor'), getTutorById);

export default router;
