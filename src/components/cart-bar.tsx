"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartBar() {
  const { count, total } = useCart();
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4">
      <Link
        href="/checkout"
        className="glass rounded-full px-6 py-4 flex items-center gap-5 shadow-2xl hover:scale-[1.02] transition-transform"
      >
        <span className="text-sm">
          <strong>{count}</strong> item{count > 1 ? "s" : ""}
        </span>
        <span className="font-display italic text-accent2">Rs {total.toFixed(0)}</span>
        <span className="px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-widest">
          Checkout
        </span>
      </Link>
    </div>
  );
}
