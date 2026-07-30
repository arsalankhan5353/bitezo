"use client";

import { useState } from "react";
import type { Category, MenuItem } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import CategoryIcon from "@/components/category-icon";

export default function MenuSection({ category, items }: { category: Category; items: MenuItem[] }) {
  const { add } = useCart();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  if (items.length === 0) return null;

  return (
    <section className="pt-24 first:pt-4">
      <div className="mb-10">
        <span className="animate-float inline-block text-[.7rem] font-semibold tracking-[.28em] uppercase text-accent">
          {category.name}
        </span>
        <h2 className="font-display text-3xl mt-2">{category.name}</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="glass rounded-2xl overflow-hidden hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div
              className="relative h-56 flex items-end justify-center overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 50% 55%, rgba(255,200,87,.28), rgba(255,106,0,.10) 55%, transparent 75%)",
              }}
            >
              <div className="absolute bottom-6 w-[55%] h-4 rounded-full bg-ink/15 blur-md" />

              <div
                className="relative animate-float w-full h-[85%] flex items-center justify-center pb-3"
                style={{ animationDelay: `${(i % 5) * 0.3}s` }}
              >
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.name}
                    onClick={() => setLightbox({ src: item.image_url!, alt: item.name })}
                    className="w-[85%] h-[85%] object-cover rounded-xl cursor-zoom-in"
                    style={{ filter: "drop-shadow(0 20px 20px rgba(20,17,14,.35))" }}
                  />
                ) : (
                  <CategoryIcon slug={category.slug} className="w-16 h-16 text-accent2" />
                )}
              </div>

              {item.is_featured && (
                <span
                  className="animate-float absolute top-4 right-4 text-[.6rem] uppercase tracking-widest bg-ink/85 backdrop-blur px-3 py-1.5 rounded-full text-accent2 border border-ink/10"
                  style={{ animationDelay: "0.6s" }}
                >
                  Best Seller
                </span>
              )}
            </div>

            <div className="p-6 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display text-xl">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-muted font-light mt-1">{item.description}</p>
                  )}
                </div>

                {!item.variants && item.price != null && (
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-display italic text-accent2 text-lg">
                      Rs {item.price.toFixed(0)}
                    </span>
                    <button
                      onClick={() => add({ id: item.id, name: item.name, price: item.price!, image_url: item.image_url })}
                      className="w-11 h-11 rounded-full border border-accent/40 text-accent flex items-center justify-center hover:bg-accent hover:text-white hover:scale-110 transition-all text-xl"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {item.variants && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.variants.map((v) => (
                    <button
                      key={v.label}
                      onClick={() =>
                        add({ id: `${item.id}-${v.label}`, name: `${item.name} (${v.label})`, price: v.price, image_url: item.image_url })
                      }
                      className="group px-3 py-2 rounded-lg border border-ink/12 hover:border-accent hover:bg-accent transition-all text-xs font-semibold text-center"
                    >
                      <div>{v.label}</div>
                      <div className="text-accent2 group-hover:text-white font-display italic">
                        Rs {v.price}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-8 text-white/70 text-sm font-display italic text-lg">
            {lightbox.alt}
          </span>
        </div>
      )}
    </section>
  );
}
