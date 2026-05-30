import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminAuth } from "@/lib/auth/admin";
import { revalidatePublicLocaleRoutes } from "@/lib/public-route-revalidation";
import { createAdminClient } from "@/lib/supabase/admin";

const createWeeklyMenuSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dish_id: z.string().uuid(),
  max_portions: z.number().int().positive().nullable().optional(),
}).strict();

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const date = request.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Missing or invalid date" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("weekly_menu")
    .select("*, dishes(*)")
    .eq("available_date", date)
    .order("created_at");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch weekly menu" }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createWeeklyMenuSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige weekly menu payload" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("weekly_menu")
    .insert({
      dish_id: parsed.data.dish_id,
      available_date: parsed.data.date,
      max_portions: parsed.data.max_portions ?? null,
    })
    .select("*, dishes(*)")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Dit gerecht staat al op het menu voor deze datum" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create weekly menu item" }, { status: 500 });
  }

  revalidatePublicLocaleRoutes("admin weekly menu create");

  return NextResponse.json({ item: data }, { status: 201 });
}
