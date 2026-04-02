import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroVideo } from "@/components/hero-video";
import { ScrollReveal } from "@/components/scroll-reveal";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}

function HomeContent() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col">
      {/* ── Hero with video background ── */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="animate-fade-up font-heading text-5xl uppercase tracking-[0.08em] text-white drop-shadow-lg md:text-7xl lg:text-8xl">
            {t("heroTitle")}
          </h1>
          <p className="animate-fade-up-delay-1 mx-auto mt-6 max-w-xl text-lg text-white/90 drop-shadow md:text-xl">
            {t("heroSubtitle")}
          </p>
          <div className="animate-fade-up-delay-2 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/bestellen"
              className="rounded-lg bg-brand-orange px-8 py-3.5 font-heading text-lg uppercase tracking-[0.08em] text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-brand-orange-hover active:scale-[0.98]"
            >
              {t("orderNow")}
            </Link>
            <Link
              href="/menu"
              className="rounded-lg border-2 border-white px-8 py-3.5 font-heading text-lg uppercase tracking-[0.08em] text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
            >
              {t("viewMenu")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── USP strip ── */}
      <section className="bg-brand-warm px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          <ScrollReveal delay={0}>
            <UspCard
              icon={<TajineIcon />}
              title={t("uspFresh")}
              text={t("uspFreshText")}
            />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <UspCard
              icon={<DeliveryIcon />}
              title={t("uspDelivery")}
              text={t("uspDeliveryText")}
            />
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <UspCard
              icon={<PartyIcon />}
              title={t("uspCatering")}
              text={t("uspCateringText")}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Story / About teaser ── */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <ScrollReveal direction="left">
            <div>
              <h2 className="font-heading text-3xl uppercase tracking-[0.08em] text-brand-brown md:text-4xl">
                {t("storyTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-brand-brown-m">
                {t("storyText")}
              </p>
              <Link
                href="/over-ons"
                className="mt-6 inline-flex items-center gap-2 font-heading uppercase tracking-[0.08em] text-brand-orange transition-colors hover:text-brand-orange-hover"
              >
                {t("storyLink")} &rarr;
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.15}>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-brand-warm2">
              {/* Placeholder for about image */}
              <div className="flex h-full items-center justify-center">
                <span className="font-heading text-6xl text-brand-orange/30">T2G</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Catering CTA ── */}
      <section className="bg-brand-warm px-4 py-16 md:py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl uppercase tracking-[0.08em] text-brand-brown md:text-5xl">
              {t("cateringCta")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-brown-m">
              {t("cateringCtaText")}
            </p>
            <Link
              href="/catering"
              className="mt-8 inline-block rounded-lg bg-brand-orange px-10 py-4 font-heading text-lg uppercase tracking-[0.08em] text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-brand-orange-hover active:scale-[0.98]"
            >
              {t("cateringCta")} &rarr;
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
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

/* ── USP Card ── */

function UspCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-brand-cream p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
      {icon}
      <h3 className="mt-4 font-heading text-xl uppercase tracking-[0.08em] text-brand-bronze">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-brown-m">{text}</p>
    </div>
  );
}

/* ── SVG Icons ── */

function TajineIcon() {
  return (
    <svg className="h-10 w-10 text-brand-orange" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M8 36h32M10 36c0-12 4-20 14-20s14 8 14 20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 16V8" strokeLinecap="round" />
      <circle cx="24" cy="6" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg className="h-10 w-10 text-brand-orange" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="14" width="28" height="20" rx="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 22h8l4 8v4h-12V22z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="38" r="4" />
      <circle cx="38" cy="38" r="4" />
    </svg>
  );
}

function PartyIcon() {
  return (
    <svg className="h-10 w-10 text-brand-orange" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M24 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 28c0-4 7-8 16-8s16 4 16 8v12H8V28z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
