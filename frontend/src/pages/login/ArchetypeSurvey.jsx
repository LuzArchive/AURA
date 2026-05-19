import { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

// ── Preguntas del cuestionario ────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: 'Cuando el profesor anuncia un nuevo proyecto final, tu primera reacción es:',
    options: {
      A: 'Planificar un cronograma detallado con fechas de entrega para cada fase.',
      B: 'Analizar la teoría detrás del proyecto y buscar la forma más lógica de resolverlo.',
      C: 'Empezar a probar ideas de inmediato y ver qué funciona sobre la marcha.',
      D: 'Pensar en con quién puedo hacer equipo para discutir ideas y colaborar.',
    },
  },
  {
    q: 'Al estudiar para un examen difícil, prefieres:',
    options: {
      A: 'Seguir mis apuntes estructurados paso a paso, en un entorno silencioso.',
      B: 'Cuestionar los conceptos, buscar conexiones lógicas y leer fuentes adicionales.',
      C: 'Hacer ejercicios prácticos, resolver problemas o usar tarjetas de memoria rápidas.',
      D: 'Formar un grupo de estudio para debatir los temas y ayudarnos mutuamente.',
    },
  },
  {
    q: 'Cuando te enfrentas a un tema completamente nuevo, aprendes mejor si:',
    options: {
      A: 'Me dan instrucciones claras, ejemplos reales y datos concretos desde el principio.',
      B: 'Me explican los principios generales y el "por qué" detrás de las cosas.',
      C: 'Me permiten experimentar directamente con el material o ver una demostración práctica.',
      D: 'Me explican cómo ese conocimiento impacta a las personas o al mundo real.',
    },
  },
  {
    q: 'Si surge un cambio imprevisto en el temario a mitad del semestre:',
    options: {
      A: 'Me genera frustración; prefiero que los planes originales se respeten.',
      B: 'Evalúo lógicamente si el nuevo temario tiene más sentido que el anterior.',
      C: 'Me adapto rápidamente; a veces los cambios hacen las clases menos monótonas.',
      D: 'Me preocupo por cómo afectará el cambio al rendimiento de mis compañeros.',
    },
  },
  {
    q: '¿Qué tipo de retroalimentación te resulta más útil de un tutor?',
    options: {
      A: 'Directa y específica: qué hice bien, qué hice mal y cómo corregirlo.',
      B: 'Crítica y objetiva: que rete mi razonamiento y muestre fallas lógicas.',
      C: 'Práctica y rápida: consejos aplicables de inmediato sin demasiada teoría.',
      D: 'Constructiva y empática: que valore mi esfuerzo y me guíe suavemente.',
    },
  },
  {
    q: 'Cuando tienes que tomar una decisión rápida en clase:',
    options: {
      A: 'Me baso en lo que ha funcionado en el pasado y en métodos comprobados.',
      B: 'Analizo fríamente los pros y contras basándome en la lógica pura.',
      C: 'Confío en mis instintos y actúo rápido, adaptándome a lo que ocurra.',
      D: 'Considero cómo la decisión afectará a todos los involucrados antes de actuar.',
    },
  },
  {
    q: 'Al leer un texto académico, tu mente suele enfocarse en:',
    options: {
      A: 'Los hechos, las fechas, las definiciones exactas y los datos concretos.',
      B: 'Las teorías subyacentes, los sistemas y los patrones a largo plazo.',
      C: 'La aplicación inmediata: ¿para qué me sirve esto ahora mismo?',
      D: 'El mensaje del autor, el significado oculto y las implicaciones éticas.',
    },
  },
  {
    q: 'Tu forma ideal de gestionar el tiempo de estudio es:',
    options: {
      A: 'Tener una rutina fija y terminar las tareas mucho antes de la fecha límite.',
      B: 'Dedicar bloques de tiempo profundo a investigar un tema hasta dominarlo.',
      C: 'Estudiar en ráfagas de energía cuando me siento motivado, a veces cerca del límite.',
      D: 'Intercalar el estudio con momentos de conexión social y descansos.',
    },
  },
  {
    q: '¿Qué entorno te resulta más estimulante para aprender?',
    options: {
      A: 'Un aula tradicional y ordenada donde el profesor dicta la clase claramente.',
      B: 'Un debate intelectual donde se puede cuestionar al profesor y proponer ideas.',
      C: 'Un laboratorio o taller donde pueda moverme y usar las manos.',
      D: 'Un seminario interactivo donde todos comparten opiniones y experiencias.',
    },
  },
  {
    q: 'En un trabajo en equipo, tu rol principal suele ser:',
    options: {
      A: 'El organizador: divido tareas, establezco fechas y aseguro que todos cumplan.',
      B: 'El estratega: diseño la arquitectura del trabajo y cuido el rigor del contenido.',
      C: 'El solucionador: resuelvo problemas urgentes y aporto ideas creativas de último minuto.',
      D: 'El mediador: mantengo la armonía, motivo a los demás y aseguro que todos participen.',
    },
  },
];

