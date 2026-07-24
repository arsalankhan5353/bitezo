"use client";

import type { Category, MenuItem } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

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
        {items.map((item) => (
          <div
            key={item.id}
            className="glass rounded-lg p-6 flex items-start justify-between gap-4 hover:border-accent/40 transition-colors"
          >
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="font-display text-xl">{item.name}</h3>
                {item.is_featured && (
                  <span className="text-[.6rem] uppercase tracking-widest text-accent2">Best Seller</span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted font-light mt-1 max-w-xs">{item.description}</p>
              )}
              <span className="font-display italic text-accent2 text-lg mt-3 inline-block">
                Rs {item.price.toFixed(0)}
              </span>
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
