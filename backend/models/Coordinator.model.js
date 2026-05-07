import mongoose from 'mongoose';
import bcrypt    from 'bcryptjs';

const coordinatorSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true, minlength: 6 },
  department: { type: String, default: 'Coordinación de Tutorías' },
  avatar:     { type: String, default: '' },
  role:       { type: String, default: 'coordinator' },
}, { timestamps: true });

coordinatorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

coordinatorSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

coordinatorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Coordinator', coordinatorSchema);