// ── Config de arquetipos ──────────────────────────────────────────────────────
const ARCHETYPES = {
  analitico: {
    name: 'Analítico', animal: 'Ocelote', emoji: '🐆',
    color: '#1a3a6e', bg: '#e8edf8', accent: '#3b6cf7',
    description: 'Intelectualmente curioso y estratégico. Te enfocas en el "por qué", disfrutas los sistemas complejos y aprendes cuestionando.',
    chatStyle: 'Tu asistente usará un tono objetivo, preciso y estructurado, con datos y lógica.',
  },
  diplomatico: {
    name: 'Diplomático', animal: 'Tlacuache', emoji: '🐾',
    color: '#6b3a2e', bg: '#f5ede9', accent: '#c0735a',
    description: 'Empático e idealista. Aprendes mejor a través de la cooperación, las historias y el impacto humano del conocimiento.',
    chatStyle: 'Tu asistente usará un tono cálido, motivador y empático, conectando temas con personas.',
  },
  centinela: {
    name: 'Centinela', animal: 'Ajolote', emoji: '🦎',
    color: '#1a4a35', bg: '#e8f5ee', accent: '#2d6a4f',
    description: 'Organizado y responsable. Confías en estructuras claras, rutinas y plazos definidos para aprender.',
    chatStyle: 'Tu asistente usará un tono formal y estructurado, con instrucciones paso a paso.',
  },
  explorador: {
    name: 'Explorador', animal: 'Xoloitzcuintle', emoji: '🐕',
    color: '#7a3a0a', bg: '#fef3e8', accent: '#e07b20',
    description: 'Creativo y espontáneo. Aprendes haciendo, disfrutas los retos inmediatos y la experimentación.',
    chatStyle: 'Tu asistente usará un tono enérgico y casual, directo a la práctica con ejemplos rápidos.',
  },
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';

// ── Componente principal ──────────────────────────────────────────────────────
const ArchetypeSurvey = ({ onClose, initialControlNumber = '' }) => {
  const isMobile = useIsMobile();

  // Fases: 'check' | 'preregform' | 'welcome' | 'quiz' | 'result' | 'already_has'
  const [phase,         setPhase]         = useState('check');
  const [controlNumber, setControlNumber] = useState(initialControlNumber);
  const [studentName,   setStudentName]   = useState('');
  const [currentQ,      setCurrentQ]      = useState(0);
  const [answers,       setAnswers]        = useState([]);
  const [result,        setResult]         = useState(null);
  const [loading,       setLoading]        = useState(false);
  const [error,         setError]          = useState('');
  const [existingArch,  setExistingArch]   = useState(null);
  const [canRetake,     setCanRetake]      = useState(false);

  // Pre-reg form
  const [preReg, setPreReg] = useState({ name:'', career:'', semester:'', email:'' });

  // ── Verificar número de control ─────────────────────────────────────────────
  const handleCheck = async (e) => {
    e.preventDefault();
    if (!controlNumber.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${BACKEND_URL}/api/archetype/check`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ controlNumber: controlNumber.trim() }),
      });
      const data = await res.json();

      if (data.status === 'registered_no_survey') {
        setStudentName(data.name);
        setPhase('welcome');
      } else if (data.status === 'not_registered') {
        setPhase('preregform');
      } else if (data.status === 'has_archetype') {
        setExistingArch(data);
        setCanRetake(data.canRetake);
        setStudentName(data.name);
        setPhase('already_has');
      } else if (data.status === 'preregistered_with_survey') {
        setResult({ archetype: data.archetype, info: data.info, isPreRegistered: true });
        setPhase('result');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Enviar encuesta ──────────────────────────────────────────────────────────
  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    setError('');
    try {
      const body = {
        controlNumber: controlNumber.trim(),
        answers:       finalAnswers,
        ...(phase === 'preregform' || preReg.name ? { preRegData: preReg } : {}),
      };
      const res  = await fetch(`${BACKEND_URL}/api/archetype/submit`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResult(data);
      setPhase('result');
    } catch (err) {
      setError(err.message || 'Error al guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Responder pregunta ───────────────────────────────────────────────────────
  const handleAnswer = (letter) => {
    const newAnswers = [...answers, letter];
    setAnswers(newAnswers);
    if (newAnswers.length < QUESTIONS.length) {
      setCurrentQ(q => q + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const progress = (currentQ / QUESTIONS.length) * 100;

  // ── Estilos comunes ──────────────────────────────────────────────────────────
  const card = {
    background: 'white',
    borderRadius: isMobile ? 16 : 24,
    padding: isMobile ? '24px 20px' : '40px 44px',
    width: '100%',
    maxWidth: isMobile ? '100%' : 540,
    boxShadow: '0 24px 60px rgba(0,0,0,.15)',
    position: 'relative',
    margin: isMobile ? '0' : 'auto',
  };

  const btn = (color = '#3b6cf7') => ({
    width: '100%', padding: '13px 0',
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    border: 'none', borderRadius: 12, color: 'white',
    fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15,
    cursor: 'pointer', marginTop: 8,
    boxShadow: `0 4px 16px ${color}44`,
  });

  const optionBtn = (letter, selected) => ({
    width: '100%', padding: isMobile ? '12px 14px' : '14px 18px',
    background: selected ? '#eef2ff' : 'white',
    border: `1.5px solid ${selected ? '#3b6cf7' : '#e8edf5'}`,
    borderRadius: 12, cursor: 'pointer', textAlign: 'left',
    fontFamily: "'DM Sans',sans-serif", fontSize: isMobile ? 13 : 14,
    color: selected ? '#3b6cf7' : '#1a2744', marginBottom: 10,
    display: 'flex', alignItems: 'flex-start', gap: 12,
    transition: 'all .15s',
  });

  // ── Overlay ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,15,40,.6)',
      zIndex: 3000, display: 'flex', alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center', padding: isMobile ? 0 : 20,
      overflowY: 'auto',
    }}>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .surv-card { animation: slideUp .3s ease; }
      `}</style>

      <div className="surv-card" style={{
        ...card,
        borderRadius: isMobile ? '20px 20px 0 0' : 24,
        maxHeight: isMobile ? '92vh' : 'none',
        overflowY: 'auto',
      }}>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: '#f4f7ff', border: 'none', borderRadius: '50%',
          width: 34, height: 34, cursor: 'pointer', color: '#8898b3',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>✕</button>

        {/* ── FASE: Ingresar número de control ── */}
        {phase === 'check' && (
          <div>
            <div style={{ fontSize: isMobile ? 36 : 44, textAlign: 'center', marginBottom: 12 }}>🧬</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 22 : 26, color: '#1a2744', textAlign: 'center', marginBottom: 8 }}>
              Conoce tu arquetipo
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#8898b3', textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
              10 preguntas para descubrir cómo aprendes mejor y personalizar tu asistente AURA.
            </p>
            <form onSubmit={handleCheck}>
              <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: '#1a2744', marginBottom: 6 }}>
                Número de control
              </label>
              <input
                value={controlNumber}
                onChange={e => setControlNumber(e.target.value)}
                placeholder="Ej: 22371061"
                maxLength={10}
                required
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f5', borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#1a2744', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
              />
              {error && <p style={{ color: '#dc2626', fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>{error}</p>}
              <button type="submit" disabled={loading} style={btn()}>
                {loading ? 'Verificando...' : 'Continuar →'}
              </button>
            </form>
          </div>
        )}

        {/* ── FASE: Pre-registro (no está en BD) ── */}
        {phase === 'preregform' && (
          <div>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>📋</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 20 : 24, color: '#1a2744', textAlign: 'center', marginBottom: 8 }}>
              Tu número no está registrado
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#8898b3', textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>
              Puedes hacer el cuestionario ahora. El coordinador completará tu registro después con tu arquetipo ya asignado.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'name',     label: 'Nombre completo', placeholder: 'Tu nombre completo',    type: 'text'   },
                { key: 'email',    label: 'Correo',          placeholder: 'tu@correo.com',         type: 'email'  },
                { key: 'career',   label: 'Carrera',         placeholder: 'Ej: Ingeniería en TICs', type: 'text'  },
                { key: 'semester', label: 'Semestre',        placeholder: 'Ej: 4',                 type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, color: '#1a2744', marginBottom: 4 }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={preReg[f.key]}
                    onChange={e => setPreReg(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f5', borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#1a2744', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginTop: 8 }}>{error}</p>}
            <button onClick={() => preReg.name && preReg.career && setPhase('welcome')} style={btn()}>
              Continuar al cuestionario →
            </button>
            <button onClick={() => setPhase('check')} style={{ ...btn('#8898b3'), background: 'none', color: '#8898b3', boxShadow: 'none', border: '1.5px solid #e2e8f5' }}>
              ← Volver
            </button>
          </div>
        )}

        {/* ── FASE: Bienvenida ── */}
        {phase === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✨</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 22 : 28, color: '#1a2744', marginBottom: 12 }}>
              ¡Hola, {(studentName || preReg.name).split(' ')[0]}!
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#6b7fa3', lineHeight: 1.7, marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>
              Estás a punto de descubrir tu <strong>arquetipo de aprendizaje</strong>. Son 10 preguntas rápidas — no hay respuestas correctas o incorrectas, solo elige lo que más te identifique.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 12 : 20, marginBottom: 28, flexWrap: 'wrap' }}>
              {Object.entries(ARCHETYPES).map(([key, a]) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: isMobile ? 28 : 36 }}>{a.emoji}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#8898b3', marginTop: 4 }}>{a.name}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase('quiz')} style={btn()}>
              Comenzar cuestionario →
            </button>
          </div>
        )}

        {/* ── FASE: Quiz ── */}
        {phase === 'quiz' && !loading && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#8898b3' }}>
                  Pregunta {currentQ + 1} de {QUESTIONS.length}
                </span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: '#3b6cf7' }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={{ background: '#f0f4ff', borderRadius: 8, height: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#3b6cf7,#5b8ff9)', borderRadius: 8, width: `${progress}%`, transition: 'width .4s ease' }}/>
              </div>
            </div>

            {/* Question */}
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: isMobile ? 15 : 16, color: '#1a2744', lineHeight: 1.6, marginBottom: 20 }}>
              {QUESTIONS[currentQ].q}
            </p>

            {/* Options */}
            {Object.entries(QUESTIONS[currentQ].options).map(([letter, text]) => (
              <button key={letter} onClick={() => handleAnswer(letter)} style={optionBtn(letter, false)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b6cf7'; e.currentTarget.style.background = '#f4f7ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.background = 'white'; }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0f4ff', color: '#3b6cf7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {letter}
                </span>
                <span style={{ lineHeight: 1.5 }}>{text}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── FASE: Cargando resultado ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #f0f4ff', borderTopColor: '#3b6cf7', animation: 'spin .8s linear infinite', margin: '0 auto 20px' }}/>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#8898b3' }}>Analizando tu perfil...</p>
          </div>
        )}

        {/* ── FASE: Ya tiene arquetipo ── */}
        {phase === 'already_has' && existingArch && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{ARCHETYPES[existingArch.archetype]?.emoji}</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 20 : 24, color: '#1a2744', marginBottom: 8 }}>
              Ya tienes arquetipo asignado
            </h2>
            <div style={{ background: ARCHETYPES[existingArch.archetype]?.bg, borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 18, color: ARCHETYPES[existingArch.archetype]?.color }}>
                {ARCHETYPES[existingArch.archetype]?.name} — {ARCHETYPES[existingArch.archetype]?.animal}
              </div>
            </div>
            {canRetake ? (
              <>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#6b7fa3', marginBottom: 20, lineHeight: 1.6 }}>
                  Estás en un nuevo semestre, puedes volver a hacer el cuestionario para actualizar tu perfil.
                </p>
                <button onClick={() => setPhase('welcome')} style={btn(ARCHETYPES[existingArch.archetype]?.accent)}>
                  Rehacer cuestionario →
                </button>
              </>
            ) : (
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#6b7fa3', lineHeight: 1.6 }}>
                Podrás rehacerlo el próximo semestre desde <strong>Configuración</strong>.
              </p>
            )}
            <button onClick={onClose} style={{ ...btn('#8898b3'), background: 'none', color: '#8898b3', boxShadow: 'none', border: '1.5px solid #e2e8f5', marginTop: 10 }}>
              Cerrar
            </button>
          </div>
        )}

        {/* ── FASE: Resultado ── */}
        {phase === 'result' && result && (() => {
          const arch = ARCHETYPES[result.archetype];
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 8, animation: 'fadeIn .5s ease' }}>{arch.emoji}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: arch.accent, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                Tu arquetipo es
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 28 : 34, color: arch.color, marginBottom: 4 }}>
                {arch.name}
              </h2>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#8898b3', marginBottom: 20 }}>
                {arch.animal}
              </div>

              <div style={{ background: arch.bg, borderRadius: 16, padding: isMobile ? '16px' : '20px 24px', marginBottom: 20, textAlign: 'left' }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: arch.color, lineHeight: 1.7, margin: 0 }}>
                  {arch.description}
                </p>
              </div>

              <div style={{ background: '#f8faff', borderRadius: 12, padding: '14px 18px', marginBottom: 24, textAlign: 'left', border: '1px solid #e8edf5' }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: '#3b6cf7', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .5 }}>
                  🤖 Cómo se adaptará tu asistente
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#6b7fa3', margin: 0, lineHeight: 1.6 }}>
                  {arch.chatStyle}
                </p>
              </div>

              {result.isPreRegistered && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#92400e', margin: 0, lineHeight: 1.6 }}>
                    📋 Tu arquetipo fue guardado. El coordinador completará tu registro con tus datos académicos y podrás iniciar sesión pronto.
                  </p>
                </div>
              )}

              <button onClick={onClose} style={btn(arch.accent)}>
                {result.isPreRegistered ? 'Entendido' : '¡Listo, iniciar sesión →'}
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default ArchetypeSurvey;
