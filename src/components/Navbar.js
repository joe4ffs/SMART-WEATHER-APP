import { useState, useEffect, useRef } from "react";
import styles from "../styles/theme";

function TypewriterText({ text, accent }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;
    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={{
      fontFamily:"'DM Sans',sans-serif",
      fontSize:17,
      fontWeight:500,
      color:"rgba(255,255,255,0.6)",
      letterSpacing:"0.01em",
      whiteSpace:"nowrap",
    }}>
      {displayed}
      {!done && (
        <span style={{
          display:"inline-block",
          width:2, height:"0.85em",
          background: accent,
          marginLeft:2,
          verticalAlign:"middle",
          animation:"blink .65s step-end infinite",
        }}/>
      )}
    </span>
  );
}

function Navbar({ accent, sMeta, activeView, setActiveView }) {
  return (
    <>
      {/* Load Playfair Display for the brand name */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap"
      />

      <nav style={{ ...styles.navbar, position:"relative" }}>

        {/* LEFT — WeatherX brand */}
        <div style={styles.navBrand}>
          <span style={{ ...styles.navIcon, color:accent }}>◈</span>
          <span style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:22,
            fontWeight:700,
            letterSpacing:"0.5px",
            background:`linear-gradient(135deg, #ffffff 30%, ${accent})`,
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
          }}>
            WeatherX
          </span>
          {sMeta && (
            <div style={{
              ...styles.seasonBadge,
              background:sMeta.color+"22",
              color:sMeta.color,
              borderColor:sMeta.color+"44",
              marginLeft:10,
            }}>
              {sMeta.label}
            </div>
          )}
        </div>

        {/* CENTER — typewriter */}
        <div style={{
          position:"absolute",
          left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          pointerEvents:"none",
        }}>
          <TypewriterText
            text="Live weather. Check yours and stay safe!"
            accent={accent}
          />
        </div>

        {/* RIGHT — nav links */}
        <div style={styles.navLinks}>
          {["Current","Forecast","Maps"].map(l => (
            <span
              key={l}
              className="nav-link"
              onClick={() => setActiveView(l)}
              style={{
                ...styles.navLink,
                opacity: activeView === l ? 1 : 0.5,
                color: activeView === l ? accent : "inherit",
                borderBottom: activeView === l ? `2px solid ${accent}` : "2px solid transparent",
                paddingBottom: 4,
                cursor:"pointer",
              }}
            >
              {l}
            </span>
          ))}
        </div>

      </nav>
    </>
  );
}

export default Navbar;