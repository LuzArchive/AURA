import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{ background:'white', borderRadius:16, padding:'22px 24px', border:'1px solid #ede9fe', display:'flex', alignItems:'center', gap:18 }}>
    <div style={{ width:52, height:52, borderRadius:14, background: color + '18', display:'flex', alignItems:'center', justifyContent:'center', color, flexShrink:0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7280', marginBottom:4 }}>{label}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:28, color:'#1a0533', lineHeight:1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#a78bfa', marginTop:3 }}>{sub}</div>}
    </div>
  </div>
);

const CoordinatorDashboard = ({ onNav }) => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.coordinator.getReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:300 }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #ede9fe', borderTopColor:'#7c3aed', animation:'spin .8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const s = reports?.summary || {};

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
        <StatCard label="Total Estudiantes" value={s.totalStudents} sub="registrados" color="#7c3aed"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}/>
        <StatCard label="Tutores Activos" value={s.totalTutors} sub="en el sistema" color="#0ea5e9"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}/>
        <StatCard label="Sin Tutor Asignado" value={s.noTutor} sub="requieren asignación" color="#f59e0b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>}/>
        <StatCard label="Cartas Pendientes" value={s.pendingReleases} sub="por revisar" color="#ef4444"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

        {/* Progress global */}
        <div style={{ background:'white', borderRadius:16, padding:'24px', border:'1px solid #ede9fe' }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'#1a0533', marginBottom:18 }}>Avance Promedio de Créditos</h3>
          <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:16 }}>
            <div style={{ position:'relative', width:100, height:100, flexShrink:0 }}>
              <svg viewBox="0 0 100 100" style={{ width:'100%', transform:'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ede9fe" strokeWidth="10"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#7c3aed" strokeWidth="10"
                  strokeDasharray={`${(s.avgProgress || 0) * 2.513} 251.3`} strokeLinecap="round"/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:'#1a0533' }}>
                {s.avgProgress || 0}%
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#6b7280', lineHeight:1.7 }}>
                Promedio general de todos los estudiantes registrados en el sistema.
              </div>
            </div>
          </div>
        </div>

        {/* Students by semester */}
        <div style={{ background:'white', borderRadius:16, padding:'24px', border:'1px solid #ede9fe' }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'#1a0533', marginBottom:18 }}>Estudiantes por Semestre</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(reports?.bySemester || []).map(b => (
              <div key={b._id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#7c3aed', width:60, flexShrink:0 }}>
                  {b._id}° sem.
                </span>
                <div style={{ flex:1, background:'#f5f3ff', borderRadius:6, height:10, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'linear-gradient(90deg,#6d28d9,#8b5cf6)', borderRadius:6, width: `${Math.min(100, (b.count / (s.totalStudents || 1)) * 100 * 3)}%`, transition:'width .5s' }}/>
                </div>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#6b7280', width:24, textAlign:'right' }}>{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background:'white', borderRadius:16, padding:'24px', border:'1px solid #ede9fe' }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'#1a0533', marginBottom:18 }}>Acciones Rápidas</h3>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {[
            { label:'Ver estudiantes sin tutor', page:'students', color:'#f59e0b' },
            { label:'Revisar cartas pendientes', page:'releases', color:'#ef4444' },
            { label:'Agregar nuevo tutor',        page:'tutors',   color:'#0ea5e9' },
            { label:'Generar reporte',             page:'reports',  color:'#7c3aed' },
          ].map(a => (
            <button key={a.label} onClick={() => onNav(a.page)}
              style={{ padding:'10px 18px', borderRadius:10, border:`1.5px solid ${a.color}33`, background:`${a.color}0d`, color:a.color, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = `${a.color}1a`}
              onMouseLeave={e => e.currentTarget.style.background = `${a.color}0d`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
