import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const cateringSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1),
  event_type: z.enum(["party", "event", "reception", "other"]),
  event_date: z.string().min(1),
  guest_count: z.number().int().min(1),
  dietary_needs: z.string().optional(),
  message: z.string().optional(),
  recaptcha_token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = cateringSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
  }

  const data = parsed.data;
  const normalizedEmail = data.email.trim().toLowerCase();

  // Verify reCAPTCHA (if key configured)
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret && recaptchaSecret !== "xxx") {
    try {
      const recaptchaBody = new URLSearchParams({
        secret: recaptchaSecret,
        response: data.recaptcha_token,
      });
      const recaptchaRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: recaptchaBody,
        },
      );

      if (!recaptchaRes.ok) {
        return NextResponse.json(
          { error: "Spamcontrole tijdelijk niet beschikbaar" },
          { status: 503 },
        );
      }

      const recaptchaData = await recaptchaRes.json() as {
        action?: string;
        success?: boolean;
        score?: number;
      };

      if (
        !recaptchaData.success ||
        recaptchaData.action !== "catering_submit" ||
        (typeof recaptchaData.score === "number" && recaptchaData.score < 0.5)
      ) {
        return NextResponse.json({ error: "Spam detectie mislukt" }, { status: 400 });
      }
    } catch (error) {
      console.error("reCAPTCHA verification failed:", error);
      return NextResponse.json(
        { error: "Spamcontrole tijdelijk niet beschikbaar" },
        { status: 503 },
      );
    }
  }

  const supabase = createAdminClient();

  // Rate limit: max 3 per email per day
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { data: existingCustomer, error: existingCustomerError } = await supabase
    .from("customers")
    .select("id, is_blocked")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingCustomerError) {
    return NextResponse.json({ error: "Aanvraag controleren mislukt" }, { status: 500 });
  }

  if (existingCustomer?.is_blocked) {
    return NextResponse.json(
      { error: "Deze aanvraag kan niet worden verwerkt." },
      { status: 403 },
    );
  }

  let requestsToday = 0;
  if (existingCustomer?.id) {
    const { count, error: countError } = await supabase
      .from("catering_requests")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", existingCustomer.id)
      .gte("created_at", startOfDay.toISOString());

    if (countError) {
      return NextResponse.json({ error: "Aanvraag controleren mislukt" }, { status: 500 });
    }

    requestsToday = count ?? 0;
  }

  if (requestsToday >= 3) {
    return NextResponse.json({ error: "Te veel aanvragen vandaag" }, { status: 429 });
  }

  // Upsert customer
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      {
        email: normalizedEmail,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (customerError || !customer) {
    return NextResponse.json({ error: "Klant opslaan mislukt" }, { status: 500 });
  }

  // Create catering request
  const { error } = await supabase.from("catering_requests").insert({
    customer_id: customer.id,
    event_type: data.event_type,
    event_date: data.event_date,
    guest_count: data.guest_count,
    dietary_needs: data.dietary_needs ?? null,
    message: data.message ?? null,
  });

  if (error) {
    return NextResponse.json({ error: "Aanvraag opslaan mislukt" }, { status: 500 });
  }

  // Log notification
  await supabase.from("notification_log").insert({
    type: "catering_request",
    recipient: normalizedEmail,
    channel: "email",
    status: "sent",
  });

  return NextResponse.json({ success: true });
}
