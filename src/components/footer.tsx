import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/*
 * Afsluitend merkmoment: één donkere plaat met het woordmerk, zoals het design
 * system het voorschrijft (ui_kits/website/Home.jsx → Footer). Copyright en
 * BTW-nummer staan in de sectie "Praktisch" op de homepagina.
 *
 * Afwijking van het design: de juridische links staan hier in een smalle balk.
 * Het design kent ze niet, maar privacybeleid en voorwaarden moeten vanaf elke
 * pagina bereikbaar blijven.
 */

/* eslint-disable @next/next/no-img-element */

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="section-ember bg-brand-brown px-4 py-14 md:px-6 md:py-16">
      <div className="flex justify-center">
        <img
          src="/brand/logo/tajine2go-wordmark-dark.svg"
          alt="Tajine2Go"
          className="block w-[min(1100px,92vw)]"
        />
      </div>

      <nav className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-brand-cream/50">
        <Link href="/privacy" className="transition-colors hover:text-brand-orange">
          {t("privacy")}
        </Link>
        <Link href="/faq" className="transition-colors hover:text-brand-orange">
          FAQ
        </Link>
        <Link href="/terms" className="transition-colors hover:text-brand-orange">
          {t("terms")}
        </Link>
      </nav>
    </footer>
  );
}
