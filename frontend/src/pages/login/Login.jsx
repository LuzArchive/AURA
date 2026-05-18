import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import logo from '../../assets/logo.png';

// Icons (puedes dejar los tuyos igual)
const MailIcon = () => <span>📧</span>;
const LockIcon = () => <span>🔒</span>;
const EyeIcon = ({ off }) => <span>{off ? '🙈' : '👁️'}</span>;

// Roles
const ROLES = [
  { id: 'student', label: 'Estudiante', color: '#3b6cf7' },
  { id: 'tutor', label: 'Tutor', color: '#0ea5e9' },
  { id: 'coordinator', label: 'Coordinador', color: '#8b5cf6' },
];

const Login = () => {
  const { login } = useAuth();
  const isMobile = useIsMobile();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentRole = ROLES.find(r => r.id === role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, role);
    } catch (err) {
      alert('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row'
      }}>

        {/* PANEL IZQUIERDO */}
        {!isMobile && (
          <div style={{
            width: '45%',
            background: `linear-gradient(135deg, ${currentRole.color}, #1a2744)`,
            color: 'white',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            animation: 'slideIn 0.6s ease'
          }}>
            <img src={logo} alt="logo" style={{ width: 80, marginBottom: 20 }} />

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: 42
            }}>
              AURA
            </h1>

            <p style={{ marginTop: 20, opacity: 0.8 }}>
              Sistema inteligente de tutorías académicas
            </p>
          </div>
        )}

        {/* PANEL DERECHO */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: isMobile ? 'flex-start' : 'center',
          padding: isMobile ? '20px' : '40px',
          animation: 'fadeIn 0.5s ease'
        }}>

          <div style={{ width: '100%', maxWidth: 400 }}>

            {/* LOGO EN MOBILE */}
            {isMobile && (
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <img src={logo} alt="logo" style={{ width: 60 }} />
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  fontSize: 32
                }}>
                  AURA
                </h1>
              </div>
            )}

            <h2 style={{ marginBottom: 20 }}>Iniciar sesión</h2>

            {/* ROLES */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 10,
              marginBottom: 20
            }}>
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: role === r.id ? `2px solid ${r.color}` : '1px solid #ccc',
                    background: role === r.id ? r.color : 'white',
                    color: role === r.id ? 'white' : '#333',
                    cursor: 'pointer'
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>

              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  marginBottom: 15,
                  borderRadius: 10,
                  border: '1px solid #ccc'
                }}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #ccc'
                  }}
                />
                <span
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 12,
                    cursor: 'pointer'
                  }}
                >
                  <EyeIcon off={showPw} />
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: 20,
                  padding: 12,
                  borderRadius: 10,
                  border: 'none',
                  background: currentRole.color,
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Cargando...' : 'Ingresar'}
              </button>

            </form>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;