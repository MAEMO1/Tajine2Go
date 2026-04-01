import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

const faqs = [
  {
    q: "Wanneer kan ik bestellen?",
    a: "We zijn elke zaterdag open voor bestellingen. Bestel vóór vrijdagavond om je favoriete gerechten te reserveren.",
  },
  {
    q: "Wat is het minimale bestelbedrag?",
    a: "Het minimale bestelbedrag is €20,00.",
  },
  {
    q: "Leveren jullie in mijn buurt?",
    a: "We leveren in Gent en omgeving (postcodes 9000-9052). Bekijk tijdens het bestellen of jouw postcode beschikbaar is.",
  },
  {
    q: "Kan ik cash betalen?",
    a: "Ja! Je kunt zowel online betalen als cash bij afhaling of levering.",
  },
  {
    q: "Hoe werkt catering?",
    a: "Stuur ons een aanvraag via het cateringformulier. We nemen contact met je op om je evenement te bespreken en een offerte op maat te maken.",
  },
  {
    q: "Kan ik mijn bestelling annuleren?",
    a: "Neem contact met ons op en we helpen je graag verder.",
  },
  {
    q: "Zijn jullie gerechten halal?",
    a: "Ja, al onze gerechten worden bereid met halal ingrediënten.",
  },
];

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-3xl text-brand-brown">Veelgestelde vragen</h1>

      <div className="mt-6 space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-xl bg-brand-cream p-4 shadow-sm">
            <summary className="cursor-pointer font-semibold text-brand-brown">
              {faq.q}
            </summary>
            <p className="mt-2 text-sm text-brand-brown-m">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("title") };
}
