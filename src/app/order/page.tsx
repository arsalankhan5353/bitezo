import { createClient } from "@/lib/supabase/server";
import type { Category, MenuItem } from "@/lib/types";
import Nav from "@/components/nav";
import MenuSection from "@/components/menu-section";
import CartBar from "@/components/cart-bar";
import HeroBurger from "@/components/hero-burger";
import Footer from "@/components/footer";

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
    <main className="min-h-screen relative bg-bg">
      <Nav />

      <section className="relative min-h-[85vh] grid md:grid-cols-2 items-center gap-10 px-6 md:px-12 pt-32 pb-16 max-w-6xl mx-auto overflow-hidden">
        <div className="text-center md:text-left">
          <span className="animate-fade-up inline-flex items-center gap-3 text-[.72rem] font-bold tracking-[.28em] uppercase text-accent2 mb-5">
            <span className="w-8 h-px bg-accent2" /> Shakargarh&apos;s First Luxury Family Spot
          </span>
          <h1
            className="animate-fade-up font-display uppercase text-[clamp(2.8rem,6.5vw,5rem)] leading-[0.95] mb-6 text-ink"
            style={{ animationDelay: "0.1s" }}
          >
            Built Like An
            <br />
            <span className="text-gradient">All-Star Craving.</span>
          </h1>
          <p
            className="animate-fade-up text-muted max-w-md mx-auto md:mx-0 text-lg mb-8"
            style={{ animationDelay: "0.2s" }}
          >
            Handcrafted gourmet burgers and wood-fired pizzas made with premium ingredients —
            order straight from the menu below.
          </p>
          <a
            href="#menu"
            className="animate-fade-up inline-block px-9 py-4 rounded-md bg-accent text-white text-sm font-bold tracking-widest uppercase hover:bg-ink transition-colors"
            style={{ animationDelay: "0.3s" }}
          >
            Order Now
          </a>
        </div>

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

      <Footer />
      <CartBar />
    </main>
  );
}
