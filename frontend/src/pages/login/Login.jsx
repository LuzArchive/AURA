import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

// ── Role config ───────────────────────────────────────────────────────────────
const ROLES = [
  {
    id:          'student',
    label:       'Estudiante',
    placeholder: 'm12345678@apizaco.tecnm.mx',
    color:       '#3b6cf7',
    bg:          '#eef2ff',
    description: 'Accede a tu panel académico',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id:          'tutor',
    label:       'Tutor',
    placeholder: 'nombre@apizaco.tecnm.mx',
    color:       '#0ea5e9',
    bg:          '#e0f2fe',
    description: 'Gestiona tus grupos asignados',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id:          'coordinator',
    label:       'Coordinador',
    placeholder: 'coordinacion@apizaco.tecnm.mx',
    color:       '#8b5cf6',
    bg:          '#ede9fe',
    description: 'Administra el sistema de tutorías',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
      </svg>
    ),
  },
];

// ── Left panel content per role ───────────────────────────────────────────────
const PANEL_CONTENT = {
  student: {
    gradient: 'linear-gradient(160deg, #0f2a6e 0%, #1e4fd8 55%, #3b6cf7 100%)',
    title: 'Tu trayectoria\nacadémica,\nen un solo lugar.',
    subtitle: 'Gestiona sesiones de tutoría, revisa tu avance de créditos y mantente en contacto con tu tutor.',
    stats: [{ v: '500+', l: 'Estudiantes' }, { v: '40+', l: 'Tutores' }, { v: '98%', l: 'Satisfacción' }],
  },
  tutor: {
    gradient: 'linear-gradient(160deg, #075985 0%, #0284c7 55%, #38bdf8 100%)',
    title: 'Acompaña a tus\nestudiantes\nhacia el éxito.',
    subtitle: 'Registra sesiones, revisa el avance crediticio de tus tutorados y genera reportes de seguimiento.',
    stats: [{ v: '12', l: 'Tutorados' }, { v: '48', l: 'Sesiones' }, { v: '9.1', l: 'Promedio' }],
  },
  coordinator: {
    gradient: 'linear-gradient(160deg, #3b0764 0%, #6d28d9 55%, #8b5cf6 100%)',
    title: 'Coordina,\nsupervisa\ny potencia.',
    subtitle: 'Asigna tutores, monitorea el avance de todos los estudiantes y gestiona las liberaciones de créditos.',
    stats: [{ v: '12', l: 'Carreras' }, { v: '500+', l: 'Alumnos' }, { v: '40+', l: 'Tutores' }],
  },
};

// ── Floating circles ──────────────────────────────────────────────────────────
const Circles = () => (
  <>
  {/* NUEVO LOGO - Esquina superior izquierda */}
  <div style={{
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 20,
  }}>
    <img 
      src="/tecnm.png" 
      alt="TecNM Logo" 
      style={{
        width: '60px',
        height: 'auto',
        filter: 'brightness(0) invert(1)', // Hace el logo blanco para que contraste con el fondo
      }}
    />
  </div>
    <div style={{ position:'absolute', top:-80,  left:-80,  width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }}/>
    <div style={{ position:'absolute', bottom:-60,right:-60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }}/>
    <div style={{ position:'absolute', top:'40%', right:-40, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }}/>
  </>
);

