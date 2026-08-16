import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitHeading } from "@/components/motion/reveal";
import { ZelligeOverlay } from "@/components/decor/khatam";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const content = await fetchPublicSiteContent(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="section-ember relative overflow-hidden bg-brand-brown">
      <ZelligeOverlay className="absolute inset-0 text-brand-gold opacity-[0.04]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(217,123,26,0.1),transparent_55%)]" />

      {/* Afsluitend merkmoment — serif, zoals het drukwerk */}
      <div className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-14 md:px-6 md:pt-18">
        <SplitHeading
          as="p"
          className="text-center font-display text-[clamp(34px,6vw,84px)] font-medium leading-none text-brand-cream/95"
        >
          {content.business_info.name}
        </SplitHeading>
        <div className="mt-4 flex items-center justify-center gap-4 text-brand-gold/80">
          <span className="h-px w-14 bg-brand-gold/40" aria-hidden="true" />
          <span className="text-[11px]" aria-hidden="true">&#10022;</span>
          <span className="h-px w-14 bg-brand-gold/40" aria-hidden="true" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold">
              {content.business_info.address_locality}
            </p>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-brand-cream/70">
              {t("tagline")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-brand-cream">
              {t("quickLinks")}
            </h3>
            <div className="mt-2 mb-4 h-px w-8 bg-brand-orange/60" />
            <nav className="flex flex-col gap-2.5">
              <FooterLink href="/menu" label={tNav("menu")} />
              <FooterLink href="/catering" label={tNav("catering")} />
              <FooterLink href="/over-ons" label={tNav("about")} />
              <FooterLink href="/faq" label={tNav("faq")} />
              <FooterLink href="/contact" label={tNav("contact")} />
            </nav>
          </div>

          {/* Contact & legal */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-brand-cream">
              {t("contactInfo")}
            </h3>
            <div className="mt-2 mb-4 h-px w-8 bg-brand-orange/60" />
            <div className="flex flex-col gap-2.5 text-[15px] text-brand-cream/70">
              {content.business_info.address_line && <p>{content.business_info.address_line}</p>}
              <p>{content.location_text}</p>
              <p>{content.business_info.email}</p>
              <p>{content.business_info.phone}</p>
              <a
                href="https://www.instagram.com/tajine2go.gent"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition-colors duration-200 hover:text-brand-orange"
              >
                Instagram: @tajine2go.gent
              </a>
              <p className="mt-2 font-medium text-brand-cream">{t("openingHoursLabel")}</p>
              {content.opening_hours_lines.length > 0 ? (
                content.opening_hours_lines.map((line) => (
                  <p key={line.day} className="text-sm text-brand-cream/55">
                    {line.label} {line.window}
                  </p>
                ))
              ) : (
                <p className="text-sm text-brand-cream/55">{content.opening_hours_summary}</p>
              )}
            </div>
            <div className="mt-6 flex gap-4 text-sm">
              <FooterLink href="/privacy" label={t("privacy")} />
              <span className="text-brand-cream/25">&middot;</span>
              <FooterLink href="/terms" label={t("terms")} />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="relative border-t border-brand-cream/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <p className="text-xs text-brand-cream/45">
            &copy; {year} {content.business_info.name}. {t("rights")}
          </p>
          <p className="text-xs text-brand-cream/30">{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="w-fit text-[15px] text-brand-cream/70 transition-colors duration-200 hover:text-brand-orange"
    >
      {label}
    </Link>
  );
}
