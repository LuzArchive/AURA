/**
 * seed.js — TecNM Campus Apizaco
 * Retícula completa: Ingeniería en TIC's + créditos complementarios
 * Uso: node seed.js
 */
import process from 'process';
import mongoose from 'mongoose';
import dotenv   from 'dotenv';
import Student  from './models/Student.model.js';
import Tutor    from './models/Tutor.model.js';
import Session  from './models/Session.model.js';
import Credit   from './models/Credit.model.js';
import Coordinator  from './models/Coordinator.model.js';

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// RETÍCULA GENÉRICA — Ingeniería en TIC's
// Formato por columna: [ nombre, clave, horas_teoria-horas_practica-creditos ]
// ─────────────────────────────────────────────────────────────────────────────
const RETICULA_TICS = [
  // ── SEMESTRE 1 ──────────────────────────────────────────────────────────────
  { semester: 1, name: 'Cálculo Diferencial',          code: 'ACI-2301', credits: 5 },
  { semester: 1, name: 'Taller de Ética',              code: 'ACA-2307', credits: 4 },
  { semester: 1, name: 'Fundamentos de Programación',  code: 'AEI-1032', credits: 5 },
  { semester: 1, name: 'Fundamentos de Investigación', code: 'ACC-0906', credits: 4 },
  { semester: 1, name: 'Matemáticas Discretas I',      code: 'TIF-1019', credits: 5 },
  { semester: 1, name: "Introducción a las TIC's",     code: 'TIP-1017', credits: 3 },

  // ── SEMESTRE 2 ──────────────────────────────────────────────────────────────
  { semester: 2, name: 'Cálculo Integral',                       code: 'ACI-0902', credits: 5 },
  { semester: 2, name: 'Probabilidad y Estadística',             code: 'AEI-1052', credits: 5 },
  { semester: 2, name: 'Programación Orientada a Objetos',       code: 'AEB-1054', credits: 4 },
  { semester: 2, name: 'Contabilidad y Costos',                  code: 'TIH-1009', credits: 5 },
  { semester: 2, name: 'Matemáticas Discretas II',               code: 'TIF-1020', credits: 5 },

  // ── SEMESTRE 3 ──────────────────────────────────────────────────────────────
  { semester: 3, name: 'Álgebra Lineal',                              code: 'ACI-0903', credits: 5 },
  { semester: 3, name: 'Matemáticas Aplicadas a las Comunicaciones',  code: 'TIE-1018', credits: 4 },
  { semester: 3, name: 'Estructura y Organización de Datos',          code: 'TID-1012', credits: 5 },
  { semester: 3, name: 'Administración Gerencial',                    code: 'TIC-1002', credits: 4 },
  { semester: 3, name: 'Electricidad y Magnetismo',                   code: 'TIC-1011', credits: 4 },
  { semester: 3, name: 'Fundamentos de Base de Datos',                code: 'AEI-1031', credits: 5 },

  // ── SEMESTRE 4 ──────────────────────────────────────────────────────────────
  { semester: 4, name: 'Matemáticas para la Toma de Decisiones',      code: 'TIF-1021', credits: 5 },
  { semester: 4, name: 'Programación II',                             code: 'TIB-1024', credits: 4 },
  { semester: 4, name: 'Ingeniería de Software',                      code: 'TIC-1014', credits: 4 },
  { semester: 4, name: 'Análisis de Señales y Sistemas de Comunicación', code: 'TID-1004', credits: 5 },
  { semester: 4, name: 'Circuitos Eléctricos y Electrónicos',         code: 'TID-1008', credits: 5 },
  { semester: 4, name: 'Taller de Base de Datos',                     code: 'AEA-1063', credits: 4 },

  // ── SEMESTRE 5 ──────────────────────────────────────────────────────────────
  { semester: 5, name: 'Arquitectura de Computadoras',                code: 'TIC-1005', credits: 4 },
  { semester: 5, name: 'Administración de Proyectos',                 code: 'TIF-1001', credits: 5 },
  { semester: 5, name: 'Taller de Ingeniería de Software',            code: 'TIC-1027', credits: 4 },
  { semester: 5, name: 'Fundamentos de Redes',                        code: 'TIH-1013', credits: 5 },
  { semester: 5, name: 'Telecomunicaciones',                          code: 'TIH-1029', credits: 5 },
  { semester: 5, name: 'Base de Datos Distribuidas',                  code: 'TIH-1007', credits: 5 },

  // ── SEMESTRE 6 ──────────────────────────────────────────────────────────────
  { semester: 6, name: 'Taller de Investigación I',                   code: 'ACA-0909', credits: 4 },
  { semester: 6, name: 'Programación Web',                            code: 'AEB-1055', credits: 4 },
  { semester: 6, name: 'Tecnologías Inalámbricas',                    code: 'TIC-1028', credits: 4 },
  { semester: 6, name: 'Sistemas Operativos I',                       code: 'AEC-1061', credits: 4 },
  { semester: 6, name: 'Desarrollo de Emprendedores',                 code: 'TID-1010', credits: 5 },
  { semester: 6, name: 'Redes de Computadoras',                       code: 'TIH-1025', credits: 5 },

  // ── SEMESTRE 7 ──────────────────────────────────────────────────────────────
  { semester: 7, name: 'Taller de Investigación II',                               code: 'ACA-0910', credits: 4 },
  { semester: 7, name: 'Negocios Electrónicos I',                                  code: 'TIC-1022', credits: 4 },
  { semester: 7, name: 'Desarrollo de Aplicaciones para Dispositivos Móviles',     code: 'AEB-1011', credits: 4 },
  { semester: 7, name: 'Desarrollo Sustentable',                                   code: 'ACD-0908', credits: 5 },
  { semester: 7, name: 'Sistemas Operativos II',                                   code: 'AED-1062', credits: 5 },
  { semester: 7, name: 'Redes Emergentes',                                         code: 'TIH-1026', credits: 5 },

  // ── SEMESTRE 8 ──────────────────────────────────────────────────────────────
  { semester: 8, name: 'Auditoría en Tecnologías de la Información',  code: 'TIC-1006', credits: 4 },
  { semester: 8, name: 'Negocios Electrónicos II',                    code: 'TIC-1023', credits: 4 },
  { semester: 8, name: 'Ingeniería del Conocimiento',                 code: 'TIC-1015', credits: 4 },
  { semester: 8, name: 'Administración y Seguridad de Redes',         code: 'TIB-1003', credits: 4 },
  { semester: 8, name: 'Interacción Humano Computadora',              code: 'TIH-1016', credits: 4 },
];

