"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCartStore } from "@/stores/cart";
import { formatMenuPrice } from "@/lib/format";
import { flyToCart } from "@/lib/motion/fly-to-cart";
import type { MenuDish } from "@/types/database";

type Props = {
  dish: MenuDish;
  isActive: boolean;
};

export function DishRow({ dish, isActive }: Props) {
  const t = useTranslations("menu");
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  function handleAdd() {
    addItem({
      weekly_menu_id: dish.weekly_menu_id,
      dish_id: dish.id,
      name: dish.name,
      price_cents: dish.price_cents,
      image_url: dish.image_url,
    });
    if (addButtonRef.current) {
      flyToCart(addButtonRef.current);
    }
    setJustAdded(true);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setJustAdded(false), 1400);
  }

  const canOrder = isActive && !dish.is_soldout;

  return (
    <div className="group relative flex gap-4 border-b border-brand-warm2/70 px-3 py-5 transition-all duration-300 hover:bg-brand-warm/40 sm:gap-5">
      {/* Warm accent line slides in on hover */}
      <div className="absolute inset-y-3 w-[3px] origin-top scale-y-0 rounded-full bg-brand-orange transition-transform duration-300 group-hover:scale-y-100 ltr:left-0 rtl:right-0" />

      {/* Image */}
      {dish.image_url ? (
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:rotate-1 group-hover:scale-[1.07]"
            sizes="112px"
          />
        </div>
      ) : (
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-brand-warm2/40 transition-colors duration-300 group-hover:bg-brand-warm2/60 sm:h-28 sm:w-28">
          <svg
            className="h-10 w-10 text-brand-orange/25 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              d="M8 36h32M10 36c0-12 4-20 14-20s14 8 14 20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M24 16V8" strokeLinecap="round" />
            <circle cx="24" cy="6" r="2" fill="currentColor" stroke="none" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          {/* Menukaart-rij: naam, puntjeslijn, prijs — zoals het drukwerk */}
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-xl font-semibold text-brand-brown sm:text-[22px]">
              {dish.name}
            </h3>
            <span
              className="mb-1 min-w-6 flex-1 border-b-2 border-dotted border-brand-brown-s/40"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap text-end font-display text-[21px] font-semibold leading-none text-brand-orange transition-colors duration-300 group-hover:text-brand-orange-hover sm:text-[23px]">
              {formatMenuPrice(dish.price_cents, dish.price_l_cents)}
              {dish.price_l_cents !== null && (
                <span className="mt-1 block font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-brown-s">
                  M / L
                </span>
              )}
            </span>
          </div>
          {dish.description && (
            <p className="mt-1.5 text-[15px] leading-relaxed text-brand-brown-s line-clamp-2">
              {dish.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            {dish.ingredients.length > 0 && (
              <p className="text-xs leading-relaxed text-brand-brown-s/80 line-clamp-2">
                {t("ingredients")}: {dish.ingredients.join(", ")}
              </p>
            )}
            {dish.allergens.length > 0 && (
              <p className="text-xs leading-relaxed text-brand-brown-s/70 line-clamp-2">
                {t("allergens")}: {dish.allergens.join(", ")}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {dish.is_soldout && (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-500">
                  {t("soldOut")}
                </span>
              )}
              {!dish.is_soldout &&
                dish.portions_remaining !== null &&
                dish.portions_remaining <= 5 && (
                  <span className="text-xs font-medium text-brand-orange">
                    {t("portionsLeft", { count: dish.portions_remaining })}
                  </span>
                )}
            </div>
          </div>

          {canOrder && (
            <div className="flex flex-col items-end gap-1">
              <button
                ref={addButtonRef}
                type="button"
                onClick={handleAdd}
                className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300 active:scale-90 ${
                  justAdded
                    ? "bg-brand-bronze"
                    : "bg-brand-orange hover:scale-105 hover:bg-brand-orange-deep hover:shadow-[0_4px_16px_rgba(181,84,15,0.4)]"
                }`}
              >
                {justAdded ? `✓ ${t("added")}` : t("addToCart")}
              </button>
              <span className="sr-only" role="status" aria-live="polite">
                {justAdded ? `${dish.name} — ${t("added")}` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
