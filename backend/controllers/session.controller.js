import Session from '../models/Session.model.js';

// GET /api/sessions  — student gets their own, tutor gets all theirs
export const getSessions = async (req, res) => {
  try {
    const filter = req.user.role === 'student'
      ? { student: req.user.id }
      : { tutor: req.user.id };

    const sessions = await Session.find(filter)
      .populate('student', 'name controlNumber email avatar')
      .populate('tutor',   'name email avatar')
      .sort({ date: 1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/sessions/:id
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('student', 'name controlNumber email')
      .populate('tutor',   'name email');

    if (!session) return res.status(404).json({ message: 'Sesión no encontrada' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/sessions  — tutor creates a session
export const createSession = async (req, res) => {
  const { title, type, date, duration, room, studentId } = req.body;
  try {
    const session = await Session.create({
      title, type, date, duration, room,
      student: studentId,
      tutor:   req.user.id,
      status: 'programada',
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/sessions/:id  — tutor updates status or adds notes
export const updateSession = async (req, res) => {
  const allowed = ['title', 'type', 'date', 'duration', 'room', 'status', 'notes'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  try {
    const session = await Session.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!session) return res.status(404).json({ message: 'Sesión no encontrada' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sesión eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
