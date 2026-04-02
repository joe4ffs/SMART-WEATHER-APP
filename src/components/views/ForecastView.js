import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer, CartesianGrid
} from "recharts";
import styles from "../../styles/theme";
import conditionMap from "../../utils/conditionMap";
import ChartTooltip from "../ChartTooltip";
import { DAY_LABELS } from "../../utils/timeUtils";

function ForecastView({ weather, accent }) {
  const [expanded, setExpanded] = useState(null);

  if (!weather) return null;

  const today = new Date();
  const dayLabel = (i) => {
    if (i === 0) return "Today";
    if (i === 1) return "Tomorrow";
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return DAY_LABELS[d.getDay()];
  };

  return (
    <div style={styles.content}>
      <div style={{ ...styles.glassCard, animation:"fadeUp .4s ease both", marginBottom:0 }}>
        <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>📅 3-Day Forecast</div>
        <div style={{ fontSize:12, opacity:0.4 }}>Tap a day to expand hourly breakdown</div>
      </div>

      {weather.weather?.slice(0,3).map((day, i) => {
        const dDesc   = day.hourly?.[4]?.weatherDesc?.[0]?.value || "";
        const { icon: dIcon, accent: dAccent } = conditionMap(dDesc);
        const isOpen  = expanded === i;

        const hourlyTemp = day.hourly?.map(h => ({
          time: `${String(parseInt(h.time)/100).padStart(2,"0")}:00`,
          temp: parseInt(h.tempC),
          rain: parseInt(h.chanceofrain),
          feel: parseInt(h.FeelsLikeC),
        })) || [];

        return (
          <div key={i} style={{ animation:`fadeUp .4s ${i*0.08}s ease both` }}>
            {/* Day header — clickable */}
            <div
              onClick={() => setExpanded(isOpen ? null : i)}
              style={{
                ...styles.glassCard,
                cursor:"pointer",
                borderColor: isOpen ? accent+"60" : "rgba(255,255,255,0.08)",
                transition:"border-color .2s",
              }}
            >
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <span style={{ fontSize:32 }}>{dIcon}</span>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16 }}>{dayLabel(i)}</div>
                    <div style={{ fontSize:12, opacity:0.45, marginTop:2 }}>{dDesc}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:dAccent }}>{day.avgtempC}°C</div>
                    <div style={{ fontSize:12, display:"flex", gap:8, justifyContent:"flex-end", marginTop:2 }}>
                      <span style={{ color:"#60a5fa" }}>↓{day.mintempC}°</span>
                      <span style={{ color:"#f87171" }}>↑{day.maxtempC}°</span>
                    </div>
                  </div>
                  <span style={{ fontSize:18, opacity:0.4, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .2s" }}>▾</span>
                </div>
              </div>

              {/* Quick stat row */}
              <div style={{ display:"flex", gap:16, marginTop:14, flexWrap:"wrap" }}>
                {[
                  { icon:"🌧️", label:"Rain",    val:`${Math.max(...day.hourly?.map(h=>parseInt(h.chanceofrain||0)))||0}%` },
                  { icon:"💨", label:"Wind",    val:`${Math.max(...day.hourly?.map(h=>parseInt(h.windspeedKmph||0)))||0} km/h` },
                  { icon:"💧", label:"Humidity",val:`${Math.round(day.hourly?.reduce((s,h)=>s+parseInt(h.humidity||0),0)/day.hourly?.length)||0}%` },
                  { icon:"⛈️", label:"Thunder", val:`${Math.max(...day.hourly?.map(h=>parseInt(h.chanceofthunder||0)))||0}%` },
                ].map(({ icon: si, label, val }) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, opacity:0.65 }}>
                    <span>{si}</span>
                    <span style={{ opacity:0.6 }}>{label}:</span>
                    <span style={{ fontWeight:600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded hourly charts */}
            {isOpen && (
              <div style={{ ...styles.glassCard, borderColor:accent+"30", marginTop:-8, borderTopLeftRadius:0, borderTopRightRadius:0 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:14, opacity:0.7 }}>🌡️ Hourly Temperature</div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={hourlyTemp} margin={{ top:8, right:8, left:-22, bottom:0 }}>
                    <defs>
                      <linearGradient id={`tg${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={dAccent} stopOpacity={0.35}/>
                        <stop offset="95%" stopColor={dAccent} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                    <XAxis dataKey="time" tick={{ fill:"rgba(255,255,255,0.4)", fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:"rgba(255,255,255,0.4)", fontSize:10 }} axisLine={false} tickLine={false} unit="°"/>
                    <Tooltip content={<ChartTooltip unit="°C"/>}/>
                    <Area type="monotone" dataKey="temp" stroke={dAccent} strokeWidth={2} fill={`url(#tg${i})`} dot={false} activeDot={{ r:4, fill:dAccent }}/>
                  </AreaChart>
                </ResponsiveContainer>

                <div style={{ fontSize:13, fontWeight:600, margin:"16px 0 14px", opacity:0.7 }}>🌧️ Chance of Rain</div>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={hourlyTemp} margin={{ top:4, right:8, left:-22, bottom:0 }}>
                    <defs>
                      <linearGradient id={`rg${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#60a5fa" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                    <XAxis dataKey="time" tick={{ fill:"rgba(255,255,255,0.4)", fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis domain={[0,100]} tick={{ fill:"rgba(255,255,255,0.4)", fontSize:10 }} axisLine={false} tickLine={false} unit="%"/>
                    <Tooltip content={<ChartTooltip unit="%"/>}/>
                    <Bar dataKey="rain" fill={`url(#rg${i})`} radius={[3,3,0,0]} maxBarSize={20}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ForecastView;