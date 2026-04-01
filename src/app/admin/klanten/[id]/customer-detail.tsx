"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import type { Customer } from "@/types/database";

type Props = {
  customer: Customer;
  orders: { order_number: number; status: string; total_cents: number; order_date: string }[];
};

export function CustomerDetail({ customer, orders }: Props) {
  const router = useRouter();
  const [notes, setNotes] = useState(customer.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function updateCustomer(updates: Record<string, unknown>) {
    setSaving(true);
    await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">
        {customer.first_name} {customer.last_name}
        {customer.is_vip && <span className="ml-3 text-lg text-brand-gold">VIP</span>}
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Gegevens</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-brown-s">Email</dt>
              <dd>{customer.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-brown-s">Telefoon</dt>
              <dd>{customer.phone ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-brown-s">Adres</dt>
              <dd>{customer.address_street ? `${customer.address_street}, ${customer.address_zip} ${customer.address_city}` : "—"}</dd>
            </div>
            {customer.company_name && (
              <div className="flex justify-between">
                <dt className="text-brand-brown-s">Bedrijf</dt>
                <dd>{customer.company_name}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => updateCustomer({ is_vip: !customer.is_vip })}
              className="rounded-lg border border-brand-gold px-3 py-1.5 text-sm text-brand-gold hover:bg-brand-warm disabled:opacity-50"
            >
              {customer.is_vip ? "VIP verwijderen" : "VIP markeren"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateCustomer({
                  is_blocked: !customer.is_blocked,
                  blocked_reason: !customer.is_blocked ? "Geblokkeerd door admin" : null,
                })
              }
              className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {customer.is_blocked ? "Deblokkeren" : "Blokkeren"}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Notities</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="mt-3 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
          />
          <button
            type="button"
            disabled={saving}
            onClick={() => updateCustomer({ notes })}
            className="mt-2 rounded-lg bg-brand-orange px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
          >
            Opslaan
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-xl text-brand-bronze">Bestellingen</h2>
          <div className="mt-4 space-y-2">
            {orders.map((o) => (
              <div key={o.order_number} className="flex items-center justify-between rounded-lg bg-brand-warm/50 px-4 py-2 text-sm">
                <span className="font-medium text-brand-brown">T2G-{String(o.order_number).padStart(4, "0")}</span>
                <span className="text-brand-brown-s">{new Date(o.order_date).toLocaleDateString("nl-BE")}</span>
                <span className="text-brand-brown-m">{o.status}</span>
                <span className="font-medium text-brand-orange">{formatPrice(o.total_cents)}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-brand-brown-s">Geen bestellingen</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
