import { useState } from 'react';
import Icon from '../../components/Icon/Icon';
import { sessions } from '../../data/mockData';

const statusStyle = {
  proxima:    { bg: "#eef2ff", color: "#3b6cf7", label: "Próxima"    },
  programada: { bg: "#fef9ec", color: "#d97706", label: "Programada" },
  completada: { bg: "#f0fdf4", color: "#16a34a", label: "Completada" },
};

const Sessions = () => {
  const [filter, setFilter] = useState("todas");
  const filtered = filter === "todas" ? sessions : sessions.filter(s => s.status === filter);

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {["todas", "proxima", "programada", "completada"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "8px 18px", borderRadius: 20, border: "1.5px solid", borderColor: filter === f ? "#3b6cf7" : "#e8edf5", background: filter === f ? "#3b6cf7" : "white", color: filter === f ? "white" : "#6b7fa3", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            {f === "todas" ? "Todas" : statusStyle[f]?.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(s => {
          const ss = statusStyle[s.status];
          return (
            <div key={s.id} style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #e8edf5", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="calendar" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, color: "#1a2744" }}>{s.title}</span>
                  <span style={{ padding: "2px 10px", borderRadius: 20, background: ss?.bg, color: ss?.color, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}>{ss?.label}</span>
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  {[{ icon: "calendar", t: s.date }, { icon: "clock", t: s.time }, { icon: "mapPin", t: s.room }].map(x => (
                    <div key={x.icon} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name={x.icon} size={12} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8898b3" }}>{x.t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <span style={{ padding: "4px 12px", borderRadius: 20, background: "#f4f7ff", color: "#6b7fa3", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{s.type}</span>
              {s.status !== "completada"
                ? <button style={{ padding: "8px 16px", background: "linear-gradient(135deg,#3b6cf7,#5b8ff9)", border: "none", borderRadius: 8, color: "white", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Ver Detalles</button>
                : <button style={{ padding: "8px 16px", background: "white", border: "1.5px solid #e8edf5", borderRadius: 8, color: "#6b7fa3", fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>Ver Resumen</button>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sessions;