// ── Main Login ────────────────────────────────────────────────────────────────
const Login = () => {
  const { login } = useAuth();
  const [role,     setRole]     = useState('student');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const currentRole = ROLES.find(r => r.id === role);
  const panel       = PANEL_CONTENT[role];

  const handleRoleChange = (id) => { setRole(id); setError(''); setEmail(''); setPassword(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#f0f4ff; }
        @keyframes loginFadeIn  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes panelSlide   { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes floatUp      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes panelFade    { from{opacity:0} to{opacity:1} }
      `}</style>

      <div style={{ minHeight:'100vh', display:'flex', background:'#f0f4ff' }}>

        {/* ── Left panel ── */}
        <div key={role} style={{
          width:'45%', minHeight:'100vh',
          background: panel.gradient,
          display:'flex', flexDirection:'column', justifyContent:'center',
          padding:'60px 56px', position:'relative', overflow:'hidden',
          animation:'panelSlide .4s ease both',
          transition:'background .5s ease',
        }}>
          <Circles />

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:52 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)', color:'white' }}>
              {currentRole.icon}
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'white', lineHeight:1.1 }}>Sistema de</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'rgba(255,255,255,.7)', lineHeight:1.1 }}>Tutorías TecNM</div>
            </div>
          </div>

          {/* Hero */}
          <div style={{ animation:'floatUp 4s ease-in-out infinite' }}>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:38, color:'white', lineHeight:1.25, marginBottom:18, whiteSpace:'pre-line' }}>
              {panel.title}
            </h1>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:'rgba(255,255,255,.72)', lineHeight:1.7, maxWidth:340, marginBottom:48 }}>
            {panel.subtitle}
          </p>

          {/* Stats */}
          <div style={{ display:'flex', gap:32 }}>
            {panel.stats.map(s => (
              <div key={s.l}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:28, color:'white' }}>{s.v}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,.6)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 32px', animation:'loginFadeIn .55s .15s ease both' }}>
          <div style={{ width:'100%', maxWidth:440 }}>

            {/* Header */}
            <div style={{ marginBottom:28, textAlign:'center' }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, color:'#8898b3', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>
                TecNM · Campus Apizaco
              </div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:30, color:'#1a2744', marginBottom:6 }}>
                Iniciar sesión
              </h2>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8898b3' }}>
                Selecciona tu perfil e ingresa tus credenciales
              </p>
            </div>

            {/* ── Role selector — 3 tabs ── */}
            <div style={{ display:'flex', gap:8, marginBottom:28 }}>
              {ROLES.map(r => {
                const active = role === r.id;
                return (
                  <button key={r.id} onClick={() => handleRoleChange(r.id)}
                    style={{
                      flex:1, padding:'10px 6px 10px',
                      border: active ? `2px solid ${r.color}` : '2px solid #e8edf5',
                      borderRadius:12, cursor:'pointer',
                      background: active ? r.bg : 'white',
                      display:'flex', flexDirection:'column', alignItems:'center', gap:5,
                      transition:'all .2s',
                    }}>
                    <span style={{ color: active ? r.color : '#b0bcd4', transition:'color .2s' }}>{r.icon}</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight: active ? 700 : 500, color: active ? r.color : '#8898b3', lineHeight:1 }}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Error */}
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 14px', background:'#fff0f0', border:'1px solid #fecaca', borderRadius:10, marginBottom:18, color:'#dc2626', fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>
                <AlertIcon />{error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, color:'#1a2744', marginBottom:6 }}>
                  Correo institucional
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#8898b3', display:'flex' }}>
                    <MailIcon />
                  </span>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={currentRole.placeholder} required
                    style={{ width:'100%', padding:'12px 42px', border:'1.5px solid #e2e8f5', borderRadius:12, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#1a2744', background:'#f8faff', outline:'none', boxSizing:'border-box', transition:'border-color .2s, box-shadow .2s' }}
                    onFocus={e => { e.target.style.borderColor = currentRole.color; e.target.style.boxShadow = `0 0 0 3px ${currentRole.color}22`; }}
                    onBlur={e  => { e.target.style.borderColor = '#e2e8f5'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:10 }}>
                <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, color:'#1a2744', marginBottom:6 }}>
                  Contraseña
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#8898b3', display:'flex' }}>
                    <LockIcon />
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    style={{ width:'100%', padding:'12px 42px', border:'1.5px solid #e2e8f5', borderRadius:12, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#1a2744', background:'#f8faff', outline:'none', boxSizing:'border-box', transition:'border-color .2s, box-shadow .2s' }}
                    onFocus={e => { e.target.style.borderColor = currentRole.color; e.target.style.boxShadow = `0 0 0 3px ${currentRole.color}22`; }}
                    onBlur={e  => { e.target.style.borderColor = '#e2e8f5'; e.target.style.boxShadow = 'none'; }}
                  />
                  <span onClick={() => setShowPw(p => !p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'#8898b3', cursor:'pointer', display:'flex' }}>
                    <EyeIcon off={showPw} />
                  </span>
                </div>
              </div>

              <div style={{ textAlign:'right', marginBottom:22 }}>
                <button type="button" style={{ background:'none', border:'none', color: currentRole.color, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, cursor:'pointer' }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'14px 0',
                background: loading ? '#c4b5fd' : `linear-gradient(135deg, ${currentRole.color}, ${currentRole.color}cc)`,
                border:'none', borderRadius:12, color:'white',
                fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 4px 16px ${currentRole.color}44`,
                transition:'all .2s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              }}>
                {loading
                  ? <><span style={{ width:18, height:18, borderRadius:'50%', border:'2px solid rgba(255,255,255,.4)', borderTopColor:'white', animation:'spin .7s linear infinite', display:'inline-block' }}/> Verificando...</>
                  : `Ingresar como ${currentRole.label}`
                }
              </button>
            </form>

            <p style={{ textAlign:'center', marginTop:26, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8898b3' }}>
              ¿Problemas para acceder?{' '}
              <a href="mailto:soporte@apizaco.tecnm.mx" style={{ color: currentRole.color, fontWeight:600, textDecoration:'none' }}>
                Contacta a soporte
              </a>
            </p>
            <p style={{ textAlign:'center', marginTop:28, fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#b0bcd4' }}>
              TecNM Campus Apizaco © 2026 · Sistema de Tutorías v2.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
