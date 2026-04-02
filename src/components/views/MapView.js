import { useState } from "react";
import styles from "../../styles/theme";

/*
  Windy.com embed — free, no API key, fully animated weather layers.
  Docs: https://embed.windy.com/embed2.html
  Supported overlays: wind, rain, clouds, temp, pressure, waves, humidity
*/

const LAYERS = [
  { id:"wind",      label:"💨 Wind",        desc:"Animated wind flow across the region" },
  { id:"rain",      label:"🌧️ Rain & Snow",  desc:"Precipitation intensity — updated every 3h" },
  { id:"clouds",    label:"☁️ Clouds",       desc:"Cloud cover from satellite data" },
  { id:"temp",      label:"🌡️ Temperature",  desc:"Temperature heatmap at surface level" },
  { id:"pressure",  label:"🔵 Pressure",     desc:"Atmospheric pressure with isobars" },
  { id:"humidity",  label:"💧 Humidity",     desc:"Relative humidity at surface level" },
  { id:"radar",     label:"📡 Radar",        desc:"Live rain radar composite" },
];

const buildWindyUrl = (lat, lng, layer) =>
  `https://embed.windy.com/embed2.html`
  + `?lat=${lat}&lon=${lng}`
  + `&detailLat=${lat}&detailLon=${lng}`
  + `&width=650&height=450`
  + `&zoom=9`
  + `&level=surface`
  + `&overlay=${layer}`
  + `&product=ecmwf`
  + `&menu=&message=true&marker=true`
  + `&calendar=now&pressure=true`
  + `&type=map&location=coordinates`
  + `&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

function MapView({ latitude, longitude, city, accent }) {
  const [activeLayer, setActiveLayer] = useState("wind");

  const lat = latitude  ?? 23.8103;
  const lng = longitude ?? 90.4125;

  const activeObj = LAYERS.find(l => l.id === activeLayer);
  const iframeUrl = buildWindyUrl(lat, lng, activeLayer);

  return (
    <div style={{ ...styles.content, gap:14 }}>

      {/* Header */}
      <div style={{ ...styles.glassCard, animation:"fadeUp .4s ease both" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>🗺️ Live Weather Map</div>
            <div style={{ fontSize:12, opacity:0.4 }}>
              {city ? `Centered on ${city}` : "Search a city to center the map"}
            </div>
          </div>
          <div style={{ fontSize:11, opacity:0.3, textAlign:"right" }}>
            Powered by<br/>
            <span style={{ opacity:0.7, fontWeight:600 }}>Windy.com</span>
          </div>
        </div>
      </div>

      {/* Layer toggles */}
      <div style={{ ...styles.glassCard, animation:"fadeUp .4s .06s ease both" }}>
        <div style={{ fontSize:12, opacity:0.45, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>
          Weather Layer
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {LAYERS.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              style={{
                padding:"7px 14px", borderRadius:10, fontSize:13, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", transition:"all .2s",
                border:     activeLayer === l.id ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.1)",
                background: activeLayer === l.id ? accent+"22"           : "rgba(255,255,255,0.06)",
                color:      activeLayer === l.id ? accent                : "#e2e8f0",
                fontWeight: activeLayer === l.id ? 600                   : 400,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {activeObj && (
          <div style={{ marginTop:12, fontSize:12, opacity:0.5, padding:"7px 12px", background:"rgba(255,255,255,0.04)", borderRadius:8 }}>
            ℹ️ {activeObj.desc}
          </div>
        )}
      </div>

      {/* Windy iframe */}
      <div style={{
        borderRadius:20, overflow:"hidden",
        border:"1px solid rgba(255,255,255,0.08)",
        animation:"fadeUp .4s .12s ease both",
        position:"relative",
        height:480,
      }}>
        <iframe
          key={iframeUrl}  /* remount on URL change so layer switches correctly */
          title="Windy Weather Map"
          src={iframeUrl}
          style={{ width:"100%", height:"100%", border:"none", display:"block" }}
          allowFullScreen
        />

        {/* City label */}
        {city && (
          <div style={{
            position:"absolute", bottom:16, left:16, zIndex:10,
            background:"rgba(7,13,26,0.88)", backdropFilter:"blur(8px)",
            border:`1px solid ${accent}50`, borderRadius:10,
            padding:"6px 12px", fontSize:12, fontWeight:600, color:accent,
            pointerEvents:"none",
          }}>
            📍 {city}
          </div>
        )}
      </div>

      {/* Coordinates */}
      {latitude && (
        <div style={{ ...styles.glassCard, animation:"fadeUp .4s .18s ease both" }}>
          <div style={{ display:"flex", justifyContent:"space-around", textAlign:"center" }}>
            {[
              { label:"Latitude",  val:`${lat.toFixed(4)}°` },
              { label:"Longitude", val:`${lng.toFixed(4)}°` },
              { label:"Layer",     val: activeObj?.label ?? "—" },
            ].map(({ label, val }, i, arr) => (
              <>
                <div key={label}>
                  <div style={{ fontSize:11, opacity:0.4, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>{label}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700 }}>{val}</div>
                </div>
                {i < arr.length-1 && <div key={`sep${i}`} style={{ width:1, background:"rgba(255,255,255,0.08)" }}/>}
              </>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default MapView;