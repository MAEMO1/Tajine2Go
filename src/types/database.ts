// Database types matching the Supabase schema

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type FulfillmentType = "pickup" | "delivery";

export type PaymentMethod = "online" | "cash";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type CateringStatus =
  | "new"
  | "in_contact"
  | "quote_sent"
  | "confirmed"
  | "completed"
  | "cancelled";

export type EventType =
  | "party"
  | "event"
  | "reception"
  | "other";

export type DayName =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type SlotMode = "slots" | "open" | "both";

export type DishNameSnapshot = {
  nl: string;
  fr: string | null;
  en: string | null;
};

export type Dish = {
  id: string;
  slug: string;
  name_nl: string;
  name_fr: string | null;
  name_en: string | null;
  description_nl: string | null;
  description_fr: string | null;
  description_en: string | null;
  ingredients_nl: string[];
  ingredients_fr: string[];
  ingredients_en: string[];
  price_cents: number;
  price_l_cents: number | null;
  image_url: string | null;
  category: string;
  allergens: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type WeeklyMenu = {
  id: string;
  dish_id: string;
  available_date: string;
  max_portions: number | null;
  portions_sold: number;
  is_soldout: boolean;
  created_at: string;
  updated_at: string;
};

export type WeeklyMenuWithDish = WeeklyMenu & {
  dishes: Dish | null;
};

export type Customer = {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  phone: string | null;
  first_name: string;
  last_name: string;
  address_street: string | null;
  address_city: string | null;
  address_zip: string | null;
  company_name: string | null;
  vat_number: string | null;
  tags: string[];
  notes: string | null;
  is_vip: boolean;
  is_blocked: boolean;
  blocked_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  order_number: number;
  customer_id: string | null;
  status: OrderStatus;
  fulfillment: FulfillmentType;
  pickup_slot: string | null;
  delivery_address_line1: string | null;
  delivery_postal_code: string | null;
  delivery_city: string | null;
  delivery_country_code: string | null;
  delivery_fee_cents: number;
  subtotal_cents: number;
  total_cents: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  mollie_payment_id: string | null;
  mollie_refund_id: string | null;
  refund_amount_cents: number | null;
  refund_reason: string | null;
  notes: string | null;
  order_date: string;
  payment_expires_at: string | null;
  stock_reserved_until: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  public_status_token_hash: string;
  invoice_requested: boolean;
  invoice_company_name: string | null;
  invoice_vat_number: string | null;
  invoice_address_line1: string | null;
  invoice_postal_code: string | null;
  invoice_city: string | null;
  invoice_country_code: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  weekly_menu_id: string;
  dish_id: string;
  dish_name_snapshot: DishNameSnapshot;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

export type Invoice = {
  id: string;
  invoice_number: number;
  order_id: string;
  customer_id: string | null;
  billing_name: string;
  company_name: string;
  vat_number: string;
  billing_address_line1: string;
  billing_postal_code: string;
  billing_city: string;
  billing_country_code: string;
  subtotal_cents: number;
  vat_rate: number;
  vat_cents: number;
  total_cents: number;
  pdf_url: string | null;
  created_at: string;
};

export type CateringRequest = {
  id: string;
  customer_id: string | null;
  status: CateringStatus;
  event_type: EventType;
  event_date: string | null;
  guest_count: number | null;
  budget_cents: number | null;
  dietary_needs: string | null;
  message: string | null;
  admin_notes: string | null;
  fulfillment: FulfillmentType | null;
  delivery_address: string | null;
  quoted_amount_cents: number | null;
  created_at: string;
  updated_at: string;
};

export type CateringQuote = {
  id: string;
  request_id: string;
  quote_number: number;
  items: unknown;
  subtotal_cents: number;
  vat_cents: number;
  total_cents: number;
  vat_rate: number;
  terms: string | null;
  valid_until: string | null;
  notes: string | null;
  pdf_url: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationLog = {
  id: string;
  type: string;
  recipient: string;
  channel: string;
  reference_id: string | null;
  status: string;
  created_at: string;
};

export type Settings = {
  key: string;
  value: unknown;
  updated_at: string;
};

export type TakeawayScheduleDay = {
  day: DayName;
  slot_mode: SlotMode;
  slots: string[];
  open_window: string;
};

// Bestel-cutoff: aantal uren vóór de service-dag (00:00) waarop bestellen sluit.
// 0 of null = geen cutoff (bestellen blijft open tot de service-dag zelf). Zie docs/adr/0001.
export type TakeawayCutoff = {
  hours_before: number;
};

export type TakeawaySchedule = {
  days: TakeawayScheduleDay[];
  cutoff?: TakeawayCutoff | null;
};

// Datum-uitzondering: overschrijft het basis weekpatroon voor één kalenderdatum.
// closed=true → die dag gesloten. Anders open met (optioneel) eigen uren.
export type TakeawayException = {
  date: string;
  closed: boolean;
  slot_mode?: SlotMode;
  slots?: string[];
  open_window?: string;
};

export type TakeawayExceptions = {
  exceptions: TakeawayException[];
};

export type DeliveryConfig = {
  enabled: boolean;
  fee_cents: number;
  free_delivery_above_cents: number;
  zip_codes: string[];
};

export type PaymentMethodsConfig = {
  online_enabled: boolean;
  cash_enabled: boolean;
};

export type PublicOrderConfig = {
  date: string;
  is_active: boolean;
  slot_mode: SlotMode;
  slots: string[];
  open_window: string;
  cutoff_at: string | null;
  min_order_cents: number;
  delivery_config: DeliveryConfig;
  payment_methods: PaymentMethodsConfig;
};

export type BusinessInfo = {
  name: string;
  legal_name: string;
  email: string;
  phone: string;
  address_line: string;
  address_locality: string;
  address_country: string;
  vat_number: string;
  bank_account: string;
  serves_cuisine: string[];
  price_range: string;
  payment_copy: string;
};

export type WebsiteHomeText = {
  hero_subtitle: string;
  story_text: string;
  catering_cta_title: string;
  catering_cta_text: string;
};

export type WebsiteNotices = {
  homepage_banner: string | null;
  closed_message: string | null;
  checkout_notice: string | null;
};

export type WebsiteAboutText = {
  body_paragraphs: string[];
};

export type WebsiteCateringText = {
  subtitle: string;
  notice: string | null;
};

export type WebsiteLocaleTexts = {
  home: WebsiteHomeText;
  notices: WebsiteNotices;
  about: WebsiteAboutText;
  catering: WebsiteCateringText;
};

export type WebsiteLocaleTextInput = {
  home?: Partial<WebsiteHomeText>;
  notices?: Partial<WebsiteNotices>;
  about?: {
    body_paragraphs?: string[];
  };
  catering?: Partial<WebsiteCateringText>;
};

export type WebsiteTexts = Partial<Record<Locale, WebsiteLocaleTextInput>>;

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

export type BrandAssets = {
  header_logo_url: string | null;
  logo_alt: string | null;
};

export type LegalPageContent = {
  title: string;
  body_paragraphs: string[];
};

export type LegalPages = {
  privacy: LegalPageContent;
  terms: LegalPageContent;
};

export type LegalPageContentInput = {
  title?: string;
  body_paragraphs?: string[];
};

export type LegalPagesInput = Partial<
  Record<
    Locale,
    {
      privacy?: LegalPageContentInput;
      terms?: LegalPageContentInput;
    }
  >
>;

export type OpeningHoursLine = {
  day: DayName;
  label: string;
  window: string;
};

export type OpeningHoursSpecification = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string;
  opens: string;
  closes: string;
};

export type LocalizedSiteContent = {
  business_info: BusinessInfo;
  website_texts: WebsiteLocaleTexts;
  faq_entries: FaqEntry[];
  brand_assets: BrandAssets;
  legal_pages: LegalPages;
  opening_hours_lines: OpeningHoursLine[];
  opening_hours_summary: string;
  location_text: string;
  opening_hours_specification: OpeningHoursSpecification[];
};

export type AdminContentSettings = {
  business_info: BusinessInfo;
  website_texts: Record<Locale, WebsiteLocaleTexts>;
  faq_entries: Record<Locale, FaqEntry[]>;
  brand_assets: BrandAssets;
  legal_pages: Record<Locale, LegalPages>;
};

export type DishImageUploadResponse = {
  url: string;
  path: string;
};

// API response types
export type MenuDish = {
  id: string;
  weekly_menu_id: string;
  slug: string;
  name: string;
  description: string | null;
  ingredients: string[];
  price_cents: number;
  price_l_cents: number | null;
  image_url: string | null;
  category: string;
  allergens: string[];
  is_soldout: boolean;
  portions_remaining: number | null;
};

export type MenuResponse = PublicOrderConfig & {
  dishes: MenuDish[];
};

export type PublicOrderStatus = {
  order_number: number;
  status: string;
  fulfillment: string;
  pickup_slot: string | null;
  total_cents: number;
};

export type Locale = "nl" | "fr" | "en";
