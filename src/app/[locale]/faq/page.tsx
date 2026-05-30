import { setRequestLocale, getTranslations } from "next-intl/server";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq" });
  const content = await fetchPublicSiteContent(locale as Locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-3xl text-brand-brown">{t("title")}</h1>

      <div className="mt-6 space-y-4">
        {content.faq_entries.map((faq) => (
          <details key={faq.id} className="group rounded-xl bg-brand-cream p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-brand-brown">
              {faq.question}
            </summary>
            <p className="mt-2 text-sm text-brand-brown-m">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("title") };
}
