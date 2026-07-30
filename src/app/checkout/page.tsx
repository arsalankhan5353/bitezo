"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import Nav from "@/components/nav";

const ORDER_TYPES: { value: "dine-in" | "takeaway" | "delivery"; label: string; icon: string }[] = [
  { value: "dine-in", label: "Dine-in", icon: "M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  {
    value: "takeaway",
    label: "Takeaway",
    icon: "M6 2l1.5 5h9L18 2M4 8h16l-1.5 12a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L4 8z",
  },
  {
    value: "delivery",
    label: "Delivery",
    icon: "M1 7h13v9H1zM14 11h3l3 3v2h-6zM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
];

export default function CheckoutPage() {
  const { lines, total, clear, setQty, remove } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    orderType: "dine-in" as "dine-in" | "takeaway" | "delivery",
    address: "",
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("orders")
      .insert({
        customer_name: form.name,
        customer_phone: form.phone,
        order_type: form.orderType,
        items: lines,
        subtotal: total,
        notes: form.notes || null,
        address: form.orderType === "delivery" ? form.address : null,
      })
      .select()
      .single();

    setLoading(false);

    if (insertError || !data) {
      setError("Something went wrong placing your order. Please try again or WhatsApp us directly.");
      return;
    }

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const itemsText = lines.map((l) => `${l.qty}x ${l.name}`).join(", ");
    const msg = encodeURIComponent(
      `New order ${data.order_number}\nName: ${form.name}\nPhone: ${form.phone}\nType: ${form.orderType}\nItems: ${itemsText}\nTotal: Rs ${total}`
    );
    window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");

    clear();
    router.push(`/order/${data.id}`);
  }

  return (
    <main className="min-h-screen">
      <Nav />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <h1 className="font-display text-4xl mb-1">Checkout</h1>
        <p className="text-muted text-sm mb-8">Review your order and tell us where to send it.</p>

        {lines.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-muted mb-4">Your cart is empty.</p>
            <a
              href="/order#menu"
              className="inline-block px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold uppercase tracking-widest"
            >
              Browse the Menu
            </a>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-ink/10 overflow-hidden mb-8">
              {lines.map((l, i) => (
                <div
                  key={l.id}
                  className={`flex items-center gap-4 p-4 bg-white ${i !== lines.length - 1 ? "border-b border-ink/8" : ""}`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-ink/5 shrink-0 flex items-center justify-center">
                    {l.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.image_url} alt={l.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[.6rem] text-muted">No photo</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{l.name}</h4>
                    <span className="font-display italic text-accent2">Rs {l.price.toFixed(0)}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 border border-ink/15 rounded-full">
                      <button
                        type="button"
                        onClick={() => setQty(l.id, l.qty - 1)}
                        aria-label={`Decrease ${l.name} quantity`}
                        className="w-8 h-8 flex items-center justify-center text-lg text-ink/70 hover:text-accent transition-colors rounded-full"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(l.id, l.qty + 1)}
                        aria-label={`Increase ${l.name} quantity`}
                        className="w-8 h-8 flex items-center justify-center text-lg text-ink/70 hover:text-accent transition-colors rounded-full"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(l.id)}
                      aria-label={`Remove ${l.name}`}
                      className="text-ink/30 hover:text-red-500 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                      </svg>
                    </button>
                  </div>

                  <span className="w-16 text-right font-display italic text-sm shrink-0">
                    Rs {(l.qty * l.price).toFixed(0)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-4 bg-bg2">
                <span className="font-semibold">Total</span>
                <span className="font-display italic text-accent2 text-xl">Rs {total.toFixed(0)}</span>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[.65rem] uppercase tracking-widest text-muted mb-1.5">Your Name</label>
                  <input
                    required
                    placeholder="Full name"
                    className="w-full rounded-lg border border-ink/12 bg-white px-4 py-3 text-sm focus:border-accent outline-none transition-colors"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[.65rem] uppercase tracking-widest text-muted mb-1.5">Phone</label>
                  <input
                    required
                    placeholder="03XX-XXXXXXX"
                    className="w-full rounded-lg border border-ink/12 bg-white px-4 py-3 text-sm focus:border-accent outline-none transition-colors"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[.65rem] uppercase tracking-widest text-muted mb-2">Order Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {ORDER_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, orderType: t.value })}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
                        form.orderType === t.value
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-ink/12 text-ink/60 hover:border-ink/25"
                      }`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d={t.icon} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs font-semibold">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {form.orderType === "delivery" && (
                <div>
                  <label className="block text-[.65rem] uppercase tracking-widest text-muted mb-1.5">
                    Delivery Address
                  </label>
                  <input
                    required
                    placeholder="House / street / area"
                    className="w-full rounded-lg border border-ink/12 bg-white px-4 py-3 text-sm focus:border-accent outline-none transition-colors"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="block text-[.65rem] uppercase tracking-widest text-muted mb-1.5">
                  Notes (optional)
                </label>
                <input
                  placeholder="Anything we should know?"
                  className="w-full rounded-lg border border-ink/12 bg-white px-4 py-3 text-sm focus:border-accent outline-none transition-colors"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-accent text-white font-semibold uppercase text-sm tracking-widest disabled:opacity-50 hover:bg-ink transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Placing order…"
                ) : (
                  <>
                    Place Order · Rs {total.toFixed(0)}
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
