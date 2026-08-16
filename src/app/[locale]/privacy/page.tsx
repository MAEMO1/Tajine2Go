import { setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await fetchPublicSiteContent(locale as Locale);

  return (
    <>
      <PageHeader title={content.legal_pages.privacy.title} />

      {/* === Calm reading column === */}
      <section className="bg-brand-cream px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl space-y-6">
          {content.legal_pages.privacy.body_paragraphs.map((paragraph, index) => (
            <Reveal key={`${index}-${paragraph.slice(0, 20)}`}>
              <p className="text-[15px] leading-[1.8] text-brand-brown-m">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const content = await fetchPublicSiteContent(locale as Locale);

  return {
    title: content.legal_pages.privacy.title,
  };
}
