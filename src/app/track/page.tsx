"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Nav from "@/components/nav";

export default function TrackLookupPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", orderNumber.trim().toUpperCase())
      .eq("customer_phone", phone.trim())
      .single();
    setLoading(false);
    if (!data) {
      setError("No matching order found — check your order number and phone.");
      return;
    }
    router.push(`/order/${data.id}`);
  }

  return (
    <main className="min-h-screen">
      <Nav />
      <div className="max-w-md mx-auto px-6 pt-32 pb-24">
        <h1 className="font-display text-4xl mb-2">Track Your Order</h1>
        <p className="text-muted mb-10 text-sm">
          Enter your order number (e.g. BTZ-260724-0001) and the phone number you ordered with.
        </p>
        <form onSubmit={submit} className="space-y-5">
          <input
            required
            placeholder="Order number"
            className="bg-transparent border-b border-white/15 focus:border-accent outline-none py-3 w-full"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <input
            required
            placeholder="Phone number"
            className="bg-transparent border-b border-white/15 focus:border-accent outline-none py-3 w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-accent text-black font-semibold uppercase text-sm tracking-widest disabled:opacity-50"
          >
            {loading ? "Searching…" : "Find My Order"}
          </button>
        </form>
      </div>
    </main>
  );
}
