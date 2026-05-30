import { setRequestLocale, getTranslations } from "next-intl/server";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const content = await fetchPublicSiteContent(locale as Locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-3xl text-brand-brown">{t("title")}</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-brand-cream p-6 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">{t("reachUs")}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-brand-brown-s">{t("emailLabel")}</dt>
              <dd className="mt-1 text-brand-brown">{content.business_info.email}</dd>
            </div>
            <div>
              <dt className="text-brand-brown-s">{t("phoneLabel")}</dt>
              <dd className="mt-1 text-brand-brown">{content.business_info.phone}</dd>
            </div>
            <div>
              <dt className="text-brand-brown-s">{t("locationLabel")}</dt>
              <dd className="mt-1 text-brand-brown">
                {content.business_info.address_line && <span>{content.business_info.address_line}<br /></span>}
                {content.location_text}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl bg-brand-cream p-6 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">{t("hoursLabel")}</h2>
          {content.opening_hours_lines.length > 0 ? (
            <dl className="mt-4 space-y-2 text-sm">
              {content.opening_hours_lines.map((line) => (
                <div key={line.day} className="flex justify-between gap-6">
                  <dt className="text-brand-brown-s capitalize">{line.label}</dt>
                  <dd className="text-brand-brown">{line.window}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-brand-brown-s">{content.opening_hours_summary}</p>
          )}
          <p className="mt-4 text-xs text-brand-brown-s">
            {t("cateringNote")}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}
