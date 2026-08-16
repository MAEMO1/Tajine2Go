"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";

// Bestellen gaat telefonisch: één knop die een popover met beide nummers opent.
// Wordt gebruikt in de hero; de header heeft (nog) zijn eigen variant.
export function PhoneOrderButton({ label, className }: { label: string; className: string }) {
  const t = useTranslations("nav");
  const tHome = useTranslations("home");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={className}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.29a1 1 0 01-.45 1.17l-1.4.84a12.04 12.04 0 005.54 5.54l.84-1.4a1 1 0 011.17-.45l3.29 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
        </svg>
        <span>{label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 overflow-hidden rounded-xl border border-brand-warm2 bg-brand-cream text-start shadow-[0_16px_40px_-12px_rgba(59,22,6,0.3)]"
          >
            <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-brown-s">
              {t("orderByPhone")}
            </p>
            <a
              href="tel:+3293773251"
              className="flex min-h-11 items-center px-4 py-2 transition-colors hover:bg-brand-warm"
              onClick={() => setOpen(false)}
            >
              <span className="font-display text-lg font-semibold text-brand-brown">09 377 32 51</span>
            </a>
            <a
              href="tel:+32451016144"
              className="flex min-h-11 items-center border-t border-brand-warm2/60 px-4 py-2 transition-colors hover:bg-brand-warm"
              onClick={() => setOpen(false)}
            >
              <span className="font-display text-lg font-semibold text-brand-brown">0451 01 61 44</span>
            </a>
            <a
              href="#menu"
              className="flex min-h-11 items-center gap-2 border-t border-brand-warm2/60 bg-brand-warm/50 px-4 py-2 transition-colors hover:bg-brand-warm"
              onClick={() => setOpen(false)}
            >
              <span className="font-display text-base font-semibold text-brand-brown-m">{tHome("viewMenu")}</span>
              <svg className="h-3.5 w-3.5 text-brand-brown-m rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
