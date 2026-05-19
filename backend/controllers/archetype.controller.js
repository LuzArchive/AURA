import Student         from '../models/Student.model.js';
import ArchetypeSurvey from '../models/ArchetypeSurvey.model.js';

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE ARQUETIPOS
// A → Centinela  (Ajolote       — verde maguey  — SJ organizado)
// B → Analítico  (Ocelote       — azul obsidiana — NT lógico)
// C → Explorador (Xoloitzcuintle — naranja cempasúchil — SP creativo)
// D → Diplomático(Tlacuache     — rosa terroso  — NF empático)
// ─────────────────────────────────────────────────────────────────────────────
const ANSWER_MAP = { A: 'centinela', B: 'analitico', C: 'explorador', D: 'diplomatico' };

const ARCHETYPE_INFO = {
  analitico: {
    name:        'Analítico',
    animal:      'Ocelote',
    color:       '#1a2f5e',
    colorName:   'Azul Obsidiana',
    emoji:       '🐆',
    description: 'Intelectualmente curioso, estratégico y lógico. Te enfocas en el "por qué" y disfrutas los sistemas complejos.',
    mbti:        'NT',
  },
  diplomatico: {
    name:        'Diplomático',
    animal:      'Tlacuache',
    color:       '#8b5e52',
    colorName:   'Rosa Mexicano Terroso',
    emoji:       '🐾',
    description: 'Empático, idealista y orientado a las personas. Aprendes mejor a través de la cooperación y el impacto humano.',
    mbti:        'NF',
  },
  centinela: {
    name:        'Centinela',
    animal:      'Ajolote',
    color:       '#2d6a4f',
    colorName:   'Verde Maguey',
    emoji:       '🦎',
    description: 'Organizado, responsable y metódico. Confías en estructuras claras, rutinas y plazos definidos.',
    mbti:        'SJ',
  },
  explorador: {
    name:        'Explorador',
    animal:      'Xoloitzcuintle',
    color:       '#e07b20',
    colorName:   'Naranja Cempasúchil',
    emoji:       '🐕',
    description: 'Creativo, espontáneo y práctico. Aprendes haciendo, disfrutas los retos inmediatos y la experimentación.',
    mbti:        'SP',
  },
};

