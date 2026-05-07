import Icon from '../../components/Icon/Icon';
import { sessions } from '../../data/mockData';

const Calendar = () => {
  const days   = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const events = [12, 19];
  const today  = 7;
  const cells  = Array.from({ length: 31 }, (_, i) => i + 1);
  const offset = 6; // March 2026 starts on Sunday

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

        {/* Calendar grid */}
        <div style={{ background: "white", borderRadius: 16, padding: "24px", border: "1px solid #e8edf5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#1a2744", margin: 0 }}>Marzo 2026</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8edf5", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="chevronLeft" size={16} />
              </button>
              <button style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8edf5", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="chevronRight" size={16} />
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
            {days.map(d => <div key={d} style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#8898b3", padding: "4px 0" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {cells.map(d => {
              const isToday   = d === today;
              const hasEvent  = events.includes(d);
              return (
                <div key={d} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 10, background: isToday ? "linear-gradient(135deg,#3b6cf7,#5b8ff9)" : hasEvent ? "#eef2ff" : "transparent", cursor: "pointer" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: isToday ? 700 : 400, color: isToday ? "white" : hasEvent ? "#3b6cf7" : "#6b7fa3" }}>{d}</span>
                  {hasEvent && !isToday && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b6cf7", marginTop: 2 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div style={{ background: "white", borderRadius: 16, padding: "24px", border: "1px solid #e8edf5" }}>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, color: "#1a2744", marginBottom: 16, marginTop: 0 }}>Próximas Sesiones</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.filter(s => s.status !== "completada").map(s => (
              <div key={s.id} style={{ padding: "14px 16px", background: "#f4f7ff", borderRadius: 12, borderLeft: "3px solid #3b6cf7" }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, color: "#1a2744", marginBottom: 4 }}>{s.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Icon name="calendar" size={12} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8898b3" }}>{s.date}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="clock" size={12} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8898b3" }}>{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
