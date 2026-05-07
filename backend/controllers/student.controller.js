import Student from '../models/Student.model.js';

// GET /api/students/me
export const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('tutor', '-password');
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/students/me
export const updateMyProfile = async (req, res) => {
  const allowed = ['name', 'avatar', 'specialty'];
  const updates = {};
  allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  try {
    const student = await Student.findByIdAndUpdate(req.user.id, updates, { new: true }).populate('tutor', '-password');
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin / tutor routes ──────────────────────────────────────────────────────

// GET /api/students  (tutor only — returns their assigned students)
export const getMyStudents = async (req, res) => {
  try {
    const students = await Student.find({ tutor: req.user.id }, '-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/students/register
export const registerStudent = async (req, res) => {
  const { name, controlNumber, email, password, career, semester, specialty, tutorId } = req.body;
  try {
    const exists = await Student.findOne({ $or: [{ email }, { controlNumber }] });
    if (exists) return res.status(409).json({ message: 'El correo o número de control ya existe' });

    const student = await Student.create({ name, controlNumber, email, password, career, semester, specialty, tutor: tutorId || null });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
