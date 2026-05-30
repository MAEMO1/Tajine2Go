"use client";

import { useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

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

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl text-brand-brown">{t("title")}</h1>
        <p className="mt-4 text-lg text-green-600">{t("success")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {recaptchaSiteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`}
          strategy="afterInteractive"
        />
      )}

      <h1 className="font-heading text-3xl text-brand-brown">{t("title")}</h1>
      <p className="mt-2 text-brand-brown-m">{subtitle ?? t("subtitle")}</p>
      {notice && (
        <div className="mt-4 rounded-xl bg-brand-warm p-4 text-sm text-brand-brown">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={tCheckout("firstName")} error={errors.first_name} requiredLabel={t("required")}>
            <input
              {...register("first_name", { required: true })}
              className="input-field"
              placeholder={tCheckout("firstName")}
            />
          </InputField>
          <InputField label={tCheckout("lastName")} error={errors.last_name} requiredLabel={t("required")}>
            <input
              {...register("last_name", { required: true })}
              className="input-field"
              placeholder={tCheckout("lastName")}
            />
          </InputField>
          <InputField label={tCheckout("email")} error={errors.email} requiredLabel={t("required")}>
            <input type="email" {...register("email", { required: true })} className="input-field" />
          </InputField>
          <InputField label={tCheckout("phone")} error={errors.phone} requiredLabel={t("required")}>
            <input type="tel" {...register("phone", { required: true })} className="input-field" />
          </InputField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("eventType")} error={errors.event_type} requiredLabel={t("required")}>
            <select {...register("event_type", { required: true })} className="input-field">
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
            <input type="date" {...register("event_date", { required: true })} className="input-field" />
          </InputField>
          <InputField label={t("guestCount")} error={errors.guest_count} requiredLabel={t("required")}>
            <input type="number" min="1" {...register("guest_count", { required: true, min: 1 })} className="input-field" />
          </InputField>
        </div>

        <InputField label={t("dietaryNeeds")}>
          <input {...register("dietary_needs")} className="input-field" />
        </InputField>

        <InputField label={t("message")}>
          <textarea {...register("message")} rows={4} className="input-field" />
        </InputField>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-orange py-3 font-semibold text-white transition-colors hover:bg-brand-orange-hover disabled:opacity-50"
        >
          {submitting ? t("sending") : t("submit")}
        </button>
      </form>

      <style jsx>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #9C8468;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        .input-field:focus {
          border-color: #D97B1A;
          outline: none;
        }
      `}</style>
    </div>
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
      <label className="text-sm text-brand-brown-m">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message ?? requiredLabel}</p>}
    </div>
  );
}
