import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MenuResponse, Locale, WeeklyMenuWithDish } from "@/types/database";

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

export async function fetchMenuData(locale: Locale): Promise<MenuResponse> {
  const supabase = createAdminClient();

  const [activeRes, scheduleRes] = await Promise.all([
    supabase.from("settings").select("value").eq("key", "takeaway_active").single(),
    supabase.from("settings").select("value").eq("key", "takeaway_schedule").single(),
  ]);

  const isActive = activeRes.data?.value?.active ?? false;
  const schedule = scheduleRes.data?.value as {
    days: { day: string; slot_mode: string; slots: string[]; open_window: string }[];
  };
  const date = getNextTakeawayDate(schedule);

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
      name: getDishName(item.dishes, locale),
      description: getDishDescription(item.dishes, locale),
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

  return {
    date,
    is_active: isActive,
    slot_mode: "slots",
    slots: schedule.days[0]?.slots ?? [],
    open_window: schedule.days[0]?.open_window ?? "",
    dishes,
  };
}
