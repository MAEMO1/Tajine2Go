import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
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
              Tajine<span className="text-brand-orange">2Go</span>
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
              <p>Gent, Belgi&euml;</p>
              <p>info@tajine2go.be</p>
              <p>+32 XXX XX XX XX</p>
              <p className="mt-2 font-medium text-brand-brown">{t("openingHours")}</p>
            </div>
            <div className="mt-6 flex gap-4 text-sm">
              <span className="cursor-pointer text-brand-brown-s transition-colors hover:text-brand-orange">{t("privacy")}</span>
              <span className="text-brand-brown-s/30">&middot;</span>
              <span className="cursor-pointer text-brand-brown-s transition-colors hover:text-brand-orange">{t("terms")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-brand-warm2/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <p className="text-xs text-brand-brown-s">
            &copy; {year} Tajine2Go. {t("rights")}
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
