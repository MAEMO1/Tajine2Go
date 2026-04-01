import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-3xl text-brand-brown">Contact</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-brand-cream p-6 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Bereik ons</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-brand-brown-s">E-mail</dt>
              <dd className="mt-1 text-brand-brown">info@tajine2go.be</dd>
            </div>
            <div>
              <dt className="text-brand-brown-s">Telefoon</dt>
              <dd className="mt-1 text-brand-brown">+32 XXX XX XX XX</dd>
            </div>
            <div>
              <dt className="text-brand-brown-s">Locatie</dt>
              <dd className="mt-1 text-brand-brown">Gent, België</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl bg-brand-cream p-6 shadow-sm">
          <h2 className="font-heading text-xl text-brand-bronze">Openingsuren</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-brown-s">Zaterdag</dt>
              <dd className="text-brand-brown">12:00 - 19:00</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-brown-s">Overige dagen</dt>
              <dd className="text-brand-brown-s">Gesloten</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-brand-brown-s">
            Catering aanvragen worden doorlopend verwerkt.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}
