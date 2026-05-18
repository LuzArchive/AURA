import { useState, useRef, useEffect, useCallback } from 'react';
import { buildSystemPrompt } from '../../services/chatbotPrompt';
import { useIsMobile } from '../../hooks/useIsMobile';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';
const REQUEST_TIMEOUT_MS = 35_000;

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const BotIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
  </svg>
);

const TypingDots = () => (
  <span style={{ display:'inline-flex', gap:3, alignItems:'center', height:16 }}>
    {[0,1,2].map(i => (
      <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#8898b3', display:'inline-block', animation:'chatbotBounce 1.2s infinite', animationDelay:`${i*0.2}s` }}/>
    ))}
  </span>
);

const Bubble = ({ msg }) => {
  const isBot = msg.from === 'bot';
  return (
    <div style={{ display:'flex', justifyContent:isBot?'flex-start':'flex-end', marginBottom:10, alignItems:'flex-end', gap:6 }}>
      {isBot && (
        <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#3b6cf7,#5b8ff9)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'white' }}>
          <BotIcon size={14}/>
        </div>
      )}
      <div style={{ maxWidth:'80%', padding:'10px 13px', borderRadius:isBot?'16px 16px 16px 4px':'16px 16px 4px 16px', background:isBot?(msg.isError?'#fff0f0':'#f0f4ff'):'linear-gradient(135deg,#3b6cf7,#5b8ff9)', color:isBot?(msg.isError?'#c0392b':'#1a2744'):'white', fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.65, whiteSpace:'pre-wrap', boxShadow:'0 1px 3px rgba(0,0,0,.07)' }}>
        {msg.loading ? <TypingDots/> : msg.text}
      </div>
    </div>
  );
};

const CHIPS = ['¿Cuántos créditos me faltan?','¿Cuándo es mi próxima tutoría?','¿Cómo contacto a mi tutor?'];

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(url, { ...options, signal:controller.signal }); }
  finally { clearTimeout(timer); }
}

function humanizeError(err, status) {
  if (err?.name === 'AbortError') return '⏱️ El servidor tardó demasiado. Intenta de nuevo.';
  if (!navigator.onLine)          return '📶 Sin conexión a internet.';
  if (status === 429) return '⚠️ Demasiadas solicitudes. Espera un momento.';
  if (status >= 500)  return '🔧 Error en el servidor. Intenta más tarde.';
  return '⚠️ Error al contactar al servidor. Intenta de nuevo.';
}

