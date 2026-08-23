import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactRow } from "@/components/contact-row";
import { Eyebrow } from "@/components/eyebrow";
import { HomepageMenu } from "@/components/homepage-menu";
import { MobileOrderBar } from "@/components/mobile-order-bar";
import { PhoneOrderButton } from "@/components/phone-order-button";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { fetchStaticMenuData } from "@/lib/menu-data";
import { fetchPublicSiteContent } from "@/lib/site-content";
import { ORDER_PHONE_SUMMARY } from "@/lib/phone";
import type { Locale } from "@/types/database";

type Props = {
  params: Promise<{ locale: string }>;
};

/*
 * De publieke site is een one-pager: menu, verhaal, catering, bereikbaarheid en
 * praktisch leven als ankersecties op deze pagina. Alleen /contact staat apart.
 * Bron: design system "Tajine2Go Design System", ui_kits/website/Home.jsx.
 */

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const currentLocale = (await getLocale()) as Locale;
  const [menuData, content] = await Promise.all([
    fetchStaticMenuData(currentLocale),
    fetchPublicSiteContent(currentLocale),
  ]);

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
        <section className="border-b border-brand-line bg-brand-warm px-4 py-3 text-center text-sm text-brand-brown">
          {content.website_texts.notices.homepage_banner}
        </section>
      )}

      <HeroSection />

      <HomepageMenu
        menu={menuData}
        closedMessage={content.website_texts.notices.closed_message}
      />

      <StorySection storyText={content.website_texts.home.story_text} />

      <CateringSection
        title={content.website_texts.home.catering_cta_title}
        text={content.website_texts.home.catering_cta_text}
      />

      <AccessSection />

      <PracticalSection
        addressLine={content.business_info.address_line}
        locationText={content.location_text}
        email={content.business_info.email}
        openingHoursLines={content.opening_hours_lines}
        openingHoursSummary={content.opening_hours_summary}
      />

      <MobileOrderBar />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Gedeelde bouwstenen                                                 */
/* ------------------------------------------------------------------ */

