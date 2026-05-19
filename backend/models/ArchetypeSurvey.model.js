import mongoose from 'mongoose';

const archetypeSurveySchema = new mongoose.Schema({
  // ── Referencia al estudiante (null si es pre-registro) ────────────────────
  student: {
    type:    mongoose.Schema.Types.ObjectId,
    ref:     'Student',
    default: null,
  },

  // ── Datos del número de control (siempre presente) ────────────────────────
  controlNumber: { type: String, required: true, trim: true },

  // ── Datos extra solo para pre-registros ──────────────────────────────────
  // Se llenan cuando el número de control NO existe en la BD de estudiantes
  isPreRegistered: { type: Boolean, default: false },
  preRegData: {
    name:     { type: String, default: '' },
    career:   { type: String, default: '' },
    semester: { type: Number, default: null },
    email:    { type: String, default: '' },
  },

  // ── Respuestas del cuestionario ───────────────────────────────────────────
  // Array de 10 strings, cada uno es 'A' | 'B' | 'C' | 'D'
  answers: {
    type:     [String],
    validate: {
      validator: v => v.length === 10 && v.every(a => ['A','B','C','D'].includes(a)),
      message:   'Se requieren exactamente 10 respuestas válidas (A/B/C/D)',
    },
  },

  // ── Conteo de cada opción (calculado al guardar) ──────────────────────────
  scores: {
    A: { type: Number, default: 0 },  // → Centinela
    B: { type: Number, default: 0 },  // → Analítico
    C: { type: Number, default: 0 },  // → Explorador
    D: { type: Number, default: 0 },  // → Diplomático
  },

  // ── Resultado final ───────────────────────────────────────────────────────
  result: {
    type: String,
    enum: ['analitico', 'diplomatico', 'centinela', 'explorador'],
  },

  // ── Semestre en que se hizo (para el límite de 1 vez por semestre) ────────
  semesterTaken: { type: Number, default: null },

  // ── Control de notificación al coordinador (solo pre-registros) ──────────
  coordinatorNotified: { type: Boolean, default: false },

}, { timestamps: true });

// ── Índice para evitar doble envío en el mismo semestre ───────────────────────
archetypeSurveySchema.index(
  { controlNumber: 1, semesterTaken: 1 },
  { unique: true }
);

export default mongoose.model('ArchetypeSurvey', archetypeSurveySchema);
