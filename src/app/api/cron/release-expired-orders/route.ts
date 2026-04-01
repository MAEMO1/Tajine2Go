import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Find expired online pending orders
  const { data: expiredOrders } = await supabase
    .from("orders")
    .select("id")
    .eq("payment_method", "online")
    .eq("status", "pending")
    .eq("payment_status", "pending")
    .lte("payment_expires_at", new Date().toISOString());

  if (!expiredOrders || expiredOrders.length === 0) {
    return NextResponse.json({ released: 0 });
  }

  let released = 0;

  for (const order of expiredOrders) {
    // Cancel order
    await supabase
      .from("orders")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancel_reason: "payment_expired",
        payment_status: "failed",
      })
      .eq("id", order.id);

    // Release stock
    const { data: items } = await supabase
      .from("order_items")
      .select("weekly_menu_id, quantity")
      .eq("order_id", order.id);

    if (items) {
      for (const item of items) {
        await supabase.rpc("release_weekly_menu_portions", {
          menu_id: item.weekly_menu_id,
          qty: item.quantity,
        });
      }
    }

    released++;
  }

  return NextResponse.json({ released });
}
