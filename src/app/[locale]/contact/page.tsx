import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactRow } from "@/components/contact-row";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { fetchPublicSiteContent } from "@/lib/site-content";
import { ORDER_PHONE_SUMMARY } from "@/lib/phone";
import type { Locale } from "@/types/database";
import { CateringForm } from "../catering/catering-form";

type Props = { params: Promise<{ locale: string }> };

/*
 * Enige subpagina van de one-pager. Opbouw volgt het design system,
 * ui_kits/website/Contact.jsx: kop, formulier links, contactgegevens rechts
 * met het sierkader, en een donkere cateringafsluiter.
 */

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const content = await fetchPublicSiteContent(locale as Locale);

  const address = [content.business_info.address_line, content.location_text]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <section className="bg-brand-cream px-4 pb-16 pt-14 md:px-6 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow>{t("title")}</Eyebrow>
          <SplitHeading as="h1" className="type-h1 mt-2">
            {t("heading")}
          </SplitHeading>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-brand-brown">
              {t("intro")}
            </p>
          </Reveal>

          <div className="mt-12 grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-14">
            <CateringForm notice={content.website_texts.catering.notice} />

            {/* De zijkolom is korter dan het formulier; sticky houdt de
                contactgegevens in beeld in plaats van een gat achter te laten. */}
            <Reveal delay={0.15} className="md:sticky md:top-32">
              {/* Sierkader met zellige-patroon, overgenomen uit het design system
                  (assets/elements/tajine2go-frame-pattern.png). next/image
                  schaalt en comprimeert bij het uitleveren. */}
              <Image
                src="/brand/elements/tajine2go-frame-pattern.png"
                alt=""
                aria-hidden="true"
                width={200}
                height={299}
                className="mb-6 block h-auto w-[min(200px,50%)]"
              />
              <ul className="grid gap-3 text-[17px] text-brand-brown">
                <ContactRow icon="pin">{address}</ContactRow>
                <ContactRow icon="phone">{ORDER_PHONE_SUMMARY}</ContactRow>
                <ContactRow icon="mail">
                  <a
                    href={`mailto:${content.business_info.email}`}
                    className="hover:text-brand-orange-hover"
                  >
                    {content.business_info.email}
                  </a>
                </ContactRow>
                <ContactRow icon="instagram">
                  <a
                    href="https://www.instagram.com/tajine2go.gent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-orange-hover"
                  >
                    @tajine2go.gent
                  </a>
                </ContactRow>
                <ContactRow icon="facebook">Tajine2Go</ContactRow>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-ember bg-brand-brown px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-[1120px] justify-items-start gap-4">
          <Eyebrow onDark>Catering</Eyebrow>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-medium leading-tight text-brand-cream">
            {t("groupTitle")}
          </h2>
          <p className="max-w-[560px] text-[17px] leading-relaxed text-brand-cream/90">
            {t("groupText")}
          </p>
          <Link
            href="/#catering"
            className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-brand-orange px-7 py-3.5 text-base font-bold text-brand-cream transition-colors duration-200 hover:bg-brand-orange-hover"
          >
            {t("groupCta")}
          </Link>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}
