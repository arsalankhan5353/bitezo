"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderRecord } from "@/lib/types";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/types";
import Nav from "@/components/nav";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setOrder(data as OrderRecord | null);
        setLoading(false);
      });

    const channel = supabase
      .channel(`order-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` },
        (payload) => setOrder(payload.new as OrderRecord)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return (
    <main className="min-h-screen">
      <Nav />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        {loading ? (
          <p className="text-muted">Loading order…</p>
        ) : !order ? (
          <p className="text-muted">Order not found.</p>
        ) : (
          <>
            <span className="text-xs uppercase tracking-widest text-accent">
              Order {order.order_number}
            </span>
            <h1 className="font-display text-4xl mt-2 mb-2">
              {order.status === "cancelled" ? "Order Cancelled" : STATUS_LABELS[order.status]}
            </h1>
            <p className="text-muted mb-10">
              This page updates live — no need to refresh.
            </p>

            {order.status !== "cancelled" && (
              <div className="flex items-center gap-1 mb-12">
                {STATUS_ORDER.map((s, i) => {
                  const currentIdx = STATUS_ORDER.indexOf(order.status);
                  const active = i <= currentIdx;
                  return (
                    <div key={s} className="flex-1 flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          active ? "bg-accent" : "bg-white/15"
                        }`}
                      />
                      {i < STATUS_ORDER.length - 1 && (
                        <div className={`h-px flex-1 ${active ? "bg-accent" : "bg-white/15"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="glass rounded-lg p-6 space-y-3 mb-6">
              {order.items.map((l) => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span>
                    {l.qty}x {l.name}
                  </span>
                  <span className="text-accent2">Rs {(l.qty * l.price).toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="font-display italic text-accent2 text-lg">
                  Rs {order.subtotal.toFixed(0)}
                </span>
              </div>
            </div>

            <div className="text-sm text-muted space-y-1">
              <p>Type: {order.order_type}</p>
              {order.address && <p>Address: {order.address}</p>}
              {order.notes && <p>Notes: {order.notes}</p>}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
