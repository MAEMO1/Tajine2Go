import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .order("category")
    .order("name_nl");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch dishes" }, { status: 500 });
  }

  return NextResponse.json({ dishes: data });
}

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const supabase = createAdminClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("dishes")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create dish" }, { status: 500 });
  }

  return NextResponse.json({ dish: data }, { status: 201 });
}
