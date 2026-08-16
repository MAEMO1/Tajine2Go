"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { createCheckoutSchema, type CheckoutRequest } from "@/lib/validations/checkout";
import { Reveal } from "@/components/motion/reveal";
import { Khatam, KhatamSolid } from "@/components/decor/khatam";
import type { Locale, PublicOrderConfig } from "@/types/database";

type Props = {
  config: PublicOrderConfig;
  checkoutNotice?: string | null;
  closedMessage?: string | null;
};

/* ── Shared visual tokens (CLAUDE.md 5.3 + design-language v3) ── */
const cardClass = "rounded-2xl border border-brand-warm2/70 bg-brand-cream p-6 shadow-sm";
const inputClass =
  "w-full rounded-lg border border-brand-brown-s bg-white/60 px-3.5 py-2.5 text-sm focus:border-brand-orange focus:outline-none";
const fieldLabelClass = "mb-1.5 block text-[13px] font-medium text-brand-brown-m";
const radioCardClass =
  "flex cursor-pointer items-center gap-3 rounded-xl border border-brand-brown-s/40 bg-white/50 px-4 py-4 transition-all duration-300 hover:border-brand-orange/50 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-warm/70 has-[:checked]:shadow-sm";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-brand-orange">
        {children}
      </h2>
      <span className="h-px flex-1 bg-brand-orange/25" aria-hidden="true" />
    </div>
  );
}

