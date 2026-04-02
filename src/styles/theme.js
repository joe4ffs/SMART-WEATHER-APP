const styles = {
  navbar:      { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 48px", borderBottom:"1px solid rgba(255,255,255,0.05)", backdropFilter:"blur(12px)", background:"rgba(7,13,26,0.6)", position:"sticky", top:0, zIndex:50 },
  navBrand:    { display:"flex", alignItems:"center", gap:10 },
  navIcon:     { fontSize:22, lineHeight:1 },
  navLogo:     { fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, letterSpacing:"-0.5px" },
  navLinks:    { display:"flex", gap:32 },
  navLink:     { opacity:0.5, fontSize:14, fontWeight:500, cursor:"pointer", transition:"opacity .2s" },
  seasonBadge: { fontSize:12, fontWeight:600, padding:"5px 14px", borderRadius:100, border:"1px solid", letterSpacing:"0.04em" },

  /* ── Hero: side by side, vertically centred, no wasted space ── */
  hero: {
    display:"flex", flexDirection:"row",
    alignItems:"center", justifyContent:"space-between",
    padding:"36px 48px 28px",
    gap:24, flexWrap:"wrap",
    borderBottom:"1px solid rgba(255,255,255,0.04)",
  },
  heroLeft: {
    flex:"1 1 300px",
    display:"flex", flexDirection:"column", gap:4,
  },
  heroRight: {
    flex:"0 0 auto",
    display:"flex", alignItems:"center",
  },

  heroMeta: { fontSize:11, fontWeight:500, opacity:0.3, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 },

  /* chips — flat inline, no section headers */
  chip:  { background:"rgba(255,255,255,0.07)", padding:"5px 11px", borderRadius:100, fontSize:12, cursor:"pointer", border:"1px solid rgba(255,255,255,0.08)", display:"inline-flex", alignItems:"center", gap:5, maxWidth:180, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", transition:"background .2s,transform .15s" },
  chipX: { opacity:0.35, fontSize:14, lineHeight:1, transition:"opacity .2s", marginLeft:2 },

  /* kept for backward compat in other components */
  chipSection: { display:"flex", flexDirection:"column", gap:4 },
  chipLabel:   { fontSize:10, opacity:0.3, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" },
  chipRow:     { display:"flex", flexWrap:"wrap", gap:5, maxWidth:500 },

  /* search */
  searchWrap:     { display:"flex", gap:8, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"6px 6px 6px 0", backdropFilter:"blur(16px)", boxShadow:"0 8px 32px rgba(0,0,0,0.3)" },
  searchIconLeft: { position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", opacity:0.4, fontSize:15, pointerEvents:"none" },
  searchInput:    { background:"transparent", border:"none", padding:"12px 14px 12px 40px", fontSize:15, width:260, fontFamily:"'DM Sans',sans-serif" },
  btnPrimary:     { padding:"12px 20px", borderRadius:12, border:"none", color:"#0f172a", fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },
  btnIcon:        { padding:"12px", borderRadius:12, border:"none", background:"rgba(255,255,255,0.08)", fontSize:18, cursor:"pointer" },
  dropdown:       { position:"absolute", top:"calc(100% + 8px)", left:0, right:0, zIndex:100, background:"#101827", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" },
  suggestionItem: { padding:"11px 16px", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.04)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  errorMsg:       { marginTop:8, color:"#f87171", fontSize:12, padding:"7px 14px", background:"rgba(248,113,113,0.08)", borderRadius:8, border:"1px solid rgba(248,113,113,0.2)" },

  loadingWrap: { textAlign:"center", padding:60 },
  spinnerRing: { width:44, height:44, borderRadius:"50%", border:"3px solid rgba(255,255,255,0.1)", animation:"spin .8s linear infinite", margin:"0 auto" },

  content:   { maxWidth:780, margin:"0 auto", padding:"24px 24px 60px", display:"flex", flexDirection:"column", gap:18 },
  mainCard:  { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:"28px 32px", backdropFilter:"blur(20px)", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" },
  glassCard: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"24px 28px", backdropFilter:"blur(16px)" },
  chartTitle:{ fontSize:14, fontWeight:600, marginBottom:16, opacity:0.8 },

  cardTopRow:     { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 },
  cityName:       { fontFamily:"'Syne',sans-serif", fontSize:"clamp(18px,3vw,24px)", fontWeight:700, letterSpacing:"-0.5px", maxWidth:480, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  conditionBadge: { display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:100, fontSize:12, fontWeight:600, marginTop:6 },
  favBtn:         { border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"8px 14px", fontSize:20, cursor:"pointer", transition:"all .2s" },

  /* temperature — Syne 800, split ° and C */
  tempRow:  { display:"flex", alignItems:"center", gap:14, margin:"18px 0 6px" },
  bigIcon:  { fontSize:48, lineHeight:1 },
  tempNum:  { fontFamily:"'Syne',sans-serif", fontSize:"clamp(64px,9vw,88px)", fontWeight:800, lineHeight:1, letterSpacing:"-4px" },
  tempSup:  { fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:700, opacity:0.7, alignSelf:"flex-start", marginTop:10 },
  tempUnit: { fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, opacity:0.35, alignSelf:"flex-end", marginBottom:12, letterSpacing:"0.04em" },
  feelsLike:{ fontSize:13, opacity:0.4, marginBottom:24 },

  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 },
  statPill:   { display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 14px", border:"1px solid rgba(255,255,255,0.06)" },
  statIcon:   { fontSize:18 },
  statLabel:  { fontSize:10, opacity:0.4, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.06em" },
  statValue:  { fontSize:14, fontWeight:600, marginTop:2 },

  sunBarHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
  sunBarTrack:  { position:"relative", height:28, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"visible", marginBottom:8 },
  sunBarLabels: { display:"flex", justifyContent:"space-between", fontSize:12, opacity:0.5 },
  moonRow:      { display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:2 },
  moonLeft:     { display:"flex", alignItems:"center", gap:12 },
  moonRight:    { textAlign:"right", minWidth:140 },
  moonTrack:    { height:6, background:"rgba(255,255,255,0.08)", borderRadius:99, overflow:"hidden" },

  forecastRow:    { display:"flex", gap:12 },
  forecastCard:   { flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid", borderRadius:18, padding:"18px 14px", textAlign:"center", backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", alignItems:"center", gap:5 },
  forecastDay:    { fontSize:11, fontWeight:600, opacity:0.4, textTransform:"uppercase", letterSpacing:"0.1em" },
  forecastIcon:   { fontSize:28 },
  forecastTemp:   { fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, letterSpacing:"-0.5px" },
  forecastDesc:   { fontSize:10, opacity:0.4, maxWidth:90, lineHeight:1.4 },
  forecastMinMax: { display:"flex", gap:8, fontSize:11, fontWeight:500 },

  footer: { textAlign:"center", padding:"20px 0 32px", opacity:0.15, fontSize:12 },
};

export default styles;