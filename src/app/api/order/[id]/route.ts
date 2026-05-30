import { NextRequest, NextResponse } from "next/server";
import { getPublicOrderStatus } from "@/lib/orders/public-status";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }

  const order = await getPublicOrderStatus(id, token);
  if (!order) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }

  return NextResponse.json(order);
}
