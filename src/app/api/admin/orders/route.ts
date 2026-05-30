import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const updateOrderStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "completed",
    "cancelled",
  ]),
}).strict();

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const supabase = createAdminClient();
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, customers(first_name, last_name, email)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);
  if (date) query = query.eq("order_date", date);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: data, total: count });
}

export async function PATCH(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const supabase = createAdminClient();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige statusupdate" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("apply_admin_order_status_transition", {
    target_order_id: parsed.data.id,
    next_status: parsed.data.status,
  });

  if (error) {
    if (error.message.includes("ORDER_NOT_FOUND")) {
      return NextResponse.json({ error: "Bestelling niet gevonden" }, { status: 404 });
    }
    if (error.message.includes("INVALID_STATUS_TRANSITION")) {
      return NextResponse.json({ error: "Ongeldige statusovergang" }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, order: data?.[0] ?? null });
}
