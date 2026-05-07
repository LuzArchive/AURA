import { useState, useEffect } from 'react';
import Icon from '../Icon/Icon';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ title, subtitle, notifCount = 0 }) => {
  const { user } = useAuth();

  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e8edf5', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 5 }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 26, color: '#1a2744', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#8898b3', margin: '2px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ position: 'relative', border: 'none', background: '#f4f7ff', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7fa3' }}>
          <Icon name="bell" size={18} />
          {notifCount > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', border: '2px solid white' }}/>}
        </button>
        {user?.avatar
          ? <img src={user.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8edf5' }}/>
          : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#3b6cf7,#5b8ff9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, border: '2px solid #e8edf5' }}>
              {user?.name?.[0] ?? '?'}
            </div>
        }
      </div>
    </div>
  );
};

export default Topbar;
