import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  DayName,
  DeliveryConfig,
  Locale,
  MenuDish,
  MenuResponse,
  PaymentMethodsConfig,
  PublicOrderConfig,
  SlotMode,
  TakeawayCutoff,
  TakeawayException,
  TakeawaySchedule,
  TakeawayScheduleDay,
  WeeklyMenuWithDish,
} from "@/types/database";

const DAY_NAMES: DayName[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DEFAULT_DELIVERY_CONFIG: DeliveryConfig = {
  enabled: true,
  fee_cents: 0,
  free_delivery_above_cents: 0,
  zip_codes: [],
};

const DEFAULT_PAYMENT_METHODS: PaymentMethodsConfig = {
  online_enabled: true,
  cash_enabled: true,
};

function toIsoDate(value: Date): string {
  return value.toISOString().split("T")[0];
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeSlotMode(value: unknown): SlotMode {
  if (value === "slots" || value === "open" || value === "both") {
    return value;
  }

  return "open";
}

export function normalizeTakeawaySchedule(value: unknown): TakeawaySchedule {
  if (!value || typeof value !== "object" || !("days" in value) || !Array.isArray(value.days)) {
    return { days: [], cutoff: null };
  }

  const days: TakeawayScheduleDay[] = [];
  const seen = new Set<DayName>();

  for (const entry of value.days) {
    if (!entry || typeof entry !== "object" || !("day" in entry)) {
      continue;
    }

    const day = entry.day;
    if (!DAY_NAMES.includes(day as DayName) || seen.has(day as DayName)) {
      continue;
    }

    seen.add(day as DayName);
    days.push({
      day: day as DayName,
      slot_mode: normalizeSlotMode("slot_mode" in entry ? entry.slot_mode : undefined),
      slots:
        "slots" in entry && Array.isArray(entry.slots)
          ? entry.slots.filter(
              (slot: unknown): slot is string => typeof slot === "string" && slot.trim().length > 0,
            )
          : [],
      open_window:
        "open_window" in entry && typeof entry.open_window === "string"
          ? entry.open_window.trim()
          : "",
    });
  }

  const cutoff =
    "cutoff" in value
    && value.cutoff
    && typeof value.cutoff === "object"
    && "hours_before" in value.cutoff
    && Number.isFinite(Number(value.cutoff.hours_before))
      ? { hours_before: Math.max(0, Math.trunc(Number(value.cutoff.hours_before))) }
      : null;

  return { days, cutoff };
}

export function normalizeTakeawayExceptions(value: unknown): TakeawayException[] {
  if (
    !value
    || typeof value !== "object"
    || !("exceptions" in value)
    || !Array.isArray(value.exceptions)
  ) {
    return [];
  }

  const result: TakeawayException[] = [];
  const seen = new Set<string>();

  for (const entry of value.exceptions) {
    if (!entry || typeof entry !== "object" || !("date" in entry)) {
      continue;
    }

    const date = entry.date;
    if (!isIsoDate(date) || seen.has(date as string)) {
      continue;
    }

    seen.add(date as string);
    result.push({
      date: date as string,
      closed: "closed" in entry ? Boolean(entry.closed) : false,
      slot_mode: "slot_mode" in entry ? normalizeSlotMode(entry.slot_mode) : undefined,
      slots:
        "slots" in entry && Array.isArray(entry.slots)
          ? entry.slots.filter(
              (slot: unknown): slot is string => typeof slot === "string" && slot.trim().length > 0,
            )
          : undefined,
      open_window:
        "open_window" in entry && typeof entry.open_window === "string"
          ? entry.open_window.trim()
          : undefined,
    });
  }

  return result;
}

export function normalizeDeliveryConfig(value: unknown): DeliveryConfig {
  if (!value || typeof value !== "object") {
    return DEFAULT_DELIVERY_CONFIG;
  }

  return {
    enabled: "enabled" in value ? Boolean(value.enabled) : DEFAULT_DELIVERY_CONFIG.enabled,
    fee_cents:
      "fee_cents" in value && Number.isFinite(Number(value.fee_cents))
        ? Number(value.fee_cents)
        : DEFAULT_DELIVERY_CONFIG.fee_cents,
    free_delivery_above_cents:
      "free_delivery_above_cents" in value && Number.isFinite(Number(value.free_delivery_above_cents))
        ? Number(value.free_delivery_above_cents)
        : DEFAULT_DELIVERY_CONFIG.free_delivery_above_cents,
    zip_codes:
      "zip_codes" in value && Array.isArray(value.zip_codes)
        ? value.zip_codes.filter(
            (zip: unknown): zip is string => typeof zip === "string" && zip.trim().length > 0,
          )
        : DEFAULT_DELIVERY_CONFIG.zip_codes,
  };
}

export function normalizePaymentMethods(value: unknown): PaymentMethodsConfig {
  if (!value || typeof value !== "object") {
    return DEFAULT_PAYMENT_METHODS;
  }

  const onlineEnabled =
    "online_enabled" in value
      ? Boolean(value.online_enabled)
      : DEFAULT_PAYMENT_METHODS.online_enabled;
  const cashEnabled =
    "cash_enabled" in value
      ? Boolean(value.cash_enabled)
      : DEFAULT_PAYMENT_METHODS.cash_enabled;

  if (!onlineEnabled && !cashEnabled) {
    return DEFAULT_PAYMENT_METHODS;
  }

  return {
    online_enabled: onlineEnabled,
    cash_enabled: cashEnabled,
  };
}

function getDayNameForDate(date: string): DayName {
  const dayIndex = new Date(`${date}T12:00:00`).getDay();
  return DAY_NAMES[dayIndex] ?? "sunday";
}

export function getScheduleForDate(schedule: TakeawaySchedule, date: string): TakeawayScheduleDay | null {
  return schedule.days.find((entry) => entry.day === getDayNameForDate(date)) ?? null;
}

export function getNextTakeawayDate(schedule: TakeawaySchedule, now = new Date()): string {
  const today = new Date(now);
  today.setHours(12, 0, 0, 0);

  if (schedule.days.length === 0) {
    return toIsoDate(today);
  }

  for (let offset = 0; offset < 14; offset += 1) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);

    if (schedule.days.some((entry) => entry.day === DAY_NAMES[candidate.getDay()])) {
      return toIsoDate(candidate);
    }
  }

  return toIsoDate(today);
}

