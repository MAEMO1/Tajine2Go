import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMollieClient } from "@/lib/mollie";
import { sendOrderConfirmation } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  // Mollie sends payment ID in form body
  let paymentId: string;
  try {
    const formData = await request.formData();
    paymentId = formData.get("id") as string;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
  }

  // Fetch payment from Mollie
  let payment;
  try {
    const mollieClient = getMollieClient();
    payment = await mollieClient.payments.get(paymentId);
  } catch (err) {
    console.error("Failed to fetch Mollie payment:", err);
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 });
  }

  // Find order
  const { data: order } = await supabase
    .from("orders")
    .select("*, customers(*)")
    .eq("mollie_payment_id", paymentId)
    .single();

  if (!order) {
    console.error("Order not found for Mollie payment:", paymentId);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Idempotency: skip if already processed to terminal state
  if (["paid", "refunded"].includes(order.payment_status) && payment.status === "paid") {
    return NextResponse.json({ status: "already_processed" });
  }

  const status = payment.status;

  if (status === "paid") {
    await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    // Send notifications
    const customer = order.customers;
    if (customer) {
      sendOrderConfirmation({
        orderId: order.id,
        orderNumber: order.order_number,
        customerName: `${customer.first_name} ${customer.last_name}`,
        customerEmail: customer.email,
        totalCents: order.total_cents,
        fulfillment: order.fulfillment,
        pickupSlot: order.pickup_slot,
        paymentMethod: "online",
        itemCount: 0, // Not critical for notification
        statusToken: "", // Not needed for admin notification
        locale: "nl",
      }).catch((err) => console.error("Notification error:", err));
    }

    // Generate invoice if requested
    if (order.invoice_requested && order.invoice_company_name) {
      const vatRate = 6;
      const vatCents = Math.round(order.subtotal_cents * (vatRate / (100 + vatRate)));
      const invoiceSubtotal = order.subtotal_cents - vatCents;

      await supabase.from("invoices").upsert(
        {
          order_id: order.id,
          customer_id: order.customer_id,
          billing_name: customer ? `${customer.first_name} ${customer.last_name}` : "",
          company_name: order.invoice_company_name,
          vat_number: order.invoice_vat_number,
          billing_address_line1: order.invoice_address_line1,
          billing_postal_code: order.invoice_postal_code,
          billing_city: order.invoice_city,
          billing_country_code: order.invoice_country_code ?? "BE",
          subtotal_cents: invoiceSubtotal,
          vat_rate: vatRate,
          vat_cents: vatCents,
          total_cents: order.subtotal_cents,
        },
        { onConflict: "order_id" },
      );
    }
  } else if (status === "failed" || status === "expired") {
    await supabase
      .from("orders")
      .update({
        payment_status: "failed",
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancel_reason: status === "failed" ? "payment_failed" : "payment_expired",
      })
      .eq("id", order.id);

    // Release stock
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("weekly_menu_id, quantity")
      .eq("order_id", order.id);

    if (orderItems) {
      for (const item of orderItems) {
        await supabase.rpc("release_weekly_menu_portions", {
          menu_id: item.weekly_menu_id,
          qty: item.quantity,
        });
      }
    }
  } else if (payment.amountRefunded && parseFloat(payment.amountRefunded.value) > 0) {
    await supabase
      .from("orders")
      .update({
        payment_status: "refunded",
        refund_amount_cents: Math.round(parseFloat(payment.amountRefunded.value) * 100),
      })
      .eq("id", order.id);
  }

  return NextResponse.json({ status: "ok" });
}
