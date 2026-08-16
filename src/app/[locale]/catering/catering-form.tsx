"use client";

import { useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Khatam, KhatamSolid, ZelligeOverlay } from "@/components/decor/khatam";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  dietary_needs: string;
  message: string;
};

type Props = {
  subtitle?: string | null;
  notice?: string | null;
};

const inputClasses =
  "w-full rounded-lg border border-brand-brown-s bg-brand-cream px-3.5 py-2.5 text-sm text-brand-brown placeholder:text-brand-brown-s/60 transition-colors focus:border-brand-orange focus:outline-none";

export function CateringForm({ subtitle, notice }: Props) {
  const t = useTranslations("catering");
  const tCheckout = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  async function getRecaptchaToken() {
    if (!recaptchaSiteKey) {
      return "skip";
    }

    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) {
      throw new Error("reCAPTCHA is not loaded");
    }

    return await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(recaptchaSiteKey, { action: "catering_submit" })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setError(null);

    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          guest_count: Number(data.guest_count),
          recaptcha_token: recaptchaToken,
        }),
      });

      if (!res.ok) {
        setError(t("error"));
      } else {
        setSubmitted(true);
      }
    } catch {
      setError(t("error"));
    }

    setSubmitting(false);
  }

  const eventTypeChips = [
    t("eventTypes.wedding"),
    t("eventTypes.aqiqa"),
    t("eventTypes.corporate"),
    t("eventTypes.funeral"),
    t("eventTypes.iftar"),
    t("eventTypes.other"),
  ];

  if (submitted) {
    return (
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <Khatam className="pointer-events-none absolute -top-12 h-64 w-64 text-brand-orange/[0.06] ltr:-right-12 rtl:-left-12" />
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_8px_30px_rgba(217,123,26,0.35)]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.4}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </Reveal>
          <SplitHeading
            as="h1"
            className="mt-7 text-[clamp(40px,6vw,84px)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-brand-brown"
          >
            {t("title")}
          </SplitHeading>
          <Reveal delay={0.25}>
            <p className="mt-5 text-lg leading-[1.7] text-brand-brown-m">{t("success")}</p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <>
      {recaptchaSiteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`}
          strategy="afterInteractive"
        />
      )}

      {/* === Page-hero band === */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <Khatam className="pointer-events-none absolute -top-14 h-72 w-72 text-brand-orange/[0.06] ltr:-right-14 rtl:-left-14" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-brand-orange">
              <span className="h-px w-12 bg-brand-orange/60" aria-hidden="true" />
              <span>{tCommon("siteName")}</span>
            </div>
          </Reveal>

          <SplitHeading
            as="h1"
            className="mt-6 text-[clamp(40px,6vw,84px)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-brand-brown"
          >
            {t("title")}
          </SplitHeading>

          <Reveal delay={0.25}>
            <p className="mt-5 max-w-2xl text-[clamp(16px,1.3vw,19px)] leading-[1.7] text-brand-brown-m">
              {subtitle ?? t("subtitle")}
            </p>
          </Reveal>

          {notice && (
            <Reveal delay={0.35}>
              <div className="mt-7 flex max-w-2xl items-start gap-3 rounded-2xl border border-brand-orange/25 bg-brand-warm p-5 text-sm leading-relaxed text-brand-brown">
                <KhatamSolid className="mt-0.5 h-3 w-3 shrink-0 text-brand-orange" />
                <span>{notice}</span>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* === Form + decorative ember panel === */}
      <section className="px-4 pb-20 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[1fr_0.85fr] md:gap-14">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Reveal>
              <div className="rounded-2xl border border-brand-warm2/70 bg-brand-cream p-6 shadow-sm md:p-7">
                <SectionLabel index="01" label={tCheckout("personalInfo")} />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <InputField label={tCheckout("firstName")} error={errors.first_name} requiredLabel={t("required")}>
                    <input
                      {...register("first_name", { required: true })}
                      className={inputClasses}
                      placeholder={tCheckout("firstName")}
                    />
                  </InputField>
                  <InputField label={tCheckout("lastName")} error={errors.last_name} requiredLabel={t("required")}>
                    <input
                      {...register("last_name", { required: true })}
                      className={inputClasses}
                      placeholder={tCheckout("lastName")}
                    />
                  </InputField>
                  <InputField label={tCheckout("email")} error={errors.email} requiredLabel={t("required")}>
                    <input type="email" {...register("email", { required: true })} className={inputClasses} />
                  </InputField>
                  <InputField label={tCheckout("phone")} error={errors.phone} requiredLabel={t("required")}>
                    <input type="tel" {...register("phone", { required: true })} className={inputClasses} />
                  </InputField>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-brand-warm2/70 bg-brand-cream p-6 shadow-sm md:p-7">
                <SectionLabel index="02" label={t("eventType")} />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <InputField label={t("eventType")} error={errors.event_type} requiredLabel={t("required")}>
                    <select {...register("event_type", { required: true })} className={inputClasses}>
                      <option value="">{t("eventType")}</option>
                      <option value="wedding">{t("eventTypes.wedding")}</option>
                      <option value="aqiqa">{t("eventTypes.aqiqa")}</option>
                      <option value="corporate">{t("eventTypes.corporate")}</option>
                      <option value="funeral">{t("eventTypes.funeral")}</option>
                      <option value="iftar">{t("eventTypes.iftar")}</option>
                      <option value="other">{t("eventTypes.other")}</option>
                    </select>
                  </InputField>
                  <InputField label={t("eventDate")} error={errors.event_date} requiredLabel={t("required")}>
                    <input type="date" {...register("event_date", { required: true })} className={inputClasses} />
                  </InputField>
                  <InputField label={t("guestCount")} error={errors.guest_count} requiredLabel={t("required")}>
                    <input
                      type="number"
                      min="1"
                      {...register("guest_count", { required: true, min: 1 })}
                      className={inputClasses}
                    />
                  </InputField>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="rounded-2xl border border-brand-warm2/70 bg-brand-cream p-6 shadow-sm md:p-7">
                <SectionLabel index="03" label={t("message")} />
                <div className="mt-5 space-y-4">
                  <InputField label={t("dietaryNeeds")}>
                    <input {...register("dietary_needs")} className={inputClasses} />
                  </InputField>
                  <InputField label={t("message")}>
                    <textarea {...register("message")} rows={4} className={inputClasses} />
                  </InputField>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
              <Magnetic className="w-full">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-brand-orange py-4 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-white shadow-[0_8px_30px_rgba(217,123,26,0.35)] transition-colors duration-300 hover:bg-brand-orange-hover active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? t("sending") : t("submit")}
                </button>
              </Magnetic>
            </Reveal>
          </form>

          {/* === Decorative ember panel (desktop) === */}
          <Reveal delay={0.15} y={36} className="hidden md:block">
            <div className="md:sticky md:top-28">
              <div className="section-ember relative overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#21130a_0%,#3a2410_55%,#5a3413_100%)] p-8 shadow-[0_35px_80px_-25px_rgba(45,27,10,0.55)]">
                <ZelligeOverlay className="absolute inset-0 text-brand-gold opacity-[0.07]" />
                <div className="relative">
                  <div className="flex items-center gap-3 text-brand-gold">
                    <span className="h-px w-10 bg-brand-gold/60" aria-hidden="true" />
                    <Khatam className="h-4 w-4" />
                    <span className="h-px w-10 bg-brand-gold/30" aria-hidden="true" />
                  </div>

                  <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-brand-cream/70">
                    {t("title")}
                  </p>

                  <div className="my-10 flex justify-center">
                    <Khatam className="animate-float h-32 w-32 text-brand-gold/40" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {eventTypeChips.map((eventType) => (
                      <span
                        key={eventType}
                        className="rounded-full border border-brand-cream/20 bg-brand-cream/10 px-3.5 py-1.5 text-xs font-medium text-brand-cream/85"
                      >
                        {eventType}
                      </span>
                    ))}
                  </div>

                  <div className="mt-10 flex items-end justify-between font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-brand-cream/60">
                    <span>Tajine2Go · Gent</span>
                    <span>MMXXVI</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.28em]">
      <span className="text-brand-orange">{index}</span>
      <KhatamSolid className="h-2.5 w-2.5 text-brand-orange" />
      <span className="text-brand-brown-m">{label}</span>
    </div>
  );
}

function InputField({
  label,
  error,
  children,
  requiredLabel,
}: {
  label: string;
  error?: { message?: string };
  children: React.ReactNode;
  requiredLabel?: string;
}) {
  return (
    <div>
      <label className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand-brown-m">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message ?? requiredLabel}</p>}
    </div>
  );
}
