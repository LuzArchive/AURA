import Icon from '../Icon/Icon';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';
// Ajusta la ruta según donde guardes el logo en tu proyecto
import logo from '../../assets/logo.png';

const Sidebar = ({ active, onNav, collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const nav = [
    { id: 'dashboard',    label: 'Inicio',                       icon: 'home'     },
    { id: 'tutor',        label: 'Mi Tutor',                     icon: 'user'     },
    { id: 'sessions',     label: 'Tutorías',                     icon: 'users'    },
    { id: 'calendar',     label: 'Calendario',                   icon: 'calendar' },
    { id: 'credits',      label: 'Progreso de Créditos',         icon: 'trending' },
    { id: 'complementary',label: 'Créditos Complementarios',     icon: 'award'    },
    { id: 'lifeplan',     label: 'Plan de Vida',                 icon: 'target'   },
    { id: 'evidences',    label: 'Repositorio de Evidencias',    icon: 'folder'   },
    { id: 'chat',         label: 'Chat / Asistente',             icon: 'message'  },
    { id: 'settings',     label: 'Configuración',                icon: 'settings' },
  ];

  // En móvil el sidebar es un drawer overlay; en desktop es la barra lateral normal
  const sidebarWidth = isMobile ? 280 : (collapsed ? 72 : 260);

  const handleNav = (id) => {
    onNav(id);
    if (isMobile) onMobileClose?.();
  };

  const handleLogout = () => {
    logout();
    if (isMobile) onMobileClose?.();
  };

  return (
    <>
      {/* Backdrop oscuro (solo móvil cuando el drawer está abierto) */}
      {isMobile && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 99,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            animation: 'sidebarFadeIn .2s ease',
          }}
        />
      )}

      <style>{`
        @keyframes sidebarFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes sidebarSlideIn { from { transform:translateX(-100%) } to { transform:translateX(0) } }
      `}</style>

      <aside style={{
        // ── Posición ──────────────────────────────────────────────────────────
        ...(isMobile ? {
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 100,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .28s cubic-bezier(.4,0,.2,1)',
          animation: mobileOpen ? 'sidebarSlideIn .28s cubic-bezier(.4,0,.2,1)' : 'none',
        } : {
          position: 'relative',
          transition: 'width .3s cubic-bezier(.4,0,.2,1)',
        }),
        // ── Apariencia ────────────────────────────────────────────────────────
        width: sidebarWidth,
        minHeight: '100vh',
        background: 'white',
        borderRight: '1px solid #e8edf5',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', flexShrink: 0,
      }}>

        {/* ── Header con logo ──────────────────────────────────────────────── */}
        <div style={{
          padding: (!isMobile && collapsed) ? '20px 0' : '20px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid #e8edf5',
          justifyContent: (!isMobile && collapsed) ? 'center' : 'space-between',
          minHeight: 72,
        }}>
          {/* Logo + nombre — visible cuando NO está colapsado (desktop) o en móvil */}
          {(isMobile || !collapsed) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: 36, height: 36,
                  objectFit: 'contain',
                  borderRadius: 8,
                  // Si el logo es oscuro sobre fondo transparente, descomenta la siguiente línea:
                  // filter: 'brightness(0) saturate(100%) invert(35%) sepia(80%) saturate(2000%) hue-rotate(210deg)',
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: '#1a2744', lineHeight: 1, whiteSpace: 'nowrap' }}>Panel</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: '#3b6cf7', lineHeight: 1, whiteSpace: 'nowrap' }}>Estudiante</div>
              </div>
            </div>
          )}

          {/* Icono colapsado (desktop) */}
          {!isMobile && collapsed && (
            <img src={logo} alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }} />
          )}

          {/* Botón de colapso (desktop) / cerrar (móvil) */}
          <button
            onClick={isMobile ? onMobileClose : onToggle}
            title={isMobile ? 'Cerrar menú' : (collapsed ? 'Expandir' : 'Colapsar')}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              color: '#8898b3', padding: 6, borderRadius: 8,
              display: 'flex', flexShrink: 0,
              transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {isMobile
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={18} />
            }
          </button>
        </div>

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          {nav.map(item => {
            const isActive = active === item.id;
            const showLabel = isMobile || !collapsed;
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
                  background: isActive ? 'linear-gradient(90deg,#eef2ff,#f0f5ff)' : 'none',
                  cursor: 'pointer',
                  color: isActive ? '#3b6cf7' : '#6b7fa3',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive && showLabel ? '3px solid #3b6cf7' : '3px solid transparent',
                  transition: 'all .15s',
                  position: 'relative',
                  textAlign: 'left',
                }}
              >
                {/* Indicador activo en modo colapsado desktop */}
                {!isMobile && collapsed && isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3, height: 32,
                    borderRadius: '0 3px 3px 0', background: '#3b6cf7',
                  }} />
                )}
                <Icon name={item.icon} size={18} />
                {showLabel && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* ── Perfil + logout ──────────────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid #e8edf5' }}>
          {(isMobile || !collapsed) && user && (
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              {user.avatar
                ? <img src={user.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b6cf7,#5b8ff9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                    {user.name?.[0] ?? '?'}
                  </div>
                )
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: '#1a2744', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#8898b3', textTransform: 'capitalize' }}>{user.role}</div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={(!isMobile && collapsed) ? 'Cerrar sesión' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%',
              padding: (!isMobile && collapsed) ? '14px 0' : '12px 20px',
              justifyContent: (!isMobile && collapsed) ? 'center' : 'flex-start',
              border: 'none', background: 'none', cursor: 'pointer',
              color: '#e74c3c', fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 500,
              borderTop: (!isMobile && collapsed) ? '1px solid #e8edf5' : 'none',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            {(isMobile || !collapsed) && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
