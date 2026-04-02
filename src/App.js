import './App.css';
import { useState } from "react";
import useWeather         from './hooks/useWeather';
import { parseOMHourly }  from './hooks/useWeather';
import conditionMap       from './utils/conditionMap';
import { getSeason, seasonMeta } from './utils/seasonUtils';
import { analyzeAlerts }  from './utils/alertAnalyzer';
import { getUpcomingDays } from './utils/timeUtils';
import styles from './styles/theme';

import WeatherCanvas  from './components/WeatherCanvas';
import Navbar         from './components/Navbar';
import SearchBar      from './components/SearchBar';
import CurrentView    from './components/views/CurrentView';
import ForecastView   from './components/views/ForecastView';
import MapView        from './components/views/MapView';

export default function App() {
  const [activeView, setActiveView] = useState("Current");

  const {
    weather, omData,
    city, loading, suggestions, setSuggestions,
    error, inputVal, latitude, longitude, timezone, nearbyAreas,
    favorites, recent,
    getWeather, getUserLocation, handleInput,
    toggleFavorite, removeFav,
  } = useWeather();

  const days       = getUpcomingDays();
  const cur        = weather?.current_condition?.[0];
  const condDesc   = cur?.weatherDesc?.[0]?.value || "";
  const todayAstro = weather?.weather?.[0]?.astronomy?.[0];
  const { icon, accent, name, type } = conditionMap(condDesc, todayAstro?.sunrise, todayAstro?.sunset, timezone);
  const season     = latitude !== null ? getSeason(latitude) : null;
  const sMeta      = season ? seasonMeta[season] : null;
  const alerts     = analyzeAlerts(weather);
  const isFav      = favorites.includes(city);

  const omHourly = parseOMHourly(omData);
  const wttrHourly = weather?.weather?.[0]?.hourly?.map(h => ({
    time:   `${String(parseInt(h.time)/100).padStart(2,"0")}:00`,
    temp:   parseInt(h.tempC),
    rain:   parseInt(h.chanceofrain),
    precip: 0,
  })) || [];

  const longitude2 = weather?.nearest_area?.[0]?.longitude
    ? parseFloat(weather.nearest_area[0].longitude) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#070d1a; font-family:'DM Sans',sans-serif; color:#e2e8f0; min-height:100vh; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
        @keyframes pulse  { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        .chip:hover    { background:rgba(255,255,255,0.14)!important; transform:translateY(-1px); }
        .nav-link:hover{ opacity:1!important; }
        .fav-x:hover   { opacity:1!important; }
        .suggest:hover { background:rgba(255,255,255,0.08)!important; }
        input { color:#e2e8f0!important; }
        input::placeholder { color:rgba(255,255,255,0.3)!important; }
        input:focus { outline:none; }
        ::-webkit-scrollbar { width:0; }
        .recharts-cartesian-axis-tick-value { fill:rgba(255,255,255,0.35); font-size:11px; }
        .recharts-tooltip-cursor { stroke:rgba(255,255,255,0.06); }
      `}</style>

      <WeatherCanvas type={type} accent={accent} />

      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,${accent}14 0%,transparent 70%)`, top:-120, left:-120, animation:"pulse 7s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,${accent}0c 0%,transparent 70%)`, bottom:-80, right:-80, animation:"pulse 9s ease-in-out infinite 2s" }}/>
      </div>

      <div style={{ position:"relative", zIndex:1, minHeight:"100vh" }}>

        <Navbar accent={accent} sMeta={sMeta} activeView={activeView} setActiveView={setActiveView} />

        {/* ── HERO ── */}
        <div style={styles.hero}>

          {/* LEFT */}
          <div style={styles.heroLeft}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {weather && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:100, fontSize:12, fontWeight:600, background:accent+"18", color:accent, border:`1px solid ${accent}30`, alignSelf:"flex-start" }}>
                  {icon} {city} · {name}
                </div>
              )}
              {(favorites.length > 0 || recent.length > 0) && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                  {favorites.map((f,i) => (
                    <span key={`fav-${i}`} className="chip" style={{ ...styles.chip, borderColor: accent+"40" }} onClick={() => getWeather(f)}>
                      ⭐ {f}<span className="fav-x" style={styles.chipX} onClick={e => removeFav(f,e)}>×</span>
                    </span>
                  ))}
                  {recent.map((r,i) => (
                    <span key={`rec-${i}`} className="chip" style={{ ...styles.chip, opacity:0.55 }} onClick={() => getWeather(r)}>{r}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — search */}
          <div style={styles.heroRight}>
            <div style={{ position:"relative" }}>
              <SearchBar
                inputVal={inputVal}
                handleInput={handleInput}
                getWeather={getWeather}
                getUserLocation={getUserLocation}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
                error={error}
                accent={accent}
              />
            </div>
          </div>

        </div>

        {loading && (
          <div style={styles.loadingWrap}>
            <div style={{ ...styles.spinnerRing, borderTopColor:accent }}/>
            <p style={{ color:accent, marginTop:16, fontWeight:400, fontSize:14 }}>Fetching weather…</p>
          </div>
        )}

        {weather && !loading && (
          <>
            {activeView === "Current" && (
              <CurrentView
                weather={weather} city={city} cur={cur}
                condDesc={condDesc} icon={icon} accent={accent} name={name}
                isFav={isFav} toggleFavorite={toggleFavorite}
                alerts={alerts} nearbyAreas={nearbyAreas} getWeather={getWeather}
                omHourly={omHourly} wttrHourly={wttrHourly} days={days}
              />
            )}
            {activeView === "Forecast" && <ForecastView weather={weather} accent={accent} />}
            {activeView === "Maps" && <MapView latitude={latitude} longitude={longitude ?? longitude2} city={city} accent={accent} />}
          </>
        )}

        {!weather && !loading && (
          <div style={{ padding:"16px 48px", opacity:0.2, fontSize:13 }}>
            Search a city or allow location access to begin
          </div>
        )}

        <div style={styles.footer}>Sky Pulse · wttr.in & Open-Meteo</div>
      </div>
    </>
  );
}