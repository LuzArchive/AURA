import { useState, useEffect, useRef } from 'react';
import Icon from '../../components/Icon/Icon';
import { tutor, student, chatMessages } from '../../data/mockData';

const Chat = () => {
  const [msgs, setMsgs] = useState(chatMessages);
  const [input, setInput]   = useState("");
  const endRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, {
      id: Date.now(),
      from: "student",
      text: input,
      time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setInput("");
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  return (
    <div style={{ padding: "28px 32px", height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, background: "white", borderRadius: 16, border: "1px solid #e8edf5", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e8edf5", display: "flex", alignItems: "center", gap: 12 }}>
          <img src={tutor.avatar} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#1a2744" }}>{tutor.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8898b3" }}>En línea</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14, background: "#f9fafc" }}>
          {msgs.map(m => {
            const isMe = m.from === "student";
            return (
              <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end" }}>
                {!isMe && <img src={tutor.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />}
                <div>
                  <div style={{ maxWidth: 360, padding: "10px 14px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: isMe ? "linear-gradient(135deg,#3b6cf7,#5b8ff9)" : "white", color: isMe ? "white" : "#1a2744", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, boxShadow: "0 1px 4px rgba(0,0,0,.06)", border: isMe ? "none" : "1px solid #e8edf5" }}>
                    {m.file
                      ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="paperclip" size={14} /><span style={{ textDecoration: "underline", cursor: "pointer" }}>{m.text}</span></div>
                      : m.text
                    }
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#b0bcd4", marginTop: 3, textAlign: isMe ? "right" : "left" }}>{m.time}</div>
                </div>
                {isMe && <img src={student.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #e8edf5", display: "flex", gap: 10, alignItems: "center" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Escribe un mensaje..."
            style={{ flex: 1, padding: "10px 16px", borderRadius: 24, border: "1.5px solid #e8edf5", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", color: "#1a2744", background: "#f9fafc" }} />
          <button onClick={send} style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#3b6cf7,#5b8ff9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
