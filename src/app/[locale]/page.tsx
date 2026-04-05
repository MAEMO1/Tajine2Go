import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroCanvas } from "@/components/hero-canvas";
import { ScrollReveal } from "@/components/scroll-reveal";
import { InfoStrip } from "@/components/info-strip";
import { HomepageMenu } from "@/components/homepage-menu";
import { fetchMenuData } from "@/lib/menu-data";
import type { Locale } from "@/types/database";

type Props = {
  params: Promise<{ locale: string }>;
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Tajine2Go",
  description: "Maghrebijnse takeaway in Gent — verse tajines, couscous en meer",
  url: "https://tajine2go.be",
  telephone: "+32 XXX XX XX XX",
  email: "info@tajine2go.be",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gent",
    addressCountry: "BE",
  },
  servesCuisine: ["Moroccan", "Maghrebi", "North African"],
  priceRange: "€€",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "12:00",
    closes: "19:00",
  },
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const currentLocale = (await getLocale()) as Locale;
  const menuData = await fetchMenuData(currentLocale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <InfoStrip />
      <HomepageMenu menu={menuData} />
      <StorySection />
      <CateringSection />
    </>
  );
}

/* -- Hero Section -- */

function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-brand-cream">
      {/* Warm gradient atmosphere behind the title */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(217,123,26,0.06),transparent)]" />

      {/* Title block */}
      <div className="relative mx-auto max-w-[1100px] px-4 pt-10 md:px-8 md:pt-14">
        <h1 className="animate-fade-up font-heading text-[clamp(60px,9vw,120px)] leading-[0.88] tracking-[0.06em] text-brand-brown">
          TAJINE<span className="text-brand-orange">2GO</span>
        </h1>
        <p className="animate-fade-up-delay-1 mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-brown-s">
          Traiteur en Catering &middot; Gent
        </p>
      </div>

      {/* Canvas illustration */}
      <HeroCanvas />

      {/* Text strip with decorative top border */}
      <div className="relative bg-brand-cream px-4 py-12 md:px-8 md:py-16">
        {/* Arch-shaped decorative accent */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />
        </div>

        <div className="mx-auto max-w-[1060px]">
          <h2 className="animate-fade-up font-heading text-3xl uppercase tracking-[0.12em] text-brand-brown md:text-[42px] md:leading-[1.1]">
            {t("infoStripTitle")}
          </h2>
          <p className="animate-fade-up-delay-1 mt-5 max-w-xl text-[17px] leading-relaxed text-brand-brown-m">
            {t("heroSubtitle")}
          </p>
          <a
            href="#menu"
            className="animate-fade-up-delay-2 mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 font-heading text-lg uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-brand-orange-hover hover:shadow-[0_4px_20px_rgba(217,123,26,0.25)] active:scale-[0.98]"
          >
            {t("scrollToMenu")}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* -- Story Section -- */

function StorySection() {
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
            {t("storyText")}
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

function CateringSection() {
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
              {t("cateringCta")}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-brand-brown-m">
              {t("cateringCtaText")}
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
