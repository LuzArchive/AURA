import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

const CoordinatorTutors = () => {
  const [tutors,  setTutors]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm,setShowForm]= useState(false);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [form,    setForm]    = useState({ name:'', email:'', password:'', department:'', specialties:'', bio:'' });

  const load = () => {
    setLoading(true);
    api.coordinator.getTutors()
      .then(setTutors)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.coordinator.createTutor({
        ...form,
        specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean),
      });
      setMsg('Tutor registrado correctamente ✅');
      setShowForm(false);
      setForm({ name:'', email:'', password:'', department:'', specialties:'', bio:'' });
      load();
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

      {/* Header action */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#6b7280' }}>
          {tutors.length} tutor{tutors.length !== 1 ? 'es' : ''} registrado{tutors.length !== 1 ? 's' : ''}
        </div>
        <button onClick={() => setShowForm(f => !f)}
          style={{ padding:'10px 20px', background:'linear-gradient(135deg,#6d28d9,#8b5cf6)', color:'white', border:'none', borderRadius:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18, lineHeight:1 }}>+</span> {showForm ? 'Cancelar' : 'Nuevo tutor'}
        </button>
      </div>

      {/* New tutor form */}
      {showForm && (
        <div style={{ background:'white', borderRadius:16, border:'1.5px solid #7c3aed', padding:'24px' }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:18, color:'#1a0533', marginBottom:20 }}>Registrar nuevo tutor</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                { key:'name',        label:'Nombre completo',    placeholder:'Dr. Juan García', type:'text'     },
                { key:'email',       label:'Correo institucional', placeholder:'j.garcia@apizaco.tecnm.mx', type:'email' },
                { key:'password',    label:'Contraseña temporal', placeholder:'Mínimo 6 caracteres', type:'password' },
                { key:'department',  label:'Departamento',        placeholder:'Ingeniería y Tecnología', type:'text' },
                { key:'specialties', label:'Especialidades',       placeholder:'Bases de Datos, Redes (separadas por coma)', type:'text' },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.key === 'specialties' ? 'span 2' : 'auto' }}>
                  <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, color:'#1a0533', marginBottom:6 }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} required={f.key !== 'specialties'}
                    style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #ede9fe', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#1a0533', outline:'none', boxSizing:'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e  => e.target.style.borderColor = '#ede9fe'}/>
                </div>
              ))}
              <div style={{ gridColumn:'span 2' }}>
                <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, color:'#1a0533', marginBottom:6 }}>Biografía (opcional)</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Breve descripción del tutor..." rows={3}
                  style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #ede9fe', borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#1a0533', outline:'none', resize:'vertical', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e  => e.target.style.borderColor = '#ede9fe'}/>
              </div>
            </div>
            <div style={{ display:'flex', gap:12, marginTop:20, justifyContent:'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding:'10px 20px', background:'#f5f3ff', color:'#7c3aed', border:'none', borderRadius:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600 }}>
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                style={{ padding:'10px 24px', background:'linear-gradient(135deg,#6d28d9,#8b5cf6)', color:'white', border:'none', borderRadius:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600 }}>
                {saving ? 'Guardando...' : 'Registrar tutor'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tutors grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
        {tutors.map(t => (
          <div key={t._id} style={{ background:'white', borderRadius:16, border:'1px solid #ede9fe', padding:'22px', display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#0284c7,#38bdf8)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:18, flexShrink:0 }}>
                {t.name[0]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, color:'#1a0533', marginBottom:2 }}>{t.name}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#a78bfa' }}>{t.email}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#6b7280', marginTop:2 }}>{t.department}</div>
              </div>
              <div style={{ flexShrink:0, textAlign:'right' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:'#7c3aed' }}>
                  {(t.students || []).length}
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#a78bfa' }}>tutorados</div>
              </div>
            </div>

            {(t.specialties || []).length > 0 && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {t.specialties.map(sp => (
                  <span key={sp} style={{ padding:'3px 10px', background:'#ede9fe', color:'#6d28d9', borderRadius:20, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600 }}>
                    {sp}
                  </span>
                ))}
              </div>
            )}

            {t.rating > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:'#f59e0b', fontSize:14 }}>{'★'.repeat(Math.round(t.rating))}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7280' }}>{t.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoordinatorTutors;
