export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bitezo-logo.png" alt="Bitezo" className="w-10 h-10 rounded-full" />
            <span className="font-display text-xl">
              BITE<span className="text-accent">ZO</span>
            </span>
          </div>
          <p className="text-sm text-muted">Taste the love in every bite!</p>
        </div>

        <div className="text-sm text-muted space-y-2">
          <p className="font-semibold text-ink">Visit Us</p>
          <p>Noorkot Road, Near Shaikha Da Bhatta, Shakargarh</p>
          <p>Dine-in &amp; Takeaway</p>
        </div>

        <div className="text-sm text-muted space-y-2">
          <p className="font-semibold text-ink">Contact</p>
          <p>
            <a href="tel:+923255699066" className="hover:text-accent">
              0325-5699066
            </a>
          </p>
          <p>
            <a href="tel:+923254480361" className="hover:text-accent">
              0325-4480361
            </a>
          </p>
          <p>
            <a href="mailto:order@thebitezo.com" className="hover:text-accent">
              order@thebitezo.com
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-ink/10 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Bitezo. All rights reserved.
      </div>
    </footer>
  );
}
