import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
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

      {/* Catering CTA */}
      <section className="w-full px-4 py-12 text-center">
        <Link
          href="/catering"
          className="text-lg font-semibold text-brand-orange hover:text-brand-orange-hover"
        >
          {t("cateringCta")} &rarr;
        </Link>
      </section>
    </div>
  );
}
