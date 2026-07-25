import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-ink/8 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl">
          BITE<span className="text-accent">ZO</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-ink/70">
          <a href="/#menu" className="hover:text-accent transition-colors">
            Menu
          </a>
          <Link href="/track" className="hover:text-accent transition-colors">
            Track Order
          </Link>
          <a
            href="/#menu"
            className="bg-ink text-white px-6 py-3 rounded-md hover:bg-accent transition-colors"
          >
            Order Now
          </a>
        </nav>
      </div>
    </header>
  );
}
