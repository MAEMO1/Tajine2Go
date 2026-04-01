"use client";

import { useState } from "react";
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

export function CateringForm() {
  const t = useTranslations("catering");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          guest_count: Number(data.guest_count),
          recaptcha_token: "skip", // reCAPTCHA v3 integration placeholder
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
      <h1 className="font-heading text-3xl text-brand-brown">{t("title")}</h1>
      <p className="mt-2 text-brand-brown-m">{t("subtitle")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("eventTypes.wedding").replace("Bruiloft", "Voornaam")} error={errors.first_name}>
            <input {...register("first_name", { required: true })} className="input-field" placeholder="Voornaam" />
          </InputField>
          <InputField label="Achternaam" error={errors.last_name}>
            <input {...register("last_name", { required: true })} className="input-field" placeholder="Achternaam" />
          </InputField>
          <InputField label="E-mail" error={errors.email}>
            <input type="email" {...register("email", { required: true })} className="input-field" />
          </InputField>
          <InputField label="Telefoon" error={errors.phone}>
            <input type="tel" {...register("phone", { required: true })} className="input-field" />
          </InputField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("eventType")} error={errors.event_type}>
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
          <InputField label={t("eventDate")} error={errors.event_date}>
            <input type="date" {...register("event_date", { required: true })} className="input-field" />
          </InputField>
          <InputField label={t("guestCount")} error={errors.guest_count}>
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
          {submitting ? "Versturen..." : t("submit")}
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

function InputField({ label, error, children }: { label: string; error?: { message?: string }; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-brand-brown-m">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">Verplicht veld</p>}
    </div>
  );
}
