import { Router } from 'express';
import {
  getMyProfile, registerCoordinator,
  getAllStudents, getStudentDetail,
  getAllTutors, createTutor, assignTutorToStudent,
  reviewRelease, manualCreditApproval,
  getReports, getAllReleases, getReleaseById,
} from '../controllers/coordinator.controller.js';
import { getPreregistros } from '../controllers/archetype.controller.js'; // ← NUEVO
import authMiddleware, { authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerCoordinator);

router.use(authMiddleware);
router.use(authorize('coordinator'));

router.get('/me',                  getMyProfile);
router.get('/students',            getAllStudents);
router.get('/students/:id',        getStudentDetail);
router.get('/tutors',              getAllTutors);
router.post('/tutors',             createTutor);
router.post('/assign',             assignTutorToStudent);
router.get('/releases',            getAllReleases);
router.get('/releases/:id',        getReleaseById);
router.patch('/releases/:id',      reviewRelease);
router.patch('/credits/manual',    manualCreditApproval);
router.get('/reports',             getReports);
router.get('/preregistros',        getPreregistros);           // ← NUEVO

export default router;
