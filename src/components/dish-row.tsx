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
    <div className="group relative flex gap-4 border-b border-brand-warm2/70 px-3 py-5 transition-all duration-300 hover:bg-brand-warm/40 sm:gap-5">
      {/* Warm accent line slides in on hover */}
      <div className="absolute inset-y-3 w-[3px] origin-top scale-y-0 rounded-full bg-brand-orange transition-transform duration-300 group-hover:scale-y-100 left-0" />

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
            <PlaceholderIcon category={dish.category} />
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
            <span className="whitespace-nowrap text-end text-[17px] font-bold leading-none text-brand-orange transition-colors duration-300 group-hover:text-brand-orange-hover sm:text-[19px]">
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
        </div>
      </div>
    </div>
  );
}

// Placeholder-icoon per categorie, tot er echte foodfoto's zijn.
function PlaceholderIcon({ category }: { category: string }) {
  switch (category) {
    case "couscous":
      // Kom met een berg couscous
      return (
        <>
          <path d="M8 30h32M10 30c0 6 6 10 14 10s14-4 14-10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 30c1-8 5-13 11-13s10 5 11 13" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="24" r="1" fill="currentColor" stroke="none" />
          <circle cx="25" cy="21" r="1" fill="currentColor" stroke="none" />
          <circle cx="28" cy="26" r="1" fill="currentColor" stroke="none" />
        </>
      );
    case "bstilla":
      // Ronde bstilla van bovenaf
      return (
        <>
          <circle cx="24" cy="24" r="14" />
          <circle cx="24" cy="24" r="8" strokeDasharray="3 3.5" />
          <circle cx="24" cy="24" r="1.2" fill="currentColor" stroke="none" />
        </>
      );
    case "drink":
      // Marokkaans theeglas met stoom
      return (
        <>
          <path d="M16 18l2 20h12l2-20z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 24h14" strokeLinecap="round" />
          <path d="M21 12c0-2 2-2 2-4M27 12c0-2 2-2 2-4" strokeLinecap="round" />
        </>
      );
    case "sweet":
      // Koekje
      return (
        <>
          <circle cx="24" cy="25" r="13" />
          <circle cx="19" cy="21" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="28" cy="22" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="22" cy="29" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="29" cy="29" r="1.4" fill="currentColor" stroke="none" />
        </>
      );
    default:
      // Tajine
      return (
        <>
          <path d="M8 36h32M10 36c0-12 4-20 14-20s14 8 14 20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 16V8" strokeLinecap="round" />
          <circle cx="24" cy="6" r="2" fill="currentColor" stroke="none" />
        </>
      );
  }
}
