import "server-only";

import { canUsePublicSupabaseFallback, createAdminClient } from "@/lib/supabase/admin";
import type {
  DayName,
  DeliveryConfig,
  Dish,
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

const FALLBACK_TAKEAWAY_SCHEDULE: TakeawaySchedule = {
  days: [
    {
      day: "saturday",
      slot_mode: "slots",
      slots: ["12:00-13:00", "13:00-14:00", "14:00-15:00", "17:00-18:00", "18:00-19:00"],
      open_window: "12:00-19:00",
    },
  ],
  cutoff: null,
};

const FALLBACK_DELIVERY_CONFIG: DeliveryConfig = {
  enabled: true,
  fee_cents: 500,
  free_delivery_above_cents: 5000,
  zip_codes: ["9000", "9030", "9032", "9040", "9041", "9042", "9050", "9051", "9052"],
};

const FALLBACK_TIMESTAMP = "2026-01-01T00:00:00.000Z";

// De echte menukaart (gedrukte kaart, augustus 2026). Namen alleen — geen
// verzonnen beschrijvingen of allergenen; die vult de eigenaar later in de admin aan.
function fallbackDish(
  slug: string,
  names: [nl: string, fr: string, en: string, ar: string],
  category: string,
  priceCents: number,
  priceLCents: number | null = null,
): Dish {
  return {
    id: `fallback-dish-${slug}`,
    slug,
    name_nl: names[0],
    name_fr: names[1],
    name_en: names[2],
    name_ar: names[3],
    description_nl: null,
    description_fr: null,
    description_en: null,
    description_ar: null,
    ingredients_nl: [],
    ingredients_fr: [],
    ingredients_en: [],
    ingredients_ar: [],
    price_cents: priceCents,
    price_l_cents: priceLCents,
    image_url: null,
    category,
    allergens: [],
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
  };
}

const FALLBACK_DISHES: Dish[] = [
  fallbackDish("tajine-royal", ["Tajine Royal (runds)", "Tajine Royale (bœuf)", "Tajine Royal (beef)", "طاجين ملكي (لحم بقري)"], "tajine", 1700, 2200),
  fallbackDish("tajine-kefta", ["Tajine Kefta", "Tajine Kefta", "Kefta tagine", "طاجين كفتة"], "tajine", 1300, 1800),
  fallbackDish("tajine-kip-groenten", ["Tajine Kip en groenten", "Tajine Poulet et légumes", "Chicken & vegetable tagine", "طاجين دجاج بالخضر"], "tajine", 1500, 2000),
  fallbackDish("tajine-veggie", ["Tajine Veggie", "Tajine Végé", "Veggie tagine", "طاجين خضر"], "tajine", 1300, 1800),
  fallbackDish("tajine-kip-olijven-citroen", ["Tajine Kip, olijven en citroen", "Tajine Poulet, olives et citron", "Chicken tagine with olives & lemon", "طاجين دجاج بالزيتون والليمون"], "tajine", 1500, 2000),
  fallbackDish("couscous-kip-merguez", ["Couscous Kip Merguez", "Couscous Poulet Merguez", "Chicken & merguez couscous", "كسكس دجاج وميرغيز"], "couscous", 1700, 2200),
  fallbackDish("couscous-kip", ["Couscous Kip", "Couscous Poulet", "Chicken couscous", "كسكس دجاج"], "couscous", 1500, 2000),
  fallbackDish("couscous-runds", ["Couscous Runds", "Couscous Bœuf", "Beef couscous", "كسكس لحم بقري"], "couscous", 1700, 2200),
  fallbackDish("couscous-veggie", ["Couscous Veggie", "Couscous Végé", "Veggie couscous", "كسكس خضر"], "couscous", 1300, 1800),
  fallbackDish("bstilla-kip", ["Bstilla Kip", "Bstilla Poulet", "Chicken bstilla", "بسطيلة دجاج"], "bstilla", 900),
  fallbackDish("bstilla-vis", ["Bstilla Vis", "Bstilla Poisson", "Fish bstilla", "بسطيلة سمك"], "bstilla", 1200),
  fallbackDish("bstilla-groenten", ["Bstilla Groenten", "Bstilla Légumes", "Vegetable bstilla", "بسطيلة خضر"], "bstilla", 900),
  fallbackDish("harira", ["Harira", "Harira", "Harira", "حريرة"], "bstilla", 500),
  fallbackDish("thee", ["Thee", "Thé", "Mint tea", "أتاي"], "drink", 250),
  fallbackDish("koffie", ["Koffie", "Café", "Coffee", "قهوة"], "drink", 300),
  fallbackDish("frisdranken", ["Frisdranken", "Boissons fraîches", "Soft drinks", "مشروبات غازية"], "drink", 250),
  fallbackDish("thee-koekjes", ["Thee + koekjes", "Thé + biscuits", "Tea + cookies", "أتاي مع حلويات"], "sweet", 550),
  fallbackDish("koekje-pack", ["Koekje pack", "Pack de biscuits", "Cookie pack", "علبة حلويات"], "sweet", 600),
];

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

function cloneDeliveryConfig(config: DeliveryConfig): DeliveryConfig {
  return {
    ...config,
    zip_codes: [...config.zip_codes],
  };
}

function resolveFallbackPublicOrderConfig(
  options: { date?: string } = {},
): PublicOrderConfig {
  const now = new Date();
  const exceptions: TakeawayException[] = [];
  const date = isIsoDate(options.date)
    ? options.date
    : getNextOrderableDate(FALLBACK_TAKEAWAY_SCHEDULE, exceptions, now);
  const resolvedDay = resolveDayForDate(FALLBACK_TAKEAWAY_SCHEDULE, exceptions, date);
  const cutoffAt = cutoffAtFor(date, FALLBACK_TAKEAWAY_SCHEDULE.cutoff);

  return {
    date,
    is_active: false,
    slot_mode: resolvedDay?.slot_mode ?? "open",
    slots: [...(resolvedDay?.slots ?? [])],
    open_window: resolvedDay?.open_window ?? "",
    cutoff_at: cutoffAt ? cutoffAt.toISOString() : null,
    min_order_cents: 2000,
    delivery_config: cloneDeliveryConfig(FALLBACK_DELIVERY_CONFIG),
    payment_methods: { ...DEFAULT_PAYMENT_METHODS },
  };
}

function getFallbackWeeklyMenuItems(date: string): WeeklyMenuWithDish[] {
  return FALLBACK_DISHES.map((dish) => ({
    id: `fallback-weekly-${dish.slug}-${date}`,
    dish_id: dish.id,
    available_date: date,
    max_portions: null,
    portions_sold: 0,
    is_soldout: false,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    dishes: dish,
  }));
}

function mapWeeklyMenuItems(menuItems: WeeklyMenuWithDish[], locale: Locale): MenuDish[] {
  return menuItems
    .filter((item) => item.dishes !== null)
    .map((item) => ({
      id: item.dishes!.id,
      weekly_menu_id: item.id,
      slug: item.dishes!.slug,
      name: getDishName(item.dishes, locale),
      description: getDishDescription(item.dishes, locale),
      ingredients: getDishIngredients(item.dishes, locale),
      price_cents: item.dishes!.price_cents,
      price_l_cents: item.dishes!.price_l_cents ?? null,
      image_url: item.dishes!.image_url,
      category: item.dishes!.category,
      allergens: item.dishes!.allergens,
      is_soldout: item.is_soldout,
      portions_remaining:
        item.max_portions !== null
          ? Math.max(item.max_portions - item.portions_sold, 0)
          : null,
    }));
}

export async function resolvePublicOrderConfig(
  options: { date?: string } = {},
): Promise<PublicOrderConfig> {
  if (canUsePublicSupabaseFallback()) {
    return resolveFallbackPublicOrderConfig(options);
  }

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

  if (canUsePublicSupabaseFallback()) {
    return {
      ...config,
      dishes: mapWeeklyMenuItems(getFallbackWeeklyMenuItems(config.date), locale),
    };
  }

  const supabase = createAdminClient();

  const { data: menuItems } = await supabase
    .from("weekly_menu")
    .select("*, dishes(*)")
    .eq("available_date", config.date)
    .eq("dishes.is_active", true)
    .order("created_at");

  const dishes = mapWeeklyMenuItems((menuItems ?? []) as WeeklyMenuWithDish[], locale);

  return {
    ...config,
    dishes,
  };
}
