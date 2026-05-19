import mongoose from 'mongoose';
import bcrypt    from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  controlNumber: { type: String, required: true, unique: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true, minlength: 6 },
  career:        { type: String, required: true },
  semester:      { type: Number, required: true, min: 1, max: 12 },
  specialty:     { type: String, default: '' },
  gpa:           { type: Number, default: 0, min: 0, max: 10 },
  avatar:        { type: String, default: '' },
  role:          { type: String, default: 'student' },

  // ── Arquetipo adaptativo ──────────────────────────────────────────────────
  archetype: {
    type:    String,
    enum:    ['analitico', 'diplomatico', 'centinela', 'explorador', null],
    default: null,
  },
  archetypeAssignedAt: { type: Date,   default: null },
  // Semestre en que se asignó — para validar el límite de 1 vez por semestre
  archetypeSemester:   { type: Number, default: null },

  // Reference to assigned tutor
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', default: null },
}, { timestamps: true });

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

studentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Student', studentSchema);
