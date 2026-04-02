import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-orange text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <p className="font-heading text-2xl uppercase tracking-[0.08em] text-white">
              Tajine2Go
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-[0.08em] text-white">
              {t("quickLinks")}
            </h3>
            <nav className="mt-3 flex flex-col gap-2">
              <FooterLink href="/menu" label={tNav("menu")} />
              <FooterLink href="/bestellen" label={tNav("order")} />
              <FooterLink href="/catering" label={tNav("catering")} />
              <FooterLink href="/over-ons" label={tNav("about")} />
              <FooterLink href="/faq" label={tNav("faq")} />
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-[0.08em] text-white">
              {t("contactInfo")}
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <p>Gent, België</p>
              <p>info@tajine2go.be</p>
              <p>+32 XXX XX XX XX</p>
              <p className="mt-1 font-medium text-white">{t("openingHours")}</p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-[0.08em] text-white">
              Legal
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <span className="cursor-pointer transition-colors hover:text-white">{t("privacy")}</span>
              <span className="cursor-pointer transition-colors hover:text-white">{t("terms")}</span>
            </div>
            <p className="mt-6 text-xs text-white/60">
              {t("madeWith")}
            </p>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4">
          <p className="text-xs text-white/60">
            &copy; {year} Tajine2Go. {t("rights")}
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
      className="text-sm transition-colors hover:text-white"
    >
      {label}
    </Link>
  );
}
