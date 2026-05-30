import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminAuth } from "@/lib/auth/admin";
import { revalidatePublicLocaleRoutes } from "@/lib/public-route-revalidation";
import { createAdminClient } from "@/lib/supabase/admin";

const updateWeeklyMenuSchema = z.object({
  max_portions: z.number().int().positive().nullable(),
}).strict();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const parsed = updateWeeklyMenuSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige update" }, { status: 400 });
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("weekly_menu")
    .update({ max_portions: parsed.data.max_portions })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update weekly menu item" }, { status: 500 });
  }

  revalidatePublicLocaleRoutes("admin weekly menu patch");

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("weekly_menu")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete weekly menu item" }, { status: 500 });
  }

  revalidatePublicLocaleRoutes("admin weekly menu delete");

  return NextResponse.json({ success: true });
}
