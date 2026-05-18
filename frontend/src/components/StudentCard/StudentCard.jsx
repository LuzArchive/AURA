import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useIsMobile } from '../../hooks/useIsMobile';

const StudentCard = () => {
  const [student, setStudent] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    api.students.getMyProfile().then(setStudent).catch(console.error);
  }, []);

  if (!student) return (
    <div style={{ background:'linear-gradient(135deg,#1a3a8f,#2d5be3,#4d7ff5)', borderRadius:20, padding:'28px 32px', height:160, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid rgba(255,255,255,.3)', borderTopColor:'white', animation:'spin .8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const fields = [
    { label:'Carrera',              value: student.career        },
    { label:'Número de Control',    value: student.controlNumber },
    { label:'Correo Institucional', value: student.email         },
    { label:'Semestre',             value: `${student.semester}°`},
    { label:'Promedio',             value: student.gpa           },
    { label:'Especialidad',         value: student.specialty || 'No definida' },
  ];

  return (
    <div style={{
      background:'linear-gradient(135deg,#1a3a8f 0%,#2d5be3 60%,#4d7ff5 100%)',
      borderRadius:20, padding: isMobile ? '20px 18px' : '28px 32px',
      color:'white', position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:-40,  right:-40,  width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:-30, right:120, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }}/>

      {/* Avatar + nombre */}
      <div style={{ display:'flex', alignItems:'center', gap: isMobile ? 14 : 28, marginBottom: isMobile ? 16 : 0 }}>
        {student.avatar
          ? <img src={student.avatar} alt="" style={{ width: isMobile?64:88, height: isMobile?64:88, borderRadius:'50%', objectFit:'cover', border:'3px solid rgba(255,255,255,.3)', flexShrink:0 }}/>
          : <div style={{ width: isMobile?64:88, height: isMobile?64:88, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'3px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize: isMobile?26:32, flexShrink:0 }}>
              {student.name?.[0]}
            </div>
        }
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize: isMobile?20:26, margin:0, lineHeight:1.2 }}>
          {student.name}
        </h2>
      </div>

      {/* Grid de datos — 2 cols en móvil, 3 en desktop */}
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: isMobile ? '10px 14px' : '10px 24px',
        marginTop: isMobile ? 0 : 14,
      }}>
        {fields.map(item => (
          <div key={item.label} style={{ minWidth:0 }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize: isMobile?10:11, opacity:.7, marginBottom:2, whiteSpace:'nowrap' }}>{item.label}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize: isMobile?12:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCard;
