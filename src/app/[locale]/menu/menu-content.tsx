"use client";

import { useTranslations } from "next-intl";
import { DishRow } from "@/components/dish-row";
import { CartDrawer } from "@/components/cart-drawer";
import type { MenuResponse, MenuDish } from "@/types/database";

type Props = {
  menu: MenuResponse;
};

export function MenuContent({ menu }: Props) {
  const t = useTranslations("menu");

  // Group dishes by category
  const categories = new Map<string, MenuDish[]>();
  for (const dish of menu.dishes) {
    const existing = categories.get(dish.category) ?? [];
    existing.push(dish);
    categories.set(dish.category, existing);
  }

  const categoryOrder = ["main", "side", "dessert", "drink"];
  const sortedCategories = [...categories.entries()].sort(
    (a, b) => categoryOrder.indexOf(a[0]) - categoryOrder.indexOf(b[0]),
  );

  const formattedDate = new Date(menu.date).toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-heading text-4xl text-brand-brown">{t("title")}</h1>
      <p className="mt-2 text-brand-brown-m capitalize">{formattedDate}</p>

      {!menu.is_active && (
        <div className="mt-4 rounded-lg bg-brand-warm2 p-4 text-center text-brand-brown-m">
          {t("noItems")}
        </div>
      )}

      {menu.dishes.length === 0 && menu.is_active && (
        <p className="mt-8 text-center text-brand-brown-s">{t("noItems")}</p>
      )}

      <div className="mt-8 space-y-10">
        {sortedCategories.map(([category, dishes]) => (
          <section key={category}>
            <h2 className="mb-4 font-heading text-2xl text-brand-bronze">
              {t(`categories.${category}` as Parameters<typeof t>[0])}
            </h2>
            <div className="space-y-3">
              {dishes.map((dish) => (
                <DishRow key={dish.id} dish={dish} isActive={menu.is_active} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <CartDrawer />
    </div>
  );
}
