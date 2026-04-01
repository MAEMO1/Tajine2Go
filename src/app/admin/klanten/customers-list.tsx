"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
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

  const valueMap = new Map<string, CustomerValue>();
  for (const cv of customerValues) {
    valueMap.set(cv.customer_id, cv);
  }

  const filtered = search
    ? customers.filter(
        (c) =>
          c.first_name.toLowerCase().includes(search.toLowerCase()) ||
          c.last_name.toLowerCase().includes(search.toLowerCase()) ||
          (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (c.phone ?? "").includes(search),
      )
    : customers;

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Klanten</h1>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Zoek op naam, email of telefoon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-warm2 bg-brand-warm">
            <tr>
              <th className="px-4 py-3 text-brand-brown-m">Naam</th>
              <th className="px-4 py-3 text-brand-brown-m">Email</th>
              <th className="px-4 py-3 text-brand-brown-m">Telefoon</th>
              <th className="px-4 py-3 text-brand-brown-m">Bestellingen</th>
              <th className="px-4 py-3 text-brand-brown-m">Waarde</th>
              <th className="px-4 py-3 text-brand-brown-m">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const val = valueMap.get(c.id);
              return (
                <tr key={c.id} className="border-b border-brand-warm2 hover:bg-brand-warm/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/klanten/${c.id}`} className="font-medium text-brand-orange hover:underline">
                      {c.first_name} {c.last_name}
                    </Link>
                    {c.is_vip && <span className="ml-2 text-xs text-brand-gold">VIP</span>}
                  </td>
                  <td className="px-4 py-3 text-brand-brown-m">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-brand-brown-m">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-brand-brown-m">{val?.order_count ?? 0}</td>
                  <td className="px-4 py-3 font-medium text-brand-brown">
                    {formatPrice(val?.lifetime_value_cents ?? 0)}
                  </td>
                  <td className="px-4 py-3">
                    {c.is_blocked && (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-600">Geblokkeerd</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
