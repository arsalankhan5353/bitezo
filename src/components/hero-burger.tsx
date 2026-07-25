"use client";

import { useRef } from "react";

export default function HeroBurger() {
  const imgRef = useRef<HTMLImageElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = imgRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateY(${px * 18}deg) rotateX(${-py * 18}deg)`;
  }

  function handleMouseLeave() {
    const el = imgRef.current;
    if (el) el.style.transform = "rotateY(0deg) rotateX(0deg)";
  }

  return (
    <div
      className="relative w-full max-w-[440px] aspect-square mx-auto flex items-end justify-center"
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* podium / shelf */}
      <div className="absolute bottom-[10%] w-[78%] h-[86%] rounded-2xl bg-gradient-to-b from-ink/[0.04] to-ink/[0.09] border border-ink/10" />
      <div className="absolute bottom-[8%] w-[62%] h-[22px] rounded-full bg-ink/20 blur-xl" />
      <div className="absolute bottom-[42%] w-[45%] h-[45%] rounded-full bg-accent/20 blur-2xl animate-bloom" />

      <img
        ref={imgRef}
        src="/bitezo-smash-burger.webp"
        alt="Bitezo double smash burger"
        className="relative z-10 w-[78%] mb-[14%] animate-float [transition:transform_0.4s_ease-out] [transform-style:preserve-3d]"
        style={{ filter: "drop-shadow(0 25px 24px rgba(20,17,14,.28))" }}
      />
    </div>
  );
}
