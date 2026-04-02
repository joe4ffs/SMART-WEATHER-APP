import styles from "../styles/theme";

function NearbyPanel({ areas, onSelect }) {
  if (!areas || areas.length === 0) return null;
  return (
    <div style={styles.glassCard}>
      <div style={{ fontSize:14, fontWeight:600, marginBottom:12, opacity:0.8 }}>📍 Nearby Areas</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {areas.map((area, i) => (
          <button key={i} onClick={() => onSelect(area)}
            style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 14px", fontSize:13, color:"#e2e8f0", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"background .2s" }}
            onMouseEnter={e => e.target.style.background="rgba(255,255,255,0.14)"}
            onMouseLeave={e => e.target.style.background="rgba(255,255,255,0.07)"}
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}

export default NearbyPanel;