"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/format";

type OrderData = {
  order_number: number;
  status: string;
  fulfillment: string;
  pickup_slot: string | null;
  total_cents: number;
};

type Props = {
  orderId: string;
  token: string | undefined;
};

export function OrderStatusContent({ orderId, token }: Props) {
  const t = useTranslations("order");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`/api/order/${orderId}?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <p className="text-brand-brown-s">{t("title")}...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <p className="text-brand-brown-s">{t("notFound")}</p>
      </div>
    );
  }

  const orderNumber = `T2G-${String(order.order_number).padStart(4, "0")}`;
  const statusKey = `statuses.${order.status}` as Parameters<typeof t>[0];

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-heading text-3xl text-brand-brown">{t("title")}</h1>

      <div className="mt-6 space-y-4 rounded-xl bg-brand-cream p-6 shadow-sm">
        <div className="flex justify-between">
          <span className="text-brand-brown-s">{t("orderNumber")}</span>
          <span className="font-semibold text-brand-brown">{orderNumber}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-brand-brown-s">{t("status")}</span>
          <OrderStatusBadge status={order.status} label={t(statusKey)} />
        </div>

        <div className="flex justify-between">
          <span className="text-brand-brown-s">{t("fulfillment")}</span>
          <span className="text-brand-brown">
            {order.fulfillment === "pickup" ? "Afhalen" : "Levering"}
          </span>
        </div>

        {order.pickup_slot && (
          <div className="flex justify-between">
            <span className="text-brand-brown-s">{t("pickupSlot")}</span>
            <span className="text-brand-brown">{order.pickup_slot}</span>
          </div>
        )}

        <div className="flex justify-between border-t border-brand-warm2 pt-4">
          <span className="text-brand-brown-s">{t("total")}</span>
          <span className="font-heading text-2xl text-brand-orange">
            {formatPrice(order.total_cents)}
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status, label }: { status: string; label: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-emerald-100 text-emerald-800",
    out_for_delivery: "bg-purple-100 text-purple-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${colors[status] ?? "bg-gray-100 text-gray-800"}`}>
      {label}
    </span>
  );
}
