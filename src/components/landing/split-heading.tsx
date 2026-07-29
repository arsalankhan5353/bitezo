"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SplitHeading({
  text,
  as: Tag = "h1",
  className = "",
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "div";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const letters = el.querySelectorAll<HTMLSpanElement>(".sh-letter");
    gsap.fromTo(
      letters,
      { opacity: 0, yPercent: 120, rotateZ: 6 },
      { opacity: 1, yPercent: 0, rotateZ: 0, duration: 0.9, stagger: 0.02, delay, ease: "power4.out" }
    );
  }, [delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {text.split("").map((ch, i) => (
        <span key={i} className="sh-letter inline-block will-change-transform">
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </Tag>
  );
}
