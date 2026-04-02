function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(15,24,42,0.95)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 14px", fontSize:13 }}>
      <div style={{ opacity:0.5, marginBottom:2 }}>{label}</div>
      <div style={{ fontWeight:700 }}>{payload[0].value}{unit}</div>
    </div>
  );
}

export default ChartTooltip;