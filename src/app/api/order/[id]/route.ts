import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_number, status, fulfillment, pickup_slot, total_cents, public_status_token_hash")
    .eq("id", id)
    .single();

  if (!order || order.public_status_token_hash !== tokenHash) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }

  return NextResponse.json({
    order_number: order.order_number,
    status: order.status,
    fulfillment: order.fulfillment,
    pickup_slot: order.pickup_slot,
    total_cents: order.total_cents,
  });
}
