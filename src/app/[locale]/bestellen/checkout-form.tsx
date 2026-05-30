"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { createCheckoutSchema, type CheckoutRequest } from "@/lib/validations/checkout";
import type { Locale, PublicOrderConfig } from "@/types/database";

type Props = {
  config: PublicOrderConfig;
  checkoutNotice?: string | null;
  closedMessage?: string | null;
};

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
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-brand-brown-s">{t("orderSummary")}</p>
        <p className="mt-2 text-brand-brown-m">Geen items in je winkelwagen.</p>
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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-3xl text-brand-brown">{t("title")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {checkoutNotice && (
          <section className="rounded-xl bg-brand-warm p-4 shadow-sm">
            <p className="text-sm text-brand-brown">{checkoutNotice}</p>
          </section>
        )}

        <section className="rounded-xl bg-brand-warm/40 p-4 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">{t("serviceDate")}</h2>
          <div className="mt-3 space-y-2 text-sm text-brand-brown-m">
            <p>{formattedDate}</p>
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

        <section className="rounded-xl bg-brand-cream p-4 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">{t("orderSummary")}</h2>
          <div className="mt-3 space-y-2">
            {items.map((item) => (
              <div key={item.weekly_menu_id} className="flex justify-between text-sm">
                <span className="text-brand-brown-m">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium text-brand-brown">
                  {formatPrice(item.price_cents * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-brand-warm2 pt-2 text-sm">
              <span className="font-medium text-brand-brown-m">Subtotaal</span>
              <span className="font-medium text-brand-brown">{formatPrice(subtotal)}</span>
            </div>
            {fulfillment === "delivery" && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-brown-m">{t("delivery")}</span>
                <span className="font-medium text-brand-brown">{formatPrice(deliveryFeeCents)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-brand-warm2 pt-2">
              <span className="font-medium text-brand-brown-m">Totaal</span>
              <span className="font-heading text-lg text-brand-orange">
                {formatPrice(totalCents)}
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl text-brand-bronze">{t("personalInfo")}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-brand-brown-m">{t("firstName")}</label>
              <input
                {...register("customer.first_name")}
                className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
              />
              {errors.customer?.first_name && (
                <p className="mt-1 text-xs text-red-600">{errors.customer.first_name.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-brand-brown-m">{t("lastName")}</label>
              <input
                {...register("customer.last_name")}
                className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
              />
              {errors.customer?.last_name && (
                <p className="mt-1 text-xs text-red-600">{errors.customer.last_name.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-brand-brown-m">{t("email")}</label>
              <input
                type="email"
                {...register("customer.email")}
                className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
              />
              {errors.customer?.email && (
                <p className="mt-1 text-xs text-red-600">{errors.customer.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-brand-brown-m">{t("phone")}</label>
              <input
                type="tel"
                {...register("customer.phone")}
                className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl text-brand-bronze">{t("fulfillment")}</h2>
          <div className="mt-3 flex flex-col gap-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" value="pickup" {...register("fulfillment")} />
              <span className="text-sm text-brand-brown">{t("pickup")}</span>
            </label>

            {config.delivery_config.enabled ? (
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" value="delivery" {...register("fulfillment")} />
                <span className="text-sm text-brand-brown">{t("delivery")}</span>
              </label>
            ) : (
              <p className="text-sm text-brand-brown-s">{t("deliveryDisabled")}</p>
            )}
          </div>

          {fulfillment === "pickup" && (
            <div className="mt-3 space-y-3">
              {slotSelectionVisible && (
                <div>
                  <label className="text-sm text-brand-brown-m">{t("pickupSlot")}</label>
                  <select
                    {...register("pickup_slot")}
                    className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                  >
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
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-brand-brown-m">{t("street")}</label>
                <input
                  {...register("delivery_address.line1")}
                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-brand-brown-m">{t("postalCode")}</label>
                <input
                  {...register("delivery_address.postal_code")}
                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-brand-brown-m">{t("city")}</label>
                <input
                  {...register("delivery_address.city")}
                  defaultValue="Gent"
                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-heading text-xl text-brand-bronze">{t("paymentMethod")}</h2>
          <div className="mt-3 flex flex-wrap gap-4">
            {config.payment_methods.online_enabled && (
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" value="online" {...register("payment_method")} />
                <span className="text-sm text-brand-brown">{t("online")}</span>
              </label>
            )}
            {config.payment_methods.cash_enabled && (
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" value="cash" {...register("payment_method")} />
                <span className="text-sm text-brand-brown">{t("cash")}</span>
              </label>
            )}
          </div>
          {availablePaymentMethods.length === 1 && (
            <p className="mt-2 text-sm text-brand-brown-s">
              {t("paymentMethodSingle")}
            </p>
          )}
        </section>

        <section>
          <label className="text-sm text-brand-brown-m">{t("notes")}</label>
          <textarea
            {...register("notes")}
            placeholder={t("notesPlaceholder")}
            rows={3}
            className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
          />
        </section>

        <section>
          <label className="flex cursor-pointer items-center gap-2">
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
            />
            <span className="text-sm font-medium text-brand-brown">{t("invoice")}</span>
          </label>

          {invoiceRequested && (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-brand-brown-m">{t("companyName")}</label>
                <input
                  {...register("invoice.company_name")}
                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-brand-brown-m">{t("vatNumber")}</label>
                <input
                  {...register("invoice.vat_number")}
                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-brand-brown-m">{t("street")}</label>
                <input
                  {...register("invoice.address_line1")}
                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-brand-brown-m">{t("postalCode")}</label>
                <input
                  {...register("invoice.postal_code")}
                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-brand-brown-m">{t("city")}</label>
                <input
                  {...register("invoice.city")}
                  className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>
          )}
        </section>

        {serverError && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || closed || !minimumReached}
          className="w-full rounded-lg bg-brand-orange py-3 font-semibold text-white transition-colors hover:bg-brand-orange-hover disabled:opacity-50"
        >
          {submitting ? t("processing") : t("placeOrder")}
        </button>
      </form>
    </div>
  );
}
