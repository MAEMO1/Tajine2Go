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
    <div className="flex gap-4 rounded-xl bg-brand-cream p-4 shadow-sm transition-shadow duration-300 hover:shadow-md ltr:border-l-4 rtl:border-r-4 border-brand-orange">
      {/* Image */}
      {dish.image_url ? (
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32">
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      ) : (
        <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-brand-warm2 sm:h-32 sm:w-32">
          <svg className="h-10 w-10 text-brand-orange/40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M8 36h32M10 36c0-12 4-20 14-20s14 8 14 20" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 16V8" strokeLinecap="round" />
            <circle cx="24" cy="6" r="2" fill="currentColor" stroke="none" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg uppercase tracking-[0.08em] text-brand-brown">
              {dish.name}
            </h3>
            <span className="whitespace-nowrap font-heading text-xl text-brand-orange">
              {formatPrice(dish.price_cents)}
            </span>
          </div>
          {dish.description && (
            <p className="mt-1 text-sm leading-relaxed text-brand-brown-m line-clamp-2">
              {dish.description}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {dish.allergens.length > 0 && (
              <span className="text-xs text-brand-brown-s">
                {t("allergens")}: {dish.allergens.join(", ")}
              </span>
            )}
            {dish.is_soldout && (
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
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
              className="rounded-lg bg-brand-orange px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-brand-orange-hover active:scale-95"
            >
              {t("addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
