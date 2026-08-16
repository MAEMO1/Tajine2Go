import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq" });
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

      {/* === Accordion list === */}
      <section className="bg-brand-cream px-4 pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="mx-auto max-w-2xl space-y-4">
          {content.faq_entries.map((faq, index) => (
            <Reveal key={faq.id} delay={Math.min(index, 4) * 0.07}>
              <details className="faq-details group rounded-2xl border border-brand-warm2/70 bg-brand-cream transition-colors hover:border-brand-orange/30">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] font-bold text-brand-orange">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold text-brand-brown">{faq.question}</span>
                  </span>
                  <span
                    className="faq-chevron flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-warm text-brand-orange"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                    >
                      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="faq-answer">
                  <div className="faq-answer-inner">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-brand-brown-m">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("title") };
}
