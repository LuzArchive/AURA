import Tutor   from '../models/Tutor.model.js';
import Student from '../models/Student.model.js';

// GET /api/tutors/me
export const getMyProfile = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.user.id).populate('students', '-password');
    if (!tutor) return res.status(404).json({ message: 'Tutor no encontrado' });
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tutors/me
export const updateMyProfile = async (req, res) => {
  const allowed = ['bio', 'avatar', 'specialties', 'department'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  try {
    const tutor = await Tutor.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tutors/:id  (student can view their tutor)
export const getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id, '-password -students');
    if (!tutor) return res.status(404).json({ message: 'Tutor no encontrado' });
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tutors/register
export const registerTutor = async (req, res) => {
  const { name, email, password, department, specialties, bio } = req.body;
  try {
    const exists = await Tutor.findOne({ email });
    if (exists) return res.status(409).json({ message: 'El correo ya existe' });
    const tutor = await Tutor.create({ name, email, password, department, specialties, bio });
    res.status(201).json(tutor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tutors/assign  — assign student to tutor
export const assignStudent = async (req, res) => {
  const { studentId } = req.body;
  try {
    const [tutor, student] = await Promise.all([
      Tutor.findById(req.user.id),
      Student.findById(studentId),
    ]);
    if (!tutor || !student) return res.status(404).json({ message: 'Tutor o estudiante no encontrado' });

    if (!tutor.students.includes(studentId)) tutor.students.push(studentId);
    student.tutor = tutor._id;

    await Promise.all([tutor.save(), student.save()]);
    res.json({ message: 'Estudiante asignado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