export function CheckoutForm({ config, checkoutNotice, closedMessage }: Props) {
  const t = useTranslations("checkout");
  const tv = useTranslations("validation");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotalCents = useCartStore((s) => s.subtotalCents);
  const clearCart = useCartStore((s) => s.clearCart);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [invoiceRequested, setInvoiceRequested] = useState(false);
  const availablePaymentMethods = [
    config.payment_methods.online_enabled ? "online" : null,
    config.payment_methods.cash_enabled ? "cash" : null,
  ].filter((method): method is "online" | "cash" => method !== null);
  const defaultPaymentMethod = availablePaymentMethods[0] ?? "online";

  const schema = useMemo(() => createCheckoutSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckoutRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      locale,
      items: items.map((item) => ({
        weekly_menu_id: item.weekly_menu_id,
        quantity: item.quantity,
      })),
      fulfillment: config.delivery_config.enabled ? "pickup" : "pickup",
      payment_method: defaultPaymentMethod,
    },
  });

  const fulfillment = useWatch({ control, name: "fulfillment" }) ?? "pickup";
  const subtotal = subtotalCents();
  const deliveryFeeCents =
    fulfillment === "delivery"
      ? (
          config.delivery_config.free_delivery_above_cents > 0
          && subtotal >= config.delivery_config.free_delivery_above_cents
            ? 0
            : config.delivery_config.fee_cents
        )
      : 0;
  const totalCents = subtotal + deliveryFeeCents;
  const minimumReached = subtotal >= config.min_order_cents;
  const slotSelectionVisible = fulfillment === "pickup" && config.slot_mode !== "open";
  const slotRequired = fulfillment === "pickup" && config.slot_mode === "slots";
  const closed = !config.is_active;
  const effectiveClosedMessage = closedMessage ?? t("closedMessage");

  useEffect(() => {
    if (!config.delivery_config.enabled) {
      setValue("fulfillment", "pickup");
    }
  }, [config.delivery_config.enabled, setValue]);

  useEffect(() => {
    if (fulfillment !== "pickup" || config.slot_mode === "open") {
      setValue("pickup_slot", undefined);
    }
  }, [config.slot_mode, fulfillment, setValue]);

  // Country is fixed to BE; set it in form state (not via a hidden input) so the
  // z.literal("BE") check passes, and clear the whole address object for pickup.
  useEffect(() => {
    if (fulfillment === "delivery") {
      setValue("delivery_address.country_code", "BE");
    } else {
      setValue("delivery_address", undefined);
    }
  }, [fulfillment, setValue]);

  useEffect(() => {
    setValue("payment_method", defaultPaymentMethod);
  }, [defaultPaymentMethod, setValue]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 text-center md:px-8">
        <div className={`${cardClass} p-10`}>
          <Khatam className="mx-auto h-10 w-10 text-brand-orange/40" />
          <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-brand-brown-s">
            {t("orderSummary")}
          </p>
          <p className="mt-2 text-brand-brown-m">Geen items in je winkelwagen.</p>
        </div>
      </div>
    );
  }

  async function onSubmit(data: CheckoutRequest) {
    setSubmitting(true);
    setServerError(null);

    if (closed) {
      setServerError(effectiveClosedMessage);
      setSubmitting(false);
      return;
    }

    if (!minimumReached) {
      setServerError(t("minimumOrder", { amount: formatPrice(config.min_order_cents) }));
      setSubmitting(false);
      return;
    }

    if (fulfillment === "delivery" && !config.delivery_config.enabled) {
      setServerError(t("deliveryDisabled"));
      setSubmitting(false);
      return;
    }

    if (slotRequired && !data.pickup_slot) {
      setServerError(t("pickupSlotRequired"));
      setSubmitting(false);
      return;
    }

    if (!availablePaymentMethods.includes(data.payment_method)) {
      setServerError(t("paymentMethodUnavailable"));
      setSubmitting(false);
      return;
    }

    data.items = items.map((item) => ({
      weekly_menu_id: item.weekly_menu_id,
      quantity: item.quantity,
    }));
    data.locale = locale;

    if (fulfillment !== "pickup" || config.slot_mode === "open") {
      data.pickup_slot = undefined;
    }

    if (
      data.pickup_slot
      && !config.slots.includes(data.pickup_slot)
    ) {
      setServerError(t("pickupSlotRequired"));
      setSubmitting(false);
      return;
    }

    if (!invoiceRequested) {
      data.invoice = undefined;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error ?? effectiveClosedMessage);
        setSubmitting(false);
        return;
      }

      clearCart();

      if (result.redirectUrl.startsWith("http")) {
        window.location.assign(result.redirectUrl);
      } else {
        router.push(result.redirectUrl);
      }
    } catch {
      setServerError(effectiveClosedMessage);
      setSubmitting(false);
    }
  }

  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${config.date}T12:00:00`));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-2 md:px-8 md:pb-28">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12"
      >
        {/* ── Order summary + service info: first on mobile, sticky aside on lg ── */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1">
          <Reveal>
            <section className={cardClass}>
              <div className="flex items-center gap-3">
                <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-brand-orange">
                  {t("orderSummary")}
                </h2>
                <span className="h-px flex-1 bg-brand-orange/25" aria-hidden="true" />
                <KhatamSolid className="h-3 w-3 shrink-0 text-brand-orange" />
              </div>
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.weekly_menu_id}
                    className="flex items-baseline justify-between gap-4 text-sm"
                  >
                    <span className="text-brand-brown-m">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="shrink-0 font-mono font-semibold text-brand-brown">
                      {formatPrice(item.price_cents * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex items-baseline justify-between border-t border-brand-warm2 pt-3 text-sm">
                  <span className="font-medium text-brand-brown-m">Subtotaal</span>
                  <span className="font-mono font-semibold text-brand-brown">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {fulfillment === "delivery" && (
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-brand-brown-m">{t("delivery")}</span>
                    <span className="font-mono font-semibold text-brand-brown">
                      {formatPrice(deliveryFeeCents)}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-brand-warm2 pt-3">
                  <span className="text-sm font-bold uppercase tracking-[0.08em] text-brand-brown">
                    Totaal
                  </span>
                  <span className="font-mono text-xl font-bold text-brand-orange">
                    {formatPrice(totalCents)}
                  </span>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section className={cardClass}>
              <SectionLabel>{t("serviceDate")}</SectionLabel>
              <div className="mt-4 space-y-2 text-sm leading-relaxed text-brand-brown-m">
                <p className="font-semibold text-brand-brown">{formattedDate}</p>
                {config.open_window && <p>{t("serviceWindow", { window: config.open_window })}</p>}
                <p>{t("minimumRequirement", { amount: formatPrice(config.min_order_cents) })}</p>
                {config.delivery_config.enabled ? (
                  <p>
                    {t("deliveryFeeInfo", {
                      amount: formatPrice(config.delivery_config.fee_cents),
                      freeAbove:
                        config.delivery_config.free_delivery_above_cents > 0
                          ? formatPrice(config.delivery_config.free_delivery_above_cents)
                          : "—",
                    })}
                  </p>
                ) : (
                  <p>{t("deliveryDisabled")}</p>
                )}
              </div>
              {closed && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {effectiveClosedMessage}
                </div>
              )}
            </section>
          </Reveal>
        </aside>

        {/* ── Form column ── */}
        <div className="space-y-6 lg:col-start-1 lg:row-start-1">
          {checkoutNotice && (
            <Reveal>
              <section className="rounded-2xl border border-brand-orange/20 bg-brand-warm p-5 shadow-sm">
                <p className="text-sm leading-relaxed text-brand-brown">{checkoutNotice}</p>
              </section>
            </Reveal>
          )}

          <Reveal delay={0.05}>
            <section className={cardClass}>
              <SectionLabel>{t("personalInfo")}</SectionLabel>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={fieldLabelClass}>{t("firstName")}</label>
                  <input {...register("customer.first_name")} className={inputClass} />
                  {errors.customer?.first_name && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.customer.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={fieldLabelClass}>{t("lastName")}</label>
                  <input {...register("customer.last_name")} className={inputClass} />
                  {errors.customer?.last_name && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.customer.last_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={fieldLabelClass}>{t("email")}</label>
                  <input type="email" {...register("customer.email")} className={inputClass} />
                  {errors.customer?.email && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.customer.email.message}</p>
                  )}
                </div>
                <div>
                  <label className={fieldLabelClass}>{t("phone")}</label>
                  <input type="tel" {...register("customer.phone")} className={inputClass} />
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.05}>
            <section className={cardClass}>
              <SectionLabel>{t("fulfillment")}</SectionLabel>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className={radioCardClass}>
                  <input
                    type="radio"
                    value="pickup"
                    {...register("fulfillment")}
                    className="h-4 w-4 shrink-0 accent-brand-orange"
                  />
                  <span className="text-sm font-semibold text-brand-brown">{t("pickup")}</span>
                </label>

                {config.delivery_config.enabled ? (
                  <label className={radioCardClass}>
                    <input
                      type="radio"
                      value="delivery"
                      {...register("fulfillment")}
                      className="h-4 w-4 shrink-0 accent-brand-orange"
                    />
                    <span className="text-sm font-semibold text-brand-brown">{t("delivery")}</span>
                  </label>
                ) : (
                  <p className="flex items-center rounded-xl border border-dashed border-brand-brown-s/40 px-4 py-4 text-sm text-brand-brown-s">
                    {t("deliveryDisabled")}
                  </p>
                )}
              </div>

              {fulfillment === "pickup" && (
                <div className="mt-5 space-y-3">
                  {slotSelectionVisible && (
                    <div>
                      <label className={fieldLabelClass}>{t("pickupSlot")}</label>
                      <select {...register("pickup_slot")} className={inputClass}>
                        <option value="">
                          {slotRequired ? t("pickupSlotRequired") : t("pickupSlotOptional")}
                        </option>
                        {config.slots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {config.open_window && (
                    <p className="text-sm text-brand-brown-s">
                      {t("serviceWindow", { window: config.open_window })}
                    </p>
                  )}
                </div>
              )}

              {fulfillment === "delivery" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={fieldLabelClass}>{t("street")}</label>
                    <input {...register("delivery_address.line1")} className={inputClass} />
                  </div>
                  <div>
                    <label className={fieldLabelClass}>{t("postalCode")}</label>
                    <input {...register("delivery_address.postal_code")} className={inputClass} />
                  </div>
                  <div>
                    <label className={fieldLabelClass}>{t("city")}</label>
                    <input
                      {...register("delivery_address.city")}
                      defaultValue="Gent"
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </section>
          </Reveal>

          <Reveal delay={0.05}>
            <section className={cardClass}>
              <SectionLabel>{t("paymentMethod")}</SectionLabel>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {config.payment_methods.online_enabled && (
                  <label className={radioCardClass}>
                    <input
                      type="radio"
                      value="online"
                      {...register("payment_method")}
                      className="h-4 w-4 shrink-0 accent-brand-orange"
                    />
                    <span className="text-sm font-semibold text-brand-brown">{t("online")}</span>
                  </label>
                )}
                {config.payment_methods.cash_enabled && (
                  <label className={radioCardClass}>
                    <input
                      type="radio"
                      value="cash"
                      {...register("payment_method")}
                      className="h-4 w-4 shrink-0 accent-brand-orange"
                    />
                    <span className="text-sm font-semibold text-brand-brown">{t("cash")}</span>
                  </label>
                )}
              </div>
              {availablePaymentMethods.length === 1 && (
                <p className="mt-3 text-sm text-brand-brown-s">
                  {t("paymentMethodSingle")}
                </p>
              )}
            </section>
          </Reveal>

          <Reveal delay={0.05}>
            <section className={cardClass}>
              <SectionLabel>{t("notes")}</SectionLabel>
              <textarea
                {...register("notes")}
                placeholder={t("notesPlaceholder")}
                rows={3}
                className={`mt-5 ${inputClass}`}
              />
            </section>
          </Reveal>

          <Reveal delay={0.05}>
            <section className={cardClass}>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={invoiceRequested}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    setInvoiceRequested(isChecked);
                    if (isChecked) {
                      setValue("invoice.country_code", "BE");
                    } else {
                      setValue("invoice", undefined);
                    }
                  }}
                  className="h-4 w-4 shrink-0 accent-brand-orange"
                />
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-brand-orange">
                  {t("invoice")}
                </span>
              </label>

              {invoiceRequested && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabelClass}>{t("companyName")}</label>
                    <input {...register("invoice.company_name")} className={inputClass} />
                  </div>
                  <div>
                    <label className={fieldLabelClass}>{t("vatNumber")}</label>
                    <input {...register("invoice.vat_number")} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabelClass}>{t("street")}</label>
                    <input {...register("invoice.address_line1")} className={inputClass} />
                  </div>
                  <div>
                    <label className={fieldLabelClass}>{t("postalCode")}</label>
                    <input {...register("invoice.postal_code")} className={inputClass} />
                  </div>
                  <div>
                    <label className={fieldLabelClass}>{t("city")}</label>
                    <input {...register("invoice.city")} className={inputClass} />
                  </div>
                </div>
              )}
            </section>
          </Reveal>

          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || closed || !minimumReached}
            className="w-full rounded-full bg-brand-orange py-4 font-mono text-[12px] font-bold uppercase tracking-[0.28em] text-white shadow-[0_8px_30px_rgba(217,123,26,0.35)] transition-colors duration-300 hover:bg-brand-orange-hover active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            {submitting ? t("processing") : t("placeOrder")}
          </button>
        </div>
      </form>
    </div>
  );
}
