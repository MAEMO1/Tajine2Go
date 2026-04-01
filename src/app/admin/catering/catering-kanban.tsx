"use client";

import { useRouter } from "next/navigation";
import type { CateringRequest, Customer } from "@/types/database";

type CateringRequestWithCustomer = CateringRequest & {
  customers: Pick<Customer, "first_name" | "last_name" | "email" | "phone"> | null;
};

const columns = [
  { status: "new", label: "Nieuw", color: "border-blue-400" },
  { status: "in_contact", label: "In contact", color: "border-yellow-400" },
  { status: "quote_sent", label: "Offerte verstuurd", color: "border-purple-400" },
  { status: "confirmed", label: "Bevestigd", color: "border-green-400" },
  { status: "completed", label: "Afgerond", color: "border-gray-400" },
  { status: "cancelled", label: "Geannuleerd", color: "border-red-400" },
];

const eventLabels: Record<string, string> = {
  wedding: "Bruiloft",
  aqiqa: "Aqiqa",
  corporate: "Bedrijf",
  funeral: "Rouwplechtigheid",
  iftar: "Iftar",
  other: "Anders",
};

export function CateringKanban({ requests }: { requests: CateringRequestWithCustomer[] }) {
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/catering", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Catering aanvragen</h1>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const items = requests.filter((r) => r.status === col.status);
          return (
            <div key={col.status} className="w-72 flex-shrink-0">
              <div className={`rounded-t-lg border-t-4 ${col.color} bg-white px-3 py-2`}>
                <h3 className="text-sm font-semibold text-brand-brown">
                  {col.label} ({items.length})
                </h3>
              </div>
              <div className="space-y-2 rounded-b-lg bg-brand-warm/30 p-2">
                {items.map((req) => (
                  <div key={req.id} className="rounded-lg bg-white p-3 shadow-sm">
                    <p className="font-medium text-brand-brown">
                      {req.customers
                        ? `${req.customers.first_name} ${req.customers.last_name}`
                        : "Onbekend"}
                    </p>
                    <p className="text-xs text-brand-brown-s">
                      {eventLabels[req.event_type] ?? req.event_type}
                      {req.event_date && ` · ${new Date(req.event_date).toLocaleDateString("nl-BE")}`}
                      {req.guest_count && ` · ${req.guest_count} gasten`}
                    </p>
                    {req.message && (
                      <p className="mt-1 text-xs text-brand-brown-m line-clamp-2">{req.message}</p>
                    )}
                    <div className="mt-2 flex gap-1">
                      {col.status === "new" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(req.id, "in_contact")}
                          className="rounded px-2 py-0.5 text-xs text-brand-orange hover:bg-brand-warm"
                        >
                          Contact opnemen
                        </button>
                      )}
                      {col.status === "in_contact" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(req.id, "quote_sent")}
                          className="rounded px-2 py-0.5 text-xs text-brand-orange hover:bg-brand-warm"
                        >
                          Offerte versturen
                        </button>
                      )}
                      {col.status === "quote_sent" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(req.id, "confirmed")}
                          className="rounded px-2 py-0.5 text-xs text-green-600 hover:bg-green-50"
                        >
                          Bevestigen
                        </button>
                      )}
                      {!["completed", "cancelled"].includes(col.status) && (
                        <button
                          type="button"
                          onClick={() => updateStatus(req.id, "cancelled")}
                          className="rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-50"
                        >
                          Annuleren
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="py-4 text-center text-xs text-brand-brown-s">Geen aanvragen</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
