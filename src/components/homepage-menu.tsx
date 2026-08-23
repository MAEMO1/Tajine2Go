"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect, useCallback } from "react";
import { DishRow } from "@/components/dish-row";
import { OrnamentMark } from "@/components/ornament";
import { ORDER_PHONE_NUMBERS } from "@/lib/phone";
import { Reveal } from "@/components/motion/reveal";
import { smoothScrollTo } from "@/lib/motion/lenis-store";
import type { MenuResponse, MenuDish } from "@/types/database";

type Props = {
  menu: MenuResponse;
  closedMessage?: string | null;
};

const CATEGORY_ORDER = ["tajine", "couscous", "stoofpotje", "bstilla", "main", "side", "dessert", "sweet", "drink"];

export function HomepageMenu({ menu, closedMessage }: Props) {
  const t = useTranslations("menu");
  const tHome = useTranslations("home");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const categoryRefs = useRef<Map<string, HTMLElement>>(new Map());

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
      rootMargin: "-120px 0px -60% 0px",
      threshold: 0,
    });

    categoryRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [observerCallback, sortedCategories.length]);

  function scrollToCategory(category: string) {
    const el = categoryRefs.current.get(category);
    if (el) {
      smoothScrollTo(el, -150);
    }
  }

  return (
    <section id="menu" className="scroll-mt-32 pb-20 md:pb-24">
      <div className="mx-auto max-w-[860px] px-4 pt-14 text-center md:px-6 md:pt-20">
        <p className="type-h3">{tHome("menuEyebrow")}</p>
      </div>

      {/* Categorie-navigatie: serif-variant uit het design system.
          Ruitjes als scheidingsteken, actiekleur markeert de zichtbare sectie. */}
      <div className="sticky top-[60px] z-20 mt-5 border-b border-brand-line bg-brand-cream md:top-[76px]">
        <div className="mx-auto flex max-w-[860px] items-center overflow-x-auto px-4 py-2 [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible md:px-6">
          {sortedCategories.map(([category], index) => (
            <span key={category} className="flex flex-none items-center">
              {index > 0 && (
                <i
                  className="h-1 w-1 flex-none rotate-45 bg-brand-bronze/50"
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={() => scrollToCategory(category)}
                className={`flex-none whitespace-nowrap px-3 py-1.5 font-display text-lg transition-colors duration-200 md:px-4 md:text-[22px] ${
                  activeCategory === category
                    ? "text-brand-orange-hover"
                    : "text-brand-brown hover:text-brand-orange-hover"
                }`}
              >
                {t(`categories.${category}` as Parameters<typeof t>[0])}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Gerechten */}
      <div className="mx-auto max-w-[860px] px-4 pt-8 md:px-6">
        {!menu.is_active && (
          <div className="mb-6 rounded-2xl bg-brand-warm p-6 text-center text-brand-brown-m">
            {closedMessage ??
              tHome("closed", {
                phone1: ORDER_PHONE_NUMBERS[0].display,
                phone2: ORDER_PHONE_NUMBERS[1].display,
              })}
          </div>
        )}

        {menu.dishes.length === 0 && (
          <p className="text-center text-brand-brown-s">{t("noItems")}</p>
        )}

        <div className="space-y-12">
          {sortedCategories.map(([category, dishes]) => {
            const hasLargeSize = dishes.some((dish) => dish.price_l_cents !== null);
            return (
              <div
                key={category}
                data-category={category}
                className="scroll-mt-[150px]"
                ref={(el) => {
                  if (el) categoryRefs.current.set(category, el);
                }}
              >
                {/* Categoriekop: gecentreerd met het merkornament eronder,
                    portiemaat rechts uitgelijnd — zoals de gedrukte kaart. */}
                <div className="relative mb-4 text-center">
                  <div className="inline-block">
                    <h3 className="font-display text-[clamp(24px,5vw,28px)] font-medium text-brand-brown">
                      {t(`categories.${category}` as Parameters<typeof t>[0])}
                    </h3>
                    <OrnamentMark className="mt-1" />
                  </div>
                  {hasLargeSize && (
                    <span className="absolute bottom-0 end-0 whitespace-nowrap text-xs font-semibold tracking-[0.06em] text-brand-bronze">
                      M &middot; L
                    </span>
                  )}
                </div>

                <div>
                  {dishes.map((dish, index) => (
                    <Reveal key={dish.id} delay={Math.min(index * 0.06, 0.3)}>
                      <DishRow dish={dish} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
