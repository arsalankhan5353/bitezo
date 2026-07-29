"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let raf: number;
    let p = 0;
    const tick = () => {
      p += Math.random() * 14;
      if (p >= 100) {
        p = 100;
        setPct(100);
        gsap.to(".bitezo-loader", {
          opacity: 0,
          duration: 0.7,
          delay: 0.25,
          onComplete: () => {
            setHidden(true);
            onDone();
          },
        });
        return;
      }
      setPct(Math.round(p));
      raf = requestAnimationFrame(() => setTimeout(tick, 90));
    };
    tick();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div className="bitezo-loader fixed inset-0 z-[1000] bg-[#050302] flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin"
          style={{ animationDuration: "1.1s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-display italic text-lg text-white">
          B
        </div>
      </div>
      <div className="w-48 h-px bg-white/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent2"
          style={{ width: `${pct}%`, transition: "width .15s linear" }}
        />
      </div>
      <span className="text-white/40 text-[.65rem] tracking-[.3em] uppercase">{pct}%</span>
    </div>
  );
}