/** Merkoranje vlak waar nog een foto moet komen. Merkoranje is een vlakkleur. */
function PhotoPlaceholder({ label, className }: { label: string; className: string }) {
  return (
    <div
      className={`grid place-items-center rounded-2xl bg-brand-orange text-sm text-brand-cream ${className}`}
    >
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — donkere plaat met zellige-patroon, logo en twee acties        */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="section-ember relative isolate overflow-hidden bg-brand-brown">
      <div
        className="absolute -inset-2 bg-[url('/brand/pattern-zellige.jpg')] bg-[length:320px_320px] opacity-50 mix-blend-luminosity"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(68,12,0,0.62)_0%,rgba(68,12,0,0.88)_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[900px] flex-col items-center justify-center gap-8 px-5 py-16 text-center md:px-6">
        <Reveal>
          <p className="font-display text-[clamp(20px,2.2vw,26px)] italic text-brand-gold">
            {t("welcome")}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          {/* Donkere-ondergrondvariant: het woordmerk staat in papierkleur.
              Zie CLAUDE.md §5.5. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo/tajine2go-horizontal-dark.svg"
            alt="Tajine2Go"
            className="h-auto w-[88%] max-w-[440px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)] md:h-[130px] md:w-auto md:max-w-none"
          />
        </Reveal>

        <Reveal delay={0.24} className="w-full">
          <div className="flex w-full items-center justify-center gap-4">
            <span className="hidden h-px flex-1 bg-brand-gold/55 sm:block" aria-hidden="true" />
            <h1 className="text-balance text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold sm:whitespace-nowrap md:text-[13px]">
              {t("heroKicker")}
            </h1>
            <span className="hidden h-px flex-1 bg-brand-gold/55 sm:block" aria-hidden="true" />
          </div>
        </Reveal>

        <Reveal delay={0.36} className="w-full">
          <div className="mx-auto flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <PhoneOrderButton
              label={t("orderNow")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-orange px-8 py-4 text-[17px] font-bold text-brand-cream transition-colors duration-200 hover:bg-brand-orange-hover sm:w-[230px]"
            />
            <Link
              href="/contact"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-brand-cream px-8 py-4 text-[17px] font-bold text-brand-cream transition-colors duration-200 hover:bg-brand-cream hover:text-brand-brown sm:w-[230px]"
            >
              {t("heroCateringCta")}
            </Link>
          </div>
        </Reveal>
      </div>

      <a
        href="#menu"
        aria-label={t("scrollToMenu")}
        className="absolute bottom-8 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center text-brand-cream/80 transition-colors hover:text-brand-cream"
      >
        <svg
          className="h-8 w-8 motion-safe:animate-float"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ons verhaal — donkere sectie                                        */
/* ------------------------------------------------------------------ */

function StorySection({ storyText }: { storyText: string }) {
  const t = useTranslations("home");

  return (
    <section id="verhaal" className="section-ember scroll-mt-24 bg-brand-brown px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto grid max-w-[1120px] items-center gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <Eyebrow onDark>{t("storyEyebrow")}</Eyebrow>
          <SplitHeading
            as="h2"
            className="mt-2 font-display text-[clamp(28px,3.5vw,44px)] font-medium leading-tight text-brand-cream"
          >
            {t("storyHeading")}
          </SplitHeading>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-brand-cream/90">
              {storyText}
            </p>
          </Reveal>
          <div className="mt-6 h-0.5 w-[120px] bg-brand-gold" aria-hidden="true" />
        </div>

        <PhotoPlaceholder label={t("photoStory")} className="h-[220px] md:h-[300px]" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Catering                                                            */
/* ------------------------------------------------------------------ */

function CateringSection({ title, text }: { title: string; text: string }) {
  const t = useTranslations("home");

  return (
    <section id="catering" className="scroll-mt-24 bg-brand-cream px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto grid max-w-[1120px] items-center gap-8 md:grid-cols-2 md:gap-12">
        <PhotoPlaceholder label={t("photoCatering")} className="h-[200px] md:h-[280px]" />

        <div>
          <Eyebrow>Catering</Eyebrow>
          <SplitHeading as="h2" className="type-h2 mt-2">
            {title}
          </SplitHeading>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-brand-brown">{text}</p>
          </Reveal>
          {/* Prijs in inktkleur, niet in de actiekleur. Zie CLAUDE.md §5.3. */}
          <p className="mt-6 text-2xl font-bold text-brand-brown">{t("cateringPrice")}</p>
          <Reveal delay={0.3}>
            <Link
              href="/contact"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-brand-orange-hover px-7 py-3.5 text-base font-bold text-white transition-colors duration-200 hover:bg-brand-orange-deep"
            >
              {t("heroCateringCta")}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bereikbaarheid — donkere sectie                                     */
/* ------------------------------------------------------------------ */

function AccessSection() {
  const t = useTranslations("home");

  const ways = [
    { title: t("accessCarTitle"), text: t("accessCarText") },
    { title: t("accessTransitTitle"), text: t("accessTransitText") },
    { title: t("accessBikeTitle"), text: t("accessBikeText") },
  ];

  return (
    <section
      id="bereikbaarheid"
      className="section-ember scroll-mt-24 bg-brand-brown px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-[1120px]">
        <Eyebrow onDark>{t("accessEyebrow")}</Eyebrow>
        <SplitHeading
          as="h2"
          className="mt-2 font-display text-[clamp(28px,3.5vw,44px)] font-medium leading-tight text-brand-cream"
        >
          {t("accessTitle")}
        </SplitHeading>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {ways.map((way, index) => (
            <Reveal key={way.title} delay={index * 0.1}>
              <h3 className="font-display text-[22px] font-semibold text-brand-cream">{way.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-brand-cream/85">{way.text}</p>
            </Reveal>
          ))}
        </div>

        <PhotoPlaceholder label={t("photoAccess")} className="mt-10 h-[200px] md:h-[280px]" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Praktisch — contact, uren en snelle links                           */
/* ------------------------------------------------------------------ */

function PracticalSection({
  addressLine,
  locationText,
  email,
  openingHoursLines,
  openingHoursSummary,
}: {
  addressLine: string | null;
  locationText: string;
  email: string;
  openingHoursLines: { day: string; label: string; window: string }[];
  openingHoursSummary: string;
}) {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  const quickLinks: { label: string; href: string }[] = [
    { label: tNav("menu"), href: "#menu" },
    { label: tNav("about"), href: "#verhaal" },
    { label: tNav("catering"), href: "#catering" },
    { label: tNav("access"), href: "#bereikbaarheid" },
  ];

  return (
    <section id="praktisch" className="scroll-mt-24 bg-brand-cream px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto grid max-w-[1120px] items-center gap-10 md:grid-cols-[1fr_1fr_auto] md:gap-12">
        <div>
          <Eyebrow>{t("practicalEyebrow")}</Eyebrow>
          <ul className="mt-4 grid gap-3 text-[17px] text-brand-brown">
            <ContactRow icon="pin">
              {[addressLine, locationText].filter(Boolean).join(", ")}
            </ContactRow>
            <ContactRow icon="phone">{ORDER_PHONE_SUMMARY}</ContactRow>
            <ContactRow icon="mail">
              <a href={`mailto:${email}`} className="hover:text-brand-orange-hover">
                {email}
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
        </div>

        <div>
          <h2 className="font-display text-[22px] font-semibold text-brand-brown">
            {t("practicalHours")}
          </h2>
          {openingHoursLines.length > 0 ? (
            <dl className="mt-3 grid max-w-[320px] gap-2 text-[17px]">
              {openingHoursLines.map((line) => (
                <div key={line.day} className="flex justify-between gap-6">
                  <dt className="capitalize text-brand-bronze">{line.label}</dt>
                  <dd className="font-semibold text-brand-brown">{line.window}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 max-w-[280px] text-[17px] leading-relaxed text-brand-bronze">
              {openingHoursSummary}
            </p>
          )}

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-hover">
            {t("practicalLinks")}
          </p>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-base">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-brand-brown transition-colors hover:text-brand-orange-hover"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/contact"
              className="text-brand-brown transition-colors hover:text-brand-orange-hover"
            >
              {tNav("contact")}
            </Link>
          </nav>
        </div>

        {/* Officiele Instagram-QR van tajine2go.gent, byte-identiek overgenomen
            uit de merkmap. next/image schaalt en comprimeert bij het uitleveren,
            zodat het bronbestand ongewijzigd blijft. */}
        <Image
          src="/brand/qr/tajine2go-qr-instagram.png"
          alt={t("qrAlt")}
          width={150}
          height={172}
          className="h-auto w-[130px] md:w-[150px]"
        />
      </div>

      <p className="mx-auto mt-12 max-w-[1120px] border-t border-brand-line pt-4 text-sm text-brand-bronze">
        {`© ${new Date().getFullYear()} Tajine2Go · BTW BE 1019936687`}
      </p>
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
