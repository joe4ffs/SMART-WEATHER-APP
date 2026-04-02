import { useState, useEffect, useRef } from "react";

/* ─── Fetch Open-Meteo hourly data by lat/lng ─── */
const fetchOpenMeteo = async (lat, lng) => {
  const url = `https://api.open-meteo.com/v1/forecast`
    + `?latitude=${lat}&longitude=${lng}`
    + `&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,windspeed_10m,weathercode`
    + `&daily=precipitation_probability_max,precipitation_sum,temperature_2m_max,temperature_2m_min,windspeed_10m_max,weathercode`
    + `&timezone=auto&forecast_days=3`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo failed");
  return res.json();
};

/* ─── Parse Open-Meteo hourly into chart-ready array for today only ─── */
export const parseOMHourly = (omData) => {
  if (!omData?.hourly) return [];
  const { time, temperature_2m, apparent_temperature, precipitation_probability, precipitation, windspeed_10m } = omData.hourly;

  // Get today's date string e.g. "2026-04-01"
  const today = new Date().toISOString().slice(0, 10);

  return time.reduce((acc, t, i) => {
    if (!t.startsWith(today)) return acc;
    acc.push({
      time:  t.slice(11, 16),           // "HH:MM"
      temp:  Math.round(temperature_2m[i] ?? 0),
      feel:  Math.round(apparent_temperature?.[i] ?? 0),
      rain:  Math.round(precipitation_probability?.[i] ?? 0),
      precip: +(precipitation?.[i] ?? 0).toFixed(1),  // actual mm fallen
      wind:  Math.round(windspeed_10m?.[i] ?? 0),
    });
    return acc;
  }, []);
};

/* ─── Parse Open-Meteo daily into 3-day summary ─── */
export const parseOMDaily = (omData) => {
  if (!omData?.daily) return [];
  const { time, precipitation_probability_max, precipitation_sum, temperature_2m_max, temperature_2m_min, windspeed_10m_max } = omData.daily;
  return time.slice(0, 3).map((t, i) => ({
    date:      t,
    rainPct:   precipitation_probability_max?.[i] ?? 0,
    precipMm:  +(precipitation_sum?.[i] ?? 0).toFixed(1),
    maxTemp:   Math.round(temperature_2m_max?.[i] ?? 0),
    minTemp:   Math.round(temperature_2m_min?.[i] ?? 0),
    maxWind:   Math.round(windspeed_10m_max?.[i] ?? 0),
  }));
};

const useWeather = () => {
  const [weather,     setWeather]     = useState(null);
  const [omData,      setOmData]      = useState(null);   // Open-Meteo data
  const [city,        setCity]        = useState("");
  const [loading,     setLoading]     = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error,       setError]       = useState("");
  const [inputVal,    setInputVal]    = useState("");
  const [latitude,    setLatitude]    = useState(null);
  const [longitude,   setLongitude]   = useState(null);
  const [timezone,    setTimezone]    = useState(null);
  const [nearbyAreas, setNearbyAreas] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wx_favorites")) || []; } catch { return []; }
  });
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wx_recent")) || []; } catch { return []; }
  });

  /* ── resolve lat/lng + nearby from wttr response ── */
  const resolveLocation = (data, fallbackLat, fallbackLng) => {
    const area   = data.nearest_area?.[0];
    const latRaw = area?.latitude;
    const lngRaw = area?.longitude;
    const lat    = latRaw ? parseFloat(latRaw) : (fallbackLat ?? null);
    const lng    = lngRaw ? parseFloat(lngRaw) : (fallbackLng ?? null);
    setLatitude(lat);
    setLongitude(lng);

    const extras  = (data.nearest_area || []).slice(1).map(a => a.areaName?.[0]?.value).filter(Boolean);
    const region  = area?.region?.[0]?.value;
    const country = area?.country?.[0]?.value;
    const nearby  = [...new Set([...extras, region, country].filter(Boolean))].slice(0, 6);
    setNearbyAreas(nearby);
    return { lat, lng };
  };

  /* ── fetch both wttr + Open-Meteo in parallel ── */
  const getWeather = async (cityName) => {
    if (!cityName?.trim()) return;
    try {
      setLoading(true); setError(""); setSuggestions([]);

      // Step 1: fetch wttr for current conditions, forecast structure, moon/sun
      const res  = await fetch(`https://wttr.in/${encodeURIComponent(cityName)}?format=j1`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWeather(data);
      setCity(cityName);
      setInputVal(cityName);

      const { lat, lng } = resolveLocation(data, null, null);

      // Step 2: fetch Open-Meteo in parallel using resolved coords
      if (lat && lng) {
        fetchOpenMeteo(lat, lng)
          .then(om => { setOmData(om); if (om.timezone) setTimezone(om.timezone); })
          .catch(() => {}); // silently fallback to wttr data if OM fails
      }

      const updated = [cityName, ...recent.filter(c => c !== cityName)].slice(0, 5);
      setRecent(updated);
      localStorage.setItem("wx_recent", JSON.stringify(updated));
    } catch { setError("Couldn't find that location. Try another city name."); }
    finally  { setLoading(false); }
  };

  /* ── geolocation ── */
  const getUserLocation = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lng } }) => {
        try {
          setLoading(true); setError("");

          // Both fetches in parallel from the start since we have coords
          const [wttrRes, om] = await Promise.allSettled([
            fetch(`https://wttr.in/${lat},${lng}?format=j1`).then(r => r.json()),
            fetchOpenMeteo(lat, lng),
          ]);

          if (wttrRes.status === "fulfilled") {
            const data = wttrRes.value;
            setWeather(data);
            resolveLocation(data, lat, lng);
            const area     = data.nearest_area?.[0];
            const areaName = area?.areaName?.[0]?.value || "Your Location";
            const country  = area?.country?.[0]?.value  || "";
            const label    = country ? `${areaName}, ${country}` : areaName;
            setCity(label);
            setInputVal(label);
          }

          if (om.status === "fulfilled") { setOmData(om.value); if (om.value.timezone) setTimezone(om.value.timezone); }

        } catch { setError("Failed to get location weather."); }
        finally  { setLoading(false); }
      },
      () => setError("Location permission denied.")
    );
  };

  useEffect(() => { getUserLocation(); }, []); // eslint-disable-line

  /* ── autocomplete ── */
  const debounceRef = useRef(null);
  const handleInput = val => {
    setInputVal(val);
    clearTimeout(debounceRef.current);
    if (val.length < 3) return setSuggestions([]);
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5`);
        const data = await res.json();
        setSuggestions(data);
      } catch { setSuggestions([]); }
    }, 300);
  };

  /* ── favorites ── */
  const toggleFavorite = () => {
    if (!city) return;
    const isFav   = favorites.includes(city);
    const updated = isFav ? favorites.filter(f => f !== city) : [...favorites, city];
    setFavorites(updated);
    localStorage.setItem("wx_favorites", JSON.stringify(updated));
  };

  const removeFav = (f, e) => {
    e.stopPropagation();
    const updated = favorites.filter(x => x !== f);
    setFavorites(updated);
    localStorage.setItem("wx_favorites", JSON.stringify(updated));
  };

  return {
    weather, omData,
    city, loading, suggestions, setSuggestions,
    error, inputVal, latitude, longitude, timezone, nearbyAreas,
    favorites, recent,
    getWeather, getUserLocation, handleInput,
    toggleFavorite, removeFav,
  };
};

export default useWeather;