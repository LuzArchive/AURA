import Icon from '../../components/Icon/Icon';

const LifePlan = () => (
  <div style={{ padding: "28px 32px", display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon name="target" size={32} />
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#1a2744", margin: "0 0 8px" }}>Plan de Vida</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#8898b3" }}>Esta sección estará disponible próximamente.</p>
    </div>
  </div>
);

export default LifePlan;
