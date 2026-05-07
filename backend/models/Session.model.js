import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  type:    {
    type: String,
    enum: ['Planificación', 'Proyecto', 'Seguimiento', 'Orientación', 'Evaluación', 'Otro'],
    default: 'Otro',
  },
  status: {
    type: String,
    enum: ['proxima', 'programada', 'completada', 'cancelada'],
    default: 'programada',
  },
  date:     { type: Date, required: true },
  duration: { type: Number, default: 60 },   // minutes
  room:     { type: String, default: '' },
  notes:    { type: String, default: '' },    // post-session notes

  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  tutor:   { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor',   required: true },
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);
