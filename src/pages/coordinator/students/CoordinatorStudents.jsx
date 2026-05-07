import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

const StatusBadge = ({ pct }) => {
  const color = pct >= 75 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
  const label = pct >= 75 ? 'Avanzado' : pct >= 40 ? 'En progreso' : 'Inicial';
  return (
    <span style={{ padding:'3px 10px', borderRadius:20, background: color + '15', color, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700 }}>
      {label}
    </span>
  );
};

const CoordinatorStudents = () => {
  const [students,  setStudents]  = useState([]);
  const [tutors,    setTutors]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');  // all | no-tutor
  const [assigning, setAssigning] = useState(null);   // studentId being assigned
  const [selTutor,  setSelTutor]  = useState('');
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');

  useEffect(() => {
    Promise.all([api.coordinator.getStudents(), api.coordinator.getTutors()])
      .then(([s, t]) => { setStudents(s); setTutors(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.controlNumber.includes(search);
    const matchFilter = filter === 'all' || (filter === 'no-tutor' && !s.tutor);
    return matchSearch && matchFilter;
  });

  const handleAssign = async (studentId) => {
    if (!selTutor) return;
    setSaving(true);
    try {
      await api.coordinator.assignTutor(studentId, selTutor);
      const updated = await api.coordinator.getStudents();
      setStudents(updated);
      setAssigning(null);
      setSelTutor('');
      setMsg('Tutor asignado correctamente ✅');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
      <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #ede9fe', borderTopColor:'#7c3aed', animation:'spin .8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {msg && (
        <div style={{ padding:'12px 18px', background: msg.includes('Error') ? '#fef2f2' : '#f0fdf4', border:`1px solid ${msg.includes('Error') ? '#fecaca' : '#bbf7d0'}`, borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color: msg.includes('Error') ? '#dc2626' : '#16a34a' }}>
          {msg}
        </div>
      )}

      {/* Controls */}
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o número de control..."
            style={{ width:'100%', padding:'10px 12px 10px 36px', border:'1.5px solid #ede9fe', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:'none', color:'#1a0533', background:'white', boxSizing:'border-box' }}/>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ padding:'10px 14px', border:'1.5px solid #ede9fe', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#1a0533', background:'white', cursor:'pointer', outline:'none' }}>
          <option value="all">Todos ({students.length})</option>
          <option value="no-tutor">Sin tutor ({students.filter(s => !s.tutor).length})</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'white', borderRadius:16, border:'1px solid #ede9fe', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#faf5ff' }}>
              {['Estudiante','Control','Carrera','Semestre','Tutor','Avance','Acciones'].map(h => (
                <th key={h} style={{ padding:'12px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:'#7c3aed', textAlign:'left', textTransform:'uppercase', letterSpacing:.5, borderBottom:'1px solid #ede9fe' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const pct = s.creditSummary?.percentage ?? 0;
              const isAssigning = assigning === s._id;
              return (
                <tr key={s._id} style={{ background: i % 2 === 0 ? 'white' : '#fdf8ff', borderBottom:'1px solid #f5f0ff' }}>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#6d28d9,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, flexShrink:0 }}>
                        {s.name[0]}
                      </div>
                      <div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, color:'#1a0533' }}>{s.name}</div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#a78bfa' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7280' }}>{s.controlNumber}</td>
                  <td style={{ padding:'14px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7280', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.career}</td>
                  <td style={{ padding:'14px 16px', textAlign:'center', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:'#7c3aed' }}>{s.semester}°</td>
                  <td style={{ padding:'14px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:13, color: s.tutor ? '#1a0533' : '#ef4444' }}>
                    {s.tutor ? s.tutor.name : (
                      <span style={{ fontWeight:600, fontSize:12 }}>⚠ Sin asignar</span>
                    )}
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1, background:'#f5f3ff', borderRadius:6, height:6, overflow:'hidden' }}>
                          <div style={{ height:'100%', background:'linear-gradient(90deg,#6d28d9,#8b5cf6)', width:`${pct}%`, borderRadius:6 }}/>
                        </div>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, color:'#7c3aed', width:30 }}>{pct}%</span>
                      </div>
                      <StatusBadge pct={pct}/>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    {isAssigning ? (
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <select value={selTutor} onChange={e => setSelTutor(e.target.value)}
                          style={{ padding:'6px 8px', border:'1.5px solid #7c3aed', borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#1a0533', outline:'none' }}>
                          <option value="">Elegir tutor...</option>
                          {tutors.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                        <button onClick={() => handleAssign(s._id)} disabled={saving || !selTutor}
                          style={{ padding:'6px 12px', background:'#7c3aed', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600 }}>
                          {saving ? '...' : 'OK'}
                        </button>
                        <button onClick={() => { setAssigning(null); setSelTutor(''); }}
                          style={{ padding:'6px 10px', background:'#f5f3ff', color:'#7c3aed', border:'none', borderRadius:8, cursor:'pointer', fontSize:12 }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => { setAssigning(s._id); setSelTutor(s.tutor?._id || ''); }}
                        style={{ padding:'7px 14px', background:'#f5f3ff', color:'#7c3aed', border:'1.5px solid #ede9fe', borderRadius:8, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, whiteSpace:'nowrap' }}>
                        {s.tutor ? 'Reasignar' : '+ Asignar tutor'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:'40px', textAlign:'center', fontFamily:"'DM Sans',sans-serif", color:'#a78bfa', fontSize:14 }}>
            No se encontraron estudiantes
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorStudents;
