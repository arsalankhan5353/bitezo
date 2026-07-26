"use client";

import type { Category, MenuItem } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import CategoryIcon from "@/components/category-icon";

export default function MenuSection({ category, items }: { category: Category; items: MenuItem[] }) {
  const { add } = useCart();
  if (items.length === 0) return null;

  return (
    <section className="pt-24 first:pt-4">
      <div className="mb-10">
        <span className="animate-float inline-block text-[.7rem] font-semibold tracking-[.28em] uppercase text-accent">
          {category.name}
        </span>
        <h2 className="font-display text-3xl mt-2">{category.name} Menu</h2>
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
              {/* podium shadow, matching the hero burger's shelf */}
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
                    className="w-[85%] h-[85%] object-cover rounded-xl"
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

            <div className="p-6 flex items-start justify-between gap-4 flex-1">
              <div className="min-w-0">
                <h3 className="font-display text-xl">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-muted font-light mt-1">{item.description}</p>
                )}
                <span className="font-display italic text-accent2 text-lg mt-2 inline-block">
                  Rs {item.price.toFixed(0)}
                </span>
              </div>

              <button
                onClick={() => add({ id: item.id, name: item.name, price: item.price })}
                className="shrink-0 w-11 h-11 rounded-full border border-accent/40 text-accent flex items-center justify-center hover:bg-accent hover:text-white hover:scale-110 transition-all text-xl"
                aria-label={`Add ${item.name} to cart`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
