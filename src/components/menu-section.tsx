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
        <span className="text-[.7rem] font-semibold tracking-[.28em] uppercase text-accent">
          {category.name}
        </span>
        <h2 className="font-display text-3xl mt-2">{category.name} Menu</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="glass rounded-lg p-6 flex items-center justify-between gap-4 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center gap-5 min-w-0">
              <div
                className="relative shrink-0 w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,200,87,.28), rgba(255,106,0,.12) 60%, transparent 75%)",
                }}
              >
                <div className="animate-float" style={{ animationDelay: `${(i % 5) * 0.3}s` }}>
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-24 object-contain"
                      style={{ filter: "drop-shadow(0 10px 12px rgba(0,0,0,.5))" }}
                    />
                  ) : (
                    <CategoryIcon slug={category.slug} className="w-9 h-9 text-accent2" />
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="font-display text-xl">{item.name}</h3>
                  {item.is_featured && (
                    <span className="text-[.6rem] uppercase tracking-widest text-accent2">
                      Best Seller
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-muted font-light mt-1">{item.description}</p>
                )}
                <span className="font-display italic text-accent2 text-lg mt-2 inline-block">
                  Rs {item.price.toFixed(0)}
                </span>
              </div>
            </div>

            <button
              onClick={() => add({ id: item.id, name: item.name, price: item.price })}
              className="shrink-0 w-11 h-11 rounded-full border border-accent/40 text-accent flex items-center justify-center hover:bg-accent hover:text-black transition-colors text-xl"
              aria-label={`Add ${item.name} to cart`}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
