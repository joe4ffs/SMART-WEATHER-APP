/* ─── Parse "HH:MM AM/PM" string → minutes since midnight ─── */
const parseTimeMins = (t) => {
  if (!t) return null;
  const [time, ampm] = t.trim().split(" ");
  let [h, m] = time.split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

/* ─── Get current local time in minutes for a given IANA timezone ─── */
const localMinutes = (timezone) => {
  try {
    const str  = new Date().toLocaleTimeString("en-US", { timeZone: timezone, hour12: false, hour:"2-digit", minute:"2-digit" });
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  } catch {
    return new Date().getHours() * 60 + new Date().getMinutes();
  }
};

/* ─── Main condition mapper ─── */
const conditionMap = (desc = "", sunrise = null, sunset = null, timezone = null) => {
  const d = desc.toLowerCase();

  // Check if it's nighttime at the location
  let isNight = false;
  if (sunrise && sunset && timezone) {
    const now  = localMinutes(timezone);
    const rise = parseTimeMins(sunrise);
    const set  = parseTimeMins(sunset);
    if (rise !== null && set !== null) {
      isNight = now < rise || now > set;
    }
  }

  // Severe/precipitation conditions — show regardless of day/night
  if (d.includes("thunder") || d.includes("storm"))
    return { icon:"⛈️", accent:"#a78bfa", name:"Stormy",       type:"storm" };
  if (d.includes("rain") || d.includes("drizzle") || d.includes("shower"))
    return { icon:"🌧️", accent:"#60a5fa", name:"Rainy",        type:"rain" };
  if (d.includes("snow") || d.includes("blizzard"))
    return { icon:"❄️",  accent:"#bae6fd", name:"Snowy",        type:"snow" };
  if (d.includes("fog") || d.includes("mist") || d.includes("haze"))
    return { icon:"🌫️", accent:"#94a3b8", name:"Foggy",        type:"fog" };

  // Night overrides for clear/cloud conditions
  if (isNight) {
    if (d.includes("cloud") || d.includes("overcast"))
      return { icon:"☁️",  accent:"#475569", name:"Cloudy Night",  type:"cloud" };
    // clear/sunny at night → night
    return   { icon:"🌙",  accent:"#6366f1", name:"Clear Night",   type:"night" };
  }

  // Daytime conditions
  if (d.includes("sunny") || d.includes("clear"))
    return { icon:"☀️",  accent:"#f59e0b", name:"Sunny",        type:"sunny" };
  if (d.includes("cloud") || d.includes("overcast"))
    return { icon:"☁️",  accent:"#7dd3fc", name:"Cloudy",       type:"cloud" };
  if (d.includes("wind") || d.includes("breez"))
    return { icon:"🌬️", accent:"#6ee7b7", name:"Windy",        type:"wind" };

  return { icon:"🌤️", accent:"#34d399", name:"Partly Cloudy", type:"partlycloudy" };
};

export default conditionMap;