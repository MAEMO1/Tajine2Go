"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { statusColors, statusLabels } from "@/lib/order-status";
import { Search, Filter, Package, ChevronLeft, ChevronRight } from "lucide-react";
import type { Order, Customer } from "@/types/database";

type OrderWithCustomer = Order & {
  customers: Pick<Customer, "first_name" | "last_name" | "email"> | null;
};

const PAGE_SIZE = 20;

export function OrdersList({ orders }: { orders: OrderWithCustomer[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (fulfillmentFilter !== "all" && order.fulfillment !== fulfillmentFilter) return false;
      if (search) {
        const orderNum = `T2G-${String(order.order_number).padStart(4, "0")}`.toLowerCase();
        const customerName = order.customers
          ? `${order.customers.first_name} ${order.customers.last_name}`.toLowerCase()
          : "";
        const q = search.toLowerCase();
        if (!orderNum.includes(q) && !customerName.includes(q)) return false;
      }
      return true;
    });
  }, [orders, statusFilter, fulfillmentFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Bestellingen</h1>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown-s" />
          <input
            type="text"
            placeholder="Zoek op nummer of klant..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-brand-brown-s py-2 pl-9 pr-3 text-sm focus:border-brand-orange focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-brand-brown-s" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
            aria-label="Filter op status"
          >
            <option value="all">Alle statussen</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={fulfillmentFilter}
            onChange={(e) => { setFulfillmentFilter(e.target.value); setPage(0); }}
            className="rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
            aria-label="Filter op type"
          >
            <option value="all">Alle types</option>
            <option value="pickup">Afhalen</option>
            <option value="delivery">Levering</option>
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="mt-6 hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-warm2 bg-brand-warm">
            <tr>
              <th className="px-4 py-3 text-brand-brown-m">Nummer</th>
              <th className="px-4 py-3 text-brand-brown-m">Klant</th>
              <th className="px-4 py-3 text-brand-brown-m">Status</th>
              <th className="px-4 py-3 text-brand-brown-m">Type</th>
              <th className="px-4 py-3 text-brand-brown-m">Betaling</th>
              <th className="px-4 py-3 text-right text-brand-brown-m">Totaal</th>
              <th className="px-4 py-3 text-brand-brown-m">Datum</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((order) => {
              const orderNum = `T2G-${String(order.order_number).padStart(4, "0")}`;
              const customerName = order.customers
                ? `${order.customers.first_name} ${order.customers.last_name}`
                : "—";
              return (
                <tr key={order.id} className="border-b border-brand-warm2 transition-colors hover:bg-brand-warm/50">
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
                    {order.payment_status === "paid" && " \u2713"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-brand-brown">
                    {formatPrice(order.total_cents)}
                  </td>
                  <td className="px-4 py-3 text-brand-brown-s">
                    {new Date(order.order_date).toLocaleDateString("nl-BE")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-brand-brown-s">
            <Package size={32} strokeWidth={1.5} />
            <p className="text-sm">Geen bestellingen gevonden</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {paginated.map((order) => {
          const orderNum = `T2G-${String(order.order_number).padStart(4, "0")}`;
          const customerName = order.customers
            ? `${order.customers.first_name} ${order.customers.last_name}`
            : "—";
          return (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block rounded-xl bg-white p-4 shadow-sm transition-colors active:bg-brand-warm/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-brand-orange">{orderNum}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? ""}`}>
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-brand-brown-m">{customerName}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-brand-brown-s">
                <span>
                  {order.fulfillment === "pickup" ? "Afhalen" : "Levering"} &middot;{" "}
                  {order.payment_method === "online" ? "Online" : "Cash"}
                  {order.payment_status === "paid" && " \u2713"}
                </span>
                <span className="font-heading text-sm text-brand-brown">{formatPrice(order.total_cents)}</span>
              </div>
              <p className="mt-1 text-xs text-brand-brown-s">
                {new Date(order.order_date).toLocaleDateString("nl-BE")}
              </p>
            </Link>
          );
        })}
        {paginated.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-brand-brown-s">
            <Package size={32} strokeWidth={1.5} />
            <p className="text-sm">Geen bestellingen gevonden</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-brand-brown-s">
            {filtered.length} resultaten &middot; pagina {safePage + 1} van {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="rounded-lg border border-brand-brown-s p-1.5 text-brand-brown-m transition-colors hover:bg-brand-warm disabled:opacity-40"
              aria-label="Vorige pagina"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="rounded-lg border border-brand-brown-s p-1.5 text-brand-brown-m transition-colors hover:bg-brand-warm disabled:opacity-40"
              aria-label="Volgende pagina"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
