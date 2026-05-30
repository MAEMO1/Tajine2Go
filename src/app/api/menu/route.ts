import { NextRequest, NextResponse } from "next/server";
import { fetchMenuData } from "@/lib/menu-data";
import type { Locale } from "@/types/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = (searchParams.get("locale") ?? "nl") as Locale;
  const date = searchParams.get("date") ?? undefined;

  try {
    const response = await fetchMenuData(locale, { date });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}
