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

    UPDATE orders AS o
    SET
      status = 'cancelled',
      cancelled_at = COALESCE(o.cancelled_at, now()),
      cancel_reason = 'admin_cancelled',
      stock_reserved_until = NULL
    WHERE o.id = target_order_id
    RETURNING
      o.id,
      o.status,
      o.confirmed_at,
      o.cancelled_at,
      o.cancel_reason
    INTO order_id, status, confirmed_at, cancelled_at, cancel_reason;

    FOR order_item IN
      SELECT oi.weekly_menu_id, oi.quantity
      FROM order_items AS oi
      WHERE oi.order_id = target_order_id
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

  UPDATE orders AS o
  SET
    status = next_status,
    confirmed_at = CASE
      WHEN next_status = 'confirmed' AND o.confirmed_at IS NULL THEN now()
      ELSE o.confirmed_at
    END
  WHERE o.id = target_order_id
  RETURNING
    o.id,
    o.status,
    o.confirmed_at,
    o.cancelled_at,
    o.cancel_reason
  INTO order_id, status, confirmed_at, cancelled_at, cancel_reason;

  stock_released := false;
  RETURN NEXT;
END;
$$;
