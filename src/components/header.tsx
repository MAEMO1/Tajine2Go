"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { smoothScrollTo } from "@/lib/motion/lenis-store";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  logoUrl?: string | null;
  logoAlt?: string | null;
  brandName?: string;
};

export function Header({ logoUrl, logoAlt, brandName = "Tajine2Go" }: Props) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoSrc = logoUrl || "/brand/logo/Tajine2Go_logo_primary_transparent_640w.png";
  const logoText = logoAlt || brandName;

  const isHomepage = pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Popover sluit bij klik erbuiten of Escape
  useEffect(() => {
    if (!phoneOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!(event.target as HTMLElement).closest("[data-phone-popover]")) {
        setPhoneOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPhoneOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [phoneOpen]);

  const navLinks = [
    { href: "/menu" as const, label: t("menu"), scrollTarget: "#menu" },
    { href: "/catering" as const, label: t("catering"), scrollTarget: null },
    { href: "/over-ons" as const, label: t("about"), scrollTarget: null },
    { href: "/faq" as const, label: t("faq"), scrollTarget: null },
    { href: "/contact" as const, label: t("contact"), scrollTarget: null },
  ];

  function handleScrollOrNavigate(scrollTarget: string | null) {
    if (scrollTarget && isHomepage) {
      const el = document.querySelector<HTMLElement>(scrollTarget);
      if (el) {
        smoothScrollTo(el, -90);
        setMobileOpen(false);
        return true;
      }
    }
    return false;
  }

  return (
    <>
      <header
        className={`z-50 bg-brand-cream transition-all duration-300 ${
          isHomepage ? "fixed inset-x-0 top-0" : "sticky top-0"
        } ${
          isHomepage && !scrolled ? "pointer-events-none -translate-y-full opacity-0" : ""
        } ${
          scrolled
            ? "border-b border-brand-warm2/80 bg-brand-cream/90 shadow-[0_1px_20px_rgba(59,22,6,0.06)] backdrop-blur-md"
            : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">
          <Link href="/" className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
            {/* Mobiel: icon-only merkteken (brand usage guide); desktop: primary horizontal */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl || "/brand/logo/Tajine2Go_icon_128.png"}
              alt={logoText}
              className="h-11 w-auto object-contain md:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={logoText}
              className="hidden h-[72px] w-auto object-contain md:block"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <SmartNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                scrollTarget={link.scrollTarget}
                isHomepage={isHomepage}
                locale={locale}
                onScroll={handleScrollOrNavigate}
              />
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {/* Bestellen gaat telefonisch: desktop toont een popover met beide nummers */}
            <div className="relative hidden md:block" data-phone-popover>
              <button
                type="button"
                onClick={() => setPhoneOpen(!phoneOpen)}
                aria-expanded={phoneOpen}
                aria-haspopup="true"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand-orange-hover px-6 py-2.5 font-display text-base font-semibold text-white shadow-[0_2px_10px_rgba(181,84,15,0.20)] transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-[0_4px_20px_rgba(181,84,15,0.30)] active:scale-[0.98]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.29a1 1 0 01-.45 1.17l-1.4.84a12.04 12.04 0 005.54 5.54l.84-1.4a1 1 0 011.17-.45l3.29 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                </svg>
                <span>{t("order")}</span>
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${phoneOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {phoneOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute end-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-brand-warm2 bg-brand-cream shadow-[0_16px_40px_-12px_rgba(59,22,6,0.3)]"
                  >
                    <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-brown-s">
                      {t("orderByPhone")}
                    </p>
                    <a
                      href="tel:+3293773251"
                      className="flex min-h-11 items-center gap-3 px-4 py-2 transition-colors hover:bg-brand-warm"
                      onClick={() => setPhoneOpen(false)}
                    >
                      <span className="font-display text-lg font-semibold text-brand-brown">09 377 32 51</span>
                    </a>
                    <a
                      href="tel:+32451016144"
                      className="flex min-h-11 items-center gap-3 border-t border-brand-warm2/60 px-4 py-2 transition-colors hover:bg-brand-warm"
                      onClick={() => setPhoneOpen(false)}
                    >
                      <span className="font-display text-lg font-semibold text-brand-brown">0451 01 61 44</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bel-knop voor mobiel */}
            <a
              href="tel:+3293773251"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-brand-brown-m transition-all duration-200 hover:bg-brand-warm hover:text-brand-orange md:hidden"
              aria-label={`${t("order")}: 09 377 32 51`}
            >
              <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.29a1 1 0 01-.45 1.17l-1.4.84a12.04 12.04 0 005.54 5.54l.84-1.4a1 1 0 011.17-.45l3.29 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
              </svg>
            </a>

            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-brand-brown-m transition-colors hover:bg-brand-warm hover:text-brand-brown lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-brand-brown/30 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile nav panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 z-50 flex w-[280px] flex-col border-brand-warm2 bg-brand-cream shadow-[-8px_0_30px_rgba(45,27,10,0.08)] ltr:right-0 ltr:border-l rtl:left-0 rtl:border-r lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display text-xl font-semibold text-brand-brown">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-1.5 text-brand-brown-s transition-colors hover:bg-brand-warm hover:text-brand-brown"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Decorative line */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-brand-warm2 to-transparent" />

            <div className="flex flex-1 flex-col gap-0.5 px-4 py-4">
              {navLinks.map((link, i) => {
                const motionProps = {
                  initial: { opacity: 0, x: 20 } as const,
                  animate: { opacity: 1, x: 0 } as const,
                  transition: { delay: 0.05 + i * 0.04 },
                };

                if (link.scrollTarget && isHomepage) {
                  return (
                    <motion.button
                      key={link.href}
                      {...motionProps}
                      type="button"
                      onClick={() => handleScrollOrNavigate(link.scrollTarget)}
                      className="rounded-lg px-4 py-3 text-start font-display text-lg font-semibold text-brand-brown-m transition-colors hover:bg-brand-warm hover:text-brand-brown"
                    >
                      {link.label}
                    </motion.button>
                  );
                }
                return (
                  <motion.div key={link.href} {...motionProps}>
                    <Link
                      href={link.href}
                      className="block rounded-lg px-4 py-3 font-display text-lg font-semibold text-brand-brown-m transition-colors hover:bg-brand-warm hover:text-brand-brown"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom decorative accent */}
            <div className="px-6 pb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-brand-warm2 to-transparent" />
              <p className="mt-4 text-center font-display text-xs uppercase tracking-[0.2em] text-brand-brown-s/50">
                {brandName}
              </p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/* -- Smart NavLink -- */

function SmartNavLink({
  href,
  label,
  scrollTarget,
  isHomepage,
  locale,
  onScroll,
}: {
  href: string;
  label: string;
  scrollTarget: string | null;
  isHomepage: boolean;
  locale: string;
  onScroll: (target: string | null) => boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClass =
    "relative px-4 py-2 font-display text-[17px] font-semibold transition-all duration-200 after:absolute after:bottom-0.5 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-brand-orange after:transition-all after:duration-300";
  const activeClass = "text-brand-brown after:w-1/2";
  const inactiveClass =
    "text-brand-brown-s hover:text-brand-brown hover:after:w-1/2";

  if (scrollTarget && isHomepage) {
    return (
      <button
        type="button"
        onClick={() => onScroll(scrollTarget)}
        className={`${baseClass} ${inactiveClass}`}
      >
        {label}
      </button>
    );
  }

  if (scrollTarget && !isHomepage) {
    return (
      <a
        href={`/${locale}${scrollTarget}`}
        className={`${baseClass} ${inactiveClass}`}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
    >
      {label}
    </Link>
  );
}
