import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Bar, ComposedChart, Line,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import styles from "../styles/theme";
import ChartTooltip from "./ChartTooltip";

/* ─── Custom tooltip for the rain combo chart ─── */
function RainTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(15,24,42,0.95)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 14px", fontSize:12 }}>
      <div style={{ opacity:0.5, marginBottom:4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight:600 }}>
          {p.name}: {p.value}{p.name === "Probability" ? "%" : " mm"}
        </div>
      ))}
    </div>
  );
}

function HourlyCharts({ omHourly, wttrHourly, accent }) {
  // Prefer Open-Meteo data — fall back to wttr if OM not loaded yet
  const data = omHourly?.length ? omHourly : wttrHourly;
  const isOM = omHourly?.length > 0;

  if (!data || data.length === 0) return null;

  // Filter to every 3hrs to avoid crowded x-axis (OM gives 24 points)
  const displayData = isOM
    ? data.filter((_, i) => i % 3 === 0)
    : data;

  const maxPrecip = Math.max(...displayData.map(d => d.precip ?? 0));
  const hasActualRain = maxPrecip > 0;

  return (
    <>
      {/* ── Hourly Temperature ── */}
      <div style={{ ...styles.glassCard, animation:"fadeUp .5s .18s ease both" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={styles.chartTitle}>🌡️ Hourly Temperature — Today</div>
          {isOM && <span style={{ fontSize:11, opacity:0.4, background:"rgba(52,211,153,0.1)", color:"#34d399", padding:"2px 8px", borderRadius:6, border:"1px solid rgba(52,211,153,0.2)" }}>Open-Meteo</span>}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={displayData} margin={{ top:10, right:10, left:-20, bottom:0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={accent} stopOpacity={0.35}/>
                <stop offset="95%" stopColor={accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="time" tick={{ fill:"rgba(255,255,255,0.4)", fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:"rgba(255,255,255,0.4)", fontSize:11 }} axisLine={false} tickLine={false} unit="°"/>
            <Tooltip content={<ChartTooltip unit="°C"/>}/>
            <Area type="monotone" dataKey="temp" stroke={accent} strokeWidth={2} fill="url(#tempGrad)" dot={false} activeDot={{ r:5, fill:accent }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Rain: probability + actual precipitation ── */}
      <div style={{ ...styles.glassCard, animation:"fadeUp .5s .22s ease both" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={styles.chartTitle}>🌧️ Rain — Probability & Actual Precipitation</div>
          {isOM && <span style={{ fontSize:11, opacity:0.4, background:"rgba(52,211,153,0.1)", color:"#34d399", padding:"2px 8px", borderRadius:6, border:"1px solid rgba(52,211,153,0.2)" }}>Open-Meteo</span>}
        </div>

        {/* Source note */}
        {isOM && (
          <div style={{ fontSize:11, opacity:0.45, marginBottom:12, display:"flex", gap:16 }}>
            <span>📊 <b>Bars</b> = actual mm of rain fallen</span>
            <span>📈 <b>Line</b> = probability %</span>
          </div>
        )}

        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={displayData} margin={{ top:10, right:10, left:-20, bottom:0 }}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#60a5fa" stopOpacity={0.85}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.35}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="time" tick={{ fill:"rgba(255,255,255,0.4)", fontSize:11 }} axisLine={false} tickLine={false}/>
            {/* Left axis: precipitation mm */}
            <YAxis
              yAxisId="mm"
              tick={{ fill:"rgba(255,255,255,0.4)", fontSize:11 }}
              axisLine={false} tickLine={false}
              unit=" mm"
              width={42}
              domain={[0, Math.max(maxPrecip * 1.5, 1)]}
            />
            {/* Right axis: probability % */}
            <YAxis
              yAxisId="pct"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill:"rgba(255,255,255,0.3)", fontSize:10 }}
              axisLine={false} tickLine={false}
              unit="%"
              width={34}
            />
            <Tooltip content={<RainTooltip/>}/>
            <Legend
              wrapperStyle={{ fontSize:11, opacity:0.5, paddingTop:8 }}
              formatter={v => v === "precip" ? "Actual rain (mm)" : "Probability (%)"}
            />
            {/* Bars: actual precipitation mm */}
            {isOM && (
              <Bar yAxisId="mm" dataKey="precip" name="Actual" fill="url(#rainGrad)" radius={[4,4,0,0]} maxBarSize={22}/>
            )}
            {/* Line: probability % */}
            <Line
              yAxisId="pct"
              type="monotone"
              dataKey="rain"
              name="Probability"
              stroke="#93c5fd"
              strokeWidth={2}
              dot={false}
              activeDot={{ r:4, fill:"#93c5fd" }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Rain summary pill */}
        {isOM && hasActualRain && (
          <div style={{ marginTop:12, padding:"8px 14px", background:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:10, fontSize:12 }}>
            💧 <b>{maxPrecip} mm</b> peak precipitation expected today
          </div>
        )}
        {isOM && !hasActualRain && (
          <div style={{ marginTop:12, padding:"8px 14px", background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)", borderRadius:10, fontSize:12, color:"#6ee7b7" }}>
            ✅ No actual precipitation forecast for today
          </div>
        )}
      </div>
    </>
  );
}

export default HourlyCharts;