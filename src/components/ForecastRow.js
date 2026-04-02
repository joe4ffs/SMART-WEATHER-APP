import styles from "../styles/theme";
import conditionMap from "../utils/conditionMap";

function ForecastRow({ weatherDays, days, accent }) {
  if (!weatherDays) return null;
  return (
    <div style={{ ...styles.forecastRow, animation:"fadeUp .5s .26s ease both" }}>
      {weatherDays.slice(0,3).map((day, i) => {
        const dDesc = day.hourly?.[4]?.weatherDesc?.[0]?.value || "";
        const { icon: dIcon, accent: dAccent } = conditionMap(dDesc);
        return (
          <div key={i} style={{ ...styles.forecastCard, borderColor: i===0 ? accent+"40" : "rgba(255,255,255,0.07)" }}>
            <div style={styles.forecastDay}>{days[i]}</div>
            <div style={styles.forecastIcon}>{dIcon}</div>
            <div style={{ ...styles.forecastTemp, color:dAccent }}>{day.avgtempC}°C</div>
            <div style={styles.forecastDesc}>{dDesc}</div>
            <div style={styles.forecastMinMax}>
              <span style={{ color:"#60a5fa" }}>↓{day.mintempC}°</span>
              <span style={{ color:"#f87171" }}>↑{day.maxtempC}°</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ForecastRow;