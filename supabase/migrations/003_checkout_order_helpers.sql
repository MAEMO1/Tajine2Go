-- ============================================================
-- Tajine2Go – Checkout and Order Workflow Helpers
-- ============================================================

CREATE OR REPLACE FUNCTION create_checkout_order(
  customer_payload JSONB,
  order_payload JSONB,
  order_items_payload JSONB,
  cash_invoice_payload JSONB DEFAULT NULL
)
RETURNS TABLE(order_id UUID, order_number INTEGER, customer_id UUID)
LANGUAGE plpgsql
AS $$
DECLARE
  v_customer_id UUID;
  v_order_id UUID;
  v_order_number INTEGER;
BEGIN
  INSERT INTO customers (
    email,
    first_name,
    last_name,
    phone,
    address_street,
    address_city,
    address_zip,
    company_name,
    vat_number
  )
  VALUES (
    customer_payload ->> 'email',
    customer_payload ->> 'first_name',
    customer_payload ->> 'last_name',
    customer_payload ->> 'phone',
    customer_payload ->> 'address_street',
    customer_payload ->> 'address_city',
    customer_payload ->> 'address_zip',
    customer_payload ->> 'company_name',
    customer_payload ->> 'vat_number'
  )
  ON CONFLICT (email) DO UPDATE
  SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    address_street = COALESCE(EXCLUDED.address_street, customers.address_street),
    address_city = COALESCE(EXCLUDED.address_city, customers.address_city),
    address_zip = COALESCE(EXCLUDED.address_zip, customers.address_zip),
    company_name = COALESCE(EXCLUDED.company_name, customers.company_name),
    vat_number = COALESCE(EXCLUDED.vat_number, customers.vat_number)
  RETURNING id INTO v_customer_id;

  INSERT INTO orders (
    customer_id,
    status,
    fulfillment,
    pickup_slot,
    delivery_address_line1,
    delivery_postal_code,
    delivery_city,
    delivery_country_code,
    delivery_fee_cents,
    subtotal_cents,
    total_cents,
    payment_method,
    payment_status,
    notes,
    order_date,
    payment_expires_at,
    stock_reserved_until,
    confirmed_at,
    public_status_token_hash,
    invoice_requested,
    invoice_company_name,
    invoice_vat_number,
    invoice_address_line1,
    invoice_postal_code,
    invoice_city,
    invoice_country_code
  )
  VALUES (
    v_customer_id,
    (order_payload ->> 'status')::order_status,
    (order_payload ->> 'fulfillment')::fulfillment_type,
    order_payload ->> 'pickup_slot',
    order_payload ->> 'delivery_address_line1',
    order_payload ->> 'delivery_postal_code',
    order_payload ->> 'delivery_city',
    order_payload ->> 'delivery_country_code',
    (order_payload ->> 'delivery_fee_cents')::INTEGER,
    (order_payload ->> 'subtotal_cents')::INTEGER,
    (order_payload ->> 'total_cents')::INTEGER,
    (order_payload ->> 'payment_method')::payment_method,
    (order_payload ->> 'payment_status')::payment_status,
    order_payload ->> 'notes',
    (order_payload ->> 'order_date')::DATE,
    (order_payload ->> 'payment_expires_at')::TIMESTAMPTZ,
    (order_payload ->> 'stock_reserved_until')::TIMESTAMPTZ,
    (order_payload ->> 'confirmed_at')::TIMESTAMPTZ,
    order_payload ->> 'public_status_token_hash',
    COALESCE((order_payload ->> 'invoice_requested')::BOOLEAN, false),
    order_payload ->> 'invoice_company_name',
    order_payload ->> 'invoice_vat_number',
    order_payload ->> 'invoice_address_line1',
    order_payload ->> 'invoice_postal_code',
    order_payload ->> 'invoice_city',
    order_payload ->> 'invoice_country_code'
  )
  RETURNING id, order_number INTO v_order_id, v_order_number;

  INSERT INTO order_items (
    order_id,
    weekly_menu_id,
    dish_id,
    dish_name_snapshot,
    quantity,
    unit_price_cents
  )
  SELECT
    v_order_id,
    item.weekly_menu_id,
    item.dish_id,
    item.dish_name_snapshot,
    item.quantity,
    item.unit_price_cents
  FROM jsonb_to_recordset(order_items_payload) AS item(
    weekly_menu_id UUID,
    dish_id UUID,
    dish_name_snapshot JSONB,
    quantity INTEGER,
    unit_price_cents INTEGER
  );

  IF cash_invoice_payload IS NOT NULL THEN
    INSERT INTO invoices (
      order_id,
      customer_id,
      billing_name,
      company_name,
      vat_number,
      billing_address_line1,
      billing_postal_code,
      billing_city,
      billing_country_code,
      subtotal_cents,
      vat_rate,
      vat_cents,
      total_cents
    )
    VALUES (
      v_order_id,
      v_customer_id,
      cash_invoice_payload ->> 'billing_name',
      cash_invoice_payload ->> 'company_name',
      cash_invoice_payload ->> 'vat_number',
      cash_invoice_payload ->> 'billing_address_line1',
      cash_invoice_payload ->> 'billing_postal_code',
      cash_invoice_payload ->> 'billing_city',
      cash_invoice_payload ->> 'billing_country_code',
      (cash_invoice_payload ->> 'subtotal_cents')::INTEGER,
      (cash_invoice_payload ->> 'vat_rate')::DECIMAL(4,2),
      (cash_invoice_payload ->> 'vat_cents')::INTEGER,
      (cash_invoice_payload ->> 'total_cents')::INTEGER
    );
  END IF;

  RETURN QUERY
  SELECT v_order_id, v_order_number, v_customer_id;
