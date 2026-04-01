"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatPrice } from "@/lib/format";

type Props = {
  todayRevenue: number;
  todayCount: number;
  weekRevenue: number;
  avgOrder: number;
  dailySummary: { order_date: string; total_revenue_cents: number; order_count: number }[];
  topDishes: { dish_id: string; name_nl: string; total_sold: number; total_revenue_cents: number }[];
  pickupCount: number;
  deliveryCount: number;
  onlineCount: number;
  cashCount: number;
};

export function DashboardContent({
  todayRevenue,
  todayCount,
  weekRevenue,
  avgOrder,
  dailySummary,
  topDishes,
  pickupCount,
  deliveryCount,
  onlineCount,
  cashCount,
}: Props) {
  const chartData = dailySummary
    .map((d) => ({
      date: new Date(d.order_date).toLocaleDateString("nl-BE", { day: "2-digit", month: "2-digit" }),
      revenue: d.total_revenue_cents / 100,
      orders: d.order_count,
    }))
    .reverse();

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Dashboard</h1>

      {/* KPI cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Omzet vandaag" value={formatPrice(todayRevenue)} />
        <KpiCard label="Bestellingen vandaag" value={String(todayCount)} />
        <KpiCard label="Omzet deze week" value={formatPrice(weekRevenue)} />
        <KpiCard label="Gem. orderwaarde" value={formatPrice(avgOrder)} />
      </div>

      {/* Revenue chart */}
      <div className="mt-8 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="font-heading text-xl text-brand-bronze">Omzet per dag (30 dagen)</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
              <Tooltip formatter={(value) => [`€${Number(value).toFixed(2)}`, "Omzet"]} />
              <Bar dataKey="revenue" fill="#D97B1A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Top dishes */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Top 5 gerechten</h2>
          <div className="mt-3 space-y-2">
            {topDishes.map((dish, i) => (
              <div key={dish.dish_id} className="flex items-center justify-between">
                <span className="text-sm text-brand-brown-m">
                  {i + 1}. {dish.name_nl}
                </span>
                <span className="text-sm font-medium text-brand-brown">
                  {dish.total_sold}x
                </span>
              </div>
            ))}
            {topDishes.length === 0 && (
              <p className="text-sm text-brand-brown-s">Nog geen data</p>
            )}
          </div>
        </div>

        {/* Fulfillment ratio */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Afhalen / Levering</h2>
          <div className="mt-4 space-y-2">
            <RatioBar label="Afhalen" count={pickupCount} total={pickupCount + deliveryCount} color="bg-brand-orange" />
            <RatioBar label="Levering" count={deliveryCount} total={pickupCount + deliveryCount} color="bg-brand-gold" />
          </div>
        </div>

        {/* Payment ratio */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Online / Cash</h2>
          <div className="mt-4 space-y-2">
            <RatioBar label="Online" count={onlineCount} total={onlineCount + cashCount} color="bg-brand-orange" />
            <RatioBar label="Cash" count={cashCount} total={onlineCount + cashCount} color="bg-brand-bronze" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm text-brand-brown-s">{label}</p>
      <p className="mt-1 font-heading text-2xl text-brand-orange">{value}</p>
    </div>
  );
}

function RatioBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-brand-brown-m">{label}</span>
        <span className="text-brand-brown">{count} ({pct}%)</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-brand-warm2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
