import styles from "../styles/theme";
import { moonPhaseIcon } from "../utils/moonUtils";
import { parseTime } from "../utils/timeUtils";

function SunBar({ sunrise, sunset, moonPhase, moonIllum }) {
  if (!sunrise || !sunset) return null;

  const now       = new Date();
  const nowMins   = now.getHours()*60 + now.getMinutes();
  const riseMins  = parseTime(sunrise);
  const setMins   = parseTime(sunset);
  const totalDay  = setMins - riseMins;
  const pct       = Math.min(100, Math.max(0, ((nowMins-riseMins)/totalDay)*100));
  const isDaytime = nowMins >= riseMins && nowMins <= setMins;
  const mIcon     = moonPhaseIcon(moonPhase || "");
  const mIllumNum = parseInt(moonIllum || "0");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <div style={styles.sunBarHeader}>
          <span style={{ fontSize:13, fontWeight:600 }}>
            {isDaytime ? "🌅 Sun Position" : "🌙 Night — Sun below horizon"}
          </span>
          <span style={{ fontSize:12, opacity:0.45 }}>
            {isDaytime ? `${Math.round(pct)}% through the day` : `Next sunrise: ${sunrise}`}
          </span>
        </div>
        <div style={styles.sunBarTrack}>
          <div style={{
            position:"absolute", left:0, top:0, bottom:0,
            width: isDaytime ? `${pct}%` : "100%",
            background: isDaytime
              ? "linear-gradient(90deg,#f59e0b33,#f9731688)"
              : "linear-gradient(90deg,#0f172a,#1e3a5f)",
            borderRadius:99, transition:"width 1s ease",
          }}/>
          {!isDaytime && [20,40,60,80].map(pos => (
            <div key={pos} style={{ position:"absolute", left:`${pos}%`, top:"50%", transform:"translateY(-50%)", width:3, height:3, borderRadius:"50%", background:"rgba(186,230,253,0.5)" }}/>
          ))}
          <div style={{
            position:"absolute", top:"50%",
            left: isDaytime ? `${pct}%` : "98%",
            transform:"translate(-50%,-50%)",
            width:28, height:28, borderRadius:"50%",
            background: isDaytime ? "#f59e0b" : "#0f172a",
            border: isDaytime ? "none" : "2px solid #93c5fd",
            boxShadow: isDaytime ? "0 0 16px #f59e0b,0 0 32px #f59e0b80" : "0 0 16px #93c5fd80",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, zIndex:2,
          }}>
            {isDaytime ? "☀️" : "🌙"}
          </div>
        </div>
        <div style={styles.sunBarLabels}>
          <span>🌄 {sunrise}</span>
          <span>🌇 {sunset}</span>
        </div>
      </div>

      <div style={styles.moonRow}>
        <div style={styles.moonLeft}>
          <span style={{ fontSize:36, lineHeight:1 }}>{mIcon}</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600 }}>{moonPhase || "—"}</div>
            <div style={{ fontSize:11, opacity:0.4, marginTop:2 }}>Current Moon Phase</div>
          </div>
        </div>
        <div style={styles.moonRight}>
          <div style={{ fontSize:11, opacity:0.4, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>Illumination</div>
          <div style={styles.moonTrack}>
            <div style={{ height:"100%", width:`${mIllumNum}%`, background:"linear-gradient(90deg,#93c5fd,#e0f2fe)", borderRadius:99 }}/>
          </div>
          <div style={{ fontSize:13, fontWeight:700, marginTop:5, color:"#93c5fd" }}>{mIllumNum}%</div>
        </div>
      </div>
    </div>
  );
}

export default SunBar;