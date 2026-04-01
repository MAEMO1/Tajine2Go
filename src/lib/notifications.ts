import "server-only";

import { createAdminClient } from "./supabase/admin";
import { sendEmail, orderConfirmationHtml, adminNewOrderHtml } from "./email";
import { formatPrice } from "./format";

type OrderNotificationParams = {
  orderId: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  fulfillment: string;
  pickupSlot: string | null;
  paymentMethod: string;
  itemCount: number;
  statusToken: string;
  locale: string;
};

async function logNotification(params: {
  type: string;
  recipient: string;
  channel: string;
  referenceId: string;
  status: string;
}) {
  const supabase = createAdminClient();
  await supabase.from("notification_log").insert({
    type: params.type,
    recipient: params.recipient,
    channel: params.channel,
    reference_id: params.referenceId,
    status: params.status,
  });
}

export async function sendOrderConfirmation(params: OrderNotificationParams) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tajine2go.be";
  const statusUrl = `${siteUrl}/${params.locale}/order/${params.orderId}?token=${params.statusToken}`;
  const orderNumberFormatted = `T2G-${String(params.orderNumber).padStart(4, "0")}`;

  // Customer email
  try {
    await sendEmail({
      to: params.customerEmail,
      subject: `Bestelling ${orderNumberFormatted} bevestigd - Tajine2Go`,
      html: orderConfirmationHtml({
        orderNumber: orderNumberFormatted,
        customerName: params.customerName,
        totalFormatted: formatPrice(params.totalCents),
        fulfillment: params.fulfillment,
        pickupSlot: params.pickupSlot,
        statusUrl,
      }),
    });
    await logNotification({
      type: "order_confirmation",
      recipient: params.customerEmail,
      channel: "email",
      referenceId: params.orderId,
      status: "sent",
    });
  } catch {
    await logNotification({
      type: "order_confirmation",
      recipient: params.customerEmail,
      channel: "email",
      referenceId: params.orderId,
      status: "failed",
    });
  }

  // Admin email
  const supabase = createAdminClient();
  const { data: notifSettings } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "notifications")
    .single();

  const adminEmail = notifSettings?.value?.admin_email;
  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: `Nieuwe bestelling ${orderNumberFormatted}`,
        html: adminNewOrderHtml({
          orderNumber: orderNumberFormatted,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          totalFormatted: formatPrice(params.totalCents),
          fulfillment: params.fulfillment,
          paymentMethod: params.paymentMethod,
          itemCount: params.itemCount,
        }),
      });
      await logNotification({
        type: "admin_new_order",
        recipient: adminEmail,
        channel: "email",
        referenceId: params.orderId,
        status: "sent",
      });
    } catch {
      await logNotification({
        type: "admin_new_order",
        recipient: adminEmail,
        channel: "email",
        referenceId: params.orderId,
        status: "failed",
      });
    }
  }

  // WhatsApp (optional, best effort)
  const whatsappUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (whatsappUrl && notifSettings?.value?.whatsapp_enabled) {
    try {
      await fetch(whatsappUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Nieuwe bestelling ${orderNumberFormatted} - ${params.customerName} - ${formatPrice(params.totalCents)}`,
        }),
      });
      await logNotification({
        type: "admin_new_order",
        recipient: "whatsapp",
        channel: "whatsapp",
        referenceId: params.orderId,
        status: "sent",
      });
    } catch {
      await logNotification({
        type: "admin_new_order",
        recipient: "whatsapp",
        channel: "whatsapp",
        referenceId: params.orderId,
        status: "skipped",
      });
    }
  }
}
