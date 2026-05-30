import { setRequestLocale } from "next-intl/server";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await fetchPublicSiteContent(locale as Locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl text-brand-brown">
        {content.legal_pages.privacy.title}
      </h1>

      <div className="mt-6 space-y-4 text-brand-brown-m">
        {content.legal_pages.privacy.body_paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const content = await fetchPublicSiteContent(locale as Locale);

  return {
    title: content.legal_pages.privacy.title,
  };
}
