import Icon from '../Icon/Icon';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ active, onNav, collapsed, onToggle }) => {
  const { user, logout } = useAuth();

  const nav = [
    { id: 'dashboard', label: 'Inicio',                    icon: 'home'     },
    { id: 'tutor',     label: 'Mi Tutor',                  icon: 'user'     },
    { id: 'sessions',  label: 'Tutorías',                  icon: 'users'    },
    { id: 'calendar',  label: 'Calendario',                icon: 'calendar' },
    { id: 'credits',   label: 'Progreso de Créditos',      icon: 'trending' },
    { id: 'complementary', label: 'Créditos Complementarios', icon: 'award'    },
    { id: 'lifeplan',  label: 'Plan de Vida',              icon: 'target'   },
    { id: 'evidences', label: 'Repositorio de Evidencias', icon: 'folder'   },
    { id: 'chat',      label: 'Chat / Asistente',          icon: 'message'  },
    { id: 'settings',  label: 'Configuración',             icon: 'settings' },
  ];

  return (
    <aside style={{
      width: collapsed ? 72 : 260,
      minHeight: '100vh',
      background: 'white',
      borderRight: '1px solid #e8edf5',
      display: 'flex', flexDirection: 'column',
      transition: 'width .3s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden', flexShrink: 0,
      position: 'relative', zIndex: 10,
    }}>

      {/* Header */}
      <div style={{ padding: collapsed ? '20px 0' : '24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #e8edf5', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3b6cf7,#5b8ff9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="book" size={18} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: '#1a2744', lineHeight: 1 }}>Panel</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: '#3b6cf7', lineHeight: 1 }}>Estudiante</div>
            </div>
          </div>
        )}
        <button onClick={onToggle} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#8898b3', padding: 4, borderRadius: 6, display: 'flex' }}>
          <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {nav.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: collapsed ? '12px 0' : '11px 20px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                border: 'none', background: isActive ? 'linear-gradient(90deg,#eef2ff,#f0f5ff)' : 'none',
                cursor: 'pointer', color: isActive ? '#3b6cf7' : '#6b7fa3',
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: isActive ? 600 : 400,
                borderLeft: isActive && !collapsed ? '3px solid #3b6cf7' : '3px solid transparent',
                transition: 'all .18s', position: 'relative',
              }}>
              {collapsed && isActive && (
                <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 32, borderRadius: '0 3px 3px 0', background: '#3b6cf7' }} />
              )}
              <Icon name={item.icon} size={18} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Profile + logout */}
      <div style={{ borderTop: '1px solid #e8edf5' }}>
        {!collapsed && user && (
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            {user.avatar
              ? <img src={user.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b6cf7,#5b8ff9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15 }}>
                  {user.name?.[0] ?? '?'}
                </div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: '#1a2744', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#8898b3', textTransform: 'capitalize' }}>{user.role}</div>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button onClick={logout} title={collapsed ? 'Cerrar sesión' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: collapsed ? '14px 0' : '12px 20px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            border: 'none', background: 'none', cursor: 'pointer',
            color: '#e74c3c', fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 500,
            borderTop: collapsed ? '1px solid #e8edf5' : 'none',
          }}>
          {/* Logout icon */}
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
