"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Search, Users } from "lucide-react";
import type { Customer } from "@/types/database";

type CustomerValue = {
  customer_id: string;
  order_count: number;
  lifetime_value_cents: number;
};

type Props = {
  customers: Customer[];
  customerValues: CustomerValue[];
};

export function CustomersList({ customers, customerValues }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "vip" | "blocked">("all");

  const valueMap = useMemo(() => {
    const map = new Map<string, CustomerValue>();
    for (const cv of customerValues) {
      map.set(cv.customer_id, cv);
    }
    return map;
  }, [customerValues]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (filter === "vip" && !c.is_vip) return false;
      if (filter === "blocked" && !c.is_blocked) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.first_name.toLowerCase().includes(q) &&
          !c.last_name.toLowerCase().includes(q) &&
          !(c.email ?? "").toLowerCase().includes(q) &&
          !(c.phone ?? "").includes(search)
        )
          return false;
      }
      return true;
    });
  }, [customers, search, filter]);

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Klanten</h1>

      {/* Search & filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown-s" />
          <input
            type="text"
            placeholder="Zoek op naam, email of telefoon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-brand-brown-s py-2 pl-9 pr-3 text-sm focus:border-brand-orange focus:outline-none"
          />
        </div>

        <div className="flex gap-1">
          {(["all", "vip", "blocked"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-brand-orange text-white"
                  : "border border-brand-brown-s text-brand-brown-m hover:bg-brand-warm"
              }`}
            >
              {f === "all" ? "Alle" : f === "vip" ? "VIP" : "Geblokkeerd"}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="mt-6 hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-warm2 bg-brand-warm">
            <tr>
              <th className="px-4 py-3 text-brand-brown-m">Naam</th>
              <th className="px-4 py-3 text-brand-brown-m">Email</th>
              <th className="px-4 py-3 text-brand-brown-m">Telefoon</th>
              <th className="px-4 py-3 text-right text-brand-brown-m">Bestellingen</th>
              <th className="px-4 py-3 text-right text-brand-brown-m">Waarde</th>
              <th className="px-4 py-3 text-brand-brown-m">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const val = valueMap.get(c.id);
              return (
                <tr key={c.id} className="border-b border-brand-warm2 transition-colors hover:bg-brand-warm/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/klanten/${c.id}`} className="font-medium text-brand-orange hover:underline">
                      {c.first_name} {c.last_name}
                    </Link>
                    {c.is_vip && (
                      <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-brand-gold">
                        VIP
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-brown-m">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-brand-brown-m">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-brand-brown-m">{val?.order_count ?? 0}</td>
                  <td className="px-4 py-3 text-right font-medium text-brand-brown">
                    {formatPrice(val?.lifetime_value_cents ?? 0)}
                  </td>
                  <td className="px-4 py-3">
                    {c.is_blocked && (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                        Geblokkeerd
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-brand-brown-s">
            <Users size={32} strokeWidth={1.5} />
            <p className="text-sm">Geen klanten gevonden</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {filtered.map((c) => {
          const val = valueMap.get(c.id);
          return (
            <Link
              key={c.id}
              href={`/admin/klanten/${c.id}`}
              className="block rounded-xl bg-white p-4 shadow-sm transition-colors active:bg-brand-warm/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-brand-orange">
                  {c.first_name} {c.last_name}
                </span>
                <div className="flex gap-1">
                  {c.is_vip && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-brand-gold">VIP</span>
                  )}
                  {c.is_blocked && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">Geblokkeerd</span>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-brand-brown-m">{c.email ?? "—"}</p>
              {c.phone && <p className="text-xs text-brand-brown-s">{c.phone}</p>}
              <div className="mt-2 flex items-center justify-between text-xs text-brand-brown-s">
                <span>{val?.order_count ?? 0} bestellingen</span>
                <span className="font-medium text-brand-brown">{formatPrice(val?.lifetime_value_cents ?? 0)}</span>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-brand-brown-s">
            <Users size={32} strokeWidth={1.5} />
            <p className="text-sm">Geen klanten gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
