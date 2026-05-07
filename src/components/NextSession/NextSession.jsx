import { useState, useEffect } from 'react';
import Icon from '../Icon/Icon';
import { api } from '../../services/api';

const NextSession = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.sessions.getAll()
      .then(sessions => {
        const upcoming = sessions
          .filter(s => s.status !== 'completada' && s.status !== 'cancelada')
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setSession(upcoming[0] || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '22px 24px', border: '1px solid #e8edf5' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Icon name="calendar" size={18} />
        <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16, color: '#1a2744', margin: 0 }}>Próxima Tutoría</h3>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #e8edf5', borderTopColor: '#3b6cf7', animation: 'spin .8s linear infinite' }}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : !session ? (
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#8898b3', textAlign: 'center', padding: '20px 0' }}>
          No hay sesiones próximas programadas
        </div>
      ) : (
        <>
          <div style={{ background: '#f4f7ff', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 15, color: '#1a2744' }}>{session.title}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#8898b3', marginTop: 3 }}>{session.type}</div>
          </div>
          {[
            { icon: 'calendar', text: formatDate(session.date) },
            { icon: 'clock',    text: `${formatTime(session.date)} · ${session.duration} min` },
            { icon: 'mapPin',   text: session.room || 'Por definir' },
          ].map(item => (
            <div key={item.icon} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name={item.icon} size={14} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#6b7fa3' }}>{item.text}</span>
            </div>
          ))}
          <button style={{ marginTop: 8, width: '100%', padding: '10px 0', background: 'white', border: '1.5px solid #3b6cf7', borderRadius: 10, color: '#3b6cf7', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Ver Detalles
          </button>
        </>
      )}
    </div>
  );
};

export default NextSession;
