import { createClient } from "@/lib/supabase/server";
import type { Category, MenuItem } from "@/lib/types";
import Nav from "@/components/nav";
import MenuSection from "@/components/menu-section";
import CartBar from "@/components/cart-bar";
import HeroBurger from "@/components/hero-burger";
import EmberParticles from "@/components/ember-particles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("sort_order"),
  ]);

  const cats = (categories ?? []) as Category[];
  const menuItems = (items ?? []) as MenuItem[];

  return (
    <main className="min-h-screen relative">
      <EmberParticles />
      <Nav />

      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 700px at 50% 30%, rgba(255,106,0,.16), transparent 60%), #050505",
          }}
        />
        <span className="animate-fade-up text-[.72rem] font-semibold tracking-[.32em] uppercase text-accent mb-5 flex items-center gap-3">
          <span className="w-8 h-px bg-accent" /> Shakargarh&apos;s First Luxury Family Spot{" "}
          <span className="w-8 h-px bg-accent" />
        </span>
        <h1
          className="animate-fade-up font-display font-semibold text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.05] mb-6"
          style={{ animationDelay: "0.1s" }}
        >
          Crafted To Satisfy
          <br />
          <em className="text-gradient not-italic italic">Every Craving</em>
        </h1>
        <p
          className="animate-fade-up text-muted max-w-xl text-lg font-light mb-10"
          style={{ animationDelay: "0.2s" }}
        >
          Handcrafted gourmet burgers and wood-fired pizzas made with premium ingredients —
          order straight from the menu below.
        </p>
        <a
          href="#menu"
          className="animate-fade-up px-9 py-4 rounded-full bg-accent text-black text-sm font-semibold tracking-widest uppercase hover:scale-105 transition-transform"
          style={{ animationDelay: "0.3s" }}
        >
          Order Now
        </a>

        <HeroBurger />
      </section>

      <div id="menu" className="relative max-w-6xl mx-auto px-6 pb-40">
        {cats.map((cat) => (
          <MenuSection
            key={cat.id}
            category={cat}
            items={menuItems.filter((i) => i.category_id === cat.id)}
          />
        ))}
      </div>

      <CartBar />
    </main>
  );
}
