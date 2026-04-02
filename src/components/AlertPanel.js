import styles from "../styles/theme";
import { ALERT_COLORS } from "../utils/alertAnalyzer";

function AlertPanel({ alerts }) {
  if (!alerts || alerts.length === 0) return (
    <div style={styles.glassCard}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:20 }}>✅</span>
        <div>
          <div style={{ fontSize:13, fontWeight:600 }}>No severe weather alerts</div>
          <div style={{ fontSize:12, opacity:0.45, marginTop:2 }}>Conditions look calm for the next 3 days</div>
        </div>
      </div>
    </div>
  );

  const dangerCount = alerts.filter(a => a.level === "danger").length;
  const headerColor = dangerCount > 0 ? "#fca5a5" : "#fcd34d";

  return (
    <div style={{ ...styles.glassCard, border:`1px solid ${dangerCount > 0 ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:18 }}>{dangerCount > 0 ? "🚨" : "⚠️"}</span>
        <span style={{ fontSize:14, fontWeight:700, color: headerColor }}>
          {dangerCount > 0 ? `${dangerCount} Severe Alert${dangerCount>1?"s":""}` : "Weather Alerts"}
        </span>
        <span style={{ fontSize:11, opacity:0.45, marginLeft:"auto" }}>{alerts.length} total</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {alerts.map((a, i) => {
          const c = ALERT_COLORS[a.level];
          return (
            <div key={i} style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{a.icon}</span>
              <span style={{ fontSize:13, color:c.text, fontWeight:500 }}>{a.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AlertPanel;