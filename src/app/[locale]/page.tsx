import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

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
    <div className="flex flex-col items-center">
      {/* Hero section */}
      <section className="w-full bg-brand-warm px-4 py-16 text-center md:py-24">
        <h1 className="font-heading text-4xl text-brand-brown md:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-brown-m">
          {t("heroSubtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/bestellen"
            className="rounded-lg bg-brand-orange px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-orange-hover"
          >
            {t("orderNow")}
          </Link>
          <Link
            href="/menu"
            className="rounded-lg border-2 border-brand-brown px-8 py-3 font-semibold text-brand-brown transition-colors hover:bg-brand-brown hover:text-white"
          >
            {t("viewMenu")}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="w-full px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          <FeatureCard
            icon="🍲"
            title="Verse gerechten"
            text="Elke week bereid met traditionele recepten en de beste ingrediënten."
          />
          <FeatureCard
            icon="🚗"
            title="Afhalen of levering"
            text="Haal je bestelling op of laat het thuisbezorgen in Gent."
          />
          <FeatureCard
            icon="🎉"
            title="Catering"
            text="Van bruiloften tot bedrijfsevenementen — wij verzorgen het."
          />
        </div>
      </section>

      {/* Catering CTA */}
      <section className="w-full bg-brand-warm px-4 py-12 text-center">
        <h2 className="font-heading text-2xl text-brand-brown">
          {t("cateringCta")}
        </h2>
        <Link
          href="/catering"
          className="mt-4 inline-block rounded-lg bg-brand-orange px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-orange-hover"
        >
          {t("cateringCta")} &rarr;
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-xl bg-brand-cream p-6 text-center shadow-sm">
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-3 font-heading text-xl text-brand-bronze">{title}</h3>
      <p className="mt-2 text-sm text-brand-brown-m">{text}</p>
    </div>
  );
}
