"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PhoneOrderButton } from "@/components/phone-order-button";

/**
 * Vaste bestelbalk onderaan op mobiel. Verschijnt zodra de hero grotendeels
 * voorbij is, zodat "Bestel nu" altijd binnen duimbereik blijft.
 * Design system: ui_kits/website/Home.jsx → MobileOrderBar.
 */
export function MobileOrderBar() {
  const t = useTranslations("home");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-brand-cream px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-[120%]"
      }`}
    >
      <PhoneOrderButton
        label={t("orderNow")}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-orange-hover px-6 py-3.5 text-[17px] font-bold text-white transition-colors duration-200 hover:bg-brand-orange-deep"
      />
    </div>
  );
}
