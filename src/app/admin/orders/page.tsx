"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderRecord, OrderStatus } from "@/lib/types";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/types";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as OrderRecord[]);
        setLoading(false);
      });

    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        setOrders((prev) => {
          if (payload.eventType === "INSERT") {
            return [payload.new as OrderRecord, ...prev];
          }
          if (payload.eventType === "UPDATE") {
            return prev.map((o) => (o.id === (payload.new as OrderRecord).id ? (payload.new as OrderRecord) : o));
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    const supabase = createClient();
    await supabase.from("orders").update({ status }).eq("id", id);
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl italic">
          Bite<span className="text-accent not-italic italic">zo</span> Admin
        </h1>
        <button onClick={logout} className="text-xs uppercase tracking-widest text-muted hover:text-white">
          Sign Out
        </button>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border ${
            filter === "all" ? "bg-accent text-black border-accent" : "border-white/15 text-muted"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border ${
              filter === s ? "bg-accent text-black border-accent" : "border-white/15 text-muted"
            }`}
          >
            {STATUS_LABELS[s]} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Loading orders…</p>
      ) : visible.length === 0 ? (
        <p className="text-muted">No orders here yet.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => (
            <div key={order.id} className="glass rounded-lg p-6">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                <div>
                  <span className="text-xs uppercase tracking-widest text-accent">{order.order_number}</span>
                  <h3 className="font-display text-xl mt-1">{order.customer_name}</h3>
                  <p className="text-sm text-muted">
                    {order.customer_phone} · {order.order_type}
                    {order.address ? ` · ${order.address}` : ""}
                  </p>
                </div>
                <span className="font-display italic text-accent2 text-lg">
                  Rs {order.subtotal.toFixed(0)}
                </span>
              </div>

              <div className="text-sm text-muted mb-4">
                {order.items.map((l) => `${l.qty}x ${l.name}`).join(", ")}
                {order.notes && <p className="mt-1 italic">Note: {order.notes}</p>}
              </div>

              <div className="flex gap-2 flex-wrap">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.id, s)}
                    className={`px-3 py-1.5 rounded-full text-[.7rem] uppercase tracking-widest border transition-colors ${
                      order.status === s
                        ? "bg-accent text-black border-accent"
                        : "border-white/15 text-muted hover:border-white/40"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
                <button
                  onClick={() => updateStatus(order.id, "cancelled")}
                  className={`px-3 py-1.5 rounded-full text-[.7rem] uppercase tracking-widest border transition-colors ${
                    order.status === "cancelled"
                      ? "bg-red-500 text-black border-red-500"
                      : "border-white/15 text-muted hover:border-red-400"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
