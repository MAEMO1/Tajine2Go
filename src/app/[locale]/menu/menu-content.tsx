"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DishRow } from "@/components/dish-row";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
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

  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${menu.date}T12:00:00`));

  return (
    <>
      {/* === Page hero band === */}
      <section className="relative overflow-hidden">
        <Khatam
          className="pointer-events-none absolute -top-20 -end-20 h-[320px] w-[320px] text-brand-bronze opacity-[0.05]"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-brand-orange">
              <span className="h-px w-12 bg-brand-orange/60" aria-hidden="true" />
              <span>{tHome("nextService")}</span>
            </div>
          </Reveal>

          <SplitHeading
            as="h1"
            className="mt-6 text-[clamp(40px,6vw,84px)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-brand-brown"
          >
            {t("title")}
          </SplitHeading>

          <Reveal delay={0.25}>
            <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-brand-brown/15 bg-brand-cream px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand-brown">
              {menu.is_active ? (
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
                </span>
              ) : (
                <span
                  className="inline-flex h-2 w-2 rounded-full bg-brand-brown-s"
                  aria-hidden="true"
                />
              )}
              <span className="capitalize">
                {formattedDate}
                {menu.open_window ? ` · ${menu.open_window}` : ""}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* === Sticky category quick-nav === */}
      {sortedCategories.length > 0 && (
        <div className="sticky top-[77px] z-40 border-y border-brand-warm2/60 bg-brand-cream/92 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-1 px-4 py-2.5 md:px-8">
            {sortedCategories.map(([category]) => (
              <button
                key={category}
                type="button"
                onClick={() => scrollToCategory(category)}
                className={`rounded-full px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-brand-orange text-white shadow-[0_2px_8px_rgba(217,123,26,0.25)]"
                    : "text-brand-brown-s hover:bg-brand-warm hover:text-brand-brown"
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
                {/* Category header: mono small-caps bronze + gradient hairline */}
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="whitespace-nowrap font-mono text-sm font-bold uppercase tracking-[0.24em] text-brand-bronze">
                    {t(`categories.${category}` as Parameters<typeof t>[0])}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-brand-warm2 to-transparent rtl:bg-gradient-to-l" />
                  <span className="font-mono text-xs font-bold text-brand-brown-s/70">
                    {String(dishes.length).padStart(2, "0")}
                  </span>
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
