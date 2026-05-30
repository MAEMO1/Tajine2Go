import "server-only";

import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PublicOrderStatus } from "@/types/database";

export async function getPublicOrderStatus(
  orderId: string,
  token: string | null | undefined,
): Promise<PublicOrderStatus | null> {
  if (!token) {
    return null;
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_number, status, fulfillment, pickup_slot, total_cents, public_status_token_hash")
    .eq("id", orderId)
    .single();

  if (!order || order.public_status_token_hash !== tokenHash) {
    return null;
  }

  return {
    order_number: order.order_number,
    status: order.status,
    fulfillment: order.fulfillment,
    pickup_slot: order.pickup_slot,
    total_cents: order.total_cents,
  };
}
