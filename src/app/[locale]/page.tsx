import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { InfoStrip } from "@/components/info-strip";
import { HomepageMenu } from "@/components/homepage-menu";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
import { fetchStaticMenuData } from "@/lib/menu-data";
import { ORDER_PHONE_NUMBERS } from "@/lib/phone";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const currentLocale = (await getLocale()) as Locale;
  const [menuData, content] = await Promise.all([
    fetchStaticMenuData(currentLocale),
    fetchPublicSiteContent(currentLocale),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: content.business_info.name,
    description: content.website_texts.home.hero_subtitle,
    url: "https://tajine2go.be",
    telephone: content.business_info.phone,
    email: content.business_info.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.business_info.address_line || undefined,
      addressLocality: content.business_info.address_locality,
      addressCountry: content.business_info.address_country,
    },
    servesCuisine: content.business_info.serves_cuisine,
    priceRange: content.business_info.price_range,
    openingHoursSpecification: content.opening_hours_specification,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {content.website_texts.notices.homepage_banner && (
        <section className="border-b border-brand-warm2 bg-brand-warm px-4 py-3 text-center text-sm text-brand-brown">
          {content.website_texts.notices.homepage_banner}
        </section>
      )}
      <HeroSection heroSubtitle={content.website_texts.home.hero_subtitle} />
      <HomepageMenu
        menu={menuData}
        closedMessage={content.website_texts.notices.closed_message}
      />
      <StorySection storyText={content.website_texts.home.story_text} />
      <CateringSection
        title={content.website_texts.home.catering_cta_title}
        text={content.website_texts.home.catering_cta_text}
      />
      <InfoStrip />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — eenheid 1. Mr. Pops-compositie: één full-bleed merkvlak,     */
/* de displaykop staat er direct op (geen scrim, geen verloop), en     */
/* twee CTA's waarvan de vórm het contrast draagt: gevulde pil tegen   */
/* scherpe hoek met 1px rand.                                          */
/* ------------------------------------------------------------------ */

function HeroSection({ heroSubtitle }: { heroSubtitle: string }) {
  const t = useTranslations("home");
  const headingWords = t("heroLine1").split(/\s+/).filter(Boolean);
  const primaryPhone = ORDER_PHONE_NUMBERS[0];

  return (
    <section
      data-unit="hero"
      data-section="hero"
      className="relative isolate flex min-h-[100vh] flex-col justify-end overflow-hidden bg-brand-brown pt-[60px] pb-10 supports-[min-height:100svh]:min-h-[100svh] md:pt-[120px] md:pb-[54px]"
    >
      {/* Art direction: liggend, ooghoogte, de toog met dampende tajines; warm kunstlicht; ruimte links voor de kop. */}
      <div
        data-media-slot="hero"
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 w-screen bg-brand-brown"
      >
        <div className="absolute inset-4 border border-brand-gold/30 md:inset-6" />
        <span className="type-label absolute top-8 right-8 text-brand-gold md:top-12 md:right-12">
          Beeldvlak — hero-foto volgt
        </span>
      </div>

      <div className="relative px-5 motion-safe:animate-fade-up md:px-[2.08vw]">
        <span className="type-label block text-brand-warm2">{t("heroKicker")}</span>

        <h1 className="type-h1 mt-4 text-brand-cream md:mt-6">
          {headingWords.map((word, index) => (
            <span key={`${word}-${index}`} className="block">
              {word}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.4] text-brand-warm md:mt-8 md:text-[18px]">
          {heroSubtitle}
        </p>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5 md:mt-10">
          <a
            data-cta="primary"
            href={`tel:${primaryPhone.tel}`}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-brand-orange-hover px-9 py-3 text-[17px] font-bold uppercase tracking-[0.05em] text-white transition-colors duration-200 hover:bg-brand-orange-deep"
          >
            {t("orderNow")}
          </a>
          <Link
            data-cta="ghost"
            href="/catering"
            className="inline-flex min-h-[52px] items-center justify-center rounded-none border border-brand-cream px-9 py-3 text-[17px] font-semibold uppercase tracking-[0.05em] text-brand-cream transition-colors duration-200 hover:bg-brand-cream hover:text-brand-brown"
          >
            {t("heroCateringCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Story — the dark ember heart of the page                            */
/* ------------------------------------------------------------------ */

function StorySection({ storyText }: { storyText: string }) {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-brand-warm px-4 py-16 md:py-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div className="text-center md:text-start">
          <div className="flex items-center justify-center gap-3 text-brand-bronze md:justify-start">
            <span className="h-px w-10 bg-brand-gold/70" aria-hidden="true" />
            <Khatam className="h-4 w-4 text-brand-gold" />
            <span className="h-px w-10 bg-brand-gold/70" aria-hidden="true" />
          </div>

          <SplitHeading as="h2" className="type-h2 mt-5">
            {t("storyTitle")}
          </SplitHeading>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.8] text-brand-brown-m md:mx-0">
              {storyText}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <Link
              href="/over-ons"
              className="mt-7 inline-flex items-center justify-center rounded-md border border-brand-brown/60 px-7 py-3 font-display text-lg font-semibold text-brand-brown transition-all duration-300 hover:bg-brand-brown hover:text-brand-cream active:scale-[0.98]"
            >
              {t("storyLink")}
            </Link>
          </Reveal>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-brand-cream shadow-[0_25px_60px_-25px_rgba(59,22,6,0.45)]">
            <Image
              src="/hero-storefront.jpg"
              alt={t("storyImageAlt")}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-[center_30%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Catering CTA                                                        */
/* ------------------------------------------------------------------ */

function CateringSection({ title, text }: { title: string; text: string }) {
  const t = useTranslations("home");
  const tCatering = useTranslations("catering");

  const eventTypes = [
    tCatering("eventTypes.party"),
    tCatering("eventTypes.event"),
    tCatering("eventTypes.reception"),
    tCatering("eventTypes.other"),
  ];

  return (
    <section className="relative overflow-hidden bg-brand-cream px-4 py-16 md:py-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="text-center md:text-start">
          <Reveal>
            <p className="font-display text-[13px] font-semibold uppercase tracking-[0.28em] text-brand-bronze">
              Catering
            </p>
          </Reveal>

          <SplitHeading as="h2" className="type-h2 mt-4">
            {title}
          </SplitHeading>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-brand-brown-m md:mx-0">{text}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {eventTypes.map((eventType) => (
                <span
                  key={eventType}
                  className="rounded-full border border-brand-brown/15 bg-brand-warm px-3.5 py-1.5 text-xs font-medium text-brand-brown-m"
                >
                  {eventType}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/catering"
                className="inline-flex items-center justify-center rounded-md bg-brand-orange-hover px-8 py-3 font-display text-lg font-semibold text-white shadow-[0_6px_20px_rgba(181,84,15,0.3)] transition-colors duration-300 hover:bg-brand-orange-deep active:scale-[0.98]"
              >
                {t("cateringPhone")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-brand-brown/60 px-8 py-3 font-display text-lg font-semibold text-brand-brown transition-all duration-300 hover:bg-brand-brown hover:text-brand-cream active:scale-[0.98]"
              >
                {t("cateringEmail")}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Mozaïekpaneel met merkteken — knipoog naar beker en gevelplaat */}
        <div className="relative hidden md:block">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-brand-gold/40 bg-[url('/brand/pattern-zellige.jpg')] bg-[length:300px_300px] shadow-[0_25px_60px_-25px_rgba(59,22,6,0.5)]">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-cream shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo/Tajine2Go_icon_128.png"
                alt=""
                className="h-24 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: t("siteName"),
    description: t("tagline"),
  };
}
