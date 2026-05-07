import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

const ACTIVITY_LABELS = {
  academico: { label: 'Académico',  color: '#3b6cf7', bg: '#eef2ff' },
  fisico:    { label: 'Físico',     color: '#22c55e', bg: '#f0fdf4' },
  cultural:  { label: 'Cultural',   color: '#f59e0b', bg: '#fffbeb' },
  escolar:   { label: 'Escolar',    color: '#8b5cf6', bg: '#f5f3ff' },
  tutoria:   { label: 'Tutoría',    color: '#0ea5e9', bg: '#e0f2fe' },
};

const STATUS_CONFIG = {
  pending:  { label: 'Pendiente', color: '#f59e0b', bg: '#fffbeb' },
  approved: { label: 'Aprobada',  color: '#22c55e', bg: '#f0fdf4' },
  rejected: { label: 'Rechazada', color: '#ef4444', bg: '#fef2f2' },
};

const CoordinatorReleases = () => {
  const [releases,  setReleases]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('pending');
  const [selected,  setSelected]  = useState(null);
  const [pdfData,   setPdfData]   = useState(null);
  const [notes,     setNotes]     = useState('');
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');

  const load = (status = filter) => {
    setLoading(true);
    api.coordinator.getReleases(status === 'all' ? undefined : status)
      .then(setReleases)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const openRelease = async (release) => {
    setSelected(release);
    setNotes(release.reviewNotes || '');
    setPdfData(null);
    try {
      const data = await api.coordinator.getReleasePDF(release._id);
      setPdfData(data.pdfBase64);
    } catch { /* PDF preview unavailable */ }
  };

  const handleDecision = async (status) => {
    setSaving(true);
    try {
      await api.coordinator.reviewRelease(selected._id, status, notes);
      setMsg(status === 'approved' ? 'Carta aprobada y crédito liberado ✅' : 'Carta rechazada');
      setSelected(null);
      load();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {msg && (
        <div style={{ padding:'12px 18px', background: msg.includes('Error') ? '#fef2f2' : '#f0fdf4', border:`1px solid ${msg.includes('Error') ? '#fecaca' : '#bbf7d0'}`, borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color: msg.includes('Error') ? '#dc2626' : '#16a34a' }}>
          {msg}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8 }}>
        {[
          { key:'pending',  label:'Pendientes' },
          { key:'approved', label:'Aprobadas'  },
          { key:'rejected', label:'Rechazadas' },
          { key:'all',      label:'Todas'      },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ padding:'8px 18px', borderRadius:20, border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight: filter === f.key ? 700 : 400, background: filter === f.key ? '#7c3aed' : '#f5f3ff', color: filter === f.key ? 'white' : '#7c3aed', transition:'all .2s' }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #ede9fe', borderTopColor:'#7c3aed', animation:'spin .8s linear infinite' }}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <div style={{ display:'flex', gap:20 }}>

          {/* Left: list */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
            {releases.length === 0 && (
              <div style={{ background:'white', borderRadius:16, border:'1px solid #ede9fe', padding:'40px', textAlign:'center', fontFamily:"'DM Sans',sans-serif", color:'#a78bfa', fontSize:14 }}>
                No hay cartas {filter !== 'all' ? STATUS_CONFIG[filter]?.label.toLowerCase() + 's' : ''}
              </div>
            )}
            {releases.map(r => {
              const act = ACTIVITY_LABELS[r.activityType] || ACTIVITY_LABELS.academico;
              const sts = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
              const isSelected = selected?._id === r._id;
              return (
                <div key={r._id} onClick={() => openRelease(r)}
                  style={{ background:'white', borderRadius:14, border: isSelected ? '2px solid #7c3aed' : '1px solid #ede9fe', padding:'18px 20px', cursor:'pointer', transition:'all .2s', display:'flex', alignItems:'center', gap:14 }}
                  onMouseEnter={e => !isSelected && (e.currentTarget.style.borderColor = '#c4b5fd')}
                  onMouseLeave={e => !isSelected && (e.currentTarget.style.borderColor = '#ede9fe')}>

                  <div style={{ width:42, height:42, borderRadius:12, background: act.bg, display:'flex', alignItems:'center', justifyContent:'center', color: act.color, flexShrink:0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:'#1a0533' }}>
                        {r.student?.name || 'Estudiante'}
                      </span>
                      <span style={{ padding:'2px 8px', borderRadius:20, background: act.bg, color: act.color, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700 }}>
                        {act.label}
                      </span>
                    </div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#6b7280' }}>
                      Control: {r.student?.controlNumber} · {r.student?.career}
                    </div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#a78bfa', marginTop:2 }}>
                      Enviada: {new Date(r.createdAt).toLocaleDateString('es-MX', { day:'numeric', month:'short', year:'numeric' })}
                    </div>
                  </div>

                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                    <span style={{ padding:'4px 10px', borderRadius:20, background: sts.bg, color: sts.color, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700 }}>
                      {sts.label}
                    </span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color: r.aiVerification.confidence >= 80 ? '#22c55e' : r.aiVerification.confidence >= 50 ? '#f59e0b' : '#ef4444' }}>
                      IA: {r.aiVerification.confidence}% confianza
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: detail panel */}
          {selected && (
            <div style={{ width:380, flexShrink:0, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ background:'white', borderRadius:16, border:'1px solid #ede9fe', padding:'22px', display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:16, color:'#1a0533' }}>Detalle de solicitud</h3>
                  <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#a78bfa', fontSize:18, lineHeight:1 }}>✕</button>
                </div>

                {/* Extracted data */}
                <div style={{ background:'#faf5ff', borderRadius:12, padding:'14px' }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, color:'#7c3aed', textTransform:'uppercase', letterSpacing:.5, marginBottom:10 }}>Datos extraídos por IA</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {[
                      { l:'Estudiante',   v: selected.extractedData?.studentName   || '—' },
                      { l:'No. Control',  v: selected.extractedData?.controlNumber || '—' },
                      { l:'Firmante',     v: `${selected.extractedData?.signerName || '—'} ${selected.extractedData?.signerTitle ? '· ' + selected.extractedData.signerTitle : ''}` },
                      { l:'Actividad',    v: selected.extractedData?.activityName  || '—' },
                      { l:'Período',      v: selected.extractedData?.period        || '—' },
                      { l:'Área emisora', v: selected.extractedData?.issuingDepartment || '—' },
                      { l:'Fecha',        v: selected.extractedData?.date          || '—' },
                      { l:'Logos TecNM',  v: selected.extractedData?.hasLogosTecNM ? '✅ Sí' : '❌ No' },
                    ].map(row => (
                      <div key={row.l} style={{ display:'flex', gap:8 }}>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#6b7280', width:90, flexShrink:0 }}>{row.l}:</span>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#1a0533' }}>{row.v}</span>
                      </div>
                    ))}
                  </div>

                  {/* 3 mandatory seals */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, color:'#7c3aed', marginBottom:8 }}>
                      Sellos obligatorios
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {[
                        { key:'sistemasYComputacion',         label:'Sistemas y Computación' },
                        { key:'serviciosEscolares',           label:'Servicios Escolares'    },
                        { key:'centroInformacionUAreaEmisora',label:'Área emisora / Centro de Información' },
                      ].map(seal => {
                        const ok = selected.extractedData?.seals?.[seal.key];
                        return (
                          <div key={seal.key} style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontSize:14 }}>{ok ? '✅' : '❌'}</span>
                            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color: ok ? '#16a34a' : '#dc2626', fontWeight: ok ? 400 : 600 }}>
                              {seal.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AI confidence */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#6b7280' }}>Confianza IA</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color: selected.aiVerification.confidence >= 80 ? '#22c55e' : '#f59e0b' }}>
                      {selected.aiVerification.confidence}%
                    </span>
                  </div>
                  <div style={{ background:'#f5f3ff', borderRadius:6, height:8, overflow:'hidden' }}>
                    <div style={{ height:'100%', background: selected.aiVerification.confidence >= 80 ? '#22c55e' : selected.aiVerification.confidence >= 50 ? '#f59e0b' : '#ef4444', width:`${selected.aiVerification.confidence}%`, borderRadius:6, transition:'width .5s' }}/>
                  </div>
                  {(selected.aiVerification.issues || []).length > 0 && (
                    <div style={{ marginTop:8 }}>
                      {selected.aiVerification.issues.map((issue, i) => (
                        <div key={i} style={{ display:'flex', gap:6, alignItems:'flex-start', marginTop:4 }}>
                          <span style={{ color:'#ef4444', fontSize:12, flexShrink:0 }}>⚠</span>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#ef4444' }}>{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PDF preview */}
                {pdfData && (
                  <div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, color:'#6b7280', marginBottom:8 }}>Vista previa del PDF</div>
                    <iframe
                      src={`data:application/pdf;base64,${pdfData}`}
                      style={{ width:'100%', height:200, border:'1px solid #ede9fe', borderRadius:10 }}
                      title="PDF preview"
                    />
                  </div>
                )}

                {/* Review notes */}
                {selected.status === 'pending' && (
                  <>
                    <div>
                      <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, color:'#1a0533', marginBottom:6 }}>Notas de revisión (opcional)</label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                        placeholder="Motivo de rechazo o comentarios..."
                        style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #ede9fe', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#1a0533', outline:'none', resize:'vertical', boxSizing:'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#7c3aed'}
                        onBlur={e  => e.target.style.borderColor = '#ede9fe'}/>
                    </div>
                    <div style={{ display:'flex', gap:10 }}>
                      <button onClick={() => handleDecision('rejected')} disabled={saving}
                        style={{ flex:1, padding:'11px 0', background:'#fef2f2', color:'#ef4444', border:'1.5px solid #fecaca', borderRadius:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600 }}>
                        {saving ? '...' : '✕ Rechazar'}
                      </button>
                      <button onClick={() => handleDecision('approved')} disabled={saving}
                        style={{ flex:1, padding:'11px 0', background:'linear-gradient(135deg,#6d28d9,#8b5cf6)', color:'white', border:'none', borderRadius:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600 }}>
                        {saving ? '...' : '✓ Aprobar'}
                      </button>
                    </div>
                  </>
                )}

                {selected.status !== 'pending' && (
                  <div style={{ padding:'12px', background: selected.status === 'approved' ? '#f0fdf4' : '#fef2f2', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:13, color: selected.status === 'approved' ? '#16a34a' : '#dc2626' }}>
                    {selected.status === 'approved' ? '✅ Carta aprobada — crédito liberado' : '❌ Carta rechazada'}
                    {selected.reviewNotes && <div style={{ marginTop:6, fontSize:12, opacity:.8 }}>{selected.reviewNotes}</div>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoordinatorReleases;
