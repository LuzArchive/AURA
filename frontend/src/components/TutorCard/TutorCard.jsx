import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const TutorCard = ({ onContact }) => {
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    api.students.getMyProfile()
      .then(s => setTutor(s.tutor || null))
      .catch(console.error);
  }, []);

  if (!tutor) return (
    <div style={{ background: 'white', borderRadius: 16, padding: '22px 24px', border: '1px solid #e8edf5', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 }}>
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#8898b3' }}>
        {tutor === null ? 'Sin tutor asignado' : 'Cargando...'}
      </span>
    </div>
  );

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '22px 24px', border: '1px solid #e8edf5' }}>
      <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16, color: '#1a2744', margin: '0 0 18px' }}>Tutor Asignado</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {tutor.avatar
          ? <img src={tutor.avatar} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}/>
          : <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#3b6cf7,#5b8ff9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 22, flexShrink: 0 }}>
              {tutor.name?.[0]}
            </div>
        }
        <div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16, color: '#1a2744' }}>{tutor.name}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#8898b3' }}>{tutor.department}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#8898b3' }}>{tutor.email}</div>
        </div>
      </div>
      <button onClick={onContact} style={{ marginTop: 16, width: '100%', padding: '10px 0', background: 'linear-gradient(135deg,#3b6cf7,#5b8ff9)', border: 'none', borderRadius: 10, color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
        Contactar
      </button>
    </div>
  );
};

export default TutorCard;