// ── Calcular arquetipo a partir de respuestas ─────────────────────────────────
const calculateArchetype = (answers) => {
  const scores = { A: 0, B: 0, C: 0, D: 0 };
  answers.forEach(a => { if (scores[a] !== undefined) scores[a]++; });

  // Obtener la letra con más respuestas
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return { scores, archetype: ANSWER_MAP[winner] };
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/archetype/check
// Público — verifica número de control antes de mostrar la encuesta
// Body: { controlNumber }
// ─────────────────────────────────────────────────────────────────────────────
export const checkControlNumber = async (req, res) => {
  const { controlNumber } = req.body;
  if (!controlNumber?.trim())
    return res.status(400).json({ message: 'El número de control es requerido' });

  try {
    const student = await Student.findOne({ controlNumber: controlNumber.trim() });

    // Caso 1: No está registrado en la BD
    if (!student) {
      // Verificar si ya hizo el test como pre-registro
      const existing = await ArchetypeSurvey.findOne({
        controlNumber: controlNumber.trim(),
        isPreRegistered: true,
      }).sort({ createdAt: -1 });

      if (existing?.result) {
        return res.json({
          status:    'preregistered_with_survey',
          message:   'Ya completaste el cuestionario. Tu arquetipo fue guardado y el coordinador ha sido notificado para completar tu registro.',
          archetype: existing.result,
          info:      ARCHETYPE_INFO[existing.result],
        });
      }

      return res.json({
        status:  'not_registered',
        message: 'Tu número de control no está en el sistema. Puedes hacer el cuestionario ahora y el coordinador completará tu registro después.',
      });
    }

    // Caso 2: Registrado pero ya tiene arquetipo
    if (student.archetype) {
      // Verificar si puede rehacer (distinto semestre al actual)
      const canRetake = student.semester !== student.archetypeSemester;
      return res.json({
        status:     'has_archetype',
        message:    canRetake
          ? `Tienes el arquetipo ${ARCHETYPE_INFO[student.archetype].name}. Puedes rehacerlo porque estás en un nuevo semestre.`
          : `Ya tienes el arquetipo ${ARCHETYPE_INFO[student.archetype].name} asignado este semestre.`,
        archetype:  student.archetype,
        info:       ARCHETYPE_INFO[student.archetype],
        canRetake,
        name:       student.name,
      });
    }

    // Caso 3: Registrado sin arquetipo — puede hacer el test
    return res.json({
      status:  'registered_no_survey',
      message: `¡Bienvenido/a, ${student.name.split(' ')[0]}! Completa el cuestionario para conocer tu arquetipo de aprendizaje.`,
      name:    student.name,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/archetype/submit
// Público — recibe respuestas, calcula arquetipo, guarda
// Body: { controlNumber, answers: ['A','B','C',...], preRegData? }
// ─────────────────────────────────────────────────────────────────────────────
export const submitSurvey = async (req, res) => {
  const { controlNumber, answers, preRegData } = req.body;

  if (!controlNumber?.trim())
    return res.status(400).json({ message: 'El número de control es requerido' });
  if (!Array.isArray(answers) || answers.length !== 10)
    return res.status(400).json({ message: 'Se requieren exactamente 10 respuestas' });
  if (!answers.every(a => ['A','B','C','D'].includes(a)))
    return res.status(400).json({ message: 'Cada respuesta debe ser A, B, C o D' });

  try {
    const student = await Student.findOne({ controlNumber: controlNumber.trim() });
    const { scores, archetype } = calculateArchetype(answers);
    const currentSemester = student?.semester ?? preRegData?.semester ?? null;

    // Verificar si ya hizo el test este semestre
    if (student?.archetype && student.archetypeSemester === currentSemester) {
      return res.status(409).json({
        message:   'Ya completaste el cuestionario este semestre.',
        archetype: student.archetype,
        info:      ARCHETYPE_INFO[student.archetype],
      });
    }

    // Guardar la encuesta
    await ArchetypeSurvey.findOneAndUpdate(
      { controlNumber: controlNumber.trim(), semesterTaken: currentSemester },
      {
        student:             student?._id || null,
        controlNumber:       controlNumber.trim(),
        isPreRegistered:     !student,
        preRegData:          !student ? (preRegData || {}) : {},
        answers,
        scores,
        result:              archetype,
        semesterTaken:       currentSemester,
        coordinatorNotified: false,
      },
      { upsert: true, new: true }
    );

    // Si el estudiante existe → actualizar su perfil
    if (student) {
      student.archetype           = archetype;
      student.archetypeAssignedAt = new Date();
      student.archetypeSemester   = currentSemester;
      await student.save();
    }

    return res.status(201).json({
      archetype,
      info:           ARCHETYPE_INFO[archetype],
      scores,
      isPreRegistered: !student,
      message:         student
        ? `¡Tu arquetipo es ${ARCHETYPE_INFO[archetype].name} ${ARCHETYPE_INFO[archetype].emoji}! El chatbot se adaptará a tu perfil.`
        : `¡Tu arquetipo es ${ARCHETYPE_INFO[archetype].name} ${ARCHETYPE_INFO[archetype].emoji}! El coordinador completará tu registro pronto.`,
    });

  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: 'Ya completaste el cuestionario este semestre.' });
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/archetype/me
// Protegido (JWT estudiante) — retorna arquetipo del usuario logueado
// ─────────────────────────────────────────────────────────────────────────────
export const getMyArchetype = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    if (!student.archetype) {
      return res.json({ archetype: null, message: 'Aún no tienes arquetipo asignado.' });
    }

    const canRetake = student.semester !== student.archetypeSemester;

    res.json({
      archetype:           student.archetype,
      info:                ARCHETYPE_INFO[student.archetype],
      archetypeAssignedAt: student.archetypeAssignedAt,
      archetypeSemester:   student.archetypeSemester,
      canRetake,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/archetype/retake
// Protegido (JWT estudiante) — permite rehacer si cambió de semestre
// Body: { answers: ['A','B',...] }
// ─────────────────────────────────────────────────────────────────────────────
export const retakeSurvey = async (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers) || answers.length !== 10)
    return res.status(400).json({ message: 'Se requieren exactamente 10 respuestas' });

  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    // Validar que sea un semestre diferente
    if (student.archetypeSemester === student.semester && student.archetype) {
      return res.status(403).json({
        message: `Ya hiciste el cuestionario en ${student.semester}° semestre. Podrás rehacerlo el próximo semestre.`,
      });
    }

    const { scores, archetype } = calculateArchetype(answers);

    // Guardar nueva encuesta
    await ArchetypeSurvey.create({
      student:       student._id,
      controlNumber: student.controlNumber,
      answers,
      scores,
      result:        archetype,
      semesterTaken: student.semester,
    });

    // Actualizar estudiante
    student.archetype           = archetype;
    student.archetypeAssignedAt = new Date();
    student.archetypeSemester   = student.semester;
    await student.save();

    res.json({
      archetype,
      info:    ARCHETYPE_INFO[archetype],
      scores,
      message: `¡Tu nuevo arquetipo es ${ARCHETYPE_INFO[archetype].name} ${ARCHETYPE_INFO[archetype].emoji}!`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/coordinator/preregistros
// Protegido (JWT coordinador) — lista pre-registros pendientes
// ─────────────────────────────────────────────────────────────────────────────
export const getPreregistros = async (req, res) => {
  try {
    const preRegs = await ArchetypeSurvey.find({
      isPreRegistered: true,
    }).sort({ createdAt: -1 });

    // Formato limpio para el panel del coordinador
    const formatted = preRegs.map(p => ({
      _id:           p._id,
      controlNumber: p.controlNumber,
      name:          p.preRegData?.name     || '—',
      career:        p.preRegData?.career   || '—',
      semester:      p.preRegData?.semester || '—',
      email:         p.preRegData?.email    || '—',
      archetype:     p.result,
      archetypeInfo: ARCHETYPE_INFO[p.result],
      completedAt:   p.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Exportar ARCHETYPE_INFO para usarlo en el chatbotPrompt del backend
// ─────────────────────────────────────────────────────────────────────────────
export { ARCHETYPE_INFO };
