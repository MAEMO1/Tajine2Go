import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const body = await request.json();

  // Only allow specific fields
  const allowed: Record<string, unknown> = {};
  if ("notes" in body) allowed.notes = body.notes;
  if ("is_vip" in body) allowed.is_vip = body.is_vip;
  if ("is_blocked" in body) {
    allowed.is_blocked = body.is_blocked;
    allowed.blocked_reason = body.blocked_reason ?? null;
  }
  if ("tags" in body) allowed.tags = body.tags;

  const { error } = await supabase
    .from("customers")
    .update(allowed)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
