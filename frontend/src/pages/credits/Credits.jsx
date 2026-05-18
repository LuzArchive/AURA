import { useState, useEffect } from 'react';
import CircularProgress from '../../components/CircularProgress/CircularProgress';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const STATUS_STYLE = {
  aprobada:  { bg:'#f0fdf4', c:'#16a34a', label:'Aprobada'  },
  cursando:  { bg:'#eef2ff', c:'#3b6cf7', label:'Cursando'  },
  pendiente: { bg:'#f9fafc', c:'#8898b3', label:'Pendiente' },
  reprobada: { bg:'#fff0f0', c:'#dc2626', label:'Reprobada' },
};

const COMP_NAMES = ['Círculo de Lectura','Acondicionamiento Físico','Danza Folklórica','Semana de Ingeniería','Tutoría Institucional'];

const Credits = () => {
  const { user }   = useAuth();
  const isMobile   = useIsMobile();
  const [credits,   setCredits]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('todas');
  const [semFilter, setSemFilter] = useState(0);

  useEffect(() => {
    api.credits.getMy().then(setCredits).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:300 }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #e8edf5', borderTopColor:'#3b6cf7', animation:'spin .8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!credits) return <div style={{ padding:32, fontFamily:"'DM Sans',sans-serif", color:'#8898b3' }}>No se encontraron créditos.</div>;

  const allSubjects = credits.subjects ?? [];
  const reticula    = allSubjects.filter(s => !COMP_NAMES.includes(s.name));
  const comp        = allSubjects.filter(s => COMP_NAMES.includes(s.name));
  const earned      = allSubjects.filter(s => s.status === 'aprobada').reduce((a,s) => a + s.credits, 0);
  const total       = credits.totalCredits ?? 245;
  const pct         = Math.round((earned / total) * 100);
  const pending     = total - earned;
  const semesters   = [...new Set(reticula.map(s => s.semester).filter(Boolean))].sort((a,b)=>a-b);
  const filtered    = reticula.filter(s => filter==='todas' || s.status===filter).filter(s => semFilter===0 || s.semester===semFilter);
  const compAprobados = comp.filter(c => c.status==='aprobada').length;
  const tutoriaLib    = comp.find(c => c.name==='Tutoría Institucional')?.status === 'aprobada';

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px', display:'flex', flexDirection:'column', gap:20 }}>

      {/* ── Top row ── */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap:20 }}>

        {/* Círculo */}
        <div style={{ background:'white', borderRadius:16, padding: isMobile?'20px 16px':'28px 24px', border:'1px solid #e8edf5', display:'flex', flexDirection: isMobile?'row':'column', alignItems:'center', gap: isMobile?20:0 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <CircularProgress value={pct} size={isMobile?110:150} stroke={isMobile?10:13}/>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize: isMobile?24:34, color:'#1a2744' }}>{pct}%</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#8898b3' }}>completado</div>
            </div>
          </div>
          <div style={{ flex:1, width: isMobile?'auto':'100%', marginTop: isMobile?0:20 }}>
            {[
              { label:'Obtenidos',     value:`${earned} / ${total}` },
              { label:'Pendientes',    value: pending },
              { label:'Este semestre', value: credits.creditsThisSemester ?? 0 },
            ].map(r => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f0f4fb' }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7fa3' }}>{r.label}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, color:'#1a2744' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avance por semestre + complementarios */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'white', borderRadius:16, padding:'18px 20px', border:'1px solid #e8edf5' }}>
            <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, color:'#1a2744', margin:'0 0 12px' }}>Avance por Semestre</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {semesters.map(sem => {
                const semMats  = reticula.filter(s => s.semester===sem);
                const semAprov = semMats.filter(s => s.status==='aprobada').length;
                const semPct   = Math.round((semAprov / semMats.length) * 100);
                const isCur    = sem === user?.semester;
                return (
                  <div key={sem} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color: isCur?'#3b6cf7':'#8898b3', fontWeight: isCur?700:400, width:54, flexShrink:0 }}>
                      {isCur ? `▸ S${sem}` : `Sem ${sem}`}
                    </span>
                    <div style={{ flex:1, height:7, background:'#e8edf5', borderRadius:6, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${semPct}%`, background: semPct===100?'#22c55e':isCur?'#3b6cf7':'#a5b8fb', borderRadius:6, transition:'width .5s' }}/>
                    </div>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#8898b3', width:36, textAlign:'right', flexShrink:0 }}>{semAprov}/{semMats.length}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background:'white', borderRadius:16, padding:'18px 20px', border:'1px solid #e8edf5' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, flexWrap:'wrap', gap:6 }}>
              <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, color:'#1a2744', margin:0 }}>Créditos Complementarios</h3>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3' }}>{compAprobados}/4 · Tutoría: {tutoriaLib?'✅':'🔒'}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {comp.map(c => {
                const st = STATUS_STYLE[c.status] || STATUS_STYLE.pendiente;
                const isTutoria = c.name === 'Tutoría Institucional';
                return (
                  <div key={c.name} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', background:'#f9fafc', borderRadius:10, border: isTutoria?'1px solid #c7d4ff':'1px solid transparent' }}>
                    <span style={{ fontSize:14, flexShrink:0 }}>{c.status==='aprobada'?'✅':c.status==='cursando'?'🔄':isTutoria?'🔒':'⏳'}</span>
                    <span style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#1a2744', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</span>
                    <span style={{ padding:'2px 8px', borderRadius:20, background:st.bg, color:st.c, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, flexShrink:0 }}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabla retícula ── */}
      <div style={{ background:'white', borderRadius:16, border:'1px solid #e8edf5', overflow:'hidden' }}>
        <div style={{ padding: isMobile?'14px 16px':'18px 24px', borderBottom:'1px solid #e8edf5', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, color:'#1a2744', margin:0 }}>Retícula — {reticula.length} materias</h3>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['todas','cursando','aprobada','pendiente'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding:'4px 12px', borderRadius:20, border:'1.5px solid', cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500,
                borderColor: filter===f?'#3b6cf7':'#e8edf5',
                background: filter===f?'#eef2ff':'white',
                color: filter===f?'#3b6cf7':'#8898b3',
              }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
            ))}
            <select value={semFilter} onChange={e => setSemFilter(Number(e.target.value))} style={{ padding:'4px 8px', borderRadius:8, border:'1.5px solid #e8edf5', fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#6b7fa3', background:'white', cursor:'pointer' }}>
              <option value={0}>Todos</option>
              {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f9fafc' }}>
                {['Sem','Materia','Créd','Calif','Estado'].map(h => (
                  <th key={h} style={{ padding: isMobile?'9px 10px':'11px 18px', textAlign:'left', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:10, color:'#8898b3', letterSpacing:'.5px', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} style={{ padding:24, textAlign:'center', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8898b3' }}>Sin materias con ese filtro</td></tr>
                : filtered.map((row, i) => {
                  const st = STATUS_STYLE[row.status] || STATUS_STYLE.pendiente;
                  return (
                    <tr key={i} style={{ borderBottom:'1px solid #f0f4fb' }}>
                      <td style={{ padding: isMobile?'10px 10px':'12px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3', whiteSpace:'nowrap' }}>{row.semester}°</td>
                      <td style={{ padding: isMobile?'10px 10px':'12px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#1a2744', fontWeight:500, minWidth: isMobile?140:200 }}>{row.name}</td>
                      <td style={{ padding: isMobile?'10px 10px':'12px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#6b7fa3', whiteSpace:'nowrap' }}>{row.credits}</td>
                      <td style={{ padding: isMobile?'10px 10px':'12px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#1a2744', fontWeight:600, whiteSpace:'nowrap' }}>{row.grade ?? '—'}</td>
                      <td style={{ padding: isMobile?'10px 10px':'12px 18px', whiteSpace:'nowrap' }}>
                        <span style={{ padding:'3px 10px', borderRadius:20, background:st.bg, color:st.c, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600 }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Credits;
