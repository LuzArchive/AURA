import process from 'process';
import jwt          from 'jsonwebtoken';
import Student      from '../models/Student.model.js';
import Tutor        from '../models/Tutor.model.js';
import Coordinator  from '../models/Coordinator.model.js';

const generateToken = (id, role, controlNumber = '') =>
  jwt.sign({ id, role, controlNumber }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ message: 'Email, password y rol son requeridos' });

  try {
    let user;
    if      (role === 'student')     user = await Student.findOne({ email }).populate('tutor', '-password');
    else if (role === 'tutor')       user = await Tutor.findOne({ email });
    else if (role === 'coordinator') user = await Coordinator.findOne({ email });
    else return res.status(400).json({ message: 'Rol inválido. Usa student, tutor o coordinator' });

    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = generateToken(user._id, user.role, user.controlNumber || '');
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    let user;
    if      (req.user.role === 'student')     user = await Student.findById(req.user.id).populate('tutor', '-password');
    else if (req.user.role === 'tutor')       user = await Tutor.findById(req.user.id);
    else if (req.user.role === 'coordinator') user = await Coordinator.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
};
