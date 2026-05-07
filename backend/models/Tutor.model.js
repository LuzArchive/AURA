import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tutorSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true, minlength: 6 },
  department:  { type: String, required: true },
  specialties: { type: [String], default: [] },
  bio:         { type: String, default: '' },
  avatar:      { type: String, default: '' },
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  role:        { type: String, default: 'tutor' },

  // Students assigned to this tutor
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

tutorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

tutorSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

tutorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Tutor', tutorSchema);
