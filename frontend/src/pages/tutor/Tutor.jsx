import Icon from '../../components/Icon/Icon';
import { tutor } from '../../data/mockData';
import { useIsMobile } from '../../hooks/useIsMobile';

const Tutor = () => {
  const isMobile = useIsMobile();

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px' }}>
      <div style={{ background:'white', borderRadius:20, border:'1px solid #e8edf5', overflow:'hidden', maxWidth:700 }}>
        <div style={{ background:'linear-gradient(135deg,#1a3a8f,#3b6cf7)', height: isMobile ? 80 : 120 }}/>
        <div style={{ padding: isMobile ? '0 18px 24px' : '0 32px 32px' }}>

          {/* Avatar + nombre */}
          <div style={{ display:'flex', alignItems:'flex-end', gap: isMobile ? 14 : 20, marginTop: isMobile ? -32 : -40, marginBottom:16, flexWrap:'wrap' }}>
            <img src={tutor.avatar} alt="" style={{ width: isMobile?70:90, height: isMobile?70:90, borderRadius:'50%', objectFit:'cover', border:'4px solid white', flexShrink:0 }}/>
            <div style={{ paddingBottom:4, flex:1, minWidth:0 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize: isMobile?18:22, color:'#1a2744', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tutor.name}</h2>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8898b3' }}>{tutor.dept}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:4, paddingBottom:4 }}>
              <Icon name="star" size={16}/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:16, color:'#1a2744' }}>{tutor.rating}</span>
            </div>
          </div>

          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#6b7fa3', lineHeight:1.7, marginBottom:18 }}>{tutor.bio}</p>

          {/* Stats */}
          <div style={{ display:'flex', gap:12, marginBottom:18 }}>
            {[{ label:'Sesiones realizadas', value:tutor.sessions },{ label:'Calificación', value:`${tutor.rating}/5.0` }].map(s => (
              <div key={s.label} style={{ flex:1, background:'#f4f7ff', borderRadius:12, padding:'12px 14px', textAlign:'center' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize: isMobile?20:24, color:'#3b6cf7' }}>{s.value}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#8898b3' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Especialidades */}
          <div style={{ marginBottom:18 }}>
            <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, color:'#1a2744', marginBottom:8 }}>Especialidades</h4>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {tutor.specialties.map(s => (
                <span key={s} style={{ padding:'5px 14px', background:'#eef2ff', color:'#3b6cf7', borderRadius:20, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Email */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
            <Icon name="mail" size={16}/>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7fa3', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tutor.email}</span>
          </div>

          {/* Botones */}
          <div style={{ display:'flex', gap:10, flexDirection: isMobile ? 'column' : 'row' }}>
            <button style={{ flex:1, padding:'12px 0', background:'linear-gradient(135deg,#3b6cf7,#5b8ff9)', border:'none', borderRadius:10, color:'white', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, cursor:'pointer' }}>
              Enviar Mensaje
            </button>
            <button style={{ flex:1, padding:'12px 0', background:'white', border:'1.5px solid #3b6cf7', borderRadius:10, color:'#3b6cf7', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, cursor:'pointer' }}>
              Agendar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
