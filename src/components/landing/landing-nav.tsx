"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MagneticButton from "./magnetic-button";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/40 backdrop-blur-xl border-b border-white/10" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-display italic text-2xl text-white">
          Bite<span className="text-accent not-italic italic">zo</span>
        </Link>
        <nav className="hidden md:flex items-center gap-9">
          {[
            ["Menu", "#menu"],
            ["Track Order", "/track"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="relative text-[.7rem] font-semibold tracking-[.2em] uppercase text-white/70 hover:text-white transition-colors group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>
          ))}
        </nav>
        <MagneticButton href="/order" className="text-[.65rem] px-6 py-3">
          Order Now
        </MagneticButton>
      </div>
    </header>
  );
}
