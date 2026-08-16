import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

export async function InfoStrip() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "home" });
  const content = await fetchPublicSiteContent(locale);

  // Zelfde bron als de footer, zodat de uren nergens uit elkaar lopen.
  const openingLabel = content.opening_hours_summary;

  return (
    <section className="border-y border-brand-warm2 bg-brand-warm px-4 py-7">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <InfoItem icon={<ClockIcon />} label={openingLabel} />
        <InfoItem icon={<PinIcon />} label={content.location_text || t("infoAddress")} />
        <InfoItem icon={<CardIcon />} label={content.business_info.payment_copy || t("infoPayment")} />
      </div>
    </section>
  );
}

function InfoItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-brown-m">
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
