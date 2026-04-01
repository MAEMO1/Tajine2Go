import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Today's stats
  const { data: todayOrders } = await supabase
    .from("orders")
    .select("total_cents, fulfillment, payment_method")
    .eq("order_date", today)
    .not("status", "eq", "cancelled");

  const todayRevenue = todayOrders?.reduce((sum, o) => sum + o.total_cents, 0) ?? 0;
  const todayCount = todayOrders?.length ?? 0;

  // Week stats
  const { data: weekOrders } = await supabase
    .from("orders")
    .select("total_cents")
    .gte("order_date", weekAgo)
    .not("status", "eq", "cancelled");

  const weekRevenue = weekOrders?.reduce((sum, o) => sum + o.total_cents, 0) ?? 0;
  const avgOrder = todayCount > 0 ? Math.round(todayRevenue / todayCount) : 0;

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

  // Ratios
  const pickupCount = todayOrders?.filter((o) => o.fulfillment === "pickup").length ?? 0;
  const deliveryCount = todayOrders?.filter((o) => o.fulfillment === "delivery").length ?? 0;
  const onlineCount = todayOrders?.filter((o) => o.payment_method === "online").length ?? 0;
  const cashCount = todayOrders?.filter((o) => o.payment_method === "cash").length ?? 0;

  return (
    <AdminShell>
      <DashboardContent
        todayRevenue={todayRevenue}
        todayCount={todayCount}
        weekRevenue={weekRevenue}
        avgOrder={avgOrder}
        dailySummary={dailySummary ?? []}
        topDishes={topDishes ?? []}
        pickupCount={pickupCount}
        deliveryCount={deliveryCount}
        onlineCount={onlineCount}
        cashCount={cashCount}
      />
    </AdminShell>
  );
}
