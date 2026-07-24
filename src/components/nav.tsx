import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-display italic text-2xl">
          Bite<em className="text-accent not-italic italic">zo</em>
        </Link>
        <nav className="hidden md:flex gap-10 text-xs tracking-widest uppercase text-muted">
          <a href="/#menu" className="hover:text-white transition-colors">
            Menu
          </a>
          <Link href="/track" className="hover:text-white transition-colors">
            Track Order
          </Link>
        </nav>
      </div>
    </header>
  );
}
