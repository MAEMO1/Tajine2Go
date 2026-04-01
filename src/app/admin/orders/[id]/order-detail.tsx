"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import type { Order, OrderItem, Customer } from "@/types/database";

type Props = {
  order: Order & { customers: Customer | null };
  items: OrderItem[];
};

const statusFlow = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "completed"];
const statusLabels: Record<string, string> = {
  pending: "In afwachting",
  confirmed: "Bevestigd",
  preparing: "In bereiding",
  ready: "Klaar",
  out_for_delivery: "Onderweg",
  completed: "Afgerond",
  cancelled: "Geannuleerd",
};

export function OrderDetail({ order, items }: Props) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const orderNum = `T2G-${String(order.order_number).padStart(4, "0")}`;

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status: newStatus }),
    });
    setUpdating(false);
    router.refresh();
  }

  const currentIdx = statusFlow.indexOf(order.status);
  const nextStatus = currentIdx >= 0 && currentIdx < statusFlow.length - 1
    ? statusFlow[currentIdx + 1]
    : null;

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">
        Bestelling {orderNum}
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Order info */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Gegevens</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Status" value={statusLabels[order.status] ?? order.status} />
            <Row label="Type" value={order.fulfillment === "pickup" ? "Afhalen" : "Levering"} />
            <Row label="Betaalmethode" value={order.payment_method === "online" ? "Online" : "Cash"} />
            <Row label="Betaalstatus" value={order.payment_status} />
            {order.pickup_slot && <Row label="Tijdstip" value={order.pickup_slot} />}
            {order.delivery_address_line1 && (
              <Row label="Adres" value={`${order.delivery_address_line1}, ${order.delivery_postal_code} ${order.delivery_city}`} />
            )}
            {order.notes && <Row label="Opmerkingen" value={order.notes} />}
            <Row label="Datum" value={new Date(order.order_date).toLocaleDateString("nl-BE")} />
          </dl>

          {/* Status actions */}
          <div className="mt-6 flex gap-2">
            {nextStatus && order.status !== "cancelled" && (
              <button
                type="button"
                disabled={updating}
                onClick={() => updateStatus(nextStatus)}
                className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
              >
                {statusLabels[nextStatus]} markeren
              </button>
            )}
            {order.status !== "cancelled" && order.status !== "completed" && (
              <button
                type="button"
                disabled={updating}
                onClick={() => updateStatus("cancelled")}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Annuleren
              </button>
            )}
          </div>
        </div>

        {/* Customer */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Klant</h2>
          {order.customers ? (
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Naam" value={`${order.customers.first_name} ${order.customers.last_name}`} />
              <Row label="E-mail" value={order.customers.email ?? "—"} />
              <Row label="Telefoon" value={order.customers.phone ?? "—"} />
            </dl>
          ) : (
            <p className="mt-4 text-sm text-brand-brown-s">Geen klantgegevens</p>
          )}
        </div>

        {/* Items */}
        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-xl text-brand-bronze">Items</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-brand-warm2">
                <th className="pb-2 text-left text-brand-brown-s">Gerecht</th>
                <th className="pb-2 text-right text-brand-brown-s">Prijs</th>
                <th className="pb-2 text-right text-brand-brown-s">Aantal</th>
                <th className="pb-2 text-right text-brand-brown-s">Totaal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const name = (item.dish_name_snapshot as { nl: string }).nl;
                return (
                  <tr key={item.id} className="border-b border-brand-warm2">
                    <td className="py-2 text-brand-brown">{name}</td>
                    <td className="py-2 text-right text-brand-brown-m">{formatPrice(item.unit_price_cents)}</td>
                    <td className="py-2 text-right text-brand-brown-m">{item.quantity}</td>
                    <td className="py-2 text-right font-medium text-brand-brown">{formatPrice(item.line_total_cents)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-brand-warm2">
                <td colSpan={3} className="py-2 text-right font-medium text-brand-brown-m">Subtotaal</td>
                <td className="py-2 text-right font-medium text-brand-brown">{formatPrice(order.subtotal_cents)}</td>
              </tr>
              {order.delivery_fee_cents > 0 && (
                <tr>
                  <td colSpan={3} className="py-1 text-right text-brand-brown-s">Leveringskosten</td>
                  <td className="py-1 text-right text-brand-brown-m">{formatPrice(order.delivery_fee_cents)}</td>
                </tr>
              )}
              <tr>
                <td colSpan={3} className="py-2 text-right font-heading text-lg text-brand-brown">Totaal</td>
                <td className="py-2 text-right font-heading text-lg text-brand-orange">{formatPrice(order.total_cents)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-brand-brown-s">{label}</dt>
      <dd className="text-brand-brown">{value}</dd>
    </div>
  );
}
