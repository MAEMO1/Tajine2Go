import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkoutSchema } from "@/lib/validations/checkout";
import { getMollieClient } from "@/lib/mollie";
import { sendOrderConfirmation } from "@/lib/notifications";
import { formatPrice } from "@/lib/format";
import type { WeeklyMenuWithDish, DishNameSnapshot } from "@/types/database";

function generateToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  // 1. Parse and validate
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

  // 2. Check takeaway_active
  const { data: activeRow } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "takeaway_active")
    .single();

  if (!activeRow?.value?.active) {
    return NextResponse.json(
      { error: "Bestellingen zijn momenteel gesloten." },
      { status: 409 },
    );
  }

  // 3. Check minimum order
  const { data: minRow } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "min_order_cents")
    .single();

  const minOrderCents = minRow?.value?.amount ?? 0;

  // 4. Check customer block
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("is_blocked")
    .eq("email", data.customer.email.toLowerCase())
    .maybeSingle();

  if (existingCustomer?.is_blocked) {
    return NextResponse.json(
      { error: "Deze bestelling kan niet worden verwerkt." },
      { status: 403 },
    );
  }

  // 5. Validate delivery postal code
  if (data.fulfillment === "delivery" && data.delivery_address) {
    const { data: deliveryConfig } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "delivery_config")
      .single();

    const allowedZips: string[] = deliveryConfig?.value?.zip_codes ?? [];
    if (!allowedZips.includes(data.delivery_address.postal_code)) {
      return NextResponse.json(
        { error: "Levering is niet beschikbaar voor deze postcode." },
        { status: 400 },
      );
    }
  }

  // 6. Fetch menu items with dish data
  const menuIds = data.items.map((i) => i.weekly_menu_id);
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

  // Build lookup
  const menuMap = new Map<string, WeeklyMenuWithDish>();
  for (const item of menuItems as WeeklyMenuWithDish[]) {
    menuMap.set(item.id, item);
  }

  // Calculate totals
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
    if (!menu || !menu.dishes) {
      return NextResponse.json(
        { error: "Gerecht niet gevonden." },
        { status: 400 },
      );
    }

    const dish = menu.dishes;
    const lineTotal = dish.price_cents * item.quantity;
    subtotalCents += lineTotal;

    orderItemsData.push({
      weekly_menu_id: item.weekly_menu_id,
      dish_id: dish.id,
      dish_name_snapshot: {
        nl: dish.name_nl,
        fr: dish.name_fr,
        en: dish.name_en,
        ar: dish.name_ar,
      },
      quantity: item.quantity,
      unit_price_cents: dish.price_cents,
    });
  }

  // Check minimum
  if (subtotalCents < minOrderCents) {
    return NextResponse.json(
      { error: `Minimumbedrag niet bereikt (min. ${formatPrice(minOrderCents)})` },
      { status: 400 },
    );
  }

  // Delivery fee
  let deliveryFeeCents = 0;
  if (data.fulfillment === "delivery") {
    const { data: deliveryConfig } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "delivery_config")
      .single();

    const config = deliveryConfig?.value;
    deliveryFeeCents = config?.fee_cents ?? 0;
    if (config?.free_delivery_above_cents && subtotalCents >= config.free_delivery_above_cents) {
      deliveryFeeCents = 0;
    }
  }

  const totalCents = subtotalCents + deliveryFeeCents;

  // 7. Reserve stock
  for (const item of data.items) {
    const { data: reserved } = await supabase.rpc("reserve_weekly_menu_portions", {
      menu_id: item.weekly_menu_id,
      qty: item.quantity,
    });

    if (!reserved) {
      // Release any already reserved
      for (const prev of data.items) {
        if (prev.weekly_menu_id === item.weekly_menu_id) break;
        await supabase.rpc("release_weekly_menu_portions", {
          menu_id: prev.weekly_menu_id,
          qty: prev.quantity,
        });
      }
      return NextResponse.json(
        { error: "Een of meer gerechten zijn niet meer beschikbaar in de gewenste hoeveelheid." },
        { status: 409 },
      );
    }
  }

  // 8. Upsert customer
  const customerEmail = data.customer.email.toLowerCase();
  const { data: customer } = await supabase
    .from("customers")
    .upsert(
      {
        email: customerEmail,
        first_name: data.customer.first_name,
        last_name: data.customer.last_name,
        phone: data.customer.phone ?? null,
        ...(data.delivery_address
          ? {
              address_street: data.delivery_address.line1,
              address_city: data.delivery_address.city,
              address_zip: data.delivery_address.postal_code,
            }
          : {}),
        ...(data.invoice
          ? {
              company_name: data.invoice.company_name,
              vat_number: data.invoice.vat_number,
            }
          : {}),
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (!customer) {
    return NextResponse.json({ error: "Klant aanmaken mislukt." }, { status: 500 });
  }

  // 9. Create order
  const token = generateToken();
  const now = new Date();
  const orderDate = now.toISOString().split("T")[0];

  const isOnline = data.payment_method === "online";
  const paymentExpiresAt = isOnline
    ? new Date(now.getTime() + 15 * 60 * 1000).toISOString()
    : null;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customer.id,
      status: isOnline ? "pending" : "confirmed",
      fulfillment: data.fulfillment,
      pickup_slot: data.pickup_slot ?? null,
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
      order_date: orderDate,
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
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order aanmaken mislukt." }, { status: 500 });
  }

  // 10. Create order items
  await supabase.from("order_items").insert(
    orderItemsData.map((item) => ({
      order_id: order.id,
      ...item,
    })),
  );

  // 11. Payment flow
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tajine2go.be";
  const orderNumberFormatted = `T2G-${String(order.order_number).padStart(4, "0")}`;

  if (isOnline) {
    // Create Mollie payment
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

      // Save Mollie payment ID
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
      // Release stock
      for (const item of data.items) {
        await supabase.rpc("release_weekly_menu_portions", {
          menu_id: item.weekly_menu_id,
          qty: item.quantity,
        });
      }
      // Cancel order
      await supabase
        .from("orders")
        .update({ status: "cancelled", cancel_reason: "payment_creation_failed" })
        .eq("id", order.id);

      return NextResponse.json(
        { error: "Online betaling is momenteel niet beschikbaar." },
        { status: 503 },
      );
    }
  }

  // 12. Cash flow - direct confirmed
  // Send notifications (fire and forget - don't block response)
  sendOrderConfirmation({
    orderId: order.id,
    orderNumber: order.order_number,
    customerName: `${data.customer.first_name} ${data.customer.last_name}`,
    customerEmail: customerEmail,
    totalCents,
    fulfillment: data.fulfillment,
    pickupSlot: data.pickup_slot ?? null,
    paymentMethod: "cash",
    itemCount: data.items.reduce((sum, i) => sum + i.quantity, 0),
    statusToken: token.raw,
    locale: data.locale,
  }).catch((err) => console.error("Notification error:", err));

  // Create invoice if requested
  if (data.invoice) {
    const vatRate = 6;
    const vatCents = Math.round(subtotalCents * (vatRate / (100 + vatRate)));
    const invoiceSubtotal = subtotalCents - vatCents;

    await supabase.from("invoices").insert({
      order_id: order.id,
      customer_id: customer.id,
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
    });
  }

  return NextResponse.json({
    orderId: order.id,
    redirectUrl: `${siteUrl}/${data.locale}/order/${order.id}?token=${token.raw}`,
  });
}
