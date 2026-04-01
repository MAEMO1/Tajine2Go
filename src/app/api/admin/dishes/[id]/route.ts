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

  const { error } = await supabase
    .from("dishes")
    .update(body)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update dish" }, { status: 500 });
  }

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
    .from("dishes")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete dish" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