function cutoffAtFor(date: string, cutoff: TakeawayCutoff | null | undefined): Date | null {
  if (!cutoff || cutoff.hours_before <= 0) {
    return null;
  }
  const serviceMidnight = new Date(`${date}T00:00:00`);
  return new Date(serviceMidnight.getTime() - cutoff.hours_before * 3_600_000);
}

// Resolve een kalenderdatum naar een service-dag-config volgens de voorrang
// datum-uitzondering > basis weekpatroon. null = die dag geen service (gesloten / niet gepland).
export function resolveDayForDate(
  schedule: TakeawaySchedule,
  exceptions: TakeawayException[],
  date: string,
): TakeawayScheduleDay | null {
  const exception = exceptions.find((entry) => entry.date === date);

  if (exception) {
    if (exception.closed) {
      return null;
    }
    const base = getScheduleForDate(schedule, date);
    return {
      day: getDayNameForDate(date),
      slot_mode: exception.slot_mode ?? base?.slot_mode ?? "open",
      slots: exception.slots ?? base?.slots ?? [],
      open_window: exception.open_window ?? base?.open_window ?? "",
    };
  }

  return getScheduleForDate(schedule, date);
}

// Eerstvolgende datum waarop besteld kan worden: een service-dag (patroon/uitzondering)
// waarvan de bestel-cutoff nog niet verstreken is. Rolt door tot 60 dagen vooruit.
export function getNextOrderableDate(
  schedule: TakeawaySchedule,
  exceptions: TakeawayException[],
  now = new Date(),
): string {
  const today = new Date(now);
  today.setHours(12, 0, 0, 0);

  for (let offset = 0; offset < 60; offset += 1) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);
    const date = toIsoDate(candidate);

    if (!resolveDayForDate(schedule, exceptions, date)) {
      continue;
    }

    const cutoffAt = cutoffAtFor(date, schedule.cutoff);
    if (cutoffAt && now.getTime() >= cutoffAt.getTime()) {
      continue;
    }

    return date;
  }

  return toIsoDate(today);
}

function getDishName(dish: WeeklyMenuWithDish["dishes"], locale: Locale): string {
  if (!dish) {
    return "";
  }

  const key = `name_${locale}` as keyof typeof dish;
  return (dish[key] as string | null) ?? dish.name_nl;
}