const ChatbotWidget = ({ studentName = 'estudiante' }) => {
  const firstName = studentName.split(' ')[0];
  const isMobile  = useIsMobile();

  const makeWelcome = useCallback(() => ({
    id:'welcome', from:'bot',
    text:`Hola ${firstName} 👋\nSoy tu asistente de tutorías\n\n¿En qué puedo ayudarte?\n\n• Revisar créditos\n• Agendar tutoría\n• Contactar tutor`,
  }), [firstName]);

  const [open,         setOpen]         = useState(false);
  const [msgs,         setMsgs]         = useState(() => [makeWelcome()]);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [unread,       setUnread]       = useState(0);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [promptReady,  setPromptReady]  = useState(false);

  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    buildSystemPrompt()
      .then(p => { setSystemPrompt(p); setPromptReady(true); })
      .catch(() => { setSystemPrompt('Eres un asistente de tutorías universitarias. Responde en español.'); setPromptReady(true); });
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 120); setUnread(0); }
  }, [open]);

  const handleReset = useCallback(() => { setOpen(false); setMsgs([makeWelcome()]); }, [makeWelcome]);

  const sendMessage = async (textOverride) => {
    const userText = (textOverride ?? input).trim();
    if (!userText || loading) return;
    setInput('');
    const userMsg = { id:Date.now(), from:'user', text:userText };
    const loadMsg = { id:'loading', from:'bot', text:'', loading:true };
    setMsgs(prev => [...prev, userMsg, loadMsg]);
    setLoading(true);
    const history = [...msgs, userMsg].filter(m => m.id!=='welcome' && !m.loading && !m.isError).map(m => ({ role:m.from==='user'?'user':'assistant', content:m.text }));
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/chat/chat`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ messages:history, system:systemPrompt }) }, REQUEST_TIMEOUT_MS);
      let data = {};
      try { data = await res.json(); } catch{}
      if (!res.ok) throw Object.assign(new Error(data?.error || humanizeError(null, res.status)), { status:res.status });
      const reply = data?.content?.[0]?.text;
      if (!reply) throw new Error('El servidor no devolvió respuesta.');
      setMsgs(prev => [...prev.filter(m=>m.id!=='loading'), { id:Date.now()+1, from:'bot', text:reply }]);
      if (!open) setUnread(u => u+1);
    } catch(err) {
      const text = err.name==='AbortError' || !err.status ? humanizeError(err) : (err.message || humanizeError(err, err.status));
      setMsgs(prev => [...prev.filter(m=>m.id!=='loading'), { id:Date.now()+1, from:'bot', text, isError:true }]);
    } finally { setLoading(false); }
  };

  const isSendDisabled = loading || !input.trim() || !promptReady;

  // En móvil el chat ocupa toda la pantalla cuando está abierto
  const chatStyle = isMobile
    ? { position:'fixed', inset:0, zIndex:1001, background:'white', display:'flex', flexDirection:'column', animation:'chatbotFadeUp .2s ease' }
    : { width:360, height:520, background:'white', borderRadius:20, boxShadow:'0 8px 40px rgba(59,108,247,.18), 0 2px 12px rgba(0,0,0,.1)', display:'flex', flexDirection:'column', overflow:'hidden', animation:'chatbotFadeUp .25s ease', border:'1px solid #e8edf5' };

  return (
    <>
      <style>{`
        @keyframes chatbotBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes chatbotFadeUp { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes chatbotPulse  { 0%,100%{box-shadow:0 4px 20px rgba(59,108,247,.45)} 50%{box-shadow:0 4px 32px rgba(59,108,247,.7)} }
      `}</style>

      <div style={{ position:'fixed', bottom: isMobile?0:28, right: isMobile?0:28, zIndex:1000 }}>

        {/* FAB */}
        {!open && (
          <button onClick={()=>setOpen(true)} style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#3b6cf7,#5b8ff9)', border:'none', cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center', animation:'chatbotPulse 2.5s ease-in-out infinite', transition:'transform .15s', position:'relative' }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            <BotIcon size={24}/>
            {unread > 0 && <span style={{ position:'absolute', top:0, right:0, width:18, height:18, borderRadius:'50%', background:'#e74c3c', border:'2px solid white', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:"'DM Sans',sans-serif" }}>{unread>9?'9+':unread}</span>}
          </button>
        )}

        {/* Ventana de chat */}
        {open && (
          <div style={chatStyle}>

            {/* Header */}
            <div style={{ padding:'14px 18px', background:'linear-gradient(135deg,#1a3a8f,#3b6cf7)', display:'flex', alignItems:'center', gap:10, flexShrink:0,
              // En móvil agrega padding top para el notch/status bar
              paddingTop: isMobile ? 'max(14px, env(safe-area-inset-top))' : '14px',
            }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', flexShrink:0 }}>
                <BotIcon size={18}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:'white' }}>Asistente de Tutorías</div>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:promptReady?'#4ade80':'#facc15' }}/>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.8)' }}>{promptReady?'En línea':'Cargando datos...'}</span>
                </div>
              </div>
              <button onClick={()=>setOpen(false)} title="Minimizar" style={{ background:'rgba(255,255,255,.15)', border:'none', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'white' }}>
                <MinimizeIcon/>
              </button>
              <button onClick={handleReset} title="Cerrar y reiniciar" style={{ background:'rgba(255,255,255,.15)', border:'none', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'white' }}>
                <CloseIcon/>
              </button>
            </div>

            {/* Mensajes */}
            <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', background:'#f9fafc', display:'flex', flexDirection:'column' }}>
              {msgs.map(m => <Bubble key={m.id} msg={m}/>)}
              <div ref={endRef}/>
            </div>

            {/* Chips */}
            {msgs.length <= 2 && (
              <div style={{ padding:'8px 14px 0', background:'#f9fafc', display:'flex', gap:6, flexWrap:'wrap' }}>
                {CHIPS.map(chip => (
                  <button key={chip} onClick={()=>sendMessage(chip)} disabled={loading||!promptReady}
                    style={{ padding:'5px 11px', borderRadius:20, border:'1.5px solid #c7d4ff', background:'white', color:'#3b6cf7', fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap', opacity:loading||!promptReady?0.5:1 }}>
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding:'10px 14px', background:'white', borderTop:'1px solid #e8edf5', display:'flex', gap:8, alignItems:'center',
              paddingBottom: isMobile ? 'max(14px, env(safe-area-inset-bottom))' : '14px',
            }}>
              <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}}
                placeholder={promptReady?'Escribe tu pregunta...':'Cargando...'}
                disabled={loading||!promptReady}
                style={{ flex:1, padding:'9px 14px', borderRadius:20, border:'1.5px solid #e8edf5', fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:'none', color:'#1a2744', background:'#f9fafc', opacity:promptReady?1:0.6 }}
                onFocus={e=>e.target.style.borderColor='#3b6cf7'} onBlur={e=>e.target.style.borderColor='#e8edf5'}
              />
              <button onClick={()=>sendMessage()} disabled={isSendDisabled}
                style={{ width:36, height:36, borderRadius:'50%', background:isSendDisabled?'#e8edf5':'linear-gradient(135deg,#3b6cf7,#5b8ff9)', border:'none', cursor:isSendDisabled?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:isSendDisabled?'#b0bcd4':'white', flexShrink:0 }}>
                <SendIcon/>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatbotWidget;
