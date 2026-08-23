"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { formatMenuPrice } from "@/lib/format";
import type { MenuDish } from "@/types/database";

type Props = {
  dish: MenuDish;
};

export function DishRow({ dish }: Props) {
  const t = useTranslations("menu");

  return (
    <div className="group relative flex gap-4 px-3 py-3 transition-all duration-300 hover:bg-brand-warm/40 sm:gap-5">
      {/* Warm accent line slides in on hover */}
      <div className="absolute inset-y-3 w-[3px] origin-top scale-y-0 rounded-full bg-brand-orange transition-transform duration-300 group-hover:scale-y-100 left-0" />

      {/* Image */}
      {dish.image_url ? (
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl sm:h-[72px] sm:w-[72px]">
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:rotate-1 group-hover:scale-[1.07]"
            sizes="72px"
          />
        </div>
      ) : (
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange px-1 text-center text-[9px] leading-tight text-brand-cream sm:h-[72px] sm:w-[72px]">
          {t("photoPending")}
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
              className="mb-1 min-w-6 flex-1 border-b-2 border-dotted border-brand-line"
              aria-hidden="true"
            />
            {/* Prijzen in inktkleur, niet in merkoranje: de actiekleur blijft
                voorbehouden aan knoppen en links. Zie CLAUDE.md §5.3. */}
            <span className="whitespace-nowrap text-end text-[17px] font-bold leading-none text-brand-brown sm:text-[19px]">
              {formatMenuPrice(dish.price_cents, dish.price_l_cents)}
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
        </div>
      </div>
    </div>
  );
}