END;
$$;

CREATE OR REPLACE FUNCTION apply_admin_order_status_transition(
  target_order_id UUID,
  next_status order_status
)
RETURNS TABLE(
  order_id UUID,
  status order_status,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  stock_released BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
  current_order orders%ROWTYPE;
  order_item RECORD;
  current_idx INTEGER;
  next_idx INTEGER;
  status_flow TEXT[] := ARRAY[
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
    'completed'
  ];
BEGIN
  SELECT *
  INTO current_order
  FROM orders
  WHERE id = target_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ORDER_NOT_FOUND';
  END IF;

  IF next_status = 'cancelled' THEN
    IF current_order.status IN ('completed', 'cancelled') THEN
      RAISE EXCEPTION 'INVALID_STATUS_TRANSITION';
    END IF;

    UPDATE orders
    SET
      status = 'cancelled',
      cancelled_at = COALESCE(cancelled_at, now()),
      cancel_reason = 'admin_cancelled',
      stock_reserved_until = NULL
    WHERE id = target_order_id
    RETURNING
      id,
      status,
      confirmed_at,
      cancelled_at,
      cancel_reason
    INTO order_id, status, confirmed_at, cancelled_at, cancel_reason;

    FOR order_item IN
      SELECT weekly_menu_id, quantity
      FROM order_items
      WHERE order_id = target_order_id
    LOOP
      PERFORM release_weekly_menu_portions(order_item.weekly_menu_id, order_item.quantity);
    END LOOP;

    stock_released := true;
    RETURN NEXT;
    RETURN;
  END IF;

  IF current_order.status IN ('completed', 'cancelled') THEN
    RAISE EXCEPTION 'INVALID_STATUS_TRANSITION';
  END IF;

  current_idx := array_position(status_flow, current_order.status::TEXT);
  next_idx := array_position(status_flow, next_status::TEXT);

  IF current_idx IS NULL OR next_idx IS NULL OR next_idx <> current_idx + 1 THEN
    RAISE EXCEPTION 'INVALID_STATUS_TRANSITION';
  END IF;

  UPDATE orders
  SET
    status = next_status,
    confirmed_at = CASE
      WHEN next_status = 'confirmed' AND confirmed_at IS NULL THEN now()
      ELSE confirmed_at
    END
  WHERE id = target_order_id
  RETURNING
    id,
    status,
    confirmed_at,
    cancelled_at,
    cancel_reason
  INTO order_id, status, confirmed_at, cancelled_at, cancel_reason;

  stock_released := false;
  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS TABLE(
  today_revenue INTEGER,
  today_count INTEGER,
  week_revenue INTEGER,
  avg_order INTEGER,
  pickup_count INTEGER,
  delivery_count INTEGER,
  online_count INTEGER,
  cash_count INTEGER
)
LANGUAGE sql
AS $$
  WITH today_orders AS (
    SELECT total_cents, fulfillment, payment_method
    FROM orders
    WHERE order_date = CURRENT_DATE
      AND status <> 'cancelled'
  ),
  week_orders AS (
    SELECT total_cents
    FROM orders
    WHERE order_date >= CURRENT_DATE - 6
      AND status <> 'cancelled'
  )
  SELECT
    COALESCE(SUM(today_orders.total_cents), 0)::INTEGER AS today_revenue,
    COUNT(*)::INTEGER AS today_count,
    (SELECT COALESCE(SUM(total_cents), 0)::INTEGER FROM week_orders) AS week_revenue,
    CASE
      WHEN COUNT(*) > 0 THEN ROUND(AVG(today_orders.total_cents))::INTEGER
      ELSE 0
    END AS avg_order,
    COUNT(*) FILTER (WHERE today_orders.fulfillment = 'pickup')::INTEGER AS pickup_count,
    COUNT(*) FILTER (WHERE today_orders.fulfillment = 'delivery')::INTEGER AS delivery_count,
    COUNT(*) FILTER (WHERE today_orders.payment_method = 'online')::INTEGER AS online_count,
    COUNT(*) FILTER (WHERE today_orders.payment_method = 'cash')::INTEGER AS cash_count
  FROM today_orders;
$$;
