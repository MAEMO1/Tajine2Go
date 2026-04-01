import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { AnalyticsContent } from "./analytics-content";

export default async function AnalyticsPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();

  const [dailyRes, dishRes, vatRes, cateringRes] = await Promise.all([
    supabase.from("daily_summary").select("*").limit(90),
    supabase.from("dish_rankings").select("*").limit(20),
    supabase.from("vat_summary").select("*").limit(12),
    supabase.from("catering_revenue").select("*"),
  ]);

  return (
    <AdminShell>
      <AnalyticsContent
        dailySummary={dailyRes.data ?? []}
        dishRankings={dishRes.data ?? []}
        vatSummary={vatRes.data ?? []}
        cateringRevenue={cateringRes.data ?? []}
      />
    </AdminShell>
  );
}
