"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam, KhatamSolid } from "@/components/decor/khatam";
import { formatPrice } from "@/lib/format";
import type { PublicOrderStatus } from "@/types/database";

type Props = {
  order: PublicOrderStatus | null;
};

export function OrderStatusContent({ order }: Props) {
  const t = useTranslations("order");
  const tCheckout = useTranslations("checkout");

  if (!order) {
    return (
      <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-24">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <Khatam className="h-10 w-10 text-brand-brown-s/40" />
          <p className="text-brand-brown-s">{t("notFound")}</p>
        </Reveal>
      </section>
    );
  }

  const orderNumber = `T2G-${String(order.order_number).padStart(4, "0")}`;
  const statusKey = `statuses.${order.status}` as Parameters<typeof t>[0];
  const isCancelled = order.status === "cancelled";

  return (
    <section className="relative flex-1 overflow-hidden px-4 py-16 md:py-24">
      <Khatam className="pointer-events-none absolute -top-12 h-64 w-64 text-brand-orange/[0.06] ltr:-right-12 rtl:-left-12" />
      <Khatam className="pointer-events-none absolute -bottom-16 h-48 w-48 text-brand-bronze/[0.05] ltr:-left-10 rtl:-right-10" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* === Page-hero band === */}
        <Reveal>
          <div className="flex items-center justify-center gap-3 text-brand-orange">
            <span className="h-px w-12 bg-brand-orange/60" aria-hidden="true" />
            <Khatam className="h-4 w-4" />
            <span className="h-px w-12 bg-brand-orange/30" aria-hidden="true" />
          </div>
        </Reveal>

        <SplitHeading
          as="h1"
          className="type-h1 mt-6"
        >
          {t("title")}
        </SplitHeading>

        <Reveal delay={0.15}>
          <p className="mt-7 font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-brand-orange">
            {t("orderNumber")}
          </p>
          <p className="mt-2 font-mono text-[clamp(32px,4.6vw,52px)] font-bold tracking-[-0.02em] text-brand-brown">
            {orderNumber}
          </p>
        </Reveal>

        {/* === Status: timeline, or a distinct treatment when cancelled === */}
        <Reveal delay={0.25} className="mt-12 w-full">
          {isCancelled ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-8">
              <KhatamSolid className="h-6 w-6 text-red-400" />
              <span className="font-mono text-[12px] font-bold uppercase tracking-[0.28em] text-red-700">
                {t(statusKey)}
              </span>
            </div>
          ) : (
            <>
              <StatusTimeline status={order.status} fulfillment={order.fulfillment} />
              <div className="mt-7 flex justify-center">
                <span className="rounded-full border border-brand-orange/25 bg-brand-warm px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">
                  {t(statusKey)}
                </span>
              </div>
            </>
          )}
        </Reveal>

        {/* === Order summary card === */}
        <Reveal delay={0.35} className="mt-10 w-full">
          <div className="mx-auto w-full max-w-lg space-y-4 rounded-2xl border border-brand-warm2/70 bg-brand-cream p-6 text-start shadow-sm md:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-brown-s">
                {t("orderNumber")}
              </span>
              <span className="font-mono text-sm font-bold text-brand-brown">{orderNumber}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-brown-s">
                {t("fulfillment")}
              </span>
              <span className="text-sm font-medium text-brand-brown">
                {order.fulfillment === "pickup" ? tCheckout("pickup") : tCheckout("delivery")}
              </span>
            </div>

            {order.pickup_slot && (
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-brown-s">
                  {t("pickupSlot")}
                </span>
                <span className="text-sm font-medium text-brand-brown">{order.pickup_slot}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-t border-brand-warm2 pt-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-brown-s">
                {t("total")}
              </span>
              <span className="font-mono text-2xl font-bold text-brand-orange">
                {formatPrice(order.total_cents)}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* StatusTimeline — khatam-star steps along the linear order flow      */
/* pending → confirmed → preparing → ready|out_for_delivery → completed */
/* Flex-based, so it mirrors automatically in RTL.                     */
/* ------------------------------------------------------------------ */

function StatusTimeline({ status, fulfillment }: { status: string; fulfillment: string }) {
  const t = useTranslations("order");

  const steps: string[] = [
    "pending",
    "confirmed",
    "preparing",
    fulfillment === "delivery" ? "out_for_delivery" : "ready",
    "completed",
  ];

  const matchedIndex = steps.indexOf(status);
  const currentIndex =
    matchedIndex >= 0
      ? matchedIndex
      : status === "ready" || status === "out_for_delivery"
        ? 3
        : 0;

  return (
    <div className="mx-auto flex w-full max-w-xl items-start justify-center">
      {steps.map((step, index) => {
        const stepKey = `statuses.${step}` as Parameters<typeof t>[0];
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <Fragment key={step}>
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`mt-5 h-px min-w-2 flex-1 ${
                  index <= currentIndex ? "bg-brand-orange" : "bg-brand-brown/15"
                }`}
              />
            )}

            <div className="flex w-14 flex-col items-center gap-2.5 sm:w-20">
              <span className="relative flex h-10 w-10 items-center justify-center">
                {isCurrent && (
                  <span
                    aria-hidden="true"
                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-25"
                  />
                )}
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                    isCurrent
                      ? "border-brand-orange bg-brand-orange text-white shadow-[0_8px_24px_-8px_rgba(181,84,15,0.6)]"
                      : isDone
                        ? "border-brand-orange/30 bg-brand-warm text-brand-orange"
                        : "border-brand-brown/15 bg-brand-cream text-brand-brown-s/50"
                  }`}
                >
                  {isDone || isCurrent ? (
                    <KhatamSolid className="h-4 w-4" />
                  ) : (
                    <Khatam className="h-4 w-4" />
                  )}
                </span>
              </span>

              <span
                className={`text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.12em] sm:text-[10px] ${
                  isCurrent
                    ? "text-brand-orange"
                    : isDone
                      ? "text-brand-brown"
                      : "text-brand-brown-s/60"
                }`}
              >
                {t(stepKey)}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
