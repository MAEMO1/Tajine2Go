"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DishRow } from "@/components/dish-row";
import { Reveal } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
import { PageHeader } from "@/components/page-header";
import { smoothScrollTo } from "@/lib/motion/lenis-store";
import type { MenuResponse, MenuDish } from "@/types/database";

type Props = {
  menu: MenuResponse;
  closedMessage?: string | null;
};

const CATEGORY_ORDER = ["tajine", "couscous", "bstilla", "main", "side", "dessert", "sweet", "drink"];

export function MenuContent({ menu, closedMessage }: Props) {
  const t = useTranslations("menu");
  const tHome = useTranslations("home");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Group dishes by category
  const categories = new Map<string, MenuDish[]>();
  for (const dish of menu.dishes) {
    const existing = categories.get(dish.category) ?? [];
    existing.push(dish);
    categories.set(dish.category, existing);
  }

  const sortedCategories = [...categories.entries()].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]),
  );

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveCategory(entry.target.getAttribute("data-category") ?? "");
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-130px 0px -60% 0px",
      threshold: 0,
    });

    categoryRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [observerCallback, sortedCategories.length]);

  function scrollToCategory(category: string) {
    const el = categoryRefs.current.get(category);
    if (el) {
      smoothScrollTo(el, -140);
    }
  }

  return (
    <>
      {/* === Menukaart-kop: boog-ornament + serif, zoals het drukwerk === */}
      <PageHeader title={t("title")} />

      {/* === Sticky category quick-nav === */}
      {sortedCategories.length > 0 && (
        <div className="sticky top-[64px] z-40 mt-6 border-y border-brand-warm2/60 bg-brand-cream/92 backdrop-blur-md md:top-[93px]">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-1 px-4 py-2.5 md:px-8">
            {sortedCategories.map(([category]) => (
              <button
                key={category}
                type="button"
                onClick={() => scrollToCategory(category)}
                className={`rounded-full px-4 py-1.5 font-display text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-brand-orange text-white shadow-[0_2px_8px_rgba(199,90,10,0.25)]"
                    : "text-brand-brown-m hover:bg-brand-warm hover:text-brand-brown"
                }`}
              >
                {t(`categories.${category}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === Dishes === */}
      <section className="bg-brand-cream">
        <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 md:px-6">
          {!menu.is_active && (
            <Reveal>
              <div className="mb-8 rounded-[24px] border border-brand-warm2 bg-brand-warm p-6 text-center text-brand-brown-m">
                {closedMessage ?? tHome("closed")}
              </div>
            </Reveal>
          )}

          {menu.dishes.length === 0 && menu.is_active && (
            <Reveal>
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <Khatam className="h-10 w-10 text-brand-brown-s/50" />
                <p className="text-brand-brown-s">{t("noItems")}</p>
              </div>
            </Reveal>
          )}

          <div className="space-y-14">
            {sortedCategories.map(([category, dishes]) => (
              <section
                key={category}
                data-category={category}
                ref={(el) => {
                  if (el) categoryRefs.current.set(category, el);
                }}
                className="scroll-mt-36"
              >
                {/* Categoriekop: gecentreerd met ornamenten, zoals de gedrukte kaart */}
                <div className="mb-4 flex items-center justify-center gap-4">
                  <span className="text-[11px] text-brand-gold" aria-hidden="true">&#10022;</span>
                  <h2 className="whitespace-nowrap font-display text-xl font-semibold uppercase tracking-[0.14em] text-brand-bronze">
                    {t(`categories.${category}` as Parameters<typeof t>[0])}
                  </h2>
                  <span className="text-[11px] text-brand-gold" aria-hidden="true">&#10022;</span>
                </div>

                <div className="space-y-3">
                  {dishes.map((dish, index) => (
                    <Reveal key={dish.id} delay={Math.min(index * 0.06, 0.3)}>
                      <DishRow dish={dish} isActive={menu.is_active} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
