export const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export const getUpcomingDays = () => {
  const today = new Date();
  return [0,1,2].map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : DAY_LABELS[d.getDay()];
  });
};

export const parseTime = (t) => {
  if (!t) return 0;
  const [time, ampm] = t.trim().split(" ");
  let [h, m] = time.split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
};