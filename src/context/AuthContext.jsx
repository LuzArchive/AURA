import { createContext, useContext, useState, useEffect } from 'react';
import { api, saveToken, getToken, removeToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);  // checking stored token

  // On mount: restore session from localStorage
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      if (!token) { setLoading(false); return; }

      try {
        const me = await api.auth.getMe();
        setUser(me);
      } catch {
        removeToken();   // token expired or invalid
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (email, password, role) => {
    const { token, user: me } = await api.auth.login(email, password, role);
    saveToken(token);
    setUser(me);
    return me;
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for convenience
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
