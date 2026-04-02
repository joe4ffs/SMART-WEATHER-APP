import styles from "../../styles/theme";
import StatPill     from "../StatPill";
import AlertPanel   from "../AlertPanel";
import NearbyPanel  from "../NearbyPanel";
import SunBar       from "../SunBar";
import HourlyCharts from "../HourlyCharts";
import ForecastRow  from "../ForecastRow";

function CurrentView({ weather, city, cur, condDesc, icon, accent, name, isFav, toggleFavorite, alerts, nearbyAreas, getWeather, omHourly, wttrHourly, days }) {
  const todayAstro = weather?.weather?.[0]?.astronomy?.[0];

  return (
    <div style={styles.content}>

      {/* ── Main weather card ── */}
      <div style={{ ...styles.mainCard, animation:"fadeUp .5s ease both" }}>
        <div style={styles.cardTopRow}>
          <div>
            <div style={styles.cityName}>{city}</div>
            <div style={{ ...styles.conditionBadge, background:accent+"22", color:accent }}>
              {icon} {name}
            </div>
          </div>
          <button
            onClick={toggleFavorite}
            style={{ ...styles.favBtn, background:isFav?accent+"30":"rgba(255,255,255,0.07)", color:isFav?accent:"#94a3b8" }}
          >
            {isFav ? "★" : "☆"}
          </button>
        </div>

        <div style={styles.tempRow}>
          <span style={styles.bigIcon}>{icon}</span>
          <span style={{ ...styles.tempNum, color:accent }}>{cur?.temp_C}</span>
          <span style={{ ...styles.tempSup, color:accent }}>°</span>
          <span style={styles.tempUnit}>C</span>
        </div>
        <div style={styles.feelsLike}>Feels like {cur?.FeelsLikeC}°C · {condDesc}</div>

        <div style={styles.statsGrid}>
          <StatPill icon="💧" label="Humidity"   value={`${cur?.humidity}%`} />
          <StatPill icon="💨" label="Wind"       value={`${cur?.windspeedKmph} km/h`} />
          <StatPill icon="☀️" label="UV Index"   value={cur?.uvIndex ?? "—"} />
          <StatPill icon="👁️" label="Visibility" value={`${cur?.visibility} km`} />
          <StatPill icon="🌡️" label="Dew Point"  value={`${cur?.DewPointC}°C`} />
          <StatPill icon="🧭" label="Wind Dir"   value={cur?.winddir16Point} />
        </div>
      </div>

      {/* ── Alerts ── */}
      <div style={{ animation:"fadeUp .5s .06s ease both" }}>
        <AlertPanel alerts={alerts} />
      </div>

      {/* ── Nearby ── */}
      <div style={{ animation:"fadeUp .5s .1s ease both" }}>
        <NearbyPanel areas={nearbyAreas} onSelect={getWeather} />
      </div>

      {/* ── Sun / Moon ── */}
      <div style={{ ...styles.glassCard, animation:"fadeUp .5s .14s ease both" }}>
        <SunBar
          sunrise={todayAstro?.sunrise}
          sunset={todayAstro?.sunset}
          moonPhase={todayAstro?.moon_phase}
          moonIllum={todayAstro?.moon_illumination}
        />
      </div>

      {/* ── Charts — Open-Meteo preferred, wttr fallback ── */}
      <HourlyCharts omHourly={omHourly} wttrHourly={wttrHourly} accent={accent} />

      {/* ── 3-day forecast ── */}
      <ForecastRow weatherDays={weather.weather} days={days} accent={accent} />

    </div>
  );
}

export default CurrentView;