import { DAY_LABELS } from "./timeUtils";

export const ALERT_COLORS = {
  danger: { bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.3)",  text:"#fca5a5" },
  warn:   { bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.3)", text:"#fcd34d" },
  info:   { bg:"rgba(96,165,250,0.1)", border:"rgba(96,165,250,0.3)", text:"#93c5fd" },
};

export const analyzeAlerts = (weatherData) => {
  if (!weatherData) return [];
  const alerts = [];
  const hourly = weatherData.weather?.[0]?.hourly || [];

  hourly.forEach(h => {
    const time    = `${String(parseInt(h.time)/100).padStart(2,"0")}:00`;
    const rain    = parseInt(h.chanceofrain    || 0);
    const snow    = parseInt(h.chanceofssnow   || 0);
    const wind    = parseInt(h.windspeedKmph   || 0);
    const thunder = parseInt(h.chanceofthunder || 0);
    const fog     = parseInt(h.chanceoffog     || 0);

    if (thunder >= 40)
      alerts.push({ level:"danger", icon:"⛈️", time, msg:`Thunderstorm likely at ${time} (${thunder}% chance)` });
    else if (thunder >= 20)
      alerts.push({ level:"warn",   icon:"🌩️", time, msg:`Thunder possible at ${time} (${thunder}% chance)` });

    if (wind >= 60)
      alerts.push({ level:"danger", icon:"💨", time, msg:`Strong winds at ${time} — ${wind} km/h` });
    else if (wind >= 40)
      alerts.push({ level:"warn",   icon:"🌬️", time, msg:`Gusty winds at ${time} — ${wind} km/h` });

    if (rain >= 70)
      alerts.push({ level:"warn",   icon:"🌧️", time, msg:`Heavy rain at ${time} (${rain}% chance)` });

    if (snow >= 50)
      alerts.push({ level:"warn",   icon:"❄️", time, msg:`Snowfall at ${time} (${snow}% chance)` });

    if (fog >= 60)
      alerts.push({ level:"info",   icon:"🌫️", time, msg:`Dense fog at ${time} (${fog}% chance)` });
  });

  weatherData.weather?.slice(1,3).forEach((day, di) => {
    const label      = di === 0 ? "Tomorrow" : DAY_LABELS[new Date(new Date().setDate(new Date().getDate()+di+1)).getDay()];
    const maxWind    = Math.max(...(day.hourly?.map(h => parseInt(h.windspeedKmph   ||0)) || [0]));
    const maxThunder = Math.max(...(day.hourly?.map(h => parseInt(h.chanceofthunder ||0)) || [0]));
    const maxRain    = Math.max(...(day.hourly?.map(h => parseInt(h.chanceofrain    ||0)) || [0]));
    if (maxThunder >= 40)
      alerts.push({ level:"danger", icon:"⛈️", time:label, msg:`Thunderstorm expected ${label} (up to ${maxThunder}%)` });
    if (maxWind >= 60)
      alerts.push({ level:"warn",   icon:"💨", time:label, msg:`High winds expected ${label} — up to ${maxWind} km/h` });
    if (maxRain >= 80)
      alerts.push({ level:"info",   icon:"🌧️", time:label, msg:`Heavy rain expected ${label} (up to ${maxRain}%)` });
  });

  const seen = new Set();
  return alerts.filter(a => {
    const key = a.icon + a.time;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
};