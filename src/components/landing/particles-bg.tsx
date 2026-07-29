"use client";

import { useEffect, useRef } from "react";

export default function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0;
    let particles: { x: number; y: number; r: number; vx: number; vy: number; life: number }[] = [];
    let raf = 0;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const cap = window.innerWidth < 760 ? 35 : 80;

    function spawn() {
      particles.push({
        x: Math.random() * W,
        y: H + 10,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.5 + 0.2),
        vx: (Math.random() - 0.5) * 0.25,
        life: 1,
      });
    }

    function tick() {
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx!.clearRect(0, 0, W, H);
      if (particles.length < cap && Math.random() > 0.5) spawn();
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.002;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,140,60,${Math.max(p.life * 0.45, 0)})`;
        ctx!.fill();
      });
      particles = particles.filter((p) => p.life > 0 && p.y > -10);
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none opacity-70" aria-hidden="true" />;
}
