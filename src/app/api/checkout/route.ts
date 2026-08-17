import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolvePublicOrderConfig } from "@/lib/menu-data";
import { checkoutSchema } from "@/lib/validations/checkout";
import { getMollieClient } from "@/lib/mollie";
import {
  sendAdminNewOrderNotification,
  sendCustomerOrderConfirmation,
} from "@/lib/notifications";
import { formatPrice } from "@/lib/format";
import type { WeeklyMenuWithDish, DishNameSnapshot } from "@/types/database";

function generateToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

function normalizePickupSlot(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function releaseReservedStock(
  supabase: ReturnType<typeof createAdminClient>,
  items: { weekly_menu_id: string; quantity: number }[],
) {
  for (const item of items) {
    await supabase.rpc("release_weekly_menu_portions", {
      menu_id: item.weekly_menu_id,
      qty: item.quantity,
    });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validatie mislukt", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const orderingConfig = await resolvePublicOrderConfig();

  if (!orderingConfig.is_active) {
    return NextResponse.json(
      { error: "Bestellingen zijn momenteel gesloten." },
      { status: 409 },
    );
  }

  const customerEmail = data.customer.email.trim().toLowerCase();
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("is_blocked")
    .eq("email", customerEmail)
    .maybeSingle();

  if (existingCustomer?.is_blocked) {
    return NextResponse.json(
      { error: "Deze bestelling kan niet worden verwerkt." },
      { status: 403 },
    );
  }

  if (data.fulfillment === "delivery") {
    if (!orderingConfig.delivery_config.enabled) {
      return NextResponse.json(
        { error: "Levering is momenteel niet beschikbaar." },
        { status: 400 },
      );
    }

    if (data.delivery_address && orderingConfig.delivery_config.zip_codes.length > 0) {
      const allowedZips = orderingConfig.delivery_config.zip_codes;
      if (!allowedZips.includes(data.delivery_address.postal_code)) {
        return NextResponse.json(
          { error: "Levering is niet beschikbaar voor deze postcode." },
          { status: 400 },
        );
      }
    }
  }

  if (data.payment_method === "online" && !orderingConfig.payment_methods.online_enabled) {
    return NextResponse.json(
      { error: "Online betaling is momenteel niet beschikbaar." },
      { status: 400 },
    );
  }

  if (data.payment_method === "cash" && !orderingConfig.payment_methods.cash_enabled) {
    return NextResponse.json(
      { error: "Cash betaling is momenteel niet beschikbaar." },
      { status: 400 },
    );
  }

  const menuIds = data.items.map((item) => item.weekly_menu_id);
  const { data: menuItems } = await supabase
    .from("weekly_menu")
    .select("*, dishes(*)")
    .in("id", menuIds);

  if (!menuItems || menuItems.length !== data.items.length) {
    return NextResponse.json(
      { error: "Een of meer gerechten zijn niet beschikbaar." },
      { status: 400 },
    );
  }

  const availableDates = new Set(menuItems.map((item) => item.available_date));
  if (availableDates.size !== 1 || !availableDates.has(orderingConfig.date)) {
    return NextResponse.json(
      { error: "Een of meer gerechten zijn niet beschikbaar." },
      { status: 409 },
    );
  }

  const pickupSlot = normalizePickupSlot(data.pickup_slot);
  if (data.fulfillment === "pickup") {
    if (orderingConfig.slot_mode === "slots" && !pickupSlot) {
      return NextResponse.json(
        { error: "Selecteer een geldig afhaaltijdstip." },
        { status: 400 },
      );
    }

    if (
      pickupSlot
      && (orderingConfig.slot_mode === "slots" || orderingConfig.slot_mode === "both")
      && !orderingConfig.slots.includes(pickupSlot)
    ) {
      return NextResponse.json(
        { error: "Selecteer een geldig afhaaltijdstip." },
        { status: 400 },
      );
    }
  }

  const menuMap = new Map<string, WeeklyMenuWithDish>();
  for (const item of menuItems as WeeklyMenuWithDish[]) {
    menuMap.set(item.id, item);
  }

  let subtotalCents = 0;
  const orderItemsData: {
    weekly_menu_id: string;
    dish_id: string;
    dish_name_snapshot: DishNameSnapshot;
    quantity: number;
    unit_price_cents: number;
  }[] = [];

  for (const item of data.items) {
    const menu = menuMap.get(item.weekly_menu_id);
    if (!menu?.dishes) {
      return NextResponse.json(
        { error: "Gerecht niet gevonden." },
        { status: 400 },
      );
    }

    const lineTotal = menu.dishes.price_cents * item.quantity;
    subtotalCents += lineTotal;

    orderItemsData.push({
      weekly_menu_id: item.weekly_menu_id,
      dish_id: menu.dishes.id,
      dish_name_snapshot: {
        nl: menu.dishes.name_nl,
        fr: menu.dishes.name_fr,
        en: menu.dishes.name_en,
      },
      quantity: item.quantity,
      unit_price_cents: menu.dishes.price_cents,
    });
  }

  if (subtotalCents < orderingConfig.min_order_cents) {
    return NextResponse.json(
      { error: `Minimumbedrag niet bereikt (min. ${formatPrice(orderingConfig.min_order_cents)})` },
      { status: 400 },
    );
  }

  let deliveryFeeCents = 0;
  if (data.fulfillment === "delivery") {
    deliveryFeeCents = orderingConfig.delivery_config.fee_cents;
    if (
      orderingConfig.delivery_config.free_delivery_above_cents > 0
      && subtotalCents >= orderingConfig.delivery_config.free_delivery_above_cents
    ) {
      deliveryFeeCents = 0;
    }
  }

  const totalCents = subtotalCents + deliveryFeeCents;

  const reservedItems: { weekly_menu_id: string; quantity: number }[] = [];
  for (const item of data.items) {
    const { data: reserved } = await supabase.rpc("reserve_weekly_menu_portions", {
      menu_id: item.weekly_menu_id,
      qty: item.quantity,
    });

    if (!reserved) {
      await releaseReservedStock(supabase, reservedItems);
      return NextResponse.json(
        { error: "Een of meer gerechten zijn niet meer beschikbaar in de gewenste hoeveelheid." },
        { status: 409 },
      );
    }

    reservedItems.push({
      weekly_menu_id: item.weekly_menu_id,
      quantity: item.quantity,
    });
  }

  const token = generateToken();
  const now = new Date();
  const isOnline = data.payment_method === "online";
  const paymentExpiresAt = isOnline
    ? new Date(now.getTime() + 15 * 60 * 1000).toISOString()
    : null;

  const customerPayload = {
    email: customerEmail,
    first_name: data.customer.first_name,
    last_name: data.customer.last_name,
    phone: data.customer.phone ?? null,
    address_street: data.delivery_address?.line1 ?? null,
    address_city: data.delivery_address?.city ?? null,
    address_zip: data.delivery_address?.postal_code ?? null,
    company_name: data.invoice?.company_name ?? null,
    vat_number: data.invoice?.vat_number ?? null,
  };

  const orderPayload = {
    status: isOnline ? "pending" : "confirmed",
    fulfillment: data.fulfillment,
    pickup_slot: data.fulfillment === "pickup" ? pickupSlot : null,
    delivery_address_line1: data.delivery_address?.line1 ?? null,
    delivery_postal_code: data.delivery_address?.postal_code ?? null,
    delivery_city: data.delivery_address?.city ?? null,
    delivery_country_code: data.delivery_address?.country_code ?? null,
    delivery_fee_cents: deliveryFeeCents,
    subtotal_cents: subtotalCents,
    total_cents: totalCents,
    payment_method: data.payment_method,
    payment_status: "pending",
    notes: data.notes ?? null,
    order_date: orderingConfig.date,
    payment_expires_at: paymentExpiresAt,
    stock_reserved_until: paymentExpiresAt,
    confirmed_at: isOnline ? null : now.toISOString(),
    public_status_token_hash: token.hash,
    invoice_requested: !!data.invoice,
    invoice_company_name: data.invoice?.company_name ?? null,
    invoice_vat_number: data.invoice?.vat_number ?? null,
    invoice_address_line1: data.invoice?.address_line1 ?? null,
    invoice_postal_code: data.invoice?.postal_code ?? null,
    invoice_city: data.invoice?.city ?? null,
    invoice_country_code: data.invoice?.country_code ?? null,
  };

  const cashInvoicePayload = !isOnline && data.invoice
    ? (() => {
        const vatRate = 6;
        const vatCents = Math.round(subtotalCents * (vatRate / (100 + vatRate)));
        const invoiceSubtotal = subtotalCents - vatCents;

        return {
          billing_name: `${data.customer.first_name} ${data.customer.last_name}`,
          company_name: data.invoice.company_name,
          vat_number: data.invoice.vat_number,
          billing_address_line1: data.invoice.address_line1,
          billing_postal_code: data.invoice.postal_code,
          billing_city: data.invoice.city,
          billing_country_code: data.invoice.country_code,
          subtotal_cents: invoiceSubtotal,
          vat_rate: vatRate,
          vat_cents: vatCents,
          total_cents: subtotalCents,
        };
      })()
    : null;

  const { data: createdOrders, error: createOrderError } = await supabase.rpc(
    "create_checkout_order",
    {
      customer_payload: customerPayload,
      order_payload: orderPayload,
      order_items_payload: orderItemsData,
      cash_invoice_payload: cashInvoicePayload,
    },
  );

  const createdOrder = createdOrders?.[0] as
    | { order_id: string; order_number: number; customer_id: string }
    | undefined;

  if (createOrderError || !createdOrder) {
    await releaseReservedStock(supabase, reservedItems);
    return NextResponse.json({ error: "Order aanmaken mislukt." }, { status: 500 });
  }

  const order = {
    id: createdOrder.order_id,
    order_number: createdOrder.order_number,
    customer_id: createdOrder.customer_id,
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tajine2go.be";
  const orderNumberFormatted = `T2G-${String(order.order_number).padStart(4, "0")}`;

  if (isOnline) {
    try {
      const mollieClient = getMollieClient();
      const payment = await mollieClient.payments.create({
        amount: {
          currency: "EUR",
          value: (totalCents / 100).toFixed(2),
        },
        description: `Tajine2Go bestelling ${orderNumberFormatted}`,
        redirectUrl: `${siteUrl}/${data.locale}/order/${order.id}?token=${token.raw}`,
        webhookUrl: `${siteUrl}/api/webhooks/mollie`,
        metadata: { orderId: order.id },
      });

      await supabase
        .from("orders")
        .update({ mollie_payment_id: payment.id })
        .eq("id", order.id);

      return NextResponse.json({
        orderId: order.id,
        redirectUrl: payment.getCheckoutUrl() ?? `${siteUrl}/${data.locale}/order/${order.id}?token=${token.raw}`,
      });
    } catch (err) {
      console.error("Mollie payment creation failed:", err);
      await releaseReservedStock(supabase, reservedItems);
      await supabase
        .from("orders")
        .update({
          status: "cancelled",
          payment_status: "failed",
          cancelled_at: new Date().toISOString(),
          cancel_reason: "payment_creation_failed",
        })
        .eq("id", order.id);

      return NextResponse.json(
        { error: "Online betaling is momenteel niet beschikbaar." },
        { status: 503 },
      );
    }
  }

  sendCustomerOrderConfirmation({
    orderId: order.id,
    orderNumber: order.order_number,
    customerName: `${data.customer.first_name} ${data.customer.last_name}`,
    customerEmail,
    totalCents,
    fulfillment: data.fulfillment,
    pickupSlot: data.fulfillment === "pickup" ? pickupSlot : null,
    paymentMethod: "cash",
    itemCount: data.items.reduce((sum, item) => sum + item.quantity, 0),
    statusToken: token.raw,
    locale: data.locale,
  }).catch((err) => console.error("Customer notification error:", err));

  sendAdminNewOrderNotification({
    orderId: order.id,
    orderNumber: order.order_number,
    customerName: `${data.customer.first_name} ${data.customer.last_name}`,
    customerEmail,
    totalCents,
    fulfillment: data.fulfillment,
    paymentMethod: "cash",
    itemCount: data.items.reduce((sum, item) => sum + item.quantity, 0),
  }).catch((err) => console.error("Admin notification error:", err));

  return NextResponse.json({
    orderId: order.id,
    redirectUrl: `${siteUrl}/${data.locale}/order/${order.id}?token=${token.raw}`,
  });
}
