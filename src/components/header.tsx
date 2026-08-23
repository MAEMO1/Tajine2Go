"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { smoothScrollTo } from "@/lib/motion/lenis-store";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ORDER_PHONE_NUMBERS } from "@/lib/phone";

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
  // De header staat op brand-cream, dus de espressovariant. De volle-kleurversie
  // heeft een woordmerk in papierkleur en verdwijnt op licht (contrast 2,02
  // tegen 7,29 op donker). Zie CLAUDE.md §5.5.
  const logoSrc = logoUrl || "/brand/logo/tajine2go-horizontal-light.svg";
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

  // De site is een one-pager: alles behalve contact leeft als ankersectie op
  // de homepagina. Zie het design system, ui_kits/website/SiteNav.jsx.
  const navLinks = [
    { key: "menu", href: "/" as const, label: t("menu"), scrollTarget: "#menu" },
    { key: "about", href: "/" as const, label: t("about"), scrollTarget: "#verhaal" },
    { key: "catering", href: "/" as const, label: t("catering"), scrollTarget: "#catering" },
    { key: "access", href: "/" as const, label: t("access"), scrollTarget: "#bereikbaarheid" },
    { key: "practical", href: "/" as const, label: t("practical"), scrollTarget: "#praktisch" },
    { key: "contact", href: "/contact" as const, label: t("contact"), scrollTarget: null },
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
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 md:h-[76px] md:px-6">
          <Link href="/" className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
            {/* Horizontale lichte-ondergrondvariant, 34px mobiel en 46px desktop —
                zoals ui_kits/website/SiteNav.jsx. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={logoText}
              className="h-[34px] w-auto object-contain md:h-[46px]"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 min-[1200px]:flex">
            {navLinks.map((link) => (
              <SmartNavLink
                key={link.key}
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

            {/* Bestellen gaat telefonisch: knop toont een popover met beide nummers */}
            <div className="relative" data-phone-popover>
              {/* Desktop: tekstknop */}
              <button
                type="button"
                onClick={() => setPhoneOpen(!phoneOpen)}
                aria-expanded={phoneOpen}
                aria-haspopup="true"
                className="hidden min-h-11 items-center gap-2 rounded-md bg-brand-orange-hover px-6 py-2.5 font-display text-base font-semibold text-white shadow-[0_2px_10px_rgba(181,84,15,0.20)] transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-[0_4px_20px_rgba(181,84,15,0.30)] active:scale-[0.98] md:inline-flex"
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

              {/* Mobiel: icoonknop, zelfde popover (klant kiest welk nummer) */}
              <button
                type="button"
                onClick={() => setPhoneOpen(!phoneOpen)}
                aria-expanded={phoneOpen}
                aria-haspopup="true"
                aria-label={t("orderByPhone")}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-brand-brown-m transition-all duration-200 hover:bg-brand-warm hover:text-brand-orange md:hidden"
              >
                <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.29a1 1 0 01-.45 1.17l-1.4.84a12.04 12.04 0 005.54 5.54l.84-1.4a1 1 0 011.17-.45l3.29 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
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
                    {ORDER_PHONE_NUMBERS.map((phone, index) => (
                      <a
                        key={phone.tel}
                        href={`tel:${phone.tel}`}
                        className={`flex min-h-11 items-center gap-3 px-4 py-2 transition-colors hover:bg-brand-warm ${
                          index > 0 ? "border-t border-brand-warm2/60" : ""
                        }`}
                        onClick={() => setPhoneOpen(false)}
                      >
                        <span className="text-base font-semibold text-brand-brown">{phone.display}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-brand-brown-m transition-colors hover:bg-brand-warm hover:text-brand-brown min-[1200px]:hidden"
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
            className="fixed inset-0 z-40 bg-brand-brown/30 backdrop-blur-[2px] min-[1200px]:hidden"
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
            className="fixed inset-y-0 z-50 flex w-[280px] flex-col border-brand-warm2 bg-brand-cream shadow-[-8px_0_30px_rgba(45,27,10,0.08)] right-0 border-l min-[1200px]:hidden"
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
                      key={link.key}
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
                  <motion.div key={link.key} {...motionProps}>
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
              {/* Woordmerk in espresso — leesbaar op de papierkleurige lade. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo/tajine2go-wordmark-mono-espresso.svg"
                alt={brandName}
                className="mx-auto mt-5 block w-[150px] opacity-70"
              />
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
