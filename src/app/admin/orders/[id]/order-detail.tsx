"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { statusLabels } from "@/lib/order-status";
import { useToast } from "@/components/admin/toast";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { Customer, Invoice, Order, OrderItem } from "@/types/database";

type Props = {
  order: Order & { customers: Customer | null };
  items: OrderItem[];
  invoice: Invoice | null;
};

const statusFlow = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "completed"];

export function OrderDetail({ order, items, invoice }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [financeError, setFinanceError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmRefund, setConfirmRefund] = useState(false);
  const orderNum = `T2G-${String(order.order_number).padStart(4, "0")}`;
  const showLatePaymentWarning =
    order.status === "cancelled" &&
    order.cancel_reason === "admin_cancelled" &&
    order.payment_status === "paid";
  const canRefund = order.payment_method === "online" && order.payment_status === "paid";
  const hasInvoiceData = Boolean(
    order.invoice_company_name
    && order.invoice_vat_number
    && order.invoice_address_line1
    && order.invoice_postal_code
    && order.invoice_city,
  );

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    setStatusError(null);

    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status: newStatus }),
    });

    setUpdating(false);
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setStatusError(result?.error ?? "Statusupdate mislukt");
      toast(result?.error ?? "Statusupdate mislukt", "error");
      return;
    }

    toast(`Status gewijzigd naar ${statusLabels[newStatus] ?? newStatus}`);
    router.refresh();
  }

  async function handleRefund() {
    if (!refundReason.trim()) {
      setFinanceError("Een refundreden is verplicht.");
      return;
    }

    setRefundLoading(true);
    setFinanceError(null);
    // toast replaces inline message

    const amountValue = refundAmount.trim();
    const amountCents = amountValue
      ? Math.round(Number(amountValue.replace(",", ".")) * 100)
      : undefined;

    const response = await fetch("/api/admin/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: order.id,
        reason: refundReason.trim(),
        amount_cents: amountCents,
      }),
    });

    setRefundLoading(false);
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setFinanceError(result?.error ?? "Refund mislukt.");
      toast(result?.error ?? "Refund mislukt.", "error");
      return;
    }

    toast("Refund verwerkt.");
    router.refresh();
  }

  async function handleInvoiceCreate() {
    setInvoiceLoading(true);
    setFinanceError(null);
    // toast replaces inline message

    const response = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order.id }),
    });

    setInvoiceLoading(false);
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setFinanceError(result?.error ?? "Factuur aanmaken mislukt.");
      toast(result?.error ?? "Factuur aanmaken mislukt.", "error");
      return;
    }

    toast("Factuur aangemaakt.");
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

          {showLatePaymentWarning && (
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              Deze bestelling werd in admin geannuleerd, maar de online betaling is later toch gelukt.
              Gebruik de refund-flow voor verdere afhandeling; de order blijft bewust geannuleerd.
            </div>
          )}

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
                onClick={() => setConfirmCancel(true)}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Annuleren
              </button>
            )}
          </div>
          {statusError && (
            <p className="mt-4 text-sm text-red-600">{statusError}</p>
          )}
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

        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-xl text-brand-bronze">Financieel</h2>

          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-brand-warm/40 p-4">
              <h3 className="font-semibold text-brand-brown">Refund</h3>
              <p className="mt-1 text-sm text-brand-brown-s">
                {canRefund
                  ? "Online betaalde bestellingen kunnen hier meteen terugbetaald worden."
                  : "Refund is alleen beschikbaar voor online betaalde bestellingen met betaalstatus betaald."}
              </p>

              {order.payment_status === "refunded" && (
                <p className="mt-3 text-sm text-green-700">
                  Reeds gerefund: {formatPrice(order.refund_amount_cents ?? 0)}
                  {order.refund_reason && ` · ${order.refund_reason}`}
                </p>
              )}

              {canRefund && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm text-brand-brown-m">Bedrag in euro (leeg = volledig)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={refundAmount}
                      onChange={(event) => setRefundAmount(event.target.value)}
                      placeholder={(order.total_cents / 100).toFixed(2)}
                      className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-brand-brown-m">Reden</label>
                    <textarea
                      value={refundReason}
                      onChange={(event) => setRefundReason(event.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!refundReason.trim()) {
                        setFinanceError("Een refundreden is verplicht.");
                        return;
                      }
                      setConfirmRefund(true);
                    }}
                    disabled={refundLoading}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {refundLoading ? "Refund bezig..." : "Refund uitvoeren"}
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-brand-warm/40 p-4">
              <h3 className="font-semibold text-brand-brown">Factuur</h3>
              {invoice ? (
                <div className="mt-3 space-y-1 text-sm text-brand-brown-m">
                  <p>Factuurnummer: T2G-INV-{String(invoice.invoice_number).padStart(4, "0")}</p>
                  <p>Bedrijf: {invoice.company_name}</p>
                  <p>BTW: {invoice.vat_number}</p>
                  <p>Totaal: {formatPrice(invoice.total_cents)}</p>
                </div>
              ) : (
                <>
                  <p className="mt-1 text-sm text-brand-brown-s">
                    {hasInvoiceData
                      ? "Deze bestelling bevat factuurgegevens, maar er is nog geen factuurrecord aangemaakt."
                      : "Er zijn geen volledige factuurgegevens beschikbaar voor deze bestelling."}
                  </p>
                  {hasInvoiceData && (
                    <button
                      type="button"
                      onClick={handleInvoiceCreate}
                      disabled={invoiceLoading}
                      className="mt-4 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
                    >
                      {invoiceLoading ? "Factuur aanmaken..." : "Factuur aanmaken"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {financeError && <p className="mt-4 text-sm text-red-600">{financeError}</p>}
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

      <ConfirmDialog
        open={confirmCancel}
        title="Bestelling annuleren"
        description={`Weet je zeker dat je bestelling ${orderNum} wilt annuleren? Dit kan niet ongedaan worden.`}
        confirmLabel="Annuleren"
        variant="danger"
        onConfirm={() => {
          setConfirmCancel(false);
          updateStatus("cancelled");
        }}
        onCancel={() => setConfirmCancel(false)}
      />

      <ConfirmDialog
        open={confirmRefund}
        title="Refund uitvoeren"
        description={`Weet je zeker dat je een refund wilt uitvoeren voor bestelling ${orderNum}?`}
        confirmLabel="Refund uitvoeren"
        variant="danger"
        onConfirm={() => {
          setConfirmRefund(false);
          handleRefund();
        }}
        onCancel={() => setConfirmRefund(false)}
      />
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
