import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const StudentCard = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    api.students.getMyProfile().then(setStudent).catch(console.error);
  }, []);

  if (!student) return (
    <div style={{ background: 'linear-gradient(135deg,#1a3a8f,#2d5be3,#4d7ff5)', borderRadius: 20, padding: '28px 32px', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(255,255,255,.3)', borderTopColor: 'white', animation: 'spin .8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg,#1a3a8f 0%,#2d5be3 60%,#4d7ff5 100%)', borderRadius: 20, padding: '28px 32px', color: 'white', display: 'flex', alignItems: 'center', gap: 28, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40,  right: -40,  width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }}/>
      <div style={{ position: 'absolute', bottom: -30, right: 120, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }}/>
      {student.avatar
        ? <img src={student.avatar} alt="" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,.3)', flexShrink: 0 }}/>
        : <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: '3px solid rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 32, flexShrink: 0 }}>
            {student.name?.[0]}
          </div>
      }
      <div style={{ flex: 1 }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 26, margin: '0 0 4px' }}>{student.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 24px', marginTop: 14 }}>
          {[
            { label: 'Carrera',              value: student.career        },
            { label: 'Número de Control',    value: student.controlNumber },
            { label: 'Correo Institucional', value: student.email         },
            { label: 'Semestre',             value: `${student.semester}°`},
            { label: 'Promedio',             value: student.gpa           },
            { label: 'Especialidad',         value: student.specialty || 'No definida' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, opacity: .7, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
