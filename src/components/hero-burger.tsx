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
      className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center mt-10"
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,182,72,.35),rgba(255,92,46,.14)_55%,transparent_72%)] blur-md animate-bloom" />
      <div className="absolute bottom-[6%] w-[58%] h-[34px] rounded-full bg-black/60 blur-xl" />
      <img
        ref={imgRef}
        src="/bitezo-smash-burger.webp"
        alt="Bitezo double smash burger"
        className="relative z-10 w-[115%] max-w-none animate-float [transition:transform_0.4s_ease-out] [transform-style:preserve-3d]"
        style={{ filter: "drop-shadow(0 25px 30px rgba(0,0,0,.55))" }}
      />
    </div>
  );
}
