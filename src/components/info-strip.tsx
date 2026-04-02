"use client";

import { useTranslations } from "next-intl";

export function InfoStrip() {
  const t = useTranslations("home");

  return (
    <section className="border-b border-brand-warm2 bg-brand-cream px-4 py-10 md:py-14">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-3xl uppercase tracking-[0.08em] text-brand-brown md:text-4xl">
          {t("infoStripTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-brown-m">
          {t("heroSubtitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm md:gap-10">
          <InfoItem icon={<ClockIcon />} label={t("infoHours")} />
          <InfoItem icon={<PinIcon />} label={t("infoAddress")} />
          <InfoItem icon={<CardIcon />} label={t("infoPayment")} />
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-brand-brown-m">
      <span className="text-brand-orange">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path d="M1 10h22" />
    </svg>
  );
}
