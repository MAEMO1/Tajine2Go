import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { InfoStrip } from "@/components/info-strip";
import { HomepageMenu } from "@/components/homepage-menu";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
import { fetchMenuData } from "@/lib/menu-data";
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
    fetchMenuData(currentLocale),
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
/* Hero — "Hero Final" comp: donker geblurd mozaïek, gouden kaderlijn, */
/* gecentreerd logo, serif-kop in crème, script-traditieregel, 2 CTA's */
/* ------------------------------------------------------------------ */

function HeroSection({
  heroSubtitle,
}: {
  heroSubtitle: string;
}) {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden bg-[#4A1E08]">
      {/* Zellige-patroon (beker/gevelplaat), licht geblurd + warme donkere waas voor leesbaarheid */}
      <div
        className="absolute -inset-2 bg-[url('/brand/pattern-zellige.jpg')] bg-[length:300px_300px] blur-[4px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,15,4,0.68)_0%,rgba(35,11,3,0.88)_100%)]"
        aria-hidden="true"
      />

      {/* Dubbele gouden kaderlijn */}
      <div className="pointer-events-none absolute inset-3 border border-brand-gold/45 md:inset-5" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-4 border border-brand-gold/25 md:inset-7" aria-hidden="true" />

      {/* Mobile-first: compacte maten en verticale ritmes, vanaf md ruimer */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-7 py-14 text-center md:px-6 md:py-24">
        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo/Tajine2Go_logo_primary_transparent_640w.png"
            alt="Tajine2Go"
            className="h-[72px] w-auto drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)] md:h-32"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 flex items-center justify-center gap-3 text-[#F6E9D2] md:mt-10 md:gap-4">
            <span className="hidden h-px bg-brand-gold/60 sm:block sm:w-8 md:w-14" aria-hidden="true" />
            <p className="max-w-[26ch] text-balance font-display text-[12px] font-semibold uppercase leading-[1.9] tracking-[0.24em] sm:max-w-none md:text-[15px] md:tracking-[0.32em]">
              {t("heroKicker")}
            </p>
            <span className="hidden h-px bg-brand-gold/60 sm:block sm:w-8 md:w-14" aria-hidden="true" />
          </div>
        </Reveal>

        <SplitHeading
          as="h1"
          className="mt-5 text-balance font-display text-[clamp(38px,11vw,96px)] font-medium leading-[1.1] text-[#F6E9D2] md:mt-8 md:leading-[1.08]"
        >
          {t("heroLine1")}
        </SplitHeading>

        <Reveal delay={0.35}>
          <p className="mt-5 text-balance font-display text-[clamp(20px,5vw,30px)] font-medium italic leading-normal text-[#F6E9D2] md:mt-7">
            {heroSubtitle}
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 md:mt-10">
            <a
              href="#menu"
              className="inline-flex items-center justify-center rounded-md bg-brand-orange-hover px-8 py-3.5 font-display text-lg font-bold text-white shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:bg-brand-orange-deep active:scale-[0.98]"
            >
              {t("viewMenu")}
            </a>
            <Link
              href="/catering"
              className="inline-flex items-center justify-center rounded-md border border-[#F6E9D2]/70 px-8 py-3.5 font-display text-lg font-bold text-[#F6E9D2] transition-all duration-300 hover:bg-[#F6E9D2]/10 active:scale-[0.98]"
            >
              {t("heroCateringCta")}
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Scroll-aanwijzing: hint dat het menu eronder staat */}
      <a
        href="#menu"
        aria-label={t("scrollToMenu")}
        className="absolute bottom-7 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-[#F6E9D2]/80 transition-colors hover:text-[#F6E9D2]"
      >
        <svg
          className="h-7 w-7 motion-safe:animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
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
              alt="Tajine2Go winkel in Gent"
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
    tCatering("eventTypes.wedding"),
    tCatering("eventTypes.aqiqa"),
    tCatering("eventTypes.corporate"),
    tCatering("eventTypes.funeral"),
    tCatering("eventTypes.iftar"),
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
