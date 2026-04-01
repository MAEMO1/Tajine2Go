import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const body = await request.json();
  const { request_id, items, subtotal_cents, vat_rate, terms, valid_until, notes } = body;

  if (!request_id || !items || !subtotal_cents) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const vatRateVal = vat_rate ?? 6;
  const vatCents = Math.round(subtotal_cents * (vatRateVal / 100));
  const totalCents = subtotal_cents + vatCents;

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("catering_quotes")
    .insert({
      request_id,
      items,
      subtotal_cents,
      vat_rate: vatRateVal,
      vat_cents: vatCents,
      total_cents: totalCents,
      terms: terms ?? null,
      valid_until: valid_until ?? null,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }

  // Update catering request status
  await supabase
    .from("catering_requests")
    .update({ status: "quote_sent", quoted_amount_cents: totalCents })
    .eq("id", request_id);

  return NextResponse.json({ quote: data }, { status: 201 });
}
