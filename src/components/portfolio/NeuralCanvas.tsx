import { useEffect, useRef, useState } from "react";

export function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr; c.height = r.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    const N = 50;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.4 * dpr, vy: (Math.random() - 0.5) * 0.4 * dpr,
    }));
    let mouseX = -9999, mouseY = -9999;
    const move = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      mouseX = (e.clientX - r.left) * dpr;
      mouseY = (e.clientY - r.top) * dpr;
    };
    c.addEventListener("mousemove", move);
    const tick = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const accent = isDark ? "239,68,68" : "220,38,38";
      ctx.clearRect(0, 0, c.width, c.height);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > c.width) n.vx *= -1;
        if (n.y < 0 || n.y > c.height) n.vy *= -1;
        const dx = n.x - mouseX, dy = n.y - mouseY;
        const d = Math.hypot(dx, dy);
        if (d < 150 * dpr) {
          n.vx += (dx / d) * 0.05; n.vy += (dy / d) * 0.05;
        }
        n.vx = Math.max(-1.5, Math.min(1.5, n.vx));
        n.vy = Math.max(-1.5, Math.min(1.5, n.vy));
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 140 * dpr) {
            ctx.strokeStyle = `rgba(${accent},${0.4 * (1 - d / (140 * dpr))})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${accent},0.9)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); c.removeEventListener("mousemove", move); };
  }, [mounted]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}
