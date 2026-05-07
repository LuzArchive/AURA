import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

const CoordinatorReports = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.coordinator.getReports()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #ede9fe', borderTopColor:'#7c3aed', animation:'spin .8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const s = data?.summary || {};
  const bySemester = data?.bySemester || [];
  const byType     = data?.releasesByType || [];

  const ACTIVITY_LABELS = { academico:'Académico', fisico:'Físico', cultural:'Cultural', escolar:'Escolar', tutoria:'Tutoría' };
  const ACTIVITY_COLORS = { academico:'#3b6cf7', fisico:'#22c55e', cultural:'#f59e0b', escolar:'#8b5cf6', tutoria:'#0ea5e9' };

  const maxStudents = Math.max(...bySemester.map(b => b.count), 1);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Summary row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
        {[
          { label:'Promedio de avance crediticio', value:`${s.avgProgress ?? 0}%`, sub:'de todos los estudiantes', color:'#7c3aed' },
          { label:'Cartas procesadas',             value:(byType.reduce((a,b)=>a+b.total,0)), sub:'enviadas en total', color:'#0ea5e9' },
          { label:'Tasa de aprobación',            value: (() => { const t=byType.reduce((a,b)=>a+b.total,0); const ap=byType.reduce((a,b)=>a+b.approved,0); return t>0 ? Math.round((ap/t)*100)+'%' : '—'; })(), sub:'cartas aprobadas', color:'#22c55e' },
        ].map(c => (
          <div key={c.label} style={{ background:'white', borderRadius:16, border:'1px solid #ede9fe', padding:'22px 24px' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7280', marginBottom:6 }}>{c.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:32, color: c.color, lineHeight:1 }}>{c.value}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#a78bfa', marginTop:4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

        {/* Students by semester bar chart */}
        <div style={{ background:'white', borderRadius:16, border:'1px solid #ede9fe', padding:'24px' }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'#1a0533', marginBottom:20 }}>Distribución por Semestre</h3>
          <div style={{ display:'flex', alignItems:'flex-end', gap:12, height:180 }}>
            {bySemester.map(b => {
              const height = Math.round((b.count / maxStudents) * 140);
              return (
                <div key={b._id} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:'#7c3aed' }}>{b.count}</span>
                  <div style={{ width:'100%', background:'linear-gradient(180deg,#6d28d9,#8b5cf6)', borderRadius:'6px 6px 0 0', height, minHeight:4, transition:'height .5s' }}/>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#6b7280' }}>{b._id}°</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complementary releases by type */}
        <div style={{ background:'white', borderRadius:16, border:'1px solid #ede9fe', padding:'24px' }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'#1a0533', marginBottom:20 }}>Cartas por Tipo de Actividad</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {byType.length === 0 && (
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#a78bfa', textAlign:'center', padding:'20px 0' }}>
                Aún no hay cartas enviadas
              </div>
            )}
            {byType.map(t => {
              const color = ACTIVITY_COLORS[t._id] || '#8b5cf6';
              const label = ACTIVITY_LABELS[t._id] || t._id;
              const pct   = t.total > 0 ? Math.round((t.approved / t.total) * 100) : 0;
              return (
                <div key={t._id}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background: color }}/>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:'#1a0533' }}>{label}</span>
                    </div>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#6b7280' }}>
                      {t.approved}/{t.total} aprobadas
                    </span>
                  </div>
                  <div style={{ background:'#f5f3ff', borderRadius:6, height:8, overflow:'hidden' }}>
                    <div style={{ height:'100%', background: color, width:`${pct}%`, borderRadius:6, transition:'width .5s' }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export note */}
      <div style={{ background:'#faf5ff', borderRadius:16, border:'1px solid #ede9fe', padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, color:'#1a0533' }}>Exportar reportes</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#a78bfa', marginTop:2 }}>
            Genera reportes detallados en PDF o Excel para presentar ante el departamento
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button style={{ padding:'10px 18px', background:'white', border:'1.5px solid #ede9fe', borderRadius:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:'#7c3aed' }}>
            📊 Exportar Excel
          </button>
          <button style={{ padding:'10px 18px', background:'linear-gradient(135deg,#6d28d9,#8b5cf6)', border:'none', borderRadius:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:'white' }}>
            📄 Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorReports;
