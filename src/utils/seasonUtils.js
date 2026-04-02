export const getSeason = (lat) => {
  const latNum = typeof lat === "number" ? lat : parseFloat(lat);
  if (isNaN(latNum)) return "spring";
  const m = new Date().getMonth();
  const north =
    (m >= 2 && m <= 4) ? "spring" :
    (m >= 5 && m <= 7) ? "summer" :
    (m >= 8 && m <= 10) ? "autumn" : "winter";
  if (latNum >= 0) return north;
  return { spring:"autumn", summer:"winter", autumn:"spring", winter:"summer" }[north];
};

export const seasonMeta = {
  spring: { label:"🌸 Spring", color:"#f9a8d4" },
  summer: { label:"☀️ Summer", color:"#fcd34d" },
  autumn: { label:"🍂 Autumn", color:"#fb923c" },
  winter: { label:"❄️ Winter", color:"#93c5fd" },
};