import { useEffect, useRef } from "react";

function WeatherCanvas({ type, accent }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ type, accent });
  stateRef.current = { type, accent };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    if (!ctx) return;
    let animId;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    const rain = Array.from({ length: 130 }, () => ({
      x: Math.random()*1920, y: Math.random()*1080,
      len: Math.random()*18+8, speed: Math.random()*9+6, o: Math.random()*0.35+0.08,
    }));
    const snow = Array.from({ length: 90 }, () => ({
      x: Math.random()*1920, y: Math.random()*1080,
      r: Math.random()*3+1, speed: Math.random()*1.2+0.3,
      drift: (Math.random()-0.5)*0.6, o: Math.random()*0.5+0.2,
    }));
    const rays = Array.from({ length: 14 }, (_, i) => ({
      angle: (i/14)*Math.PI*2, len: Math.random()*90+60,
    }));
    let sunAngle = 0;
    const wisps = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random()*1920, y: 180+i*130,
      w: Math.random()*400+300, speed: Math.random()*0.4+0.1, o: Math.random()*0.07+0.03,
    }));
    const streaks = Array.from({ length: 45 }, () => ({
      x: Math.random()*1920, y: Math.random()*1080,
      len: Math.random()*130+40, speed: Math.random()*6+4, o: Math.random()*0.18+0.04,
    }));
    const clouds = Array.from({ length: 5 }, (_, i) => ({
      x: (i/5)*1920, y: 80+Math.random()*180,
      r: Math.random()*60+40, speed: Math.random()*0.3+0.1, o: Math.random()*0.08+0.04,
    }));
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random()*1920, y: Math.random()*1080,
      r: Math.random()*2+0.5, dx: (Math.random()-0.5)*0.5, dy: (Math.random()-0.5)*0.5,
      o: Math.random()*0.3+0.05,
    }));
    let ltTimer = Math.random()*180+60, ltFlash = false;

    const draw = () => {
      const { type: t, accent: ac } = stateRef.current;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      if (t === "rain" || t === "storm") {
        rain.forEach(d => {
          d.y += d.speed; d.x += 2;
          if (d.y > h) { d.y = -d.len; d.x = Math.random()*w; }
          if (d.x > w) d.x = 0;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x-2, d.y+d.len);
          ctx.strokeStyle = `rgba(147,197,253,${d.o})`; ctx.lineWidth = 1; ctx.stroke();
        });
        if (t === "storm") {
          ltTimer--;
          if (ltTimer <= 0) { ltFlash = true; ltTimer = Math.random()*200+80; }
          if (ltFlash) {
            ctx.fillStyle = "rgba(167,139,250,0.07)"; ctx.fillRect(0,0,w,h);
            const bx = w*0.2 + Math.random()*w*0.6;
            ctx.beginPath();
            ctx.moveTo(bx,0); ctx.lineTo(bx-25,h*0.25); ctx.lineTo(bx+12,h*0.25);
            ctx.lineTo(bx-18,h*0.55); ctx.lineTo(bx+8,h*0.55); ctx.lineTo(bx-10,h*0.75);
            ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 2.5; ctx.stroke();
            setTimeout(() => { ltFlash = false; }, 90);
          }
        }
      } else if (t === "snow") {
        snow.forEach(s => {
          s.y += s.speed; s.x += s.drift;
          if (s.y > h) { s.y = -s.r; s.x = Math.random()*w; }
          if (s.x > w) s.x = 0; if (s.x < 0) s.x = w;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
          ctx.fillStyle = `rgba(186,230,253,${s.o})`; ctx.fill();
        });
      } else if (t === "sunny") {
        sunAngle += 0.003;
        const cx = w*0.82, cy = h*0.12;
        rays.forEach(ray => {
          const a = ray.angle + sunAngle;
          const grad = ctx.createLinearGradient(cx,cy,cx+Math.cos(a)*ray.len,cy+Math.sin(a)*ray.len);
          grad.addColorStop(0,"rgba(251,191,36,0.22)"); grad.addColorStop(1,"rgba(251,191,36,0)");
          ctx.beginPath(); ctx.moveTo(cx,cy);
          ctx.lineTo(cx+Math.cos(a-0.14)*ray.len, cy+Math.sin(a-0.14)*ray.len);
          ctx.lineTo(cx+Math.cos(a+0.14)*ray.len, cy+Math.sin(a+0.14)*ray.len);
          ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
        });
        const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,220);
        glow.addColorStop(0,"rgba(251,191,36,0.14)"); glow.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle = glow; ctx.fillRect(0,0,w,h);
      } else if (t === "fog") {
        wisps.forEach(wsp => {
          wsp.x -= wsp.speed; if (wsp.x+wsp.w < 0) wsp.x = w+50;
          const grad = ctx.createLinearGradient(wsp.x,0,wsp.x+wsp.w,0);
          grad.addColorStop(0,"rgba(148,163,184,0)");
          grad.addColorStop(0.5,`rgba(148,163,184,${wsp.o})`);
          grad.addColorStop(1,"rgba(148,163,184,0)");
          ctx.fillStyle = grad; ctx.fillRect(wsp.x, wsp.y-40, wsp.w, 80);
        });
      } else if (t === "wind") {
        streaks.forEach(sk => {
          sk.x -= sk.speed; if (sk.x+sk.len < 0) { sk.x = w+sk.len; sk.y = Math.random()*h; }
          ctx.beginPath(); ctx.moveTo(sk.x,sk.y); ctx.lineTo(sk.x+sk.len,sk.y);
          ctx.strokeStyle = `rgba(110,231,183,${sk.o})`; ctx.lineWidth = 1; ctx.stroke();
        });
      } else if (t === "cloud") {
        clouds.forEach(cl => {
          cl.x -= cl.speed; if (cl.x+cl.r*3 < 0) cl.x = w+cl.r;
          const grad = ctx.createRadialGradient(cl.x,cl.y,0,cl.x,cl.y,cl.r*2.5);
          grad.addColorStop(0,`rgba(125,211,252,${cl.o})`); grad.addColorStop(1,"rgba(125,211,252,0)");
          ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cl.x,cl.y,cl.r*2.5,0,Math.PI*2); ctx.fill();
        });
        particles.forEach(p => {
          p.x+=p.dx; p.y+=p.dy;
          if(p.x<0||p.x>w) p.dx*=-1; if(p.y<0||p.y>h) p.dy*=-1;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle = ac+Math.round(p.o*255).toString(16).padStart(2,"0"); ctx.fill();
        });
      } else if (t === "night") {
        // Twinkling stars for clear night
        if (!WeatherCanvas._stars) {
          WeatherCanvas._stars = Array.from({ length: 120 }, () => ({
            x: Math.random()*1920, y: Math.random()*900,
            r: Math.random()*1.4+0.3, phase: Math.random()*Math.PI*2,
            speed: Math.random()*0.025+0.005,
          }));
        }
        WeatherCanvas._stars.forEach(st => {
          st.phase += st.speed;
          const twinkle = (Math.sin(st.phase)+1)/2;
          ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
          ctx.fillStyle = `rgba(196,181,253,${twinkle*0.7+0.1})`; ctx.fill();
        });
        // Soft indigo glow top
        const nightGlow = ctx.createRadialGradient(w*0.5, 0, 0, w*0.5, 0, h*0.6);
        nightGlow.addColorStop(0,"rgba(99,102,241,0.08)"); nightGlow.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle = nightGlow; ctx.fillRect(0,0,w,h);
      } else {
        particles.forEach(p => {
          p.x+=p.dx; p.y+=p.dy;
          if(p.x<0||p.x>w) p.dx*=-1; if(p.y<0||p.y>h) p.dy*=-1;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle = ac+Math.round(p.o*255).toString(16).padStart(2,"0"); ctx.fill();
        });
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []); // eslint-disable-line

  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}/>;
}

export default WeatherCanvas;