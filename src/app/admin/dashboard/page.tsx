import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardContent } from "./dashboard-content";

type DashboardMetrics = {
  today_revenue: number;
  today_count: number;
  week_revenue: number;
  avg_order: number;
  pickup_count: number;
  delivery_count: number;
  online_count: number;
  cash_count: number;
};

export default async function DashboardPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();
  const { data: metricsRows } = await supabase.rpc("get_dashboard_metrics");
  const metrics = (metricsRows?.[0] ?? null) as DashboardMetrics | null;

  // Daily summary for chart (last 30 days)
  const { data: dailySummary } = await supabase
    .from("daily_summary")
    .select("*")
    .limit(30);

  // Top dishes
  const { data: topDishes } = await supabase
    .from("dish_rankings")
    .select("*")
    .limit(5);

  return (
    <AdminShell>
      <DashboardContent
        todayRevenue={metrics?.today_revenue ?? 0}
        todayCount={metrics?.today_count ?? 0}
        weekRevenue={metrics?.week_revenue ?? 0}
        avgOrder={metrics?.avg_order ?? 0}
        dailySummary={dailySummary ?? []}
        topDishes={topDishes ?? []}
        pickupCount={metrics?.pickup_count ?? 0}
        deliveryCount={metrics?.delivery_count ?? 0}
        onlineCount={metrics?.online_count ?? 0}
        cashCount={metrics?.cash_count ?? 0}
      />
    </AdminShell>
  );
}
