import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMollieClient } from "@/lib/mollie";
import {
  sendAdminLatePaymentAlert,
  sendAdminNewOrderNotification,
} from "@/lib/notifications";

function getCustomerName(customer: { first_name: string; last_name: string } | null) {
  return customer ? `${customer.first_name} ${customer.last_name}` : "Onbekende klant";
}

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

  const paymentMetadata =
    payment.metadata && typeof payment.metadata === "object"
      ? (payment.metadata as { orderId?: string })
      : {};
  const paymentOrderId = paymentMetadata.orderId;

  if (!paymentOrderId || payment.id !== paymentId) {
    return NextResponse.json({ error: "Payment metadata mismatch" }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, customers(*)")
    .eq("id", paymentOrderId)
    .eq("mollie_payment_id", payment.id)
    .single();

  if (!order) {
    console.error("Order not found for Mollie payment:", paymentId, paymentOrderId);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const paymentStatus = payment.status;
  const isAdminCancelled =
    order.status === "cancelled" && order.cancel_reason === "admin_cancelled";

  if (paymentStatus === "paid" && ["paid", "refunded"].includes(order.payment_status)) {
    return NextResponse.json({ status: "already_processed" });
  }
  if (
    ["failed", "expired"].includes(paymentStatus) &&
    order.status === "cancelled" &&
    order.payment_status === "failed"
  ) {
    return NextResponse.json({ status: "already_processed" });
  }

  if (isAdminCancelled) {
    if (paymentStatus === "paid") {
      const { error: latePaymentError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          stock_reserved_until: null,
        })
        .eq("id", order.id);

      if (latePaymentError) {
        console.error("Failed to persist late payment after admin cancel:", latePaymentError);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
      }

      await sendAdminLatePaymentAlert({
        orderId: order.id,
        orderNumber: order.order_number,
        customerName: getCustomerName(order.customers),
        customerEmail: order.customers?.email ?? null,
        totalCents: order.total_cents,
        fulfillment: order.fulfillment,
      }).catch((err) => console.error("Late payment alert error:", err));

      return NextResponse.json({ status: "late_paid_after_admin_cancel" });
    }

    if (paymentStatus === "failed" || paymentStatus === "expired") {
      return NextResponse.json({ status: "ignored_terminal_state" });
    }
  }

  if (paymentStatus === "paid") {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        stock_reserved_until: null,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to mark order as paid:", updateError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    const customer = order.customers;
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("quantity")
      .eq("order_id", order.id);

    await sendAdminNewOrderNotification({
        orderId: order.id,
        orderNumber: order.order_number,
        customerName: getCustomerName(customer),
        customerEmail: customer?.email ?? null,
        totalCents: order.total_cents,
        fulfillment: order.fulfillment,
        paymentMethod: "online",
        itemCount: (orderItems ?? []).reduce((sum, item) => sum + item.quantity, 0),
      })
      .catch((err) => console.error("Admin notification error:", err));

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
  } else if (paymentStatus === "failed" || paymentStatus === "expired") {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "failed",
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancel_reason: paymentStatus === "failed" ? "payment_failed" : "payment_expired",
        stock_reserved_until: null,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to cancel failed/expired order:", updateError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

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
    const { error: refundUpdateError } = await supabase
      .from("orders")
      .update({
        payment_status: "refunded",
        refund_amount_cents: Math.round(parseFloat(payment.amountRefunded.value) * 100),
      })
      .eq("id", order.id);

    if (refundUpdateError) {
      console.error("Failed to mark order as refunded:", refundUpdateError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ok" });
}
