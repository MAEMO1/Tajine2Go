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
  | "wedding"
  | "aqiqa"
  | "corporate"
  | "funeral"
  | "iftar"
  | "other";

export type DishNameSnapshot = {
  nl: string;
  fr: string | null;
  en: string | null;
  ar: string | null;
};

export type Dish = {
  id: string;
  slug: string;
  name_nl: string;
  name_fr: string | null;
  name_en: string | null;
  name_ar: string | null;
  description_nl: string | null;
  description_fr: string | null;
  description_en: string | null;
  description_ar: string | null;
  price_cents: number;
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
  dishes: Dish;
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

// API response types
export type MenuDish = {
  id: string;
  weekly_menu_id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  category: string;
  allergens: string[];
  is_soldout: boolean;
  portions_remaining: number | null;
};

export type MenuResponse = {
  date: string;
  is_active: boolean;
  slot_mode: "slots" | "open" | "both";
  slots: string[];
  open_window: string;
  dishes: MenuDish[];
};

export type Locale = "nl" | "fr" | "en" | "ar";
