export const moonPhaseIcon = (phase = "") => {
  const p = phase.toLowerCase();
  if (p.includes("new"))              return "🌑";
  if (p.includes("waxing crescent"))  return "🌒";
  if (p.includes("first quarter"))    return "🌓";
  if (p.includes("waxing gibbous"))   return "🌔";
  if (p.includes("full"))             return "🌕";
  if (p.includes("waning gibbous"))   return "🌖";
  if (p.includes("last quarter") || p.includes("third quarter")) return "🌗";
  if (p.includes("waning crescent"))  return "🌘";
  return "🌙";
};