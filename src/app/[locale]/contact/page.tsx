import { setRequestLocale, getTranslations } from "next-intl/server";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
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

      {/* === Contact cards === */}
      <section className="bg-brand-cream px-4 pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-brand-warm2/70 bg-brand-cream p-7 shadow-[0_25px_60px_-30px_rgba(45,27,10,0.35)]">
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-brand-brown">
                {t("reachUs")}
              </h2>
              <span className="mt-3 block h-px w-12 bg-brand-orange" aria-hidden="true" />
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand-brown-s">
                    {t("emailLabel")}
                  </dt>
                  <dd className="mt-1.5 text-[15px] text-brand-brown">
                    {content.business_info.email}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand-brown-s">
                    {t("phoneLabel")}
                  </dt>
                  <dd className="mt-1.5 text-[15px] text-brand-brown">
                    {content.business_info.phone}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand-brown-s">
                    {t("locationLabel")}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-brand-brown">
                    {content.business_info.address_line && (
                      <span>
                        {content.business_info.address_line}
                        <br />
                      </span>
                    )}
                    {content.location_text}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-brand-warm2/70 bg-brand-cream p-7 shadow-[0_25px_60px_-30px_rgba(45,27,10,0.35)]">
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-brand-brown">
                {t("hoursLabel")}
              </h2>
              <span className="mt-3 block h-px w-12 bg-brand-orange" aria-hidden="true" />
              {content.opening_hours_lines.length > 0 ? (
                <dl className="mt-6 space-y-2.5 text-sm">
                  {content.opening_hours_lines.map((line) => (
                    <div
                      key={line.day}
                      className="flex justify-between gap-6 border-b border-brand-warm2/50 pb-2.5 last:border-0 last:pb-0"
                    >
                      <dt className="capitalize text-brand-brown-s">{line.label}</dt>
                      <dd className="font-mono text-[13px] font-bold text-brand-brown">
                        {line.window}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-6 text-sm leading-relaxed text-brand-brown-s">
                  {content.opening_hours_summary}
                </p>
              )}
              <p className="mt-auto pt-5 text-xs leading-relaxed text-brand-brown-s">
                {t("cateringNote")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}
