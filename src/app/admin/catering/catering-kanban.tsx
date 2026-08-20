"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import type { CateringQuote, CateringRequest, Customer } from "@/types/database";

type CateringRequestWithCustomer = CateringRequest & {
  customers: Pick<Customer, "first_name" | "last_name" | "email" | "phone"> | null;
  catering_quotes?: CateringQuote[] | null;
};

const columns = [
  { status: "new", label: "Nieuw", color: "border-blue-400" },
  { status: "in_contact", label: "In contact", color: "border-yellow-400" },
  { status: "quote_sent", label: "Offerte verstuurd", color: "border-purple-400" },
  { status: "confirmed", label: "Bevestigd", color: "border-green-400" },
  { status: "completed", label: "Afgerond", color: "border-gray-400" },
  { status: "cancelled", label: "Geannuleerd", color: "border-red-400" },
] as const;

const eventLabels: Record<string, string> = {
  party: "Feesten",
  event: "Evenementen",
  reception: "Recepties",
  other: "Anders",
};

export function CateringKanban({ requests }: { requests: CateringRequestWithCustomer[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>(
    Object.fromEntries(requests.map((request) => [request.id, request.admin_notes ?? ""])),
  );
  const [quoteItemsById, setQuoteItemsById] = useState<Record<string, string>>({});
  const [quoteSubtotalById, setQuoteSubtotalById] = useState<Record<string, string>>({});
  const [quoteValidUntilById, setQuoteValidUntilById] = useState<Record<string, string>>({});
  const [quoteTermsById, setQuoteTermsById] = useState<Record<string, string>>({});
  const [quoteNotesById, setQuoteNotesById] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateRequest(id: string, updates: Record<string, unknown>) {
    setError(null);
    setMessage(null);

    const response = await fetch("/api/admin/catering", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Bijwerken mislukt.");
      return false;
    }

    router.refresh();
    return true;
  }

  async function createQuote(requestId: string) {
    const rawItems = (quoteItemsById[requestId] ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (rawItems.length === 0) {
      setError("Voeg minstens één offertelijn toe.");
      return;
    }

    const subtotal = Number(quoteSubtotalById[requestId] ?? "");
    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      setError("Geef een geldig subtotaal in centen in.");
      return;
    }

    setError(null);
    setMessage(null);

    const response = await fetch("/api/admin/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: requestId,
        items: rawItems.map((description) => ({ description })),
        subtotal_cents: subtotal,
        valid_until: quoteValidUntilById[requestId] || null,
        terms: quoteTermsById[requestId] || null,
        notes: quoteNotesById[requestId] || null,
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Offerte aanmaken mislukt.");
      return;
    }

    setMessage("Offerte aangemaakt.");
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-brand-brown">Catering aanvragen</h1>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-4 text-sm text-green-700">{message}</p>}

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const items = requests.filter((request) => request.status === col.status);
          return (
            <div key={col.status} className="w-[28rem] flex-shrink-0">
              <div className={`rounded-t-lg border-t-4 ${col.color} bg-white px-3 py-2`}>
                <h3 className="text-sm font-semibold text-brand-brown">
                  {col.label} ({items.length})
                </h3>
              </div>
              <div className="space-y-2 rounded-b-lg bg-brand-warm/30 p-2">
                {items.map((request) => {
                  const quotes = request.catering_quotes ?? [];
                  const isExpanded = expandedId === request.id;
                  return (
                    <div key={request.id} className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-brand-brown">
                            {request.customers
                              ? `${request.customers.first_name} ${request.customers.last_name}`
                              : "Onbekend"}
                          </p>
                          <p className="text-xs text-brand-brown-s">
                            {eventLabels[request.event_type] ?? request.event_type}
                            {request.event_date && ` · ${new Date(request.event_date).toLocaleDateString("nl-BE")}`}
                            {request.guest_count && ` · ${request.guest_count} gasten`}
                          </p>
                          {request.quoted_amount_cents !== null && (
                            <p className="mt-1 text-xs font-medium text-brand-orange">
                              Offertebedrag: {formatPrice(request.quoted_amount_cents)}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : request.id)}
                          className="rounded px-2 py-1 text-xs text-brand-orange hover:bg-brand-warm"
                        >
                          {isExpanded ? "Minder" : "Details"}
                        </button>
                      </div>

                      {request.message && (
                        <p className="mt-2 text-xs text-brand-brown-m line-clamp-2">{request.message}</p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-1">
                        {col.status === "new" && (
                          <button
                            type="button"
                            onClick={() => updateRequest(request.id, { status: "in_contact" })}
                            className="rounded px-2 py-0.5 text-xs text-brand-orange hover:bg-brand-warm"
                          >
                            Contact opnemen
                          </button>
                        )}
                        {col.status === "quote_sent" && (
                          <button
                            type="button"
                            onClick={() => updateRequest(request.id, { status: "confirmed" })}
                            className="rounded px-2 py-0.5 text-xs text-green-600 hover:bg-green-50"
                          >
                            Bevestigen
                          </button>
                        )}
                        {col.status === "confirmed" && (
                          <button
                            type="button"
                            onClick={() => updateRequest(request.id, { status: "completed" })}
                            className="rounded px-2 py-0.5 text-xs text-brand-brown hover:bg-brand-warm"
                          >
                            Afronden
                          </button>
                        )}
                        {!["completed", "cancelled"].includes(col.status) && (
                          <button
                            type="button"
                            onClick={() => updateRequest(request.id, { status: "cancelled" })}
                            className="rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-50"
                          >
                            Annuleren
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="mt-4 space-y-4 border-t border-brand-warm2 pt-4 text-sm">
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                              <p className="text-brand-brown-s">E-mail</p>
                              <p className="text-brand-brown">{request.customers?.email ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-brand-brown-s">Telefoon</p>
                              <p className="text-brand-brown">{request.customers?.phone ?? "—"}</p>
                            </div>
                          </div>

                          {request.dietary_needs && (
                            <div>
                              <p className="text-brand-brown-s">Dieetwensen</p>
                              <p className="text-brand-brown">{request.dietary_needs}</p>
                            </div>
                          )}

                          <div>
                            <label className="text-brand-brown-s">Admin notities</label>
                            <textarea
                              value={notesById[request.id] ?? ""}
                              onChange={(event) =>
                                setNotesById((current) => ({ ...current, [request.id]: event.target.value }))
                              }
                              rows={3}
                              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateRequest(request.id, { admin_notes: notesById[request.id] ?? "" })}
                              className="mt-2 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-orange-hover"
                            >
                              Notities opslaan
                            </button>
                          </div>

                          <div className="rounded-lg bg-brand-warm/40 p-3">
                            <h4 className="font-medium text-brand-brown">Offerte</h4>
                            <div className="mt-3 space-y-3">
                              <div>
                                <label className="text-brand-brown-s">Offertelijnen (1 per regel)</label>
                                <textarea
                                  value={quoteItemsById[request.id] ?? ""}
                                  onChange={(event) =>
                                    setQuoteItemsById((current) => ({ ...current, [request.id]: event.target.value }))
                                  }
                                  rows={4}
                                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                                />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                  <label className="text-brand-brown-s">Subtotaal (centen)</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={quoteSubtotalById[request.id] ?? ""}
                                    onChange={(event) =>
                                      setQuoteSubtotalById((current) => ({ ...current, [request.id]: event.target.value }))
                                    }
                                    className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-brand-brown-s">Geldig tot</label>
                                  <input
                                    type="date"
                                    value={quoteValidUntilById[request.id] ?? ""}
                                    onChange={(event) =>
                                      setQuoteValidUntilById((current) => ({ ...current, [request.id]: event.target.value }))
                                    }
                                    className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-brand-brown-s">Voorwaarden</label>
                                <textarea
                                  value={quoteTermsById[request.id] ?? ""}
                                  onChange={(event) =>
                                    setQuoteTermsById((current) => ({ ...current, [request.id]: event.target.value }))
                                  }
                                  rows={2}
                                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-brand-brown-s">Extra notities</label>
                                <textarea
                                  value={quoteNotesById[request.id] ?? ""}
                                  onChange={(event) =>
                                    setQuoteNotesById((current) => ({ ...current, [request.id]: event.target.value }))
                                  }
                                  rows={2}
                                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => createQuote(request.id)}
                                className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-white hover:bg-brand-orange-hover"
                              >
                                Offerte aanmaken
                              </button>
                            </div>
                          </div>

                          {quotes.length > 0 && (
                            <div>
                              <h4 className="font-medium text-brand-brown">Bestaande offertes</h4>
                              <div className="mt-2 space-y-2">
                                {quotes.map((quote) => (
                                  <div key={quote.id} className="rounded-lg bg-brand-warm/30 px-3 py-2">
                                    <p className="text-brand-brown">
                                      Offerte #{quote.quote_number} · {formatPrice(quote.total_cents)}
                                    </p>
                                    {quote.valid_until && (
                                      <p className="text-xs text-brand-brown-s">
                                        Geldig tot {new Date(quote.valid_until).toLocaleDateString("nl-BE")}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

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
