import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { revalidatePublicLocaleRoutes } from "@/lib/public-route-revalidation";
import {
  fetchAdminContentSettings,
  updateContentSettings,
} from "@/lib/site-content";

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  try {
    const content = await fetchAdminContentSettings();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch content settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const body = await request.json();

  if (
    !body
    || typeof body !== "object"
    || (
      !("business_info" in body)
      && !("website_texts" in body)
      && !("faq_entries" in body)
      && !("brand_assets" in body)
      && !("legal_pages" in body)
    )
  ) {
    return NextResponse.json(
      { error: "Missing content payload" },
      { status: 400 },
    );
  }

  try {
    await updateContentSettings(body);
    revalidatePublicLocaleRoutes("admin content patch");
    const content = await fetchAdminContentSettings({ fresh: true });
    return NextResponse.json(content);
  } catch {
    return NextResponse.json(
      { error: "Failed to update content settings" },
      { status: 500 },
    );
  }
}
