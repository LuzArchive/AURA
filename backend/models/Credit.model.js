import mongoose from 'mongoose';

// One document per student — contains all subjects
const creditSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },

  totalCredits:          { type: Number, default: 240 },
  creditsThisSemester:   { type: Number, default: 0   },

  subjects: [{
    name:     { type: String, required: true },
    credits:  { type: Number, required: true },
    grade:    { type: Number, default: null, min: 0, max: 10 },
    status:   { type: String, enum: ['cursando', 'aprobada', 'reprobada', 'pendiente'], default: 'cursando' },
    semester: { type: Number, required: true },
  }],
}, { timestamps: true });

// Virtual: earned credits (sum of approved subjects)
creditSchema.virtual('earnedCredits').get(function () {
  return this.subjects
    .filter(s => s.status === 'aprobada')
    .reduce((sum, s) => sum + s.credits, 0);
});

creditSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Credit', creditSchema);