// ─────────────────────────────────────────────────────────────────────────────
// CRÉDITOS COMPLEMENTARIOS
// Reglas:
//  - 4 actividades: 1 académica + 1 física + 1 cultural + 1 escolar
//  - 1 crédito de tutoría (se libera al completar las 4 actividades)
//  - No se pueden repetir actividades ni tomar 2 del mismo tipo
//  - Disponibles a más tardar en 6° semestre
// ─────────────────────────────────────────────────────────────────────────────
const COMPLEMENTARIOS = [
  {
    name:     'Círculo de Lectura',
    code:     'COMP-ACAD-001',
    credits:  1,
    semester: 2,
    tipo:     'academico',
    status:   'aprobada',   // ya liberada
    grade:    null,
    note:     'Actividad complementaria académica — requerida para servicio social',
  },
  {
    name:     'Acondicionamiento Físico',
    code:     'COMP-FIS-001',
    credits:  1,
    semester: 2,
    tipo:     'fisico',
    status:   'aprobada',   // ya liberada
    grade:    null,
    note:     'Actividad complementaria física — requerida para servicio social',
  },
  {
    name:     'Danza Folklórica',
    code:     'COMP-CULT-001',
    credits:  1,
    semester: 3,
    tipo:     'cultural',
    status:   'cursando',   // en curso — aún no liberada
    grade:    null,
    note:     'Actividad complementaria cultural — en curso este semestre',
  },
  {
    name:     'Semana de Ingeniería',
    code:     'COMP-ESC-001',
    credits:  1,
    semester: 4,
    tipo:     'escolar',
    status:   'pendiente',  // convocatoria aún no abierta
    grade:    null,
    note:     'Evento escolar — convocatoria abre primeras 2 semanas del ciclo',
  },
  {
    // Se libera automáticamente al completar las 4 actividades anteriores
    name:     'Tutoría Institucional',
    code:     'TUT-INST-001',
    credits:  1,
    semester: 0,            // 0 = transversal, no ligada a semestre fijo
    tipo:     'tutoria',
    status:   'cursando',   // pendiente hasta liberar las 4 complementarias
    grade:    null,
    note:     'Se libera al completar las 4 actividades complementarias. Requisito para servicio social.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CALIFICACIONES MOCK para semestres ya cursados (1–3)
// ─────────────────────────────────────────────────────────────────────────────
const GRADES = {
  // sem 1: 6 materias
  1: [9.2, 8.8, 9.8, 8.5, 9.0, 9.5],
  // sem 2: 5 materias
  2: [7.5, 8.3, 9.1, 8.7, 8.6],
  // sem 3: 6 materias
  3: [8.0, 8.4, 9.0, 8.9, 8.7, 9.3],
};

const CURRENT_SEMESTER = 4;

// Calificaciones parciales del semestre actual (algunas aún sin calificación)
const GRADES_SEM4 = [null, null, 8.5, null, null, null];

// ─────────────────────────────────────────────────────────────────────────────
const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas\n');

    // Limpiar colecciones
    await Promise.all([
      Student.deleteMany({}),
      Tutor.deleteMany({}),
      Session.deleteMany({}),
      Credit.deleteMany({}),
      Coordinator.deleteMany({}),
    ]);
    console.log('🗑️  Colecciones limpiadas');

    // ── Tutor ────────────────────────────────────────────────────────────────
    const tutor = await Tutor.create({
      name:        'Dr. Carlos Mendoza',
      email:       'carlos.mendoza@apizaco.tecnm.mx',
      password:    'tutor123',
      department:  'Ingeniería y Tecnología',
      specialties: ['Desarrollo Web', 'Bases de Datos', 'IA y Machine Learning'],
      bio:         'Doctor en Ciencias Computacionales con 15 años de experiencia.',
      avatar:      'https://i.pravatar.cc/150?img=12',
      rating:      4.9,
    });
    console.log(`👨‍🏫 Tutor: ${tutor.name}`);


    // Coordinador
    const coordinator = await Coordinator.create({
      name:       'Dra. Ana Flores',
      email:      'ana.flores@apizaco.tecnm.mx',
      password:   'coord123',
      department: 'Coordinacion de Tutorias',
    });
    console.log('Coordinadora creada:', coordinator.name);

    // ── Estudiante ───────────────────────────────────────────────────────────
    const student = await Student.create({
      name:          'María Cortés',
      controlNumber: '22371061',
      email:         'm22371061@apizaco.tecnm.mx',
      password:      'tutorias123',
      career:        "Ingeniería en TIC's",
      semester:      CURRENT_SEMESTER,
      specialty:     'Desarrollo de Software',
      gpa:           9.2,
      avatar:        'https://i.pravatar.cc/150?img=47',
      tutor:         tutor._id,
    });
    tutor.students.push(student._id);
    await tutor.save();
    console.log(`👩‍🎓 Estudiante: ${student.name}`);

    // ── Sesiones ─────────────────────────────────────────────────────────────
    const now = new Date();
    await Session.insertMany([
      {
        title: 'Revisión de Plan Académico', type: 'Planificación', status: 'proxima',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 0),
        duration: 60, room: 'Sala 204 - Edificio Principal',
        student: student._id, tutor: tutor._id,
      },
      {
        title: 'Asesoría en Proyecto Final', type: 'Proyecto', status: 'programada',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 11, 0),
        duration: 90, room: 'Sala 101 - Edificio B',
        student: student._id, tutor: tutor._id,
      },
      {
        title: 'Revisión de Avances', type: 'Seguimiento', status: 'completada',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10, 10, 0),
        duration: 60, room: 'Sala 204 - Edificio Principal',
        notes: 'Buen avance general. Reforzar Base de Datos.',
        student: student._id, tutor: tutor._id,
      },
      {
        title: 'Orientación Vocacional', type: 'Orientación', status: 'completada',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 22, 9, 0),
        duration: 60, room: 'Sala 305 - Edificio C',
        notes: 'Se discutieron opciones de especialización.',
        student: student._id, tutor: tutor._id,
      },
      {
        title: 'Revisión Semestral', type: 'Evaluación', status: 'completada',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 39, 10, 0),
        duration: 120, room: 'Sala 204 - Edificio Principal',
        notes: 'Evaluación completa. Promedio satisfactorio.',
        student: student._id, tutor: tutor._id,
      },
    ]);
    console.log('📅 5 sesiones creadas');

    // ── Construir subjects con status y calificaciones ────────────────────────
    const semIdx = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const subjects = RETICULA_TICS.map(mat => {
      const i = semIdx[mat.semester] ?? 0;
      semIdx[mat.semester] = i + 1;

      let grade  = null;
      let status = 'pendiente';

      if (mat.semester < CURRENT_SEMESTER) {
        grade  = GRADES[mat.semester]?.[i] ?? 8.5;
        status = 'aprobada';
      } else if (mat.semester === CURRENT_SEMESTER) {
        grade  = GRADES_SEM4[i] ?? null;
        status = 'cursando';
      }

      return { name: mat.name, credits: mat.credits, grade, status, semester: mat.semester };
    });

    // Agregar complementarios
    const allSubjects = [
      ...subjects,
      ...COMPLEMENTARIOS.map(c => ({
        name:     c.name,
        credits:  c.credits,
        grade:    c.grade,
        status:   c.status,
        semester: c.semester,
      })),
    ];

    // Calcular totales
    const earnedReticula = subjects
      .filter(s => s.status === 'aprobada')
      .reduce((acc, s) => acc + s.credits, 0);

    const earnedComp = COMPLEMENTARIOS
      .filter(c => c.status === 'aprobada')
      .reduce((acc, c) => acc + c.credits, 0);

    const totalEarned = earnedReticula + earnedComp;
    // Total posible: suma retícula + 5 complementarios
    const totalPossible = RETICULA_TICS.reduce((a, m) => a + m.credits, 0) + 5;

    await Credit.create({
      student:             student._id,
      totalCredits:        totalPossible,
      creditsThisSemester: 27,
      subjects:            allSubjects,
    });


    // ── Estudiante 2: Maibelyn ────────────────────────────────────────────────
    const CURRENT_SEM_MAI = 6;

    const gradesMai = {
      1: [9.0, 8.5, 9.5, 8.2, 8.8, 9.1],
      2: [8.0, 7.8, 9.2, 8.6, 8.4],
      3: [8.7, 7.9, 9.0, 8.3, 8.5, 9.4],
      4: [8.1, 8.9, 9.3, 7.7, 8.6, 8.0],
      5: [8.4, 9.1, 8.7, 8.2, 9.0, 8.5],
    };

    const semIdxMai = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
    const gradesSem6Mai = [null, null, null, null, 8.0, null]; // algunas parciales

    const subjectsMai = RETICULA_TICS.map(mat => {
      const i = semIdxMai[mat.semester] ?? 0;
      semIdxMai[mat.semester] = i + 1;

      let grade  = null;
      let status = 'pendiente';

      if (mat.semester < CURRENT_SEM_MAI) {
        grade  = gradesMai[mat.semester]?.[i] ?? 8.5;
        status = 'aprobada';
      } else if (mat.semester === CURRENT_SEM_MAI) {
        grade  = gradesSem6Mai[semIdxMai[mat.semester] - 1] ?? null;
        status = 'cursando';
      }

      return { name: mat.name, credits: mat.credits, grade, status, semester: mat.semester };
    });

    // Complementarios de Maibelyn:
    // - Física (Fortalecimiento Físico): APROBADA — periodo 2023SEM3
    // - Cultural (Artes Plásticas): CURSANDO
    // - Académica, Escolar, Tutoría: PENDIENTE
    const compMai = [
      { name: 'Fortalecimiento Físico', credits: 1, semester: 3, status: 'aprobada',  grade: null },
      { name: 'Artes Plásticas',        credits: 1, semester: 6, status: 'cursando',  grade: null },
      { name: 'Círculo de Lectura',     credits: 1, semester: 0, status: 'pendiente', grade: null },
      { name: 'Semana de Ingeniería',   credits: 1, semester: 0, status: 'pendiente', grade: null },
      { name: 'Tutoría Institucional',  credits: 1, semester: 0, status: 'cursando',  grade: null },
    ];

    const student2 = await Student.create({
      name:          'Maibelyn Sehany Papalotzi',
      controlNumber: '23370832',
      email:         'l23370832@apizaco.tecnm.mx',
      password:      'tutorias123',
      career:        "Ingeniería en TIC's",
      semester:      CURRENT_SEM_MAI,
      specialty:     '',
      gpa:           8.7,
      avatar:        'https://i.pravatar.cc/150?img=25',
      tutor:         tutor._id,
    });
    tutor.students.push(student2._id);
    await tutor.save();
    console.log(`👩‍🎓 Estudiante 2: ${student2.name}`);

    // Sesiones de Maibelyn
    await Session.insertMany([
      {
        title: 'Seguimiento Semestral', type: 'Seguimiento', status: 'proxima',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 9, 0),
        duration: 60, room: 'Sala 101 - Edificio B',
        student: student2._id, tutor: tutor._id,
      },
      {
        title: 'Asesoría Actividades Complementarias', type: 'Orientación', status: 'completada',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15, 10, 0),
        duration: 60, room: 'Sala 204 - Edificio Principal',
        notes: 'Se orientó sobre requisitos de complementarias y tutoría para servicio social.',
        student: student2._id, tutor: tutor._id,
      },
      {
        title: 'Revisión de Avance 6° Semestre', type: 'Seguimiento', status: 'completada',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 11, 0),
        duration: 90, room: 'Sala 305 - Edificio C',
        notes: 'Avance satisfactorio. Pendiente liberar 3 complementarias.',
        student: student2._id, tutor: tutor._id,
      },
    ]);
    console.log('📅 3 sesiones de Maibelyn creadas');

    const totalPossible2 = RETICULA_TICS.reduce((a, m) => a + m.credits, 0) + 5;
    await Credit.create({
      student:             student2._id,
      totalCredits:        totalPossible2,
      creditsThisSemester: 26,
      subjects:            [...subjectsMai, ...compMai],
    });
    console.log('💾 Créditos de Maibelyn guardados');

    // ── Resumen ──────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  SEED COMPLETADO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👩‍🎓 Estudiante 1: m22371061@apizaco.tecnm.mx  |  Password: tutorias123');
    console.log('👩‍🎓 Estudiante 2: l23370832@apizaco.tecnm.mx   |  Password: tutorias123');
    console.log('👨‍🏫 Email:    carlos.mendoza@apizaco.tecnm.mx');
    console.log('   Password: tutor123     |  Rol: tutor');
console.log('Coordinadora: ana.flores@apizaco.tecnm.mx  |  Password: coord123  |  Rol: coordinator');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📚 Materias retícula: ${RETICULA_TICS.length}`);
    console.log(`   Aprobadas:  ${subjects.filter(s=>s.status==='aprobada').length}`);
    console.log(`   Cursando:   ${subjects.filter(s=>s.status==='cursando').length}`);
    console.log(`   Pendientes: ${subjects.filter(s=>s.status==='pendiente').length}`);
    console.log(`🎯 Complementarios: ${COMPLEMENTARIOS.length}`);
    console.log(`   Aprobados: ${COMPLEMENTARIOS.filter(c=>c.status==='aprobada').length}/4 actividades`);
    console.log(`   Tutoría:   ${COMPLEMENTARIOS.find(c=>c.tipo==='tutoria')?.status}`);
    console.log(`💳 Créditos obtenidos: ${totalEarned} / ${totalPossible}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    console.error(err);
    await mongoose.disconnect();
  }
};

run();