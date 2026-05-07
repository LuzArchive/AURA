import { Router } from 'express';
import { submitRelease, getMyReleases, getReleasePDF } from '../controllers/release.controller.js';
import authMiddleware, { authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Student submits a PDF for verification
router.post('/',        authorize('student'),                    submitRelease);

// Student views their own submissions
router.get('/me',       authorize('student'),                    getMyReleases);

// View PDF (student = own only, coordinator = any)
router.get('/:id/pdf',  authorize('student', 'coordinator'),    getReleasePDF);

export default router;
