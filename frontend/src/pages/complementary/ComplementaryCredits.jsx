import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useIsMobile } from '../../hooks/useIsMobile';

const ACTIVITY_TYPES = [
  { id:'academico', label:'Académico', description:'Círculo de lectura u otra actividad académica', example:'Ej: Círculo de lectura, conferencia, taller académico', color:'#3b6cf7', bg:'#eef2ff', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> },
  { id:'fisico',    label:'Físico',    description:'Deporte o actividad de acondicionamiento físico', example:'Ej: Fútbol, voleibol, atletismo', color:'#22c55e', bg:'#f0fdf4', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
  { id:'cultural',  label:'Cultural',  description:'Actividad artística o cultural', example:'Ej: Danza folklórica, artes plásticas, teatro', color:'#f59e0b', bg:'#fffbeb', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><path d="M5 20s0-5 7-5 7 5 7 5"/><path d="M5 5v15"/><path d="M19 5v15"/><path d="M5 5h14"/></svg> },
  { id:'escolar',   label:'Escolar',   description:'Evento escolar o actividad institucional', example:'Ej: Semana de Ingeniería, apoyo en eventos del TecNM', color:'#8b5cf6', bg:'#f5f3ff', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
];

const StatusBadge = ({ status }) => {
  const cfg = { aprobada:{label:'Aprobada',color:'#22c55e',bg:'#f0fdf4'}, cursando:{label:'Cursando',color:'#3b6cf7',bg:'#eef2ff'}, pendiente:{label:'Pendiente',color:'#f59e0b',bg:'#fffbeb'}, reprobada:{label:'Reprobada',color:'#ef4444',bg:'#fef2f2'} }[status] || {label:status,color:'#6b7280',bg:'#f9fafb'};
  return <span style={{ padding:'3px 10px', borderRadius:20, background:cfg.bg, color:cfg.color, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700 }}>{cfg.label}</span>;
};

const UploadModal = ({ activityType, onClose, onSuccess }) => {
  const fileRef  = useRef(null);
  const [file,   setFile]   = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState('');
  const [drag,   setDrag]   = useState(false);
  const cfg = ACTIVITY_TYPES.find(a => a.id === activityType);

  const handleFile = (f) => {
    if (!f) return;
    if (!['image/png','image/jpeg','image/jpg','image/webp','application/pdf'].includes(f.type)) { setError('Acepta imágenes (PNG, JPG) o PDF.'); return; }
    if (f.size > 10*1024*1024) { setError('El archivo no debe superar 10 MB'); return; }
    setError(''); setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setStatus('uploading'); setError('');
    try {
      const base64 = await new Promise((res,rej) => { const r=new FileReader(); r.onload=()=>res(r.result.split(',')[1]); r.onerror=()=>rej(new Error('No se pudo leer')); r.readAsDataURL(file); });
      const response = await api.releases.submit({ activityType, imageBase64:base64, imageType:file.type, ...(file.type==='application/pdf'?{pdfBase64:base64}:{}), pdfName:file.name });
      setResult(response); setStatus('success');
      setTimeout(() => { onSuccess(); onClose(); }, 3000);
    } catch(err) { setError(err.message||'Error al enviar la carta'); setStatus('error'); }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:2000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'16px', overflowY:'auto' }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:'white', borderRadius:20, width:'100%', maxWidth:500, padding:'24px', boxShadow:'0 24px 60px rgba(0,0,0,.2)', animation:'modalIn .25s ease', margin:'auto' }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', color:cfg.color, flexShrink:0 }}>{cfg.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'#1a2744', margin:0 }}>Carta de liberación — {cfg.label}</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3', margin:'2px 0 0' }}>{cfg.example}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#b0bcd4', fontSize:20, padding:4 }}>✕</button>
        </div>

        {status==='success' ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>{result?.autoApproved?'✅':'📋'}</div>
            <h4 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:'#1a2744', marginBottom:10 }}>{result?.autoApproved?'¡Crédito liberado!':'Carta recibida'}</h4>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8898b3', lineHeight:1.6 }}>{result?.message}</p>
          </div>
        ) : (
          <>
            <div style={{ background:'#f8faff', borderRadius:12, padding:'12px 14px', marginBottom:14, border:'1px solid #e8edf5' }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:11, color:'#3b6cf7', textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>La carta debe contener</div>
              {['Tu nombre completo y número de control','Nombre y cargo del jefe del área que firma','Actividad complementaria, período y carrera','Logos institucionales: SEP + TecNM en encabezado'].map(req=>(
                <div key={req} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                  <span style={{ color:'#22c55e', fontSize:13, flexShrink:0 }}>✓</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#6b7280' }}>{req}</span>
                </div>
              ))}
            </div>

            <div style={{ background:'#fff8e1', borderRadius:12, padding:'12px 14px', marginBottom:14, border:'1px solid #fde68a' }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:11, color:'#b45309', textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>⚠ 3 sellos obligatorios</div>
              {[{n:'1',label:'RECIBIDO — Depto. de Sistemas y Computación',desc:'Sello con fecha y rúbrica'},{n:'2',label:'RECIBIDO — Servicios Escolares',desc:'Sello con fecha y rúbrica'},{n:'3',label:'Sello del área emisora',desc:'Centro de Información u otro depto. TecNM'}].map(s=>(
                <div key={s.n} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#f59e0b', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:11, flexShrink:0 }}>{s.n}</div>
                  <div><div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, color:'#92400e' }}>{s.label}</div><div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#a16207' }}>{s.desc}</div></div>
                </div>
              ))}
            </div>

            <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>fileRef.current?.click()}
              style={{ border:`2px dashed ${drag?cfg.color:file?'#22c55e':'#d0d8ee'}`, borderRadius:14, padding:'24px 16px', textAlign:'center', cursor:'pointer', background:drag?cfg.bg:file?'#f0fdf4':'#f9fafc', transition:'all .2s', marginBottom:14 }}>
              <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp,.pdf" style={{ display:'none' }} onChange={e=>handleFile(e.target.files[0])}/>
              {file ? (<><div style={{ fontSize:28, marginBottom:6 }}>📄</div><div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, color:'#22c55e' }}>{file.name}</div><div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#8898b3', marginTop:3 }}>{(file.size/1024).toFixed(0)} KB · Toca para cambiar</div></>)
              : (<><div style={{ fontSize:28, marginBottom:8 }}>📎</div><div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, color:'#1a2744', marginBottom:3 }}>Toca para seleccionar</div><div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3' }}>PNG, JPG o PDF · Máx 10 MB</div></>)}
            </div>

            {error && <div style={{ padding:'10px 12px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, marginBottom:12, fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#dc2626' }}>⚠ {error}</div>}

            <div style={{ display:'flex', gap:8, padding:'10px 12px', background:'#fff8e1', borderRadius:10, marginBottom:18, border:'1px solid #fde68a' }}>
              <span style={{ fontSize:13, flexShrink:0 }}>🤖</span>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#92400e', lineHeight:1.5 }}><strong>Recomendación:</strong> sube como imagen (PNG/JPG) para mejor precisión. Si confianza ≥80%, se libera automáticamente.</div>
            </div>

            <div style={{ display:'flex', gap:8 }}>
              <button onClick={onClose} style={{ flex:1, padding:'12px 0', background:'#f4f7ff', color:'#6b7280', border:'none', borderRadius:12, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600 }}>Cancelar</button>
              <button onClick={handleSubmit} disabled={!file||status==='uploading'}
                style={{ flex:2, padding:'12px 0', background:!file?'#e8edf5':`linear-gradient(135deg,${cfg.color},${cfg.color}cc)`, color:!file?'#b0bcd4':'white', border:'none', borderRadius:12, cursor:!file?'not-allowed':'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {status==='uploading' ? <><span style={{ width:15, height:15, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'white', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/> Verificando...</> : '📤 Enviar carta'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ComplementaryCredits = () => {
  const isMobile = useIsMobile();
  const [credits,    setCredits]    = useState(null);
  const [releases,   setReleases]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [uploadType, setUploadType] = useState(null);

  const load = async () => {
    try {
      const [credit,rel] = await Promise.all([api.credits.getMy(), api.releases.getMy()]);
      setCredits(credit); setReleases(rel);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const compSubjects = (credits?.subjects||[]).filter(s => s.credits===1 || s.semester===0);

  const getSubjectForType = (typeId) => {
    const keywords = { academico:['círculo','circulo','lectura','academ'], fisico:['físic','fisic','acondicion','fútbol','futbol','voleibol'], cultural:['danza','cultur','artes','música','musica','teatro'], escolar:['semana','ingenier','evento','escolar'], tutoria:['tutoría','tutoria','institucional'] };
    return compSubjects.find(s => (keywords[typeId]||[]).some(kw => s.name.toLowerCase().includes(kw)));
  };

  const getReleaseForType = (typeId) => releases.find(r => r.activityType===typeId && r.status!=='rejected');

  const mainTypes     = ['academico','fisico','cultural','escolar'];
  const approvedCount = mainTypes.filter(t => getSubjectForType(t)?.status==='aprobada').length;
  const tutoriaReady  = approvedCount === 4;

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:300 }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #e8edf5', borderTopColor:'#3b6cf7', animation:'spin .8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ padding: isMobile?'16px':'28px 32px', display:'flex', flexDirection:'column', gap:20 }}>

      {uploadType && <UploadModal activityType={uploadType} onClose={()=>setUploadType(null)} onSuccess={()=>{setLoading(true);load();}}/>}

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1a2744,#3b6cf7)', borderRadius:20, padding: isMobile?'20px 18px':'28px 32px', color:'white', display:'flex', alignItems:'center', gap: isMobile?16:28, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,.7)', marginBottom:4, letterSpacing:.5, textTransform:'uppercase', fontWeight:600 }}>Créditos Complementarios</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize: isMobile?20:26, marginBottom:8 }}>{approvedCount} de 4 actividades liberadas</h2>
          <div style={{ background:'rgba(255,255,255,.2)', borderRadius:8, height:8, overflow:'hidden', maxWidth:280 }}>
            <div style={{ height:'100%', background:'white', borderRadius:8, width:`${(approvedCount/4)*100}%`, transition:'width .6s ease' }}/>
          </div>
          {!isMobile && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,.75)', marginTop:10, lineHeight:1.6, maxWidth:420 }}>Necesitas liberar las 4 actividades para habilitar Tutoría Institucional, requisito para tu Servicio Social.</p>}
        </div>
        <div style={{ position:'relative', width: isMobile?80:110, height: isMobile?80:110, flexShrink:0 }}>
          <svg viewBox="0 0 100 100" style={{ width:'100%', transform:'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="10"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="10" strokeDasharray={`${(approvedCount/4)*251.3} 251.3`} strokeLinecap="round"/>
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize: isMobile?22:26, color:'white', lineHeight:1 }}>{approvedCount}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.7)' }}>/ 4</span>
          </div>
        </div>
      </div>

      {/* Cards de actividades — 1 col en móvil, 2 en desktop */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:16 }}>
        {ACTIVITY_TYPES.map(act => {
          const subject    = getSubjectForType(act.id);
          const release    = getReleaseForType(act.id);
          const status     = subject?.status || 'pendiente';
          const approved   = status === 'aprobada';
          const hasPending = release?.status === 'pending';
          return (
            <div key={act.id} style={{ background:'white', borderRadius:18, border:`1.5px solid ${approved?act.color+'44':'#e8edf5'}`, padding: isMobile?'16px':'22px 24px', display:'flex', flexDirection:'column', gap:12, boxShadow: approved?`0 4px 20px ${act.color}14`:'none' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:act.bg, display:'flex', alignItems:'center', justifyContent:'center', color:act.color, flexShrink:0 }}>{act.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                    <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:'#1a2744', margin:0 }}>{act.label}</h3>
                    <StatusBadge status={status}/>
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3', margin:0, lineHeight:1.5 }}>{act.description}</p>
                </div>
              </div>
              {subject && (
                <div style={{ background:'#f8faff', borderRadius:10, padding:'9px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, color:'#1a2744' }}>{subject.name}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#8898b3' }}>1 crédito complementario</div>
                  </div>
                  {approved && <span style={{ fontSize:18 }}>✅</span>}
                </div>
              )}
              {release && (
                <div style={{ padding:'9px 12px', borderRadius:10, background:release.status==='approved'?'#f0fdf4':release.status==='pending'?'#fffbeb':'#fef2f2', border:`1px solid ${release.status==='approved'?'#bbf7d0':release.status==='pending'?'#fde68a':'#fecaca'}` }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, color:release.status==='approved'?'#16a34a':release.status==='pending'?'#92400e':'#dc2626' }}>
                    {release.status==='approved'?'✅ Carta aprobada':release.status==='pending'?'⏳ En revisión':'❌ Carta rechazada'}
                  </div>
                </div>
              )}
              {!approved && !hasPending && (
                <button onClick={()=>setUploadType(act.id)} style={{ padding:'10px 0', borderRadius:12, border:`1.5px dashed ${act.color}66`, background:act.bg, color:act.color, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  Subir carta
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Tutoría card */}
      <div style={{ background:'white', borderRadius:18, border:`1.5px solid ${tutoriaReady?'#0ea5e9':'#e8edf5'}`, padding: isMobile?'16px':'22px 24px', boxShadow:tutoriaReady?'0 4px 20px rgba(14,165,233,.12)':'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <div style={{ width:44, height:44, borderRadius:12, background:tutoriaReady?'#e0f2fe':'#f4f7ff', display:'flex', alignItems:'center', justifyContent:'center', color:tutoriaReady?'#0ea5e9':'#b0bcd4', flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
              <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:'#1a2744', margin:0 }}>Tutoría Institucional</h3>
              <StatusBadge status={getSubjectForType('tutoria')?.status||'pendiente'}/>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3', margin:0, lineHeight:1.5 }}>
              {tutoriaReady ? 'Todas tus actividades están completas. Tu tutor puede liberar este crédito.' : `Necesitas completar las 4 actividades para desbloquear. (${approvedCount}/4)`}
            </p>
          </div>
          {tutoriaReady && <div style={{ background:'#e0f2fe', borderRadius:10, padding:'6px 14px', flexShrink:0 }}><div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:'#0ea5e9' }}>🔓 Desbloqueado</div></div>}
        </div>
        {!tutoriaReady && (
          <div style={{ marginTop:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8898b3' }}>Progreso</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#3b6cf7' }}>{approvedCount}/4</span>
            </div>
            <div style={{ background:'#f0f4ff', borderRadius:6, height:8, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'linear-gradient(90deg,#3b6cf7,#5b8ff9)', borderRadius:6, width:`${(approvedCount/4)*100}%`, transition:'width .6s' }}/>
            </div>
          </div>
        )}
      </div>

      {/* Reglas — 1 col en móvil, 2 en desktop */}
      <div style={{ background:'#f8faff', borderRadius:16, padding: isMobile?'16px':'20px 24px', border:'1px solid #e8edf5' }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, color:'#3b6cf7', textTransform:'uppercase', letterSpacing:.5, marginBottom:12 }}>📋 Reglas importantes</div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:8 }}>
          {['Solo 1 crédito por actividad — no se puede repetir','No puedes tomar 2 créditos del mismo tipo','Las convocatorias abren en las primeras 2 semanas del ciclo','Las actividades deben completarse antes de 6° semestre','La tutoría se libera al completar las 4 actividades','Estos créditos son requisito para tu Servicio Social'].map(rule=>(
            <div key={rule} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
              <span style={{ color:'#3b6cf7', fontSize:14, flexShrink:0, marginTop:1 }}>•</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#6b7280', lineHeight:1.5 }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplementaryCredits;
