import Coordinator from '../models/Coordinator.model.js';
import Student     from '../models/Student.model.js';
import Tutor       from '../models/Tutor.model.js';
import Credit      from '../models/Credit.model.js';
import Session     from '../models/Session.model.js';
import ComplementaryRelease from '../models/ComplementaryRelease.model.js';

// ── GET /api/coordinator/me ───────────────────────────────────────────────────
export const getMyProfile = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.user.id);
    if (!coordinator) return res.status(404).json({ message: 'Coordinador no encontrado' });
    res.json(coordinator);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── POST /api/coordinator/register ───────────────────────────────────────────
export const registerCoordinator = async (req, res) => {
  const { name, email, password, department } = req.body;
  try {
    const exists = await Coordinator.findOne({ email });
    if (exists) return res.status(409).json({ message: 'El correo ya existe' });
    const coordinator = await Coordinator.create({ name, email, password, department });
    res.status(201).json(coordinator);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET /api/coordinator/students ─────────────────────────────────────────────
// Returns all students with their credit progress and tutor info
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, '-password').populate('tutor', 'name email department');

    // Attach credit summary to each student
    const withCredits = await Promise.all(students.map(async (s) => {
      const credit  = await Credit.findOne({ student: s._id });
      const earned  = credit?.earnedCredits ?? 0;
      const total   = credit?.totalCredits  ?? 245;
      const pct     = total > 0 ? Math.round((earned / total) * 100) : 0;

      const complementarios = (credit?.subjects ?? []).filter(sub =>
        ['academico','fisico','cultural','escolar','tutoria'].includes(sub.semester === 0 ? 'tutoria' : '')
        || sub.credits === 1
      );

      return {
        ...s.toJSON(),
        creditSummary: { earned, total, percentage: pct },
      };
    }));

    res.json(withCredits);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET /api/coordinator/students/:id ─────────────────────────────────────────
export const getStudentDetail = async (req, res) => {
  try {
    const student  = await Student.findById(req.params.id, '-password').populate('tutor', '-password');
    if (!student)  return res.status(404).json({ message: 'Estudiante no encontrado' });

    const credit   = await Credit.findOne({ student: student._id });
    const sessions = await Session.find({ student: student._id }).populate('tutor', 'name email').sort({ date: -1 });
    const releases = await ComplementaryRelease.find({ student: student._id }).sort({ createdAt: -1 });

    res.json({ student, credit, sessions, releases });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET /api/coordinator/tutors ───────────────────────────────────────────────
export const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({}, '-password').populate('students', 'name controlNumber semester');
    res.json(tutors);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── POST /api/coordinator/tutors ──────────────────────────────────────────────
export const createTutor = async (req, res) => {
  const { name, email, password, department, specialties, bio } = req.body;
  try {
    const exists = await Tutor.findOne({ email });
    if (exists) return res.status(409).json({ message: 'El correo ya existe' });
    const tutor = await Tutor.create({ name, email, password, department, specialties, bio });
    res.status(201).json(tutor);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── POST /api/coordinator/assign ──────────────────────────────────────────────
// Body: { studentId, tutorId }
export const assignTutorToStudent = async (req, res) => {
  const { studentId, tutorId } = req.body;
  try {
    const [student, tutor] = await Promise.all([
      Student.findById(studentId),
      Tutor.findById(tutorId),
    ]);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });
    if (!tutor)   return res.status(404).json({ message: 'Tutor no encontrado' });

    // Remove student from previous tutor if any
    if (student.tutor && !student.tutor.equals(tutorId)) {
      await Tutor.findByIdAndUpdate(student.tutor, { $pull: { students: studentId } });
    }

    student.tutor = tutorId;
    if (!tutor.students.includes(studentId)) tutor.students.push(studentId);

    await Promise.all([student.save(), tutor.save()]);
    res.json({ message: 'Tutor asignado correctamente', student: student.name, tutor: tutor.name });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── PATCH /api/coordinator/releases/:id ──────────────────────────────────────
// Manual approve or reject a complementary release
export const reviewRelease = async (req, res) => {
  const { status, reviewNotes } = req.body;
  if (!['approved', 'rejected'].includes(status))
    return res.status(400).json({ message: 'status debe ser approved o rejected' });

  try {
    const release = await ComplementaryRelease.findById(req.params.id).populate('student');
    if (!release) return res.status(404).json({ message: 'Solicitud no encontrada' });

    release.status      = status;
    release.reviewNotes = reviewNotes || '';
    release.reviewedBy  = req.user.id;
    release.reviewedAt  = new Date();
    await release.save();

    // If approved → update the student's credit record
    if (status === 'approved') {
      await updateStudentComplementaryCredit(release.student._id, release.activityType, 'aprobada');
    }

    res.json({ message: `Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'}`, release });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── PATCH /api/coordinator/credits/manual ────────────────────────────────────
// Manually approve any credit (coordinator override)
export const manualCreditApproval = async (req, res) => {
  const { studentId, activityType, status, notes } = req.body;
  try {
    await updateStudentComplementaryCredit(studentId, activityType, status || 'aprobada');
    res.json({ message: `Crédito de ${activityType} actualizado a ${status || 'aprobada'}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET /api/coordinator/reports ─────────────────────────────────────────────
export const getReports = async (req, res) => {
  try {
    const [totalStudents, totalTutors, allCredits, pendingReleases] = await Promise.all([
      Student.countDocuments(),
      Tutor.countDocuments(),
      Credit.find(),
      ComplementaryRelease.countDocuments({ status: 'pending' }),
    ]);

    // Students without tutor
    const noTutor = await Student.countDocuments({ tutor: null });

    // Average credit progress
    const avgProgress = allCredits.length > 0
      ? Math.round(
          allCredits.reduce((sum, c) => sum + ((c.earnedCredits / c.totalCredits) * 100), 0) / allCredits.length
        )
      : 0;

    // Distribution by semester
    const bySemester = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Complementary releases by type
    const releasesByType = await ComplementaryRelease.aggregate([
      { $group: { _id: '$activityType', total: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ['$status','approved'] }, 1, 0] } } } },
    ]);

    res.json({
      summary: { totalStudents, totalTutors, noTutor, pendingReleases, avgProgress },
      bySemester,
      releasesByType,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET /api/coordinator/releases ────────────────────────────────────────────
export const getAllReleases = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const releases = await ComplementaryRelease
      .find(filter, '-pdfBase64')   // exclude heavy PDF data from list view
      .populate('student', 'name controlNumber career semester')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(releases);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET /api/coordinator/releases/:id ────────────────────────────────────────
export const getReleaseById = async (req, res) => {
  try {
    const release = await ComplementaryRelease
      .findById(req.params.id)
      .populate('student', 'name controlNumber career semester')
      .populate('reviewedBy', 'name');
    if (!release) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json(release);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Helper: update complementary subject status in Credit ────────────────────
export const updateStudentComplementaryCredit = async (studentId, activityType, newStatus) => {
  const credit = await Credit.findOne({ student: studentId });
  if (!credit) return;

  // Map activityType to subject name patterns
  const typeMap = {
    academico: ['círculo', 'circulo', 'lectura', 'académic', 'academ'],
    fisico:    ['físic', 'fisic', 'acondicionamiento', 'fútbol', 'futbol', 'voleibol', 'basquetbol', 'atletismo', 'ajedrez'],
    cultural:  ['danza', 'cultura', 'artes', 'música', 'musica', 'teatro'],
    escolar:   ['semana', 'ingeniería', 'ingenieria', 'evento', 'escolar'],
    tutoria:   ['tutoría', 'tutoria', 'institucional'],
  };

  const keywords = typeMap[activityType] || [];
  let updated = false;

  credit.subjects = credit.subjects.map(sub => {
    const nameLower = sub.name.toLowerCase();
    const matchesType = keywords.some(kw => nameLower.includes(kw));
    if (matchesType && sub.credits === 1) {
      updated = true;
      return { ...sub.toObject(), status: newStatus };
    }
    return sub;
  });

  if (updated) await credit.save();

  // Auto-release tutoria if all 4 complementary activities are approved
  const compTypes = ['academico', 'fisico', 'cultural', 'escolar'];
  const allApproved = compTypes.every(type => {
    const keywords2 = typeMap[type] || [];
    return credit.subjects.some(sub => {
      const nameLower = sub.name.toLowerCase();
      return keywords2.some(kw => nameLower.includes(kw)) && sub.credits === 1 && sub.status === 'aprobada';
    });
  });

  if (allApproved) {
    credit.subjects = credit.subjects.map(sub => {
      const nameLower = sub.name.toLowerCase();
      if ((nameLower.includes('tutoría') || nameLower.includes('tutoria')) && sub.credits === 1) {
        return { ...sub.toObject(), status: 'aprobada' };
      }
      return sub;
    });
    await credit.save();
  }
};
