"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Order, Customer } from "@/types/database";

type OrderWithCustomer = Order & {
  customers: Pick<Customer, "first_name" | "last_name" | "email"> | null;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-emerald-100 text-emerald-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "In afwachting",
  confirmed: "Bevestigd",
  preparing: "In bereiding",
  ready: "Klaar",
  out_for_delivery: "Onderweg",
  completed: "Afgerond",
  cancelled: "Geannuleerd",
};

export function OrdersList({ orders }: { orders: OrderWithCustomer[] }) {
  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Bestellingen</h1>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-warm2 bg-brand-warm">
            <tr>
              <th className="px-4 py-3 text-brand-brown-m">Nummer</th>
              <th className="px-4 py-3 text-brand-brown-m">Klant</th>
              <th className="px-4 py-3 text-brand-brown-m">Status</th>
              <th className="px-4 py-3 text-brand-brown-m">Type</th>
              <th className="px-4 py-3 text-brand-brown-m">Betaling</th>
              <th className="px-4 py-3 text-brand-brown-m">Totaal</th>
              <th className="px-4 py-3 text-brand-brown-m">Datum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const orderNum = `T2G-${String(order.order_number).padStart(4, "0")}`;
              const customerName = order.customers
                ? `${order.customers.first_name} ${order.customers.last_name}`
                : "—";

              return (
                <tr key={order.id} className="border-b border-brand-warm2 hover:bg-brand-warm/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-orange hover:underline">
                      {orderNum}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-brown-m">{customerName}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? ""}`}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-brown-m">
                    {order.fulfillment === "pickup" ? "Afhalen" : "Levering"}
                  </td>
                  <td className="px-4 py-3 text-brand-brown-m">
                    {order.payment_method === "online" ? "Online" : "Cash"}
                    {order.payment_status === "paid" && " ✓"}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-brown">
                    {formatPrice(order.total_cents)}
                  </td>
                  <td className="px-4 py-3 text-brand-brown-s">
                    {new Date(order.order_date).toLocaleDateString("nl-BE")}
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-brand-brown-s">
                  Geen bestellingen gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
