"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Loader from "./loader";
import ParticlesBg from "./particles-bg";
import LandingNav from "./landing-nav";
import SplitHeading from "./split-heading";
import MagneticButton from "./magnetic-button";
import TiltCard from "./tilt-card";

// Three.js/R3F is a large dependency — load it only in the browser, split
// into its own chunk, so it never blocks the initial HTML/CSS/text paint.
const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#050302]" />,
});

type PreviewItem = { id: string; name: string; price: number | null; image_url: string | null };

export default function LandingExperience({ featuredItems }: { featuredItems: PreviewItem[] }) {
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Lenis smooth scroll, wired into GSAP's ticker + ScrollTrigger, scoped to
  // this page only so /order keeps native scroll for form usability.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      // hero copy parallax-fades as you scroll past it
      gsap.to("[data-hero-copy]", {
        opacity: 0,
        y: -60,
        scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={rootRef} className="bg-[#050302] text-white">
      {!ready && <Loader onDone={() => setReady(true)} />}
      <ParticlesBg />
      <LandingNav />

      {/* ambient glow blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="landing-blob absolute w-[600px] h-[600px] rounded-full bg-accent/20 blur-[120px] -top-40 -right-40" />
        <div
          className="landing-blob absolute w-[500px] h-[500px] rounded-full bg-accent2/10 blur-[120px] bottom-0 -left-40"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <section data-hero className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-[2]">
          <HeroScene />
        </div>
        <div data-hero-copy className="relative z-[3] max-w-3xl mx-auto px-6 text-center pointer-events-none mt-24">
          <span className="inline-flex items-center gap-3 text-[.7rem] font-bold tracking-[.3em] uppercase text-accent2 mb-6">
            <span className="w-8 h-px bg-accent2" /> Shakargarh&apos;s First Luxury Family Spot
            <span className="w-8 h-px bg-accent2" />
          </span>
          <SplitHeading
            text="Crafted To Satisfy"
            as="h1"
            className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02]"
          />
          <SplitHeading
            text="Every Craving"
            as="div"
            delay={0.15}
            className="font-display italic text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02] text-accent2"
          />
          <p className="mt-8 text-white/60 max-w-lg mx-auto text-lg font-light">
            Handcrafted gourmet burgers and wood-fired pizzas, made fresh — order in seconds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 pointer-events-auto">
            <MagneticButton href="/order">Order Now</MagneticButton>
            <MagneticButton href="/order#menu" variant="outline">
              Explore Menu
            </MagneticButton>
          </div>
        </div>
      </section>

      <section className="relative z-[3] py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div data-reveal className="max-w-xl mb-16">
            <span className="text-[.7rem] font-bold tracking-[.3em] uppercase text-accent">Fan Favorites</span>
            <h2 className="font-display text-4xl mt-3">A taste of what&apos;s waiting.</h2>
          </div>
          <div data-reveal className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <TiltCard
                key={item.id}
                name={item.name}
                price={item.price != null ? `Rs ${item.price}` : "See menu"}
                image={item.image_url}
              />
            ))}
          </div>
          <div data-reveal className="mt-14 text-center">
            <MagneticButton href="/order">See Full Menu</MagneticButton>
          </div>
        </div>
      </section>

      <footer className="relative z-[3] border-t border-white/10 py-12 px-6 text-center">
        <p className="font-display italic text-xl mb-2">
          Bite<span className="text-accent">zo</span>
        </p>
        <p className="text-white/40 text-sm">Taste the love in every bite! · Noorkot Road, Near Shaikha Da Bhatta, Shakargarh</p>
      </footer>
    </div>
  );
}
