import Icon from '../Icon/Icon';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const Topbar = ({ title, subtitle, notifCount = 0, onMenuClick, showMenuButton }) => {
  const { user }   = useAuth();
  const isMobile   = useIsMobile();

  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #e8edf5',
      padding: isMobile ? '12px 16px' : '16px 32px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 5,
      gap: 12,
    }}>

      {/* Izquierda: hamburger (móvil) + título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              color: '#3b6cf7', padding: 6, borderRadius: 8,
              display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}

        <div style={{ minWidth: 0 }}>
          <h1 style={{
            fontFamily: "'Playfair Display',serif", fontWeight: 700,
            fontSize: isMobile ? 20 : 26,
            color: '#1a2744', margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {title}
          </h1>
          {subtitle && !isMobile && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#8898b3', margin: '2px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Derecha: notificaciones + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, flexShrink: 0 }}>
        <button style={{
          position: 'relative', border: 'none', background: '#f4f7ff',
          borderRadius: 10, width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#6b7fa3',
        }}>
          <Icon name="bell" size={18} />
          {notifCount > 0 && (
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', border: '2px solid white' }}/>
          )}
        </button>

        {user?.avatar
          ? <img src={user.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8edf5' }}/>
          : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#3b6cf7,#5b8ff9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, border: '2px solid #e8edf5', flexShrink: 0 }}>
              {user?.name?.[0] ?? '?'}
            </div>
        }
      </div>
    </div>
  );
};

export default Topbar;
