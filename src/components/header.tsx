"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useCartStore } from "@/stores/cart";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount);
  const count = itemCount();

  const isHomepage = pathname === "/";

  const navLinks = [
    { href: "/menu" as const, label: t("menu"), scrollTarget: "#menu" },
    { href: "/catering" as const, label: t("catering"), scrollTarget: null },
    { href: "/over-ons" as const, label: t("about"), scrollTarget: null },
    { href: "/faq" as const, label: t("faq"), scrollTarget: null },
    { href: "/contact" as const, label: t("contact"), scrollTarget: null },
  ];

  function handleScrollOrNavigate(scrollTarget: string | null, href: string) {
    if (scrollTarget && isHomepage) {
      const el = document.querySelector(scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
        return true;
      }
    }
    return false;
  }

  return (
    <>
      {/* Layer 1 — Utility bar */}
      <div className="bg-brand-brown text-brand-brown-s">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <span className="text-xs">
            {tCommon("tagline")}
          </span>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Layer 2 — Main navigation */}
      <header className="sticky top-0 z-50 bg-brand-orange shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="Tajine2Go"
              width={48}
              height={48}
              className="h-10 w-auto md:h-12"
            />
            <span className="font-heading text-xl uppercase tracking-[0.08em] text-white md:text-2xl">
              Tajine2Go
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
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

          {/* Right side: cart + mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/bestellen"
              className="relative flex items-center text-white"
              aria-label={t("order")}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {count > 0 && (
                <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-orange">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="text-white lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
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
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 z-50 flex w-72 flex-col bg-brand-orange ltr:right-0 rtl:left-0 lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-heading text-xl uppercase tracking-[0.08em] text-white">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-4">
              {navLinks.map((link) => {
                if (link.scrollTarget && isHomepage) {
                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => handleScrollOrNavigate(link.scrollTarget, link.href)}
                      className="rounded-lg px-3 py-3 text-start font-heading text-lg uppercase tracking-[0.08em] text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {link.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-3 font-heading text-lg uppercase tracking-[0.08em] text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Smart NavLink: scroll on homepage, navigate elsewhere ── */

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
  onScroll: (target: string | null, href: string) => boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // On homepage with scroll target: use button for smooth scroll
  if (scrollTarget && isHomepage) {
    return (
      <button
        type="button"
        onClick={() => onScroll(scrollTarget, href)}
        className="group relative px-3 py-2 font-heading text-sm uppercase tracking-[0.08em] text-white/80 transition-colors hover:text-white"
      >
        {label}
        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-white transition-transform group-hover:scale-x-100" />
      </button>
    );
  }

  // On other pages with scroll target: navigate to homepage with hash
  if (scrollTarget && !isHomepage) {
    return (
      <a
        href={`/${locale}${scrollTarget}`}
        className="group relative px-3 py-2 font-heading text-sm uppercase tracking-[0.08em] text-white/80 transition-colors hover:text-white"
      >
        {label}
        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-white transition-transform group-hover:scale-x-100" />
      </a>
    );
  }

  // Regular link
  return (
    <Link
      href={href}
      className={`group relative px-3 py-2 font-heading text-sm uppercase tracking-[0.08em] transition-colors ${
        isActive ? "text-white" : "text-white/80 hover:text-white"
      }`}
    >
      {label}
      <span
        className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full bg-white transition-transform ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}
