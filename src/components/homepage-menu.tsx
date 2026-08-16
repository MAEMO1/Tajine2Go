"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useEffect, useCallback } from "react";
import { DishRow } from "@/components/dish-row";
import { Reveal } from "@/components/motion/reveal";
import { smoothScrollTo } from "@/lib/motion/lenis-store";
import type { MenuResponse, MenuDish } from "@/types/database";

type Props = {
  menu: MenuResponse;
  closedMessage?: string | null;
};

const CATEGORY_ORDER = ["tajine", "couscous", "bstilla", "main", "side", "dessert", "sweet", "drink"];

export function HomepageMenu({ menu, closedMessage }: Props) {
  const t = useTranslations("menu");
  const tHome = useTranslations("home");
  const locale = useLocale();
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
      smoothScrollTo(el, -130);
    }
  }

  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${menu.date}T12:00:00`));

  return (
    <section id="menu" className="pb-24">
      {/* Menukaart-kop: gecentreerd, met boog-ornament zoals het drukwerk */}
      <div className="mx-auto max-w-3xl px-4 pt-14 text-center md:px-6 md:pt-20">
        <svg className="mx-auto w-40 text-brand-bronze" viewBox="0 0 200 54" aria-hidden="true">
          <path d="M10,54 Q10,30 40,25 C68,20 82,16 100,4 C118,16 132,20 160,25 Q190,30 190,54" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M22,54 Q22,36 48,31 C72,27 86,22 100,13 C114,22 128,27 152,31 Q178,36 178,54" fill="none" stroke="#F5A400" strokeWidth="1.4" />
        </svg>
        <h2 className="mt-3 font-display text-[clamp(30px,4.5vw,48px)] font-medium leading-tight text-brand-brown">
          {tHome("menuTitle")}
        </h2>
        <p className="mt-2 font-display text-[15px] uppercase tracking-[0.2em] text-brand-bronze">
          {formattedDate}
        </p>
      </div>

      {/* Categorie-navigatie */}
      <div className="sticky top-[64px] z-40 mt-6 border-y border-brand-warm2/60 bg-brand-cream/92 backdrop-blur-md md:top-[93px]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-1 px-4 py-2.5 md:px-6">
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

      {/* Dishes */}
      <div className="mx-auto max-w-3xl px-4 pt-10 md:px-6">
        {!menu.is_active && (
          <div className="mb-6 rounded-2xl bg-brand-warm p-6 text-center text-brand-brown-m">
            {closedMessage ?? tHome("closed")}
          </div>
        )}

        {menu.dishes.length === 0 && (
          <p className="text-center text-brand-brown-s">{t("noItems")}</p>
        )}

        <div className="space-y-12">
          {sortedCategories.map(([category, dishes]) => (
            <div
              key={category}
              data-category={category}
              ref={(el) => {
                if (el) categoryRefs.current.set(category, el);
              }}
            >
              {/* Categoriekop: gecentreerd met ornamenten, zoals de gedrukte kaart */}
              <div className="mb-4 flex items-center justify-center gap-4">
                <span className="text-[11px] text-brand-gold" aria-hidden="true">&#10022;</span>
                <h3 className="whitespace-nowrap font-display text-xl font-semibold uppercase tracking-[0.14em] text-brand-bronze">
                  {t(`categories.${category}` as Parameters<typeof t>[0])}
                </h3>
                <span className="text-[11px] text-brand-gold" aria-hidden="true">&#10022;</span>
              </div>

              <div>
                {dishes.map((dish, index) => (
                  <Reveal key={dish.id} delay={Math.min(index * 0.06, 0.3)}>
                    <DishRow dish={dish} isActive={menu.is_active} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
