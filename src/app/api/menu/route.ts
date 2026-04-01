import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MenuResponse, MenuDish, Locale, WeeklyMenuWithDish } from "@/types/database";

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
    if (daysUntil === 0) daysUntil = 0; // today counts

    const target = new Date(today);
    target.setDate(today.getDate() + daysUntil);
    return target.toISOString().split("T")[0];
  }

  // Fallback: today
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

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const searchParams = request.nextUrl.searchParams;
  const locale = (searchParams.get("locale") ?? "nl") as Locale;

  // Get takeaway_active
  const { data: activeRow } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "takeaway_active")
    .single();

  const isActive = activeRow?.value?.active ?? false;

  // Get schedule
  const { data: scheduleRow } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "takeaway_schedule")
    .single();

  const schedule = scheduleRow?.value as { days: { day: string; slot_mode: string; slots: string[]; open_window: string }[] };

  // Determine date
  let date = searchParams.get("date");
  if (!date) {
    date = getNextTakeawayDate(schedule);
  }

  // Get schedule for this day
  const dateObj = new Date(date + "T00:00:00");
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayName = dayNames[dateObj.getDay()];
  const daySchedule = schedule.days.find((d) => d.day === dayName);

  const slotMode = (daySchedule?.slot_mode ?? "open") as "slots" | "open" | "both";
  const slots = daySchedule?.slots ?? [];
  const openWindow = daySchedule?.open_window ?? "";

  // Get weekly menu items with dishes
  const { data: menuItems, error } = await supabase
    .from("weekly_menu")
    .select("*, dishes(*)")
    .eq("available_date", date)
    .eq("dishes.is_active", true)
    .order("created_at");

  if (error) {
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }

  const dishes: MenuDish[] = (menuItems ?? [])
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

  const response: MenuResponse = {
    date,
    is_active: isActive,
    slot_mode: slotMode,
    slots,
    open_window: openWindow,
    dishes,
  };

  return NextResponse.json(response);
}
