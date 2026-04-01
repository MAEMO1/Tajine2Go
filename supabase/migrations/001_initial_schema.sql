-- ============================================================
-- Tajine2Go – Initial Schema
-- ============================================================

-- 1. ENUMS
-- ------------------------------------------------------------
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'preparing', 'ready',
  'out_for_delivery', 'completed', 'cancelled'
);

CREATE TYPE fulfillment_type AS ENUM ('pickup', 'delivery');

CREATE TYPE payment_method AS ENUM ('online', 'cash');

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TYPE catering_status AS ENUM (
  'new', 'in_contact', 'quote_sent', 'confirmed', 'completed', 'cancelled'
);

CREATE TYPE event_type AS ENUM (
  'wedding', 'aqiqa', 'corporate', 'funeral', 'iftar', 'other'
);


-- 2. TABLES
-- ------------------------------------------------------------

-- dishes
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_nl TEXT NOT NULL,
  name_fr TEXT,
  name_en TEXT,
  name_ar TEXT,
  description_nl TEXT,
  description_fr TEXT,
  description_en TEXT,
  description_ar TEXT,
  price_cents INTEGER NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'main',
  allergens TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- weekly_menu
CREATE TABLE weekly_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  available_date DATE NOT NULL,
  max_portions INTEGER,
  portions_sold INTEGER NOT NULL DEFAULT 0,
  is_soldout BOOLEAN GENERATED ALWAYS AS (
    CASE WHEN max_portions IS NOT NULL THEN portions_sold >= max_portions ELSE false END
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(dish_id, available_date)
);

-- customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email TEXT UNIQUE,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address_street TEXT,
  address_city TEXT DEFAULT 'Gent',
  address_zip TEXT,
  company_name TEXT,
  vat_number TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  is_vip BOOLEAN NOT NULL DEFAULT false,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  blocked_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL UNIQUE,
  customer_id UUID REFERENCES customers(id),
  status order_status NOT NULL DEFAULT 'pending',
  fulfillment fulfillment_type NOT NULL,
  pickup_slot TEXT,
  delivery_address_line1 TEXT,
  delivery_postal_code TEXT,
  delivery_city TEXT,
  delivery_country_code TEXT DEFAULT 'BE',
  delivery_fee_cents INTEGER NOT NULL DEFAULT 0,
  subtotal_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  mollie_payment_id TEXT,
  mollie_refund_id TEXT,
  refund_amount_cents INTEGER,
  refund_reason TEXT,
  notes TEXT,
  order_date DATE NOT NULL,
  payment_expires_at TIMESTAMPTZ,
  stock_reserved_until TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  public_status_token_hash TEXT NOT NULL,
  invoice_requested BOOLEAN NOT NULL DEFAULT false,
  invoice_company_name TEXT,
  invoice_vat_number TEXT,
  invoice_address_line1 TEXT,
  invoice_postal_code TEXT,
  invoice_city TEXT,
  invoice_country_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  weekly_menu_id UUID NOT NULL REFERENCES weekly_menu(id),
  dish_id UUID NOT NULL REFERENCES dishes(id),
  dish_name_snapshot JSONB NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  line_total_cents INTEGER GENERATED ALWAYS AS (quantity * unit_price_cents) STORED
);

-- invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number SERIAL UNIQUE,
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  billing_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  vat_number TEXT NOT NULL,
  billing_address_line1 TEXT NOT NULL,
  billing_postal_code TEXT NOT NULL,
  billing_city TEXT NOT NULL,
  billing_country_code TEXT NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  vat_rate DECIMAL(4,2) NOT NULL DEFAULT 6.00,
  vat_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- catering_requests
CREATE TABLE catering_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  status catering_status NOT NULL DEFAULT 'new',
  event_type event_type NOT NULL,
  event_date DATE,
  guest_count INTEGER,
  budget_cents INTEGER,
  dietary_needs TEXT,
  message TEXT,
  admin_notes TEXT,
  fulfillment fulfillment_type,
  delivery_address TEXT,
  quoted_amount_cents INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- catering_quotes
CREATE TABLE catering_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES catering_requests(id) ON DELETE CASCADE,
  quote_number SERIAL UNIQUE,
  items JSONB NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  vat_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  vat_rate DECIMAL(4,2) NOT NULL DEFAULT 6.00,
  terms TEXT,
  valid_until DATE,
  notes TEXT,
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- notification_log
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  channel TEXT NOT NULL,
  reference_id UUID,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 3. INDEXES
-- ------------------------------------------------------------
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_payment_expires ON orders(payment_expires_at);
CREATE INDEX idx_weekly_menu_date ON weekly_menu(available_date);
CREATE INDEX idx_order_items_dish ON order_items(dish_id);
CREATE INDEX idx_order_items_weekly_menu ON order_items(weekly_menu_id);
CREATE INDEX idx_catering_status ON catering_requests(status);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_blocked ON customers(is_blocked) WHERE is_blocked = true;
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_notification_ref ON notification_log(reference_id);


