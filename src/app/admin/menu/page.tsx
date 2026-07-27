"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Category, MenuItem } from "@/lib/types";

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("sort_order"),
    ]).then(([cats, its]) => {
      setCategories((cats.data ?? []) as Category[]);
      setItems((its.data ?? []) as MenuItem[]);
      setLoading(false);
    });
  }, []);

  async function handleUpload(item: MenuItem, file: File) {
    setError(null);
    setUploadingId(item.id);
    const supabase = createClient();

    const ext = file.name.split(".").pop();
    const path = `${item.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setUploadingId(null);
      return;
    }

    const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("menu_items")
      .update({ image_url: publicUrl })
      .eq("id", item.id);

    if (updateError) {
      setError(`Saved image but failed to update item: ${updateError.message}`);
    } else {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, image_url: publicUrl } : i)));
    }
    setUploadingId(null);
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl italic">
          Bite<span className="text-accent not-italic italic">zo</span> Admin — Menu Photos
        </h1>
        <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-muted hover:text-accent">
          Orders →
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <p className="text-muted">Loading menu…</p>
      ) : (
        categories.map((cat) => {
          const catItems = items.filter((i) => i.category_id === cat.id);
          if (catItems.length === 0) return null;
          return (
            <section key={cat.id} className="mb-12">
              <h2 className="font-display text-2xl mb-4">{cat.name}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {catItems.map((item) => (
                  <div key={item.id} className="glass rounded-xl p-4 flex flex-col gap-3">
                    <div className="w-full h-36 rounded-lg overflow-hidden bg-ink/5 flex items-center justify-center">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-muted">No photo</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold truncate">{item.name}</div>
                    <input
                      ref={(el) => {
                        fileInputs.current[item.id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(item, file);
                      }}
                    />
                    <button
                      onClick={() => fileInputs.current[item.id]?.click()}
                      disabled={uploadingId === item.id}
                      className="text-xs uppercase tracking-widest font-semibold border border-accent/40 text-accent rounded-md py-2 hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                    >
                      {uploadingId === item.id ? "Uploading…" : item.image_url ? "Replace Photo" : "Upload Photo"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
