"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect, useCallback } from "react";
import { DishRow } from "@/components/dish-row";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { MenuResponse, MenuDish } from "@/types/database";

type Props = {
  menu: MenuResponse;
};

const CATEGORY_ORDER = ["main", "side", "dessert", "drink"];

export function HomepageMenu({ menu }: Props) {
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
      const yOffset = -130;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  const formattedDate = new Date(menu.date).toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (!menu.is_active) {
    return (
      <section id="menu" className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-brand-warm p-8 text-center text-brand-brown-m">
            {tHome("closed")}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="pb-24">
      {/* Sticky category bar */}
      <div className="sticky top-[77px] z-40 border-b border-brand-warm2/60 bg-brand-cream/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-2 px-4 py-3 sm:flex-row sm:items-center md:px-6">
          <div>
            <h2 className="font-heading text-2xl uppercase tracking-[0.12em] text-brand-brown sm:text-3xl">
              {tHome("menuTitle")} <span className="text-brand-orange">{t("title")}</span>
            </h2>
            <p className="text-sm capitalize text-brand-brown-s">{formattedDate}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {sortedCategories.map(([category]) => (
              <button
                key={category}
                type="button"
                onClick={() => scrollToCategory(category)}
                className={`rounded-full px-4 py-1.5 font-heading text-sm uppercase tracking-[0.12em] transition-all duration-250 ${
                  activeCategory === category
                    ? "bg-brand-orange text-white shadow-[0_2px_8px_rgba(217,123,26,0.2)]"
                    : "text-brand-brown-s hover:bg-brand-warm hover:text-brand-brown"
                }`}
              >
                {t(`categories.${category}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dishes */}
      <div className="mx-auto max-w-3xl px-4 pt-10 md:px-6">
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
              {/* Category header with decorative line */}
              <div className="mb-3 flex items-center gap-3">
                <h3 className="whitespace-nowrap font-heading text-xl uppercase tracking-[0.15em] text-brand-bronze">
                  {t(`categories.${category}` as Parameters<typeof t>[0])}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-warm2 to-transparent" />
              </div>

              <div>
                {dishes.map((dish, index) => (
                  <ScrollReveal key={dish.id} delay={index * 0.05}>
                    <DishRow dish={dish} isActive={menu.is_active} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
