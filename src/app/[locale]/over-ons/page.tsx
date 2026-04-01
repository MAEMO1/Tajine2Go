import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-3xl text-brand-brown">Over Tajine2Go</h1>

      <div className="mt-6 space-y-4 text-brand-brown-m">
        <p>
          Tajine2Go brengt de authentieke smaken van de Maghrebijnse keuken
          naar Gent. Elke week bereiden we verse tajines, couscous en meer
          met traditionele recepten en de beste ingrediënten.
        </p>
        <p>
          Onze missie is simpel: iedereen laten genieten van huisgemaakte
          Maghrebijnse gerechten, met de warmte en gastvrijheid die bij
          onze cultuur hoort.
        </p>
        <p>
          Naast onze wekelijkse takeaway bieden we ook catering aan voor
          evenementen — van bruiloften en aqiqa&apos;s tot bedrijfsevenementen
          en iftar.
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}
