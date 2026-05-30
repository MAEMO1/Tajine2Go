import "server-only";

import { createAdminClient } from "./supabase/admin";
import { sendEmail, orderConfirmationHtml, adminNewOrderHtml } from "./email";
import { formatPrice } from "./format";

type CustomerOrderNotificationParams = {
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

type AdminOrderNotificationParams = {
  orderId: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string | null;
  totalCents: number;
  fulfillment: string;
  paymentMethod: string;
  itemCount: number;
};

type AdminLatePaymentAlertParams = {
  orderId: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string | null;
  totalCents: number;
  fulfillment: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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

async function getNotificationSettings() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "notifications")
    .single();

  return data?.value;
}

export async function sendCustomerOrderConfirmation(
  params: CustomerOrderNotificationParams,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tajine2go.be";
  const statusUrl = `${siteUrl}/${params.locale}/order/${params.orderId}?token=${params.statusToken}`;
  const orderNumberFormatted = `T2G-${String(params.orderNumber).padStart(4, "0")}`;

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
}

export async function sendAdminNewOrderNotification(
  params: AdminOrderNotificationParams,
) {
  const notifSettings = await getNotificationSettings();
  const orderNumberFormatted = `T2G-${String(params.orderNumber).padStart(4, "0")}`;

  const adminEmail = notifSettings?.admin_email;
  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: `Nieuwe bestelling ${orderNumberFormatted}`,
        html: adminNewOrderHtml({
          orderNumber: orderNumberFormatted,
          customerName: params.customerName,
          customerEmail: params.customerEmail ?? "—",
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
  if (whatsappUrl && notifSettings?.whatsapp_enabled) {
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

export async function sendAdminLatePaymentAlert(
  params: AdminLatePaymentAlertParams,
) {
  const notifSettings = await getNotificationSettings();
  const orderNumberFormatted = `T2G-${String(params.orderNumber).padStart(4, "0")}`;
  const adminEmail = notifSettings?.admin_email;

  if (!adminEmail) {
    return;
  }

  const customerName = escapeHtml(params.customerName);
  const customerEmail = escapeHtml(params.customerEmail ?? "—");
  const fulfillment = params.fulfillment === "pickup" ? "Afhalen" : "Levering";

  try {
    await sendEmail({
      to: adminEmail,
      subject: `Actie vereist: late betaling voor ${orderNumberFormatted}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #B42318;">Late betaling na admin-annulering</h1>
          <p>Bestelling <strong>${orderNumberFormatted}</strong> is alsnog betaald via Mollie nadat ze in admin werd geannuleerd.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 6px 0; color: #666;">Klant:</td><td>${customerName}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">E-mail:</td><td>${customerEmail}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Totaal:</td><td style="font-weight: bold;">${formatPrice(params.totalCents)}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Type:</td><td>${fulfillment}</td></tr>
          </table>
          <p style="margin-top: 16px;">De order blijft geannuleerd. Controleer de bestelling en voer indien nodig handmatig een refund of opvolging uit.</p>
        </div>
      `,
    });

    await logNotification({
      type: "late_paid_after_admin_cancel",
      recipient: adminEmail,
      channel: "email",
      referenceId: params.orderId,
      status: "sent",
    });
  } catch {
    await logNotification({
      type: "late_paid_after_admin_cancel",
      recipient: adminEmail,
      channel: "email",
      referenceId: params.orderId,
      status: "failed",
    });
  }
}
