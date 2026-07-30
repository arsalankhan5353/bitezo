import { createClient } from "@/lib/supabase/server";
import type { Category, MenuItem } from "@/lib/types";
import LandingExperience from "@/components/landing/landing-experience";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("sort_order"),
  ]);

  return (
    <LandingExperience
      categories={(categories ?? []) as Category[]}
      items={(items ?? []) as MenuItem[]}
    />
  );
}
