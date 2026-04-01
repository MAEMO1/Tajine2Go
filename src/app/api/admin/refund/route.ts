import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMollieClient } from "@/lib/mollie";

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const body = await request.json();
  const { order_id, amount_cents, reason } = body;

  if (!order_id || !reason) {
    return NextResponse.json({ error: "order_id en reason zijn verplicht" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", order_id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Bestelling niet gevonden" }, { status: 404 });
  }

  if (order.payment_method !== "online" || !order.mollie_payment_id) {
    return NextResponse.json(
      { error: "Refund is alleen mogelijk voor online betaalde bestellingen met een Mollie betaling" },
      { status: 400 },
    );
  }

  if (order.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Alleen betaalde bestellingen kunnen gerefund worden" },
      { status: 400 },
    );
  }

  try {
    const mollieClient = getMollieClient();
    const refundAmount = amount_cents
      ? (amount_cents / 100).toFixed(2)
      : (order.total_cents / 100).toFixed(2);

    const refund = await mollieClient.paymentRefunds.create({
      paymentId: order.mollie_payment_id,
      amount: { currency: "EUR", value: refundAmount },
      description: reason,
    });

    await supabase
      .from("orders")
      .update({
        payment_status: "refunded",
        mollie_refund_id: refund.id,
        refund_amount_cents: amount_cents ?? order.total_cents,
        refund_reason: reason,
      })
      .eq("id", order_id);

    return NextResponse.json({ success: true, refundId: refund.id });
  } catch (err) {
    console.error("Refund failed:", err);
    return NextResponse.json({ error: "Refund is mislukt" }, { status: 500 });
  }
}
