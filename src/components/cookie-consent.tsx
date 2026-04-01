"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const COOKIE_KEY = "tajine2go_consent";

export function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (stored === null) {
      setVisible(true);
    }
  }, []);

  function respond(accepted: boolean) {
    localStorage.setItem(COOKIE_KEY, accepted ? "granted" : "denied");
    setVisible(false);
    if (accepted) {
      window.dispatchEvent(new Event("consent-granted"));
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-warm2 bg-brand-cream p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-brand-brown-m">{t("message")}</p>
        <div className="flex gap-2">
          <button
            onClick={() => respond(false)}
            className="rounded-lg border border-brand-brown-s px-4 py-2 text-sm text-brand-brown-m transition-colors hover:bg-brand-warm"
          >
            {t("decline")}
          </button>
          <button
            onClick={() => respond(true)}
            className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-hover"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
