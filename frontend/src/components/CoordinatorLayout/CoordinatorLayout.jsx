import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';
// Ajusta la ruta según donde guardes el logo
import logo from '../../assets/logo.png';

const NAV = [
  { id: 'dashboard', label: 'Panel General',       icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
  { id: 'students',  label: 'Estudiantes',          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
  { id: 'tutors',    label: 'Tutores',               icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'releases',  label: 'Cartas de Liberación',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>, badge: true },
  { id: 'reports',   label: 'Reportes',              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg> },
];

const PAGE_TITLES = {
  dashboard: 'Panel General',
  students:  'Estudiantes',
  tutors:    'Tutores',
  releases:  'Cartas de Liberación',
  reports:   'Reportes',
};

const CoordinatorLayout = ({ children, activePage, onNav, pendingCount = 0 }) => {
  const { user, logout } = useAuth();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => { if (!isMobile) setMobileOpen(false); }, [isMobile]);

  const handleNav = (id) => { onNav(id); if (isMobile) setMobileOpen(false); };

  const showLabel = isMobile || !collapsed;

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const Sidebar = (
    <>
      {/* Backdrop móvil */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 99, backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
        />
      )}

      <aside style={{
        ...(isMobile ? {
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .28s cubic-bezier(.4,0,.2,1)',
        } : {
          position: 'relative',
          transition: 'width .3s cubic-bezier(.4,0,.2,1)',
        }),
        width: isMobile ? 280 : (collapsed ? 72 : 264),
        minHeight: '100vh',
        background: 'white',
        borderRight: '1px solid #ede9fe',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', flexShrink: 0,
      }}>

        {/* Header */}
        <div style={{
          padding: (!isMobile && collapsed) ? '20px 0' : '20px 18px',
          borderBottom: '1px solid #ede9fe',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: (!isMobile && collapsed) ? 'center' : 'space-between',
          minHeight: 72,
        }}>
          {showLabel && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <img src={logo} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 14, color: '#1a0533', lineHeight: 1, whiteSpace: 'nowrap' }}>Panel</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 14, color: '#7c3aed', lineHeight: 1, whiteSpace: 'nowrap' }}>Coordinación</div>
              </div>
            </div>
          )}
          {!isMobile && collapsed && (
            <img src={logo} alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }} />
          )}

          <button
            onClick={isMobile ? () => setMobileOpen(false) : () => setCollapsed(c => !c)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#a78bfa', padding: 6, borderRadius: 8, display: 'flex', flexShrink: 0 }}
          >
            {isMobile
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
                </svg>
            }
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                title={(!isMobile && collapsed) ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%',
                  padding: showLabel ? '11px 20px' : '12px 0',
                  justifyContent: showLabel ? 'flex-start' : 'center',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg,#ede9fe,#f5f3ff)' : 'none',
                  cursor: 'pointer', color: isActive ? '#7c3aed' : '#6b7280',
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive && showLabel ? '3px solid #7c3aed' : '3px solid transparent',
                  transition: 'all .15s', position: 'relative',
                }}
              >
                {!isMobile && collapsed && isActive && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 32, borderRadius: '0 3px 3px 0', background: '#7c3aed' }} />
                )}
                <span style={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
                  {item.icon}
                  {item.badge && pendingCount > 0 && (
                    <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: '#ef4444', borderRadius: '50%', fontSize: 9, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </span>
                {showLabel && <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{item.label}</span>}
                {showLabel && item.badge && pendingCount > 0 && (
                  <span style={{ background: '#fef2f2', color: '#ef4444', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Perfil + logout */}
        <div style={{ borderTop: '1px solid #ede9fe' }}>
          {showLabel && user && (
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6d28d9,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                {user.name?.[0] ?? 'C'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: '#1a0533', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#a78bfa' }}>Coordinador/a</div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            title={(!isMobile && collapsed) ? 'Cerrar sesión' : undefined}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: showLabel ? '12px 20px' : '14px 0', justifyContent: showLabel ? 'flex-start' : 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, borderTop: (!isMobile && collapsed) ? '1px solid #ede9fe' : 'none' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            {showLabel && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );

  // ── Render principal ───────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f3ff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 10px; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f3ff' }}>
        {Sidebar}

        {/* Contenido principal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Topbar */}
          <div style={{
            background: 'white', borderBottom: '1px solid #ede9fe',
            padding: isMobile ? '14px 16px' : '16px 32px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexShrink: 0, gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {/* Hamburger en móvil */}
              {isMobile && (
                <button
                  onClick={() => setMobileOpen(true)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#7c3aed', padding: 6, borderRadius: 8, display: 'flex', flexShrink: 0 }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
              )}
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: '#1a0533', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {PAGE_TITLES[activePage] || 'Panel'}
                </h1>
                {!isMobile && (
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#a78bfa', marginTop: 2 }}>
                    TecNM Campus Apizaco · Coordinación de Tutorías
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {pendingCount > 0 && (
                <button
                  onClick={() => onNav('releases')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobile ? '6px 10px' : '8px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, cursor: 'pointer', color: '#ef4444', fontFamily: "'DM Sans',sans-serif", fontSize: isMobile ? 12 : 13, fontWeight: 600 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  {pendingCount} {isMobile ? '' : `carta${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}`}
                </button>
              )}
              {!isMobile && (
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#6b7280' }}>
                  {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          {/* Contenido de la página */}
          <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '28px 32px' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoordinatorLayout;
