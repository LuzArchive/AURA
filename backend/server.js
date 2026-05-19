import express    from 'express';
import cors       from 'cors';
import dotenv     from 'dotenv';
import mongoose   from 'mongoose';

import authRoutes        from './routes/auth.routes.js';
import studentRoutes     from './routes/student.routes.js';
import tutorRoutes       from './routes/tutor.routes.js';
import sessionRoutes     from './routes/session.routes.js';
import creditRoutes      from './routes/credit.routes.js';
import coordinatorRoutes from './routes/coordinator.routes.js';
import releaseRoutes     from './routes/release.routes.js';
import chatRoutes        from './routes/chat.routes.js';
import archetypeRoutes   from './routes/archetype.routes.js';   // ← NUEVO

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/students',    studentRoutes);
app.use('/api/tutors',      tutorRoutes);
app.use('/api/sessions',    sessionRoutes);
app.use('/api/credits',     creditRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/releases',    releaseRoutes);
app.use('/api/chat',        chatRoutes);
app.use('/api/archetype',   archetypeRoutes);                   // ← NUEVO

app.get('/', (_req, res) => res.json({ status: 'API corriendo ✅', version: '2.1' }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas conectado');
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });
