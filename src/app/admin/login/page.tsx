"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin/orders");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <h1 className="font-display text-3xl italic mb-8 text-center">
          Bite<span className="text-accent not-italic italic">zo</span> Admin
        </h1>
        <input
          required
          type="email"
          placeholder="Email"
          className="bg-transparent border-b border-ink/15 focus:border-accent outline-none py-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          placeholder="Password"
          className="bg-transparent border-b border-ink/15 focus:border-accent outline-none py-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-full bg-accent text-white font-semibold uppercase text-sm tracking-widest disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
