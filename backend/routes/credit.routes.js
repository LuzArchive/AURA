import { Router } from 'express';
import { getMyCredits, getCreditsByStudent, createCreditRecord, updateCredits } from '../controllers/credit.controller.js';
import authMiddleware, { authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/me',             authorize('student'), getMyCredits);
router.get('/:studentId',     authorize('tutor'),   getCreditsByStudent);
router.post('/',              authorize('tutor'),   createCreditRecord);
router.put('/:studentId',     authorize('tutor'),   updateCredits);

export default router;