function getDishDescription(dish: WeeklyMenuWithDish["dishes"], locale: Locale): string | null {
  if (!dish) {
    return null;
  }

  const key = `description_${locale}` as keyof typeof dish;
  return (dish[key] as string | null) ?? dish.description_nl;
}

function getDishIngredients(dish: WeeklyMenuWithDish["dishes"], locale: Locale): string[] {
  if (!dish) {
    return [];
  }

  const key = `ingredients_${locale}` as keyof typeof dish;
  const localizedIngredients = dish[key];

  if (Array.isArray(localizedIngredients) && localizedIngredients.length > 0) {
    return localizedIngredients.filter(
      (ingredient): ingredient is string =>
        typeof ingredient === "string" && ingredient.trim().length > 0,
    );
  }

  return dish.ingredients_nl.filter((ingredient) => ingredient.trim().length > 0);
}

export async function resolvePublicOrderConfig(
  options: { date?: string } = {},
): Promise<PublicOrderConfig> {
  const supabase = createAdminClient();

  const [activeRes, scheduleRes, minOrderRes, deliveryRes, paymentMethodsRes, exceptionsRes] =
    await Promise.all([
      supabase.from("settings").select("value").eq("key", "takeaway_active").single(),
      supabase.from("settings").select("value").eq("key", "takeaway_schedule").single(),
      supabase.from("settings").select("value").eq("key", "min_order_cents").single(),
      supabase.from("settings").select("value").eq("key", "delivery_config").single(),
      supabase.from("settings").select("value").eq("key", "payment_methods").single(),
      supabase.from("settings").select("value").eq("key", "takeaway_exceptions").single(),
    ]);

  const schedule = normalizeTakeawaySchedule(scheduleRes.data?.value);
  const exceptions = normalizeTakeawayExceptions(exceptionsRes.data?.value);
  const now = new Date();
  const date = isIsoDate(options.date)
    ? options.date
    : getNextOrderableDate(schedule, exceptions, now);
  const resolvedDay = resolveDayForDate(schedule, exceptions, date);
  const cutoffAt = cutoffAtFor(date, schedule.cutoff);
  const beforeCutoff = !cutoffAt || now.getTime() < cutoffAt.getTime();
  const globallyActive = activeRes.data?.value?.active ?? false;

  return {
    date,
    is_active: globallyActive && !!resolvedDay && beforeCutoff,
    slot_mode: resolvedDay?.slot_mode ?? "open",
    slots: resolvedDay?.slots ?? [],
    open_window: resolvedDay?.open_window ?? "",
    cutoff_at: cutoffAt ? cutoffAt.toISOString() : null,
    min_order_cents: Number(minOrderRes.data?.value?.amount ?? 0) || 0,
    delivery_config: normalizeDeliveryConfig(deliveryRes.data?.value),
    payment_methods: normalizePaymentMethods(paymentMethodsRes.data?.value),
  };
}

export async function fetchMenuData(
  locale: Locale,
  options: { date?: string } = {},
): Promise<MenuResponse> {
  const config = await resolvePublicOrderConfig(options);
  const supabase = createAdminClient();

  const { data: menuItems } = await supabase
    .from("weekly_menu")
    .select("*, dishes(*)")
    .eq("available_date", config.date)
    .eq("dishes.is_active", true)
    .order("created_at");

  const dishes: MenuDish[] = (menuItems ?? [])
    .filter((item: WeeklyMenuWithDish) => item.dishes !== null)
    .map((item: WeeklyMenuWithDish) => ({
      id: item.dishes!.id,
      weekly_menu_id: item.id,
      slug: item.dishes!.slug,
      name: getDishName(item.dishes, locale),
      description: getDishDescription(item.dishes, locale),
      ingredients: getDishIngredients(item.dishes, locale),
      price_cents: item.dishes!.price_cents,
      image_url: item.dishes!.image_url,
      category: item.dishes!.category,
      allergens: item.dishes!.allergens,
      is_soldout: item.is_soldout,
      portions_remaining:
        item.max_portions !== null
          ? Math.max(item.max_portions - item.portions_sold, 0)
          : null,
    }));

  return {
    ...config,
    dishes,
  };
}
