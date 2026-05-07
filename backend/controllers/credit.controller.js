import Credit from '../models/Credit.model.js';

// GET /api/credits/me
export const getMyCredits = async (req, res) => {
  try {
    const credits = await Credit.findOne({ student: req.user.id });
    if (!credits) return res.status(404).json({ message: 'Registro de créditos no encontrado' });
    res.json(credits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/credits/:studentId  (tutor access)
export const getCreditsByStudent = async (req, res) => {
  try {
    const credits = await Credit.findOne({ student: req.params.studentId });
    if (!credits) return res.status(404).json({ message: 'Registro de créditos no encontrado' });
    res.json(credits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/credits  — create initial credit record for a student
export const createCreditRecord = async (req, res) => {
  const { studentId, totalCredits, subjects, creditsThisSemester } = req.body;
  try {
    const exists = await Credit.findOne({ student: studentId });
    if (exists) return res.status(409).json({ message: 'El estudiante ya tiene un registro de créditos' });

    const credit = await Credit.create({ student: studentId, totalCredits, subjects, creditsThisSemester });
    res.status(201).json(credit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/credits/:studentId  — tutor updates grades or adds subjects
export const updateCredits = async (req, res) => {
  const { subjects, creditsThisSemester } = req.body;
  try {
    const credit = await Credit.findOneAndUpdate(
      { student: req.params.studentId },
      { subjects, creditsThisSemester },
      { new: true }
    );
    if (!credit) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json(credit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
