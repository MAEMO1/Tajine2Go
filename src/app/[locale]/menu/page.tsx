import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MenuResponse, Locale, WeeklyMenuWithDish } from "@/types/database";
import { MenuContent } from "./menu-content";

function getNextTakeawayDate(schedule: { days: { day: string }[] }): string {
  const dayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };

  const today = new Date();
  const todayDow = today.getDay();

  for (const entry of schedule.days) {
    const targetDow = dayMap[entry.day];
    if (targetDow === undefined) continue;
    let daysUntil = (targetDow - todayDow + 7) % 7;
    if (daysUntil === 0) daysUntil = 0;
    const target = new Date(today);
    target.setDate(today.getDate() + daysUntil);
    return target.toISOString().split("T")[0];
  }

  return today.toISOString().split("T")[0];
}

function getDishName(dish: WeeklyMenuWithDish["dishes"], locale: Locale): string {
  const key = `name_${locale}` as keyof typeof dish;
  return (dish[key] as string | null) ?? dish.name_nl;
}

function getDishDescription(dish: WeeklyMenuWithDish["dishes"], locale: Locale): string | null {
  const key = `description_${locale}` as keyof typeof dish;
  return (dish[key] as string | null) ?? dish.description_nl;
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = createAdminClient();
  const currentLocale = (await getLocale()) as Locale;

  // Load settings
  const [activeRes, scheduleRes] = await Promise.all([
    supabase.from("settings").select("value").eq("key", "takeaway_active").single(),
    supabase.from("settings").select("value").eq("key", "takeaway_schedule").single(),
  ]);

  const isActive = activeRes.data?.value?.active ?? false;
  const schedule = scheduleRes.data?.value as { days: { day: string; slot_mode: string; slots: string[]; open_window: string }[] };
  const date = getNextTakeawayDate(schedule);

  // Load menu
  const { data: menuItems } = await supabase
    .from("weekly_menu")
    .select("*, dishes(*)")
    .eq("available_date", date)
    .eq("dishes.is_active", true)
    .order("created_at");

  const dishes = (menuItems ?? [])
    .filter((item: WeeklyMenuWithDish) => item.dishes !== null)
    .map((item: WeeklyMenuWithDish) => ({
      id: item.dishes.id,
      weekly_menu_id: item.id,
      slug: item.dishes.slug,
      name: getDishName(item.dishes, currentLocale),
      description: getDishDescription(item.dishes, currentLocale),
      price_cents: item.dishes.price_cents,
      image_url: item.dishes.image_url,
      category: item.dishes.category,
      allergens: item.dishes.allergens,
      is_soldout: item.is_soldout,
      portions_remaining:
        item.max_portions !== null
          ? Math.max(item.max_portions - item.portions_sold, 0)
          : null,
    }));

  const menuData: MenuResponse = {
    date,
    is_active: isActive,
    slot_mode: "slots",
    slots: schedule.days[0]?.slots ?? [],
    open_window: schedule.days[0]?.open_window ?? "",
    dishes,
  };

  return <MenuContent menu={menuData} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "menu" });
  return { title: t("title") };
}
