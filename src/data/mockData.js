export const student = {
  name: "María Cortés",
  career: "Ingeniería en TIC's",
  control: "22371061",
  email: "m22371061@apizaco.tecnm.mx",
  semester: "4° Semestre",
  gpa: "9.2",
  specialty: "Desarrollo de Software",
  avatar: "https://i.pravatar.cc/150?img=47",
  credits: { earned: 180, total: 240, thisSemester: 24 },
};

export const tutor = {
  name: "Dr. Carlos Mendoza",
  dept: "Ingeniería y Tecnología",
  email: "carlos.mendoza@universidad.edu",
  avatar: "https://i.pravatar.cc/150?img=12",
  bio: "Doctor en Ciencias Computacionales con 15 años de experiencia en desarrollo de software y arquitecturas empresariales.",
  specialties: ["Desarrollo Web", "Bases de Datos", "IA y Machine Learning"],
  rating: 4.9,
  sessions: 28,
};

export const sessions = [
  { id: 1, title: "Revisión de Plan Académico", date: "12 de Marzo, 2026", time: "10:00 AM - 1 hora", room: "Sala 204 - Edificio Principal", status: "proxima", type: "Planificación" },
  { id: 2, title: "Asesoría en Proyecto Final", date: "19 de Marzo, 2026", time: "11:00 AM - 1.5 horas", room: "Sala 101 - Edificio B", status: "programada", type: "Proyecto" },
  { id: 3, title: "Revisión de Avances", date: "26 de Febrero, 2026", time: "10:00 AM - 1 hora", room: "Sala 204 - Edificio Principal", status: "completada", type: "Seguimiento" },
  { id: 4, title: "Orientación Vocacional", date: "15 de Febrero, 2026", time: "09:00 AM - 1 hora", room: "Sala 305 - Edificio C", status: "completada", type: "Orientación" },
  { id: 5, title: "Revisión Semestral", date: "28 de Enero, 2026", time: "10:00 AM - 2 horas", room: "Sala 204 - Edificio Principal", status: "completada", type: "Evaluación" },
];

export const notifications = [
  { id: 1, type: "warning", title: "Nueva tarea asignada", desc: "Desarrollo Web Avanzado - Proyecto Final", time: "Hace 2 horas" },
  { id: 2, type: "info", title: "Recordatorio de tutoría", desc: "Tu próxima sesión es el 12 de Marzo a las 10:00 AM", time: "Hace 5 horas" },
  { id: 3, type: "success", title: "Calificación publicada", desc: "Base de Datos - Examen Parcial: 8.5", time: "Hace 1 día" },
  { id: 4, type: "info", title: "Mensaje de tu tutor", desc: "Dr. Mendoza te envió un documento", time: "Hace 2 días" },
];

export const credits_detail = [
  { subject: "Desarrollo Web Avanzado", credits: 5, grade: 9.0, status: "cursando" },
  { subject: "Base de Datos", credits: 4, grade: 8.5, status: "cursando" },
  { subject: "Inteligencia Artificial", credits: 5, grade: null, status: "cursando" },
  { subject: "Redes de Computadoras", credits: 4, grade: 9.5, status: "aprobada" },
  { subject: "Sistemas Operativos", credits: 4, grade: 8.8, status: "aprobada" },
  { subject: "Cálculo Diferencial", credits: 5, grade: 9.2, status: "aprobada" },
];

export const chatMessages = [
  { id: 1, from: "tutor", text: "¡Hola María! ¿Cómo va el proyecto final?", time: "10:03 AM" },
  { id: 2, from: "student", text: "¡Hola Dr. Mendoza! Va bien, aunque tengo algunas dudas sobre la arquitectura de la base de datos.", time: "10:05 AM" },
  { id: 3, from: "tutor", text: "Claro, en nuestra sesión del martes lo revisamos a detalle. Te mando un documento de referencia.", time: "10:07 AM" },
  { id: 4, from: "tutor", text: "📎 Arquitectura_BD_Referencia.pdf", time: "10:07 AM", file: true },
  { id: 5, from: "student", text: "Perfecto, muchas gracias. Lo revisaré antes de la sesión.", time: "10:09 AM" },
];
