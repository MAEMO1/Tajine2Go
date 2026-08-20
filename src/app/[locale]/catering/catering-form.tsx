"use client";

import { useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam, KhatamSolid } from "@/components/decor/khatam";

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
  "w-full rounded-lg border border-brand-brown-s/60 bg-white/60 px-3.5 py-2.5 text-[15px] text-brand-brown placeholder:text-brand-brown-s/60 transition-colors focus:border-brand-orange focus:outline-none";

export function CateringForm({ subtitle, notice }: Props) {
  const t = useTranslations("catering");
  const tCheckout = useTranslations("checkout");
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
    t("eventTypes.party"),
    t("eventTypes.event"),
    t("eventTypes.reception"),
    t("eventTypes.other"),
  ];

  if (submitted) {
    return (
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <Khatam className="pointer-events-none absolute -top-12 h-64 w-64 text-brand-orange/[0.06] -right-12" />
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange-hover text-white shadow-[0_8px_30px_rgba(181,84,15,0.35)]">
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
            className="mt-7 font-display text-[clamp(34px,5vw,56px)] font-medium leading-tight text-brand-brown"
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

      {/* === Menukaart-kop === */}
      <section className="relative overflow-hidden px-4 pt-14 md:pt-20">
        <div className="relative mx-auto max-w-3xl text-center">
          <svg className="mx-auto w-36 text-brand-bronze" viewBox="0 0 200 54" aria-hidden="true">
            <path d="M10,54 Q10,30 40,25 C68,20 82,16 100,4 C118,16 132,20 160,25 Q190,30 190,54" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M22,54 Q22,36 48,31 C72,27 86,22 100,13 C114,22 128,27 152,31 Q178,36 178,54" fill="none" stroke="#F5A400" strokeWidth="1.4" />
          </svg>

          <SplitHeading
            as="h1"
            className="mt-3 font-display text-[clamp(34px,5vw,56px)] font-medium leading-tight text-brand-brown"
          >
            {t("title")}
          </SplitHeading>

          <Reveal delay={0.25}>
            <p className="mx-auto mt-4 max-w-2xl text-[clamp(16px,1.3vw,19px)] leading-[1.7] text-brand-brown-m">
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
                <SectionLabel label={tCheckout("personalInfo")} />
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
                <SectionLabel label={t("eventType")} />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <InputField label={t("eventType")} error={errors.event_type} requiredLabel={t("required")}>
                    <select {...register("event_type", { required: true })} className={inputClasses}>
                      <option value="">{t("eventType")}</option>
                      <option value="party">{t("eventTypes.party")}</option>
                      <option value="event">{t("eventTypes.event")}</option>
                      <option value="reception">{t("eventTypes.reception")}</option>
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
                <SectionLabel label={t("message")} />
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
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-brand-orange-hover py-3.5 font-display text-lg font-semibold text-white shadow-[0_6px_20px_rgba(181,84,15,0.3)] transition-colors duration-300 hover:bg-brand-orange-deep active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? t("sending") : t("submit")}
              </button>
            </Reveal>
          </form>

          {/* === Mozaïekpaneel met merkteken (desktop) === */}
          <Reveal delay={0.15} y={36} className="hidden md:block">
            <div className="md:sticky md:top-28">
              <div className="relative overflow-hidden rounded-2xl border border-brand-gold/40 bg-[url('/brand/pattern-zellige.jpg')] bg-[length:300px_300px] p-8 shadow-[0_25px_60px_-25px_rgba(59,22,6,0.5)]">
                <div className="relative flex flex-col items-center gap-8 py-6">
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-brand-cream shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/logo/Tajine2Go_icon_128.png" alt="" className="h-20 w-auto" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {eventTypeChips.map((eventType) => (
                      <span
                        key={eventType}
                        className="rounded-full bg-brand-cream/90 px-3.5 py-1.5 text-xs font-medium text-brand-brown"
                      >
                        {eventType}
                      </span>
                    ))}
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

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] text-brand-gold" aria-hidden="true">&#10022;</span>
      <span className="type-label">{label}</span>
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
      <label className="text-sm font-medium text-brand-brown-m">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message ?? requiredLabel}</p>}
    </div>
  );
}
