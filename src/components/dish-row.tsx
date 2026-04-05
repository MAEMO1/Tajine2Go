"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import type { MenuDish } from "@/types/database";

type Props = {
  dish: MenuDish;
  isActive: boolean;
};

export function DishRow({ dish, isActive }: Props) {
  const t = useTranslations("menu");
  const addItem = useCartStore((s) => s.addItem);

  const canOrder = isActive && !dish.is_soldout;

  return (
    <div className="group relative flex gap-4 border-b border-brand-warm2/70 px-3 py-5 transition-all duration-300 hover:bg-brand-warm/40 hover:px-4 sm:gap-5">
      {/* Warm accent line on hover */}
      <div className="absolute inset-y-0 w-[3px] rounded-full bg-brand-orange opacity-0 transition-opacity duration-300 group-hover:opacity-100 ltr:left-0 rtl:right-0" />

      {/* Image */}
      {dish.image_url ? (
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="112px"
          />
        </div>
      ) : (
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-brand-warm2/40 transition-colors duration-300 group-hover:bg-brand-warm2/60 sm:h-28 sm:w-28">
          <svg className="h-10 w-10 text-brand-orange/25" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M8 36h32M10 36c0-12 4-20 14-20s14 8 14 20" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 16V8" strokeLinecap="round" />
            <circle cx="24" cy="6" r="2" fill="currentColor" stroke="none" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-xl uppercase tracking-[0.08em] text-brand-brown transition-colors duration-200 group-hover:text-brand-brown">
              {dish.name}
            </h3>
            <span className="whitespace-nowrap font-heading text-[26px] leading-none text-brand-orange">
              {formatPrice(dish.price_cents)}
            </span>
          </div>
          {dish.description && (
            <p className="mt-1.5 text-[15px] leading-relaxed text-brand-brown-s line-clamp-2">
              {dish.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {dish.allergens.length > 0 && (
              <span className="text-xs text-brand-brown-s/70">
                {t("allergens")}: {dish.allergens.join(", ")}
              </span>
            )}
            {dish.is_soldout && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-500">
                {t("soldOut")}
              </span>
            )}
            {!dish.is_soldout && dish.portions_remaining !== null && dish.portions_remaining <= 5 && (
              <span className="text-xs font-medium text-brand-orange">
                {t("portionsLeft", { count: dish.portions_remaining })}
              </span>
            )}
          </div>

          {canOrder && (
            <button
              type="button"
              onClick={() =>
                addItem({
                  weekly_menu_id: dish.weekly_menu_id,
                  dish_id: dish.id,
                  name: dish.name,
                  price_cents: dish.price_cents,
                  image_url: dish.image_url,
                })
              }
              className="rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-orange-hover hover:shadow-[0_2px_12px_rgba(217,123,26,0.3)] active:scale-95"
            >
              {t("addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
