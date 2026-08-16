import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const content = await fetchPublicSiteContent(locale as Locale);

  return (
    <>
      {/* === Page hero === */}
      <section className="relative overflow-hidden">
        <Khatam className="pointer-events-none absolute -top-12 h-56 w-56 text-brand-orange/[0.07] ltr:-right-10 rtl:-left-10" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 md:py-24">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-brand-orange">
              <span className="h-px w-12 bg-brand-orange/60" aria-hidden="true" />
              <span>{tCommon("siteName")}</span>
            </div>
          </Reveal>

          <SplitHeading
            as="h1"
            className="mt-6 text-[clamp(40px,6vw,84px)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-brand-brown"
          >
            {t("title")}
          </SplitHeading>
        </div>
      </section>

      {/* === Khatam divider + editorial body === */}
      <section className="bg-brand-cream px-4 pb-20 md:pb-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="flex items-center gap-4 py-10 text-brand-orange md:py-14">
              <span className="h-px flex-1 bg-brand-brown/10" aria-hidden="true" />
              <Khatam className="h-5 w-5" />
              <span className="h-px flex-1 bg-brand-brown/10" aria-hidden="true" />
            </div>
          </Reveal>
        </div>

        <div className="mx-auto max-w-2xl space-y-7">
          {content.website_texts.about.body_paragraphs.map((paragraph, index) => (
            <Reveal key={`${index}-${paragraph.slice(0, 20)}`} delay={Math.min(index, 2) * 0.1}>
              <p
                className={
                  index === 0
                    ? "text-[19px] leading-[1.8] text-brand-brown"
                    : "text-[16px] leading-[1.7] text-brand-brown-m"
                }
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}
