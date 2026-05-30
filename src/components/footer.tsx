import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const content = await fetchPublicSiteContent(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-brand-warm2 bg-brand-warm">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(217,123,26,0.05),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-18">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div>
            <p className="font-heading text-3xl uppercase tracking-[0.15em] text-brand-brown">
              {content.business_info.name}
            </p>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-brand-brown-m">
              {t("tagline")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-[0.15em] text-brand-brown">
              {t("quickLinks")}
            </h3>
            <div className="mt-1 mb-4 h-px w-8 bg-brand-orange/40" />
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
            <h3 className="font-heading text-sm uppercase tracking-[0.15em] text-brand-brown">
              {t("contactInfo")}
            </h3>
            <div className="mt-1 mb-4 h-px w-8 bg-brand-orange/40" />
            <div className="flex flex-col gap-2.5 text-[15px] text-brand-brown-m">
              <p>{content.location_text}</p>
              <p>{content.business_info.email}</p>
              <p>{content.business_info.phone}</p>
              <p className="mt-2 font-medium text-brand-brown">{t("openingHoursLabel")}</p>
              {content.opening_hours_lines.length > 0 ? (
                content.opening_hours_lines.map((line) => (
                  <p key={line.day} className="text-sm text-brand-brown-s">
                    {line.label} {line.window}
                  </p>
                ))
              ) : (
                <p className="text-sm text-brand-brown-s">{content.opening_hours_summary}</p>
              )}
            </div>
            <div className="mt-6 flex gap-4 text-sm">
              <FooterLink href="/privacy" label={t("privacy")} />
              <span className="text-brand-brown-s/30">&middot;</span>
              <FooterLink href="/terms" label={t("terms")} />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-brand-warm2/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <p className="text-xs text-brand-brown-s">
            &copy; {year} {content.business_info.name}. {t("rights")}
          </p>
          <p className="text-xs text-brand-brown-s/50">
            {t("madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[15px] text-brand-brown-m transition-colors duration-200 hover:text-brand-orange"
    >
      {label}
    </Link>
  );
}
