import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const cateringSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1),
  event_type: z.enum(["wedding", "aqiqa", "corporate", "funeral", "iftar", "other"]),
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

  // Verify reCAPTCHA (if key configured)
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret && recaptchaSecret !== "xxx") {
    try {
      const recaptchaRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${data.recaptcha_token}`,
        { method: "POST" },
      );
      const recaptchaData = await recaptchaRes.json();
      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json({ error: "Spam detectie mislukt" }, { status: 400 });
      }
    } catch {
      // Continue if reCAPTCHA verification fails
    }
  }

  const supabase = createAdminClient();

  // Rate limit: max 3 per email per day
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("catering_requests")
    .select("id", { count: "exact", head: true })
    .eq("customers.email", data.email)
    .gte("created_at", `${today}T00:00:00`);

  if (count && count >= 3) {
    return NextResponse.json({ error: "Te veel aanvragen vandaag" }, { status: 429 });
  }

  // Upsert customer
  const { data: customer } = await supabase
    .from("customers")
    .upsert(
      {
        email: data.email.toLowerCase(),
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  // Create catering request
  const { error } = await supabase.from("catering_requests").insert({
    customer_id: customer?.id ?? null,
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
    recipient: data.email,
    channel: "email",
    status: "sent",
  });

  return NextResponse.json({ success: true });
}
