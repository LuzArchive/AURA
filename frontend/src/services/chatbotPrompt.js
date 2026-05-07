import { api } from './api.js';

export const buildSystemPrompt = async () => {
  try {
    const [student, sessions, credits] = await Promise.all([
      api.students.getMyProfile(),
      api.sessions.getAll(),
      api.credits.getMy(),
    ]);

    const tutor = student.tutor || {};

    const upcoming = sessions
      .filter(s => s.status !== 'completada' && s.status !== 'cancelada')
      .map(s => {
        const fecha = new Date(s.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const hora  = new Date(s.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        return `• ${s.title} — ${fecha} a las ${hora} (${s.duration} min) en ${s.room || 'por definir'}`;
      }).join('\n') || '• Sin sesiones próximas';

    const completed = sessions
      .filter(s => s.status === 'completada')
      .map(s => `• ${s.title} — ${new Date(s.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`)
      .join('\n') || '• Sin sesiones completadas';

    // Calcular créditos del lado del frontend (no depender del virtual de mongoose)
    const allSubjects  = credits?.subjects ?? [];
    const earnedCredits   = allSubjects.filter(s => s.status === 'aprobada').reduce((a, s) => a + s.credits, 0);
    const totalCredits    = credits?.totalCredits    ?? 245;
    const semesterCredits = credits?.creditsThisSemester ?? 0;
    const pendingCredits  = totalCredits - earnedCredits;
    const percentage      = Math.round((earnedCredits / totalCredits) * 100);

    // Separar materias y complementarios
    const COMP_CODES = ['COMP-', 'TUT-'];
    const materiasReticula = allSubjects.filter(s => !COMP_CODES.some(p => s.name?.startsWith(p) || false));
    const complementarios  = allSubjects.filter(s => s.semester === 0 || ['Círculo de Lectura','Acondicionamiento Físico','Danza Folklórica','Semana de Ingeniería','Tutoría Institucional'].includes(s.name));

    const subjects = materiasReticula
      .map(s => `• ${s.name}: ${s.credits} cr — Cal: ${s.grade ?? '—'} (${s.status}) [sem ${s.semester}]`)
      .join('\n') || '• Sin materias';

    const compStatus = complementarios.map(c => `• ${c.name}: ${c.status}`).join('\n') || '• Sin registros';

    const compAprobados = complementarios.filter(c => c.status === 'aprobada').length;
    const tutoriaLibre  = complementarios.find(c => c.name === 'Tutoría Institucional')?.status === 'aprobada';

    return `
Eres un asistente virtual de tutorías del Tecnológico Nacional de México, campus Apizaco.
Tu nombre es "Asistente de Tutorías". Amable, conciso, siempre en español.
Usa solo el primer nombre del estudiante.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTUDIANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre:           ${student.name}
Carrera:          ${student.career}
No. Control:      ${student.controlNumber}
Correo:           ${student.email}
Semestre actual:  ${student.semester}°
Promedio:         ${student.gpa}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TUTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${tutor.name || 'No asignado'} | ${tutor.department || '—'}
Correo: ${tutor.email || '—'} | Rating: ${tutor.rating ?? '—'}/5.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRÉDITOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Obtenidos:    ${earnedCredits} / ${totalCredits} (${percentage}%)
Pendientes:   ${pendingCredits}
Este semestre: ${semesterCredits}

Materias retícula (resumen por estatus):
- Aprobadas: ${materiasReticula.filter(s=>s.status==='aprobada').length} materias
- Cursando:  ${materiasReticula.filter(s=>s.status==='cursando').length} materias
- Pendientes: ${materiasReticula.filter(s=>s.status==='pendiente').length} materias

Materias cursando actualmente:
${materiasReticula.filter(s=>s.status==='cursando').map(s=>`• ${s.name} (${s.credits} cr)`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRÉDITOS COMPLEMENTARIOS (req. servicio social)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reglas: 1 académico + 1 físico + 1 cultural + 1 escolar = 4 actividades → libera tutoría
Aprobados hasta ahora: ${compAprobados}/4
Tutoría institucional: ${tutoriaLibre ? '✅ LIBERADA' : '🔒 Pendiente (requiere las 4 actividades)'}

${compStatus}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Próximas:
${upcoming}

Completadas:
${completed}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCCIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Máximo 5 líneas de respuesta salvo necesidad.
2. Usa datos exactos de arriba — nunca inventes.
3. Para créditos complementarios, explica las reglas si te preguntan.
4. Para contactar tutor: ${tutor.email || 'no disponible'}.
5. Para agendar sesión: sección "Tutorías" del panel.
6. Si no tienes el dato: "No tengo esa información, consulta a tu tutor."
`;
  } catch (err) {
    console.error('Error buildSystemPrompt:', err);
    return 'Eres un asistente de tutorías del TecNM Apizaco. Responde en español. No puedo acceder a los datos ahora mismo.';
  }
};
