import { setRequestLocale } from "next-intl/server";
import { getPublicOrderStatus } from "@/lib/orders/public-status";
import { OrderStatusContent } from "./order-status-content";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function OrderStatusPage({ params, searchParams }: Props) {
  const { locale, id } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);

  const order = await getPublicOrderStatus(id, token);

  return <OrderStatusContent order={order} />;
}

export async function generateMetadata() {
  return { title: "Bestellingsstatus" };
}
