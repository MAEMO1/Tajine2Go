import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const body = await request.json();
  const { order_id } = body;

  if (!order_id) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Check if invoice already exists
  const { data: existing } = await supabase
    .from("invoices")
    .select("id")
    .eq("order_id", order_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Factuur bestaat al voor deze bestelling" }, { status: 409 });
  }

  // Get order with customer
  const { data: order } = await supabase
    .from("orders")
    .select("*, customers(*)")
    .eq("id", order_id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Bestelling niet gevonden" }, { status: 404 });
  }

  if (!order.invoice_company_name || !order.invoice_vat_number) {
    return NextResponse.json({ error: "Bestelling heeft geen volledige factuurgegevens" }, { status: 400 });
  }

  const vatRate = 6;
  const vatCents = Math.round(order.subtotal_cents * (vatRate / (100 + vatRate)));
  const invoiceSubtotal = order.subtotal_cents - vatCents;

  const customer = order.customers;
  const billingName = customer
    ? `${customer.first_name} ${customer.last_name}`
    : order.invoice_company_name;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      order_id,
      customer_id: order.customer_id,
      billing_name: billingName,
      company_name: order.invoice_company_name,
      vat_number: order.invoice_vat_number,
      billing_address_line1: order.invoice_address_line1 ?? "",
      billing_postal_code: order.invoice_postal_code ?? "",
      billing_city: order.invoice_city ?? "",
      billing_country_code: order.invoice_country_code ?? "BE",
      subtotal_cents: invoiceSubtotal,
      vat_rate: vatRate,
      vat_cents: vatCents,
      total_cents: order.subtotal_cents,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Factuur aanmaken mislukt" }, { status: 500 });
  }

  return NextResponse.json({ invoice }, { status: 201 });
}
