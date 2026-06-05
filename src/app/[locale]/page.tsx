import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { InfoStrip } from "@/components/info-strip";
import { HomepageMenu } from "@/components/homepage-menu";
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

  const t = await getTranslations({ locale: currentLocale, namespace: "home" });
  const serviceDayLabel = new Intl.DateTimeFormat(currentLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${menuData.date}T12:00:00`));
  const cutoffLabel = menuData.cutoff_at
    ? new Intl.DateTimeFormat(currentLocale, {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(menuData.cutoff_at))
    : null;

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
      {menuData.is_active && (
        <section className="border-b border-brand-warm2 bg-brand-cream px-4 py-2.5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-mono text-xs uppercase tracking-[0.18em]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
            </span>
            <span className="text-brand-brown">
              {t("nextService")}: {serviceDayLabel}
              {menuData.open_window ? ` · ${menuData.open_window}` : ""}
            </span>
            {cutoffLabel && (
              <span className="text-brand-orange">· {t("orderBy", { time: cutoffLabel })}</span>
            )}
          </div>
        </section>
      )}
      <HeroSection
        heroSubtitle={content.website_texts.home.hero_subtitle}
      />
      <InfoStrip />
      <HomepageMenu
        menu={menuData}
        closedMessage={content.website_texts.notices.closed_message}
      />
      <StorySection storyText={content.website_texts.home.story_text} />
      <CateringSection
        title={content.website_texts.home.catering_cta_title}
        text={content.website_texts.home.catering_cta_text}
      />
    </>
  );
}

/* -- Hero Section — editorial style v3 (matches print pieces) -- */

function HeroSection({
  heroSubtitle,
}: {
  heroSubtitle: string;
}) {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-[#F4F0E8]">
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-[1.08fr_1fr] md:gap-14 md:px-8 md:py-20 lg:py-24">

        {/* === Left: editorial text column === */}
        <div className="relative z-10 max-w-2xl">
          {/* Kicker — mono letterspaced caps with leading rule */}
          <div className="animate-fade-up flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-brand-orange">
            <span className="h-px w-12 bg-brand-orange" />
            <span>Een nieuw hoofdstuk in de Gentse keuken</span>
          </div>

          {/* Headline — Gloock display serif, italic accent on Marokkaanse */}
          <h1 className="animate-fade-up-delay-1 mt-6 font-[family-name:var(--font-display)] text-[clamp(52px,7.4vw,108px)] font-normal leading-[0.94] tracking-[-0.02em] text-brand-brown">
            {t("heroTitleA")}{" "}
            <em className="font-[family-name:var(--font-italic)] italic text-brand-orange">
              {t("heroTitleAccent")}
            </em>{" "}
            {t("heroTitleB")}
          </h1>

          {/* Italic deck — InstrumentSerif italic */}
          <p className="animate-fade-up-delay-2 mt-8 max-w-xl font-[family-name:var(--font-italic)] text-[clamp(18px,1.6vw,24px)] italic leading-[1.4] text-brand-brown-m">
            {heroSubtitle}
          </p>

          {/* Hairline rule, full text-column width */}
          <div className="animate-fade-up-delay-2 mt-10 h-px bg-brand-brown/85" />

          {/* Bottom action row: URL-style "Bekijk menu" link + monospaced labels */}
          <div className="animate-fade-up-delay-3 mt-6 flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#menu"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-brown px-7 py-3.5 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-brand-cream transition-all duration-300 hover:bg-brand-brown-m active:scale-[0.98]"
              >
                {t("viewMenu")}
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <Link
                href="/bestellen"
                className="inline-flex items-center gap-2 rounded-full border border-brand-brown/85 px-7 py-3 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.32em] text-brand-brown transition-all duration-300 hover:bg-brand-brown hover:text-brand-cream active:scale-[0.98]"
              >
                {t("orderNow")}
              </Link>
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.28em] leading-[1.7] text-brand-brown/60">
              <div><span className="text-brand-orange">Plaats</span> Gent · BE</div>
              <div><span className="text-brand-orange">Editie</span> Nº 01</div>
            </div>
          </div>
        </div>

        {/* === Right: takeaway hero photograph === */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4F0E8] shadow-[0_18px_50px_-30px_rgba(45,27,10,0.24)]">
          <Image
            src="/hero-takeaway-box.jpeg"
            alt="Marokkaanse takeaway box met verse tajine"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            preload
            className="object-cover object-[center_55%] brightness-[1.025] contrast-[0.99] saturate-[0.985]"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-9 bg-gradient-to-r from-[#F4F0E8]/38 via-[#F4F0E8]/12 to-transparent backdrop-blur-[1px]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-9 bg-gradient-to-l from-[#F4F0E8]/38 via-[#F4F0E8]/12 to-transparent backdrop-blur-[1px]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#F4F0E8]/30 via-[#F4F0E8]/10 to-transparent backdrop-blur-[1px]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F4F0E8]/38 via-[#F4F0E8]/12 to-transparent backdrop-blur-[1px]" />

          {/* Caption overlay — mono labels in cream, like a magazine FIG line */}
          <div className="absolute left-4 top-4 right-4 flex justify-between font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.28em] text-brand-brown/50">
            <span>Tajine2Go · Gent</span>
            <span>Mei MMXXVI</span>
          </div>
        </div>
      </div>

      {/* === USP strip beneath the hero === */}
      <div className="relative border-t border-brand-warm2/80 bg-brand-cream">
        <div className="mx-auto grid max-w-7xl gap-y-6 px-4 py-8 sm:grid-cols-3 md:gap-x-12 md:px-8 md:py-10">
          <UspItem
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C12 2 6 8 6 13a6 6 0 0012 0c0-5-6-11-6-11z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v5M9 22h6" />
              </svg>
            }
            title={t("uspFresh")}
            subtitle={t("uspFreshShort")}
          />
          <UspItem
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4M9 4v3m6-3v3M6 7h12l-1 13a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8M8 15h8" opacity="0.4" />
              </svg>
            }
            title={t("uspRecipes")}
            subtitle={t("uspRecipesShort")}
          />
          <UspItem
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
              </svg>
            }
            title={t("uspFast")}
            subtitle={t("uspFastShort")}
          />
        </div>
      </div>
    </section>
  );
}

function UspItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-warm/60 text-brand-bronze">
        <span className="block h-6 w-6">{icon}</span>
      </div>
      <div>
        <div className="font-heading text-base uppercase tracking-[0.1em] text-brand-brown">
          {title}
        </div>
        <div className="text-sm text-brand-brown-s">{subtitle}</div>
      </div>
    </div>
  );
}

/* -- Story Section -- */

function StorySection({ storyText }: { storyText: string }) {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-brand-cream px-4 py-16 md:py-20">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(217,123,26,0.04),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(140,78,16,0.03),transparent_50%)]" />

      <ScrollReveal>
        <div className="relative mx-auto max-w-3xl text-center">
          {/* Decorative diamond */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-warm2" />
            <div className="h-2 w-2 rotate-45 border border-brand-orange/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-warm2" />
          </div>

          <h2 className="font-heading text-3xl uppercase tracking-[0.15em] text-brand-brown md:text-4xl">
            {t("storyTitle")}
          </h2>
          <p className="mt-5 text-[17px] leading-[1.8] text-brand-brown-m">
            {storyText}
          </p>
          <Link
            href="/over-ons"
            className="mt-6 inline-block font-heading text-sm uppercase tracking-[0.15em] text-brand-orange transition-colors hover:text-brand-orange-hover"
          >
            {t("storyLink")} &rarr;
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* -- Catering Section -- */

function CateringSection({ title, text }: { title: string; text: string }) {
  const t = useTranslations("home");
  const tCatering = useTranslations("catering");

  return (
    <section className="relative overflow-hidden border-t border-brand-warm2 bg-brand-warm px-4 py-16 md:py-24">
      {/* Atmospheric gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(217,123,26,0.08),transparent_60%)]" />

      <ScrollReveal>
        <div className="relative mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-10 bg-brand-orange/40" />
              <span className="font-heading text-xs uppercase tracking-[0.2em] text-brand-orange">
                Catering
              </span>
            </div>

            <h2 className="font-heading text-3xl uppercase tracking-[0.1em] text-brand-brown md:text-[40px] md:leading-[1.1]">
              {title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-brand-brown-m">
              {text}
            </p>
            <div className="mt-4 text-sm text-brand-brown-s">
              <strong className="text-brand-brown">{tCatering("eventTypes.wedding")}</strong>
              {" \u00b7 "}{tCatering("eventTypes.aqiqa")}
              {" \u00b7 "}{tCatering("eventTypes.corporate")}
              {" \u00b7 "}{tCatering("eventTypes.funeral")}
              {" \u00b7 "}{tCatering("eventTypes.iftar")}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catering"
                className="rounded-full bg-brand-orange px-7 py-3 font-heading text-[15px] uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-brand-orange-hover hover:shadow-[0_4px_20px_rgba(217,123,26,0.25)] active:scale-[0.98]"
              >
                {t("cateringPhone")}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border-2 border-brand-brown/80 px-7 py-3 font-heading text-[15px] uppercase tracking-[0.12em] text-brand-brown transition-all duration-300 hover:bg-brand-brown hover:text-brand-cream active:scale-[0.98]"
              >
                {t("cateringEmail")}
              </Link>
            </div>
          </div>

          {/* Placeholder image area with pattern */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-warm2/80 to-brand-warm2/40">
            {/* Zellige-inspired dot pattern */}
            <div className="absolute inset-0 opacity-[0.12]" style={{
              backgroundImage: `radial-gradient(circle, #D97B1A 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }} />
            <div className="flex h-full items-center justify-center">
              <span className="font-heading text-7xl tracking-[0.1em] text-brand-orange/10">T2G</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
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
