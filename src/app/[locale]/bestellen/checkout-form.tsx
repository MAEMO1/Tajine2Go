"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { checkoutSchema, type CheckoutRequest } from "@/lib/validations/checkout";
import type { Locale } from "@/types/database";

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotalCents = useCartStore((s) => s.subtotalCents);
  const clearCart = useCartStore((s) => s.clearCart);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutRequest>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      locale,
      items: items.map((i) => ({ weekly_menu_id: i.weekly_menu_id, quantity: i.quantity })),
      fulfillment: "pickup",
      payment_method: "online",
    },
  });

  const fulfillment = watch("fulfillment");
  const paymentMethod = watch("payment_method");
  const invoiceRequested = watch("invoice");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-brand-brown-s">{t("orderSummary")}</p>
        <p className="mt-2 text-brand-brown-m">
          Geen items in je winkelwagen.
        </p>
      </div>
    );
  }

  async function onSubmit(data: CheckoutRequest) {
    setSubmitting(true);
    setServerError(null);

    // Sync items from cart store
    data.items = items.map((i) => ({
      weekly_menu_id: i.weekly_menu_id,
      quantity: i.quantity,
    }));
    data.locale = locale;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error ?? t("closedMessage"));
        setSubmitting(false);
        return;
      }

      clearCart();

      // Redirect to Mollie or order status
      if (result.redirectUrl.startsWith("http")) {
        window.location.href = result.redirectUrl;
      } else {
        router.push(result.redirectUrl);
      }
    } catch {
      setServerError(t("closedMessage"));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-3xl text-brand-brown">{t("title")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {/* Order summary */}
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
            <div className="flex justify-between border-t border-brand-warm2 pt-2">
              <span className="font-medium text-brand-brown-m">Subtotaal</span>
              <span className="font-heading text-lg text-brand-orange">
                {formatPrice(subtotalCents())}
              </span>
            </div>
          </div>
        </section>

        {/* Personal info */}
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

        {/* Fulfillment */}
        <section>
          <h2 className="font-heading text-xl text-brand-bronze">{t("fulfillment")}</h2>
          <div className="mt-3 flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" value="pickup" {...register("fulfillment")} />
              <span className="text-sm text-brand-brown">{t("pickup")}</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" value="delivery" {...register("fulfillment")} />
              <span className="text-sm text-brand-brown">{t("delivery")}</span>
            </label>
          </div>

          {fulfillment === "pickup" && (
            <div className="mt-3">
              <label className="text-sm text-brand-brown-m">{t("pickupSlot")}</label>
              <select
                {...register("pickup_slot")}
                className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
              >
                <option value="">Selecteer een tijdstip</option>
                <option value="12:00-13:00">12:00 - 13:00</option>
                <option value="13:00-14:00">13:00 - 14:00</option>
                <option value="14:00-15:00">14:00 - 15:00</option>
                <option value="17:00-18:00">17:00 - 18:00</option>
                <option value="18:00-19:00">18:00 - 19:00</option>
              </select>
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
              <input type="hidden" {...register("delivery_address.country_code")} value="BE" />
            </div>
          )}
        </section>

        {/* Payment */}
        <section>
          <h2 className="font-heading text-xl text-brand-bronze">{t("paymentMethod")}</h2>
          <div className="mt-3 flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" value="online" {...register("payment_method")} />
              <span className="text-sm text-brand-brown">{t("online")}</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" value="cash" {...register("payment_method")} />
              <span className="text-sm text-brand-brown">{t("cash")}</span>
            </label>
          </div>
        </section>

        {/* Notes */}
        <section>
          <label className="text-sm text-brand-brown-m">{t("notes")}</label>
          <textarea
            {...register("notes")}
            placeholder={t("notesPlaceholder")}
            rows={3}
            className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
          />
        </section>

        {/* Invoice */}
        <section>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...register("invoice")} value="" />
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
              <input type="hidden" {...register("invoice.country_code")} value="BE" />
            </div>
          )}
        </section>

        {/* Error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-orange py-3 font-semibold text-white transition-colors hover:bg-brand-orange-hover disabled:opacity-50"
        >
          {submitting ? t("processing") : t("placeOrder")}
        </button>
      </form>
    </div>
  );
}
