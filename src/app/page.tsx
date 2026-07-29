import { createClient } from "@/lib/supabase/server";
import LandingExperience from "@/components/landing/landing-experience";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("menu_items")
    .select("id,name,price,image_url")
    .eq("is_featured", true)
    .eq("is_available", true)
    .limit(6);

  return <LandingExperience featuredItems={data ?? []} />;
}
