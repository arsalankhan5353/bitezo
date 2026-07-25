import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bitezo — Crafted To Satisfy Every Craving",
  description:
    "Bitezo — Shakargarh's first luxury family dining spot. Handcrafted gourmet burgers and wood-fired pizzas made with premium ingredients.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-bg text-ink">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
