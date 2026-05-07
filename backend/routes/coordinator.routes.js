import { Router } from 'express';
import {
  getMyProfile, registerCoordinator,
  getAllStudents, getStudentDetail,
  getAllTutors, createTutor, assignTutorToStudent,
  reviewRelease, manualCreditApproval,
  getReports, getAllReleases, getReleaseById,
} from '../controllers/coordinator.controller.js';
import authMiddleware, { authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Public — register first coordinator (protect in production)
router.post('/register', registerCoordinator);

// All routes below require auth + coordinator role
router.use(authMiddleware);
router.use(authorize('coordinator'));

router.get('/me',                     getMyProfile);
router.get('/students',               getAllStudents);
router.get('/students/:id',           getStudentDetail);
router.get('/tutors',                 getAllTutors);
router.post('/tutors',                createTutor);
router.post('/assign',                assignTutorToStudent);
router.get('/releases',               getAllReleases);
router.get('/releases/:id',           getReleaseById);
router.patch('/releases/:id',         reviewRelease);
router.patch('/credits/manual',       manualCreditApproval);
router.get('/reports',                getReports);

export default router;
