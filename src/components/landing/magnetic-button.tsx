"use client";

import { useRef } from "react";
import gsap from "gsap";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "fill" | "outline";
  className?: string;
};

export default function MagneticButton({ href, onClick, children, variant = "fill", className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    gsap.to(el, { x: x * 0.35, y: y * 0.45, duration: 0.4, ease: "power3.out" });
  }

  function handleLeave() {
    const el = ref.current;
    if (el) gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,.4)" });
  }

  function handleClick(e: React.MouseEvent) {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const ripple = document.createElement("span");
      ripple.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;background:rgba(255,255,255,.5);
        width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px;
        transform:scale(0);animation:bitezoRipple .6s ease-out forwards;`;
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    }
    onClick?.();
  }

  const base =
    "relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold tracking-[.18em] uppercase transition-colors";
  const styles =
    variant === "fill"
      ? "bg-accent text-white hover:bg-white hover:text-black"
      : "border border-white/25 text-white hover:border-white";

  const Comp = href ? "a" : "button";

  return (
    <Comp
      ref={ref as never}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </Comp>
  );
}
