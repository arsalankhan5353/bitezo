"use client";

import { useRef } from "react";

export default function TiltCard({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(10px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm [transition:transform_.4s_ease-out] will-change-transform"
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/0 via-accent/0 to-accent2/0 group-hover:from-accent/40 group-hover:to-accent2/20 transition-all duration-500 pointer-events-none" />
      <div className="relative h-52 overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-transparent" />
        )}
      </div>
      <div className="p-5 flex items-center justify-between">
        <h3 className="font-display text-lg text-white">{name}</h3>
        <span className="font-display italic text-accent2">{price}</span>
      </div>
    </div>
  );
}
