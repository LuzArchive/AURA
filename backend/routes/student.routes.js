import { Router } from 'express';
import { getMyProfile, updateMyProfile, getMyStudents, registerStudent } from '../controllers/student.controller.js';
import authMiddleware, { authorize } from '../middleware/auth.middleware.js';

const router = Router();

// ✅ Pública — no requiere token
router.post('/register', registerStudent);

// 🔒 Protegidas — requieren token
router.use(authMiddleware);

router.get('/me',  authorize('student'), getMyProfile);
router.put('/me',  authorize('student'), updateMyProfile);
router.get('/',    authorize('tutor'),   getMyStudents);

export default router;