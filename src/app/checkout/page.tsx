"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import Nav from "@/components/nav";

export default function CheckoutPage() {
  const { lines, total, clear } = useCart();
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
        <h1 className="font-display text-4xl mb-8">Checkout</h1>

        {lines.length === 0 ? (
          <p className="text-muted">Your cart is empty — head back to the menu.</p>
        ) : (
          <>
            <div className="glass rounded-lg p-6 mb-8 space-y-3">
              {lines.map((l) => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span>
                    {l.qty}x {l.name}
                  </span>
                  <span className="text-accent2">Rs {(l.qty * l.price).toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="font-display italic text-accent2 text-lg">Rs {total.toFixed(0)}</span>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  required
                  placeholder="Your name"
                  className="bg-transparent border-b border-white/15 focus:border-accent outline-none py-3"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  placeholder="Phone number"
                  className="bg-transparent border-b border-white/15 focus:border-accent outline-none py-3"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <select
                className="bg-transparent border-b border-white/15 focus:border-accent outline-none py-3 w-full"
                value={form.orderType}
                onChange={(e) => setForm({ ...form, orderType: e.target.value as typeof form.orderType })}
              >
                <option value="dine-in" className="bg-bg2">
                  Dine-in
                </option>
                <option value="takeaway" className="bg-bg2">
                  Takeaway
                </option>
                <option value="delivery" className="bg-bg2">
                  Delivery
                </option>
              </select>

              {form.orderType === "delivery" && (
                <input
                  required
                  placeholder="Delivery address"
                  className="bg-transparent border-b border-white/15 focus:border-accent outline-none py-3 w-full"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              )}

              <input
                placeholder="Notes (optional)"
                className="bg-transparent border-b border-white/15 focus:border-accent outline-none py-3 w-full"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-accent text-black font-semibold uppercase text-sm tracking-widest disabled:opacity-50"
              >
                {loading ? "Placing order…" : "Place Order"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
