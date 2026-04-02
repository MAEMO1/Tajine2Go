import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroVideo } from "@/components/hero-video";
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
      <CateringSection />
    </>
  );
}

/* ── Hero Section ── */

function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <HeroVideo />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="animate-fade-up font-heading text-6xl uppercase tracking-[0.08em] text-white drop-shadow-lg md:text-8xl lg:text-9xl">
          TAJINE<span className="text-brand-gold">2GO</span>
        </h1>
        <p className="animate-fade-up-delay-1 mt-2 font-heading text-lg uppercase tracking-[0.12em] text-white/80 md:text-xl">
          Traiteur en Catering · Gent
        </p>
        <p className="animate-fade-up-delay-1 mx-auto mt-4 max-w-xl text-white/90 drop-shadow">
          {t("heroSubtitle")}
        </p>
        <a
          href="#menu"
          className="animate-fade-up-delay-2 mt-8 inline-block rounded-full bg-brand-orange px-10 py-3.5 font-heading text-lg uppercase tracking-[0.08em] text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-brand-orange-hover active:scale-[0.98]"
        >
          {t("scrollToMenu")}
        </a>
      </div>
    </section>
  );
}

/* ── Catering Section ── */

function CateringSection() {
  const t = useTranslations("home");
  const tCatering = useTranslations("catering");

  return (
    <section className="bg-brand-warm px-4 py-16 md:py-20">
      <ScrollReveal>
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl uppercase tracking-[0.08em] text-brand-brown md:text-4xl">
              {t("cateringCta")}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-brown-m">
              {t("cateringCtaText")}
            </p>
            <div className="mt-4 text-sm text-brand-brown-m">
              <strong className="text-brand-brown">{tCatering("eventTypes.wedding")}</strong>
              {" · "}{tCatering("eventTypes.aqiqa")}
              {" · "}{tCatering("eventTypes.corporate")}
              {" · "}{tCatering("eventTypes.funeral")}
              {" · "}{tCatering("eventTypes.iftar")}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/catering"
                className="rounded-full bg-brand-orange px-6 py-2.5 font-heading uppercase tracking-[0.08em] text-white transition-all duration-200 hover:scale-[1.02] hover:bg-brand-orange-hover active:scale-[0.98]"
              >
                {t("cateringPhone")}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border-2 border-brand-brown px-6 py-2.5 font-heading uppercase tracking-[0.08em] text-brand-brown transition-all duration-200 hover:scale-[1.02] hover:bg-brand-brown hover:text-brand-cream active:scale-[0.98]"
              >
                {t("cateringEmail")}
              </Link>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-brand-warm2">
            <div className="flex h-full items-center justify-center">
              <span className="font-heading text-6xl text-brand-orange/20">T2G</span>
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
