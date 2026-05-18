import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useIsMobile } from '../../hooks/useIsMobile';

const TutorCard = ({ onContact }) => {
  const [tutor, setTutor] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    api.students.getMyProfile()
      .then(s => setTutor(s.tutor || null))
      .catch(console.error);
  }, []);

  if (!tutor) return (
    <div style={{ background:'white', borderRadius:16, padding:'22px 24px', border:'1px solid #e8edf5', display:'flex', alignItems:'center', justifyContent:'center', minHeight:140 }}>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8898b3' }}>
        {tutor === null ? 'Sin tutor asignado' : 'Cargando...'}
      </span>
    </div>
  );

  return (
    <div style={{ background:'white', borderRadius:16, padding: isMobile ? '16px' : '22px 24px', border:'1px solid #e8edf5' }}>
      <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:16, color:'#1a2744', margin:'0 0 14px' }}>Tutor Asignado</h3>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {tutor.avatar
          ? <img src={tutor.avatar} alt="" style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
          : <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#3b6cf7,#5b8ff9)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:20, flexShrink:0 }}>
              {tutor.name?.[0]}
            </div>
        }
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, color:'#1a2744', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tutor.name}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tutor.department}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tutor.email}</div>
        </div>
      </div>
      <button onClick={onContact} style={{ marginTop:14, width:'100%', padding:'10px 0', background:'linear-gradient(135deg,#3b6cf7,#5b8ff9)', border:'none', borderRadius:10, color:'white', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, cursor:'pointer' }}>
        Contactar
      </button>
    </div>
  );
};

export default TutorCard;
