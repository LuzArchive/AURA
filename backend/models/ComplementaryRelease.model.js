import mongoose from 'mongoose';

const complementaryReleaseSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },

  // Type of complementary activity
  activityType: {
    type: String,
    enum: ['academico', 'fisico', 'cultural', 'escolar', 'tutoria'],
    required: true,
  },

  // PDF stored as base64 string (for simplicity — in production use S3/Cloud Storage)
  pdfBase64: { type: String, required: true },
  pdfName:   { type: String, default: 'carta_liberacion.pdf' },

  // Data extracted by AI from the PDF
  extractedData: {
    studentName:          { type: String, default: '' },
    controlNumber:        { type: String, default: '' },
    signerName:           { type: String, default: '' },
    signerTitle:          { type: String, default: '' },
    activityName:         { type: String, default: '' },
    activityType:         { type: String, default: '' },
    period:               { type: String, default: '' },
    career:               { type: String, default: '' },
    date:                 { type: String, default: '' },
    officeNumber:         { type: String, default: '' },
    issuingDepartment:    { type: String, default: '' },
    hasLogosTecNM:        { type: Boolean, default: false },
    // 3 mandatory seals
    seals: {
      sistemasYComputacion:         { type: Boolean, default: false },
      serviciosEscolares:           { type: Boolean, default: false },
      centroInformacionUAreaEmisora:{ type: Boolean, default: false },
    },
  },

  // AI verification result
  aiVerification: {
    valid:      { type: Boolean, default: false },
    confidence: { type: Number, default: 0, min: 0, max: 100 },  // 0–100%
    issues:     { type: [String], default: [] },   // list of problems found
    rawResponse:{ type: String, default: '' },
  },

  // Workflow status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  // Manual coordinator action (if needed)
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'Coordinator', default: null },
  reviewedAt:  { type: Date, default: null },
  reviewNotes: { type: String, default: '' },

}, { timestamps: true });

export default mongoose.model('ComplementaryRelease', complementaryReleaseSchema);
