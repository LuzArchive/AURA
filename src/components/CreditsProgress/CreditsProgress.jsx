import { useState, useEffect } from 'react';
import CircularProgress from '../CircularProgress/CircularProgress';
import { api } from '../../services/api';

const CreditsProgress = () => {
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    api.credits.getMy().then(setCredits).catch(console.error);
  }, []);

  // Client-side calculation — no dependency on mongoose virtuals
  const allSubjects   = credits?.subjects ?? [];
  const earned        = allSubjects.filter(s => s.status === 'aprobada').reduce((a, s) => a + s.credits, 0);
  const total         = credits?.totalCredits ?? 245;
  const pct           = credits ? Math.round((earned / total) * 100) : 0;
  const thisSemester  = credits?.creditsThisSemester ?? 0;

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '22px 24px', border: '1px solid #e8edf5' }}>
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, color: '#1a2744', marginBottom: 18, marginTop: 0 }}>
        Progreso de Créditos
      </h3>

      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 16 }}>
        <CircularProgress value={pct} size={140} stroke={12} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 30, color: '#1a2744' }}>
            {credits ? `${pct}%` : '—'}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#8898b3' }}>completado</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b7fa3' }}>Créditos Totales</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: '#1a2744' }}>
          {credits ? `${earned} / ${total}` : '—'}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b7fa3' }}>Créditos este semestre</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: '#1a2744' }}>{thisSemester}</span>
      </div>

      <div style={{ height: 6, background: '#e8edf5', borderRadius: 6 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#3b6cf7,#5b8ff9)', borderRadius: 6, transition: 'width .5s' }} />
      </div>
    </div>
  );
};

export default CreditsProgress;