-- 4. RLS
-- ------------------------------------------------------------
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically.
-- No permissive policies for anon/authenticated in v1 — all access is server-side via service role.

-- Public read access for dishes and weekly_menu (non-sensitive data)
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read dishes" ON dishes FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE weekly_menu ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read weekly_menu" ON weekly_menu FOR SELECT TO anon, authenticated USING (true);

-- Settings: public read for non-sensitive config
CREATE POLICY "Public read settings" ON settings FOR SELECT TO anon, authenticated USING (true);


-- 5. DATABASE FUNCTIONS
-- ------------------------------------------------------------

-- Atomically reserve portions for a weekly menu item
CREATE OR REPLACE FUNCTION reserve_weekly_menu_portions(menu_id UUID, qty INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  current_record RECORD;
BEGIN
  SELECT max_portions, portions_sold
  INTO current_record
  FROM weekly_menu
  WHERE id = menu_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- NULL max_portions means unlimited
  IF current_record.max_portions IS NOT NULL
     AND (current_record.portions_sold + qty) > current_record.max_portions THEN
    RETURN false;
  END IF;

  UPDATE weekly_menu
  SET portions_sold = portions_sold + qty,
      updated_at = now()
  WHERE id = menu_id;

  RETURN true;
END;
$$;

-- Atomically release portions for a weekly menu item
CREATE OR REPLACE FUNCTION release_weekly_menu_portions(menu_id UUID, qty INTEGER)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE weekly_menu
  SET portions_sold = GREATEST(portions_sold - qty, 0),
      updated_at = now()
  WHERE id = menu_id;
END;
$$;


-- 6. VIEWS
-- ------------------------------------------------------------

-- Dish rankings: total quantity sold per dish
CREATE OR REPLACE VIEW dish_rankings AS
SELECT
  d.id AS dish_id,
  d.name_nl,
  d.slug,
  COALESCE(SUM(oi.quantity), 0) AS total_sold,
  COALESCE(SUM(oi.line_total_cents), 0) AS total_revenue_cents
FROM dishes d
LEFT JOIN order_items oi ON oi.dish_id = d.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status NOT IN ('cancelled')
GROUP BY d.id, d.name_nl, d.slug
ORDER BY total_sold DESC;

-- Daily summary: revenue per day
CREATE OR REPLACE VIEW daily_summary AS
SELECT
  o.order_date,
  COUNT(*) AS order_count,
  SUM(o.total_cents) AS total_revenue_cents,
  AVG(o.total_cents)::INTEGER AS avg_order_cents,
  COUNT(*) FILTER (WHERE o.fulfillment = 'pickup') AS pickup_count,
  COUNT(*) FILTER (WHERE o.fulfillment = 'delivery') AS delivery_count,
  COUNT(*) FILTER (WHERE o.payment_method = 'online') AS online_count,
  COUNT(*) FILTER (WHERE o.payment_method = 'cash') AS cash_count
FROM orders o
WHERE o.status NOT IN ('cancelled')
GROUP BY o.order_date
ORDER BY o.order_date DESC;

-- Customer value: lifetime value per customer
CREATE OR REPLACE VIEW customer_value AS
SELECT
  c.id AS customer_id,
  c.first_name,
  c.last_name,
  c.email,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.total_cents), 0) AS lifetime_value_cents,
  MAX(o.created_at) AS last_order_at
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status NOT IN ('cancelled')
GROUP BY c.id, c.first_name, c.last_name, c.email
ORDER BY lifetime_value_cents DESC;

-- VAT summary: monthly
CREATE OR REPLACE VIEW vat_summary AS
SELECT
  DATE_TRUNC('month', o.order_date)::DATE AS month,
  SUM(o.subtotal_cents) AS subtotal_cents,
  SUM(o.total_cents - o.subtotal_cents) AS vat_cents,
  SUM(o.total_cents) AS total_cents,
  COUNT(*) AS order_count
FROM orders o
WHERE o.status NOT IN ('cancelled')
  AND o.payment_status = 'paid'
GROUP BY DATE_TRUNC('month', o.order_date)
ORDER BY month DESC;

-- Catering revenue per event type
CREATE OR REPLACE VIEW catering_revenue AS
SELECT
  cr.event_type,
  COUNT(*) AS request_count,
  COUNT(*) FILTER (WHERE cr.status = 'completed') AS completed_count,
  COALESCE(SUM(cq.total_cents) FILTER (WHERE cr.status = 'completed'), 0) AS total_revenue_cents
FROM catering_requests cr
LEFT JOIN catering_quotes cq ON cq.request_id = cr.id
GROUP BY cr.event_type
ORDER BY total_revenue_cents DESC;


-- 7. UPDATED_AT TRIGGER
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON dishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON weekly_menu
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON catering_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON catering_quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
