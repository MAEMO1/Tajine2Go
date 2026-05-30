import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { revalidatePublicLocaleRoutes } from "@/lib/public-route-revalidation";
import { createAdminClient } from "@/lib/supabase/admin";

const PUBLIC_SETTINGS_KEYS = new Set([
  "takeaway_active",
  "takeaway_schedule",
  "min_order_cents",
  "delivery_config",
  "payment_methods",
  "takeaway_exceptions",
]);

function isValidPaymentMethodsValue(
  value: unknown,
): value is { online_enabled: boolean; cash_enabled: boolean } {
  return (
    !!value
    && typeof value === "object"
    && "online_enabled" in value
    && "cash_enabled" in value
    && typeof value.online_enabled === "boolean"
    && typeof value.cash_enabled === "boolean"
  );
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }

  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const supabase = createAdminClient();
  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
  }

  if (key === "payment_methods") {
    if (!isValidPaymentMethodsValue(value)) {
      return NextResponse.json({ error: "Ongeldige betaalmethodes." }, { status: 400 });
    }

    if (!value.online_enabled && !value.cash_enabled) {
      return NextResponse.json(
        { error: "Minstens één betaalmethode moet actief blijven." },
        { status: 400 },
      );
    }
  }

  const { error } = await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  if (PUBLIC_SETTINGS_KEYS.has(key)) {
    revalidatePublicLocaleRoutes(`admin settings patch:${key}`);
  }

  return NextResponse.json({ success: true });
}
