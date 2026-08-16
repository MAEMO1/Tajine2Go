import { setRequestLocale } from "next-intl/server";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await fetchPublicSiteContent(locale as Locale);

  return (
    <>
      {/* === Narrow page hero === */}
      <section className="relative overflow-hidden">
        <Khatam className="pointer-events-none absolute -top-10 h-44 w-44 text-brand-orange/[0.06] ltr:-right-8 rtl:-left-8" />
        <div className="relative mx-auto max-w-3xl px-4 py-14 md:py-20">
          <Reveal>
            <div className="flex items-center gap-3 text-brand-orange">
              <span className="h-px w-12 bg-brand-orange/60" aria-hidden="true" />
              <Khatam className="h-4 w-4" />
            </div>
          </Reveal>

          <SplitHeading
            as="h1"
            className="mt-6 text-[clamp(32px,4.6vw,56px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-brand-brown"
          >
            {content.legal_pages.privacy.title}
          </SplitHeading>
        </div>
      </section>

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
