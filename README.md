# Bitezo — Restaurant Ordering App

Next.js 14 + Supabase. Shakargarh's first luxury family dining spot.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Realtime) for menu, orders, and live order tracking

## Environment variables (set these in Vercel project settings)
```
NEXT_PUBLIC_SUPABASE_URL=https://sgmbpuphngegzltxbkhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_WHATSAPP_NUMBER=923255699066
```

## Routes
- `/` — menu, add to cart
- `/checkout` — places a real order in Supabase
- `/order/[id]` — live order tracking (realtime status updates)
- `/track` — look up an order by order number + phone
- `/admin/login` — admin sign in
- `/admin/orders` — realtime order dashboard, update order status
