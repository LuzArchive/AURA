import { useState, useEffect } from 'react';
import StudentCard     from '../../components/StudentCard/StudentCard';
import TutorCard       from '../../components/TutorCard/TutorCard';
import NextSession     from '../../components/NextSession/NextSession';
import CreditsProgress from '../../components/CreditsProgress/CreditsProgress';
import Icon            from '../../components/Icon/Icon';
import ChatbotWidget   from '../../components/ChatbotWidget/ChatbotWidget';
import { api }         from '../../services/api';

const Dashboard = () => {
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    api.students.getMyProfile()
      .then(s => setStudentName(s.name))
      .catch(() => setStudentName(''));
  }, []);

  const notifications = [
    { id: 1, type: 'warning', title: 'Nueva tarea asignada',    desc: 'Desarrollo Web Avanzado - Proyecto Final',           time: 'Hace 2 horas' },
    { id: 2, type: 'info',    title: 'Recordatorio de tutoría', desc: 'Tu próxima sesión es el 12 de Marzo a las 10:00 AM', time: 'Hace 5 horas'  },
    { id: 3, type: 'success', title: 'Calificación publicada',  desc: 'Base de Datos - Examen Parcial: 8.5',                time: 'Hace 1 día'   },
  ];

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
      <StudentCard />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <TutorCard />
        <NextSession />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <CreditsProgress />

        {/* Notifications */}
        <div style={{ background: "white", borderRadius: 16, padding: "22px 24px", border: "1px solid #e8edf5" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="bell" size={18} />
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, color: "#1a2744", margin: 0 }}>Notificaciones</h3>
            </div>
            <span style={{ background: "#3b6cf7", color: "white", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{notifications.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map(n => {
              const dot = { warning: "#f59e0b", info: "#3b6cf7", success: "#22c55e" };
              return (
                <div key={n.id} style={{ padding: "10px 12px", background: "#f9fafc", borderRadius: 10, borderLeft: `3px solid ${dot[n.type]}` }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#1a2744" }}>{n.title}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8898b3" }}>{n.desc}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#b0bcd4", marginTop: 2 }}>{n.time}</div>
                </div>
              );
            })}
          </div>
          <button style={{ marginTop: 12, width: "100%", padding: "8px 0", background: "none", border: "none", color: "#3b6cf7", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Ver todas las notificaciones
          </button>
        </div>
      </div>

      {/* Floating chatbot with real student name */}
      <ChatbotWidget studentName={studentName} />
    </div>
  );
};

export default Dashboard;
