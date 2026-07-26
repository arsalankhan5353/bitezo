export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type PriceVariant = {
  label: string;
  price: number;
};

export type MenuItem = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  variants: PriceVariant[] | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type OrderRecord = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: "dine-in" | "takeaway" | "delivery";
  status: OrderStatus;
  items: CartLine[];
  subtotal: number;
  notes: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Received",
  confirmed: "Confirmed",
  preparing: "In the Kitchen",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
];
