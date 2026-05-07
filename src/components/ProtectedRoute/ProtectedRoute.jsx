import { useAuth } from '../../context/AuthContext';

/**
 * Wraps any page that requires authentication.
 * - While checking the token → shows a centered spinner
 * - If no user → renders the fallback (Login page)
 * - If authenticated → renders children
 */
const ProtectedRoute = ({ children, fallback }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f4f7ff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '3px solid #e8edf5', borderTopColor: '#3b6cf7',
            animation: 'spin .8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#8898b3' }}>Verificando sesión...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return fallback || null;

  return children;
};

export default ProtectedRoute;
