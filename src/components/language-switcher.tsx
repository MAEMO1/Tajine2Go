"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, string> = {
  nl: "NL",
  fr: "FR",
  en: "EN",
  ar: "عربي",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-brand-warm/60 p-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
            loc === locale
              ? "bg-brand-cream text-brand-brown shadow-sm"
              : "text-brand-brown-s hover:text-brand-brown"
          }`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
