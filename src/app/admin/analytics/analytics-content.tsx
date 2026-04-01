"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { formatPrice } from "@/lib/format";

type Props = {
  dailySummary: { order_date: string; total_revenue_cents: number; order_count: number }[];
  dishRankings: { dish_id: string; name_nl: string; slug: string; total_sold: number; total_revenue_cents: number }[];
  vatSummary: { month: string; subtotal_cents: number; vat_cents: number; total_cents: number; order_count: number }[];
  cateringRevenue: { event_type: string; request_count: number; completed_count: number; total_revenue_cents: number }[];
};

const eventLabels: Record<string, string> = {
  wedding: "Bruiloft",
  aqiqa: "Aqiqa",
  corporate: "Bedrijf",
  funeral: "Rouwplechtigheid",
  iftar: "Iftar",
  other: "Anders",
};

export function AnalyticsContent({ dailySummary, dishRankings, vatSummary, cateringRevenue }: Props) {
  const dailyData = dailySummary
    .map((d) => ({
      date: new Date(d.order_date).toLocaleDateString("nl-BE", { day: "2-digit", month: "2-digit" }),
      revenue: d.total_revenue_cents / 100,
      orders: d.order_count,
    }))
    .reverse();

  const vatData = vatSummary
    .map((v) => ({
      month: new Date(v.month).toLocaleDateString("nl-BE", { month: "short", year: "2-digit" }),
      subtotal: v.subtotal_cents / 100,
      vat: v.vat_cents / 100,
      total: v.total_cents / 100,
      orders: v.order_count,
    }))
    .reverse();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-brand-brown">Analytics</h1>
        <div className="flex gap-2">
          <a
            href="/api/admin/export?type=orders"
            className="rounded-lg border border-brand-brown-s px-4 py-2 text-sm text-brand-brown-m hover:bg-brand-warm"
          >
            Export bestellingen (CSV)
          </a>
          <a
            href="/api/admin/export?type=vat"
            className="rounded-lg border border-brand-brown-s px-4 py-2 text-sm text-brand-brown-m hover:bg-brand-warm"
          >
            Export BTW (CSV)
          </a>
        </div>
      </div>

      {/* Daily revenue */}
      <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="font-heading text-xl text-brand-bronze">Omzet per dag</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
              <Tooltip formatter={(value) => [`€${Number(value).toFixed(2)}`, "Omzet"]} />
              <Bar dataKey="revenue" fill="#D97B1A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Dish rankings */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Gerechten ranking</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-brand-warm2">
                <th className="pb-2 text-left text-brand-brown-s">#</th>
                <th className="pb-2 text-left text-brand-brown-s">Gerecht</th>
                <th className="pb-2 text-right text-brand-brown-s">Verkocht</th>
                <th className="pb-2 text-right text-brand-brown-s">Omzet</th>
              </tr>
            </thead>
            <tbody>
              {dishRankings.map((d, i) => (
                <tr key={d.dish_id} className="border-b border-brand-warm2">
                  <td className="py-2 text-brand-brown-s">{i + 1}</td>
                  <td className="py-2 text-brand-brown">{d.name_nl}</td>
                  <td className="py-2 text-right text-brand-brown-m">{d.total_sold}</td>
                  <td className="py-2 text-right font-medium text-brand-orange">{formatPrice(d.total_revenue_cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VAT summary */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">BTW-overzicht per maand</h2>
          {vatData.length > 0 ? (
            <>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vatData}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
                    <Tooltip formatter={(value) => [`€${Number(value).toFixed(2)}`]} />
                    <Line type="monotone" dataKey="total" stroke="#D97B1A" strokeWidth={2} />
                    <Line type="monotone" dataKey="vat" stroke="#EDAC2A" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <table className="mt-4 w-full text-xs">
                <thead>
                  <tr className="border-b border-brand-warm2">
                    <th className="pb-1 text-left text-brand-brown-s">Maand</th>
                    <th className="pb-1 text-right text-brand-brown-s">Subtotaal</th>
                    <th className="pb-1 text-right text-brand-brown-s">BTW (6%)</th>
                    <th className="pb-1 text-right text-brand-brown-s">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  {vatData.map((v) => (
                    <tr key={v.month} className="border-b border-brand-warm2">
                      <td className="py-1">{v.month}</td>
                      <td className="py-1 text-right">€{v.subtotal.toFixed(2)}</td>
                      <td className="py-1 text-right text-brand-gold">€{v.vat.toFixed(2)}</td>
                      <td className="py-1 text-right font-medium">€{v.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="mt-4 text-sm text-brand-brown-s">Nog geen data</p>
          )}
        </div>

        {/* Catering revenue */}
        <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-xl text-brand-bronze">Catering omzet per type</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-brand-warm2">
                <th className="pb-2 text-left text-brand-brown-s">Type</th>
                <th className="pb-2 text-right text-brand-brown-s">Aanvragen</th>
                <th className="pb-2 text-right text-brand-brown-s">Afgerond</th>
                <th className="pb-2 text-right text-brand-brown-s">Omzet</th>
              </tr>
            </thead>
            <tbody>
              {cateringRevenue.map((c) => (
                <tr key={c.event_type} className="border-b border-brand-warm2">
                  <td className="py-2 text-brand-brown">{eventLabels[c.event_type] ?? c.event_type}</td>
                  <td className="py-2 text-right text-brand-brown-m">{c.request_count}</td>
                  <td className="py-2 text-right text-brand-brown-m">{c.completed_count}</td>
                  <td className="py-2 text-right font-medium text-brand-orange">{formatPrice(c.total_revenue_cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
