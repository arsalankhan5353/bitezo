"use client";

import { useRef } from "react";
import { useCart } from "@/lib/cart-context";
import type { MenuItem } from "@/lib/types";

export default function LandingMenuItem({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateZ(8px)`;
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
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm [transition:transform_.4s_ease-out] will-change-transform flex flex-col"
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/0 to-accent2/0 group-hover:from-accent/40 group-hover:to-accent2/20 transition-all duration-500 pointer-events-none z-10" />

      <div className="relative h-44 overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/25 to-transparent flex items-center justify-center">
            <span className="font-display italic text-white/30 text-sm">Bitezo</span>
          </div>
        )}
        {item.is_featured && (
          <span className="absolute top-3 right-3 text-[.55rem] uppercase tracking-widest bg-black/70 backdrop-blur px-2.5 py-1 rounded-full text-accent2 border border-white/10">
            Best Seller
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-lg text-white">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-white/45 font-light mt-1 line-clamp-2">{item.description}</p>
        )}

        <div className="mt-auto pt-4">
          {!item.variants && item.price != null && (
            <div className="flex items-center justify-between">
              <span className="font-display italic text-accent2 text-lg">Rs {item.price.toFixed(0)}</span>
              <button
                onClick={() => add({ id: item.id, name: item.name, price: item.price! })}
                className="w-9 h-9 rounded-full border border-accent/40 text-accent flex items-center justify-center hover:bg-accent hover:text-white hover:scale-110 transition-all text-lg"
                aria-label={`Add ${item.name} to cart`}
              >
                +
              </button>
            </div>
          )}

          {item.variants && (
            <div className="flex flex-wrap gap-1.5">
              {item.variants.map((v) => (
                <button
                  key={v.label}
                  onClick={() =>
                    add({ id: `${item.id}-${v.label}`, name: `${item.name} (${v.label})`, price: v.price })
                  }
                  className="px-2.5 py-1.5 rounded-md border border-white/10 hover:border-accent hover:bg-accent transition-all text-[.65rem] font-semibold text-white/70 hover:text-white"
                >
                  {v.label} · Rs {v.price}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
