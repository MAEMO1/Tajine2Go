import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const supabase = createAdminClient();
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") ?? "orders";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (type === "orders") {
    let query = supabase
      .from("orders")
      .select("order_number, status, fulfillment, payment_method, payment_status, subtotal_cents, delivery_fee_cents, total_cents, order_date, created_at, customers(first_name, last_name, email)")
      .order("created_at", { ascending: false });

    if (from) query = query.gte("order_date", from);
    if (to) query = query.lte("order_date", to);

    const { data } = await query;

    const rows = (data ?? []).map((o) => {
      const c = o.customers as unknown as { first_name: string; last_name: string; email: string } | null;
      return [
        `T2G-${String(o.order_number).padStart(4, "0")}`,
        o.order_date,
        o.status,
        o.fulfillment,
        o.payment_method,
        o.payment_status,
        (o.subtotal_cents / 100).toFixed(2),
        (o.delivery_fee_cents / 100).toFixed(2),
        (o.total_cents / 100).toFixed(2),
        c ? `${c.first_name} ${c.last_name}` : "",
        c?.email ?? "",
      ].join(";");
    });

    const header = "Nummer;Datum;Status;Type;Betaalmethode;Betaalstatus;Subtotaal;Leveringskosten;Totaal;Klant;Email";
    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-export.csv"`,
      },
    });
  }

  if (type === "vat") {
    const { data } = await supabase
      .from("vat_summary")
      .select("*")
      .order("month", { ascending: false });

    const rows = (data ?? []).map((v) => [
      v.month,
      (v.subtotal_cents / 100).toFixed(2),
      (v.vat_cents / 100).toFixed(2),
      (v.total_cents / 100).toFixed(2),
      v.order_count,
    ].join(";"));

    const header = "Maand;Subtotaal;BTW;Totaal;Bestellingen";
    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="vat-export.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Unknown export type" }, { status: 400 });
}
