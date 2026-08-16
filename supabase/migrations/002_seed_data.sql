-- ============================================================
-- Tajine2Go – Seed Data
-- ============================================================

-- 1. SETTINGS
-- ------------------------------------------------------------

INSERT INTO settings (key, value) VALUES
(
  'takeaway_schedule',
  '{
    "days": [
      {
        "day": "saturday",
        "slot_mode": "slots",
        "slots": ["12:00-13:00", "13:00-14:00", "14:00-15:00", "17:00-18:00", "18:00-19:00"],
        "open_window": "12:00-19:00"
      }
    ]
  }'::jsonb
),
(
  'delivery_config',
  '{
    "enabled": true,
    "fee_cents": 500,
    "free_delivery_above_cents": 5000,
    "zip_codes": ["9000", "9030", "9032", "9040", "9041", "9042", "9050", "9051", "9052"]
  }'::jsonb
),
(
  'business_info',
  '{
    "name": "Tajine2Go",
    "legal_name": "Tajine2Go",
    "address": "Gent, België",
    "phone": "+32 XXX XX XX XX",
    "email": "info@tajine2go.be",
    "vat_number": "BE 0XXX.XXX.XXX",
    "bank_account": "BE00 0000 0000 0000"
  }'::jsonb
),
(
  'takeaway_active',
  '{"active": true}'::jsonb
),
(
  'min_order_cents',
  '{"amount": 2000}'::jsonb
),
(
  'payment_methods',
  '{
    "methods": ["bancontact", "ideal", "visa_mc", "cash"],
    "online_enabled": true,
    "cash_enabled": true
  }'::jsonb
),
(
  'notifications',
  '{
    "admin_email": "admin1@tajine2go.be",
    "whatsapp_enabled": false,
    "email_enabled": true
  }'::jsonb
),
(
  'website_texts',
  '{
    "homepage_banner": null,
    "closed_message": null,
    "checkout_notice": null
  }'::jsonb
);


-- 2. DISHES — de echte menukaart (gedrukte kaart, augustus 2026)
-- M-prijs in price_cents, L-prijs in price_l_cents (NULL = één maat).
-- Beschrijvingen en allergenen vult de eigenaar later aan via de admin.
-- ------------------------------------------------------------

INSERT INTO dishes (slug, name_nl, name_fr, name_en, name_ar, price_cents, price_l_cents, category, allergens) VALUES
('tajine-royal', 'Tajine Royal (runds)', 'Tajine Royale (bœuf)', 'Tajine Royal (beef)', 'طاجين ملكي (لحم بقري)', 1700, 2200, 'tajine', '{}'),
('tajine-kefta', 'Tajine Kefta', 'Tajine Kefta', 'Kefta tagine', 'طاجين كفتة', 1300, 1800, 'tajine', '{}'),
('tajine-kip-groenten', 'Tajine Kip en groenten', 'Tajine Poulet et légumes', 'Chicken & vegetable tagine', 'طاجين دجاج بالخضر', 1500, 2000, 'tajine', '{}'),
('tajine-veggie', 'Tajine Veggie', 'Tajine Végé', 'Veggie tagine', 'طاجين خضر', 1300, 1800, 'tajine', '{}'),
('tajine-kip-olijven-citroen', 'Tajine Kip, olijven en citroen', 'Tajine Poulet, olives et citron', 'Chicken tagine with olives & lemon', 'طاجين دجاج بالزيتون والليمون', 1500, 2000, 'tajine', '{}'),
('couscous-kip-merguez', 'Couscous Kip Merguez', 'Couscous Poulet Merguez', 'Chicken & merguez couscous', 'كسكس دجاج وميرغيز', 1700, 2200, 'couscous', '{gluten}'),
('couscous-kip', 'Couscous Kip', 'Couscous Poulet', 'Chicken couscous', 'كسكس دجاج', 1500, 2000, 'couscous', '{gluten}'),
('couscous-runds', 'Couscous Runds', 'Couscous Bœuf', 'Beef couscous', 'كسكس لحم بقري', 1700, 2200, 'couscous', '{gluten}'),
('couscous-veggie', 'Couscous Veggie', 'Couscous Végé', 'Veggie couscous', 'كسكس خضر', 1300, 1800, 'couscous', '{gluten}'),
('bstilla-kip', 'Bstilla Kip', 'Bstilla Poulet', 'Chicken bstilla', 'بسطيلة دجاج', 900, NULL, 'bstilla', '{gluten}'),
('bstilla-vis', 'Bstilla Vis', 'Bstilla Poisson', 'Fish bstilla', 'بسطيلة سمك', 1200, NULL, 'bstilla', '{gluten,fish}'),
('bstilla-groenten', 'Bstilla Groenten', 'Bstilla Légumes', 'Vegetable bstilla', 'بسطيلة خضر', 900, NULL, 'bstilla', '{gluten}'),
('harira', 'Harira', 'Harira', 'Harira', 'حريرة', 500, NULL, 'bstilla', '{}'),
('thee', 'Thee', 'Thé', 'Mint tea', 'أتاي', 250, NULL, 'drink', '{}'),
('koffie', 'Koffie', 'Café', 'Coffee', 'قهوة', 300, NULL, 'drink', '{}'),
('frisdranken', 'Frisdranken', 'Boissons fraîches', 'Soft drinks', 'مشروبات غازية', 250, NULL, 'drink', '{}'),
('thee-koekjes', 'Thee + koekjes', 'Thé + biscuits', 'Tea + cookies', 'أتاي مع حلويات', 550, NULL, 'sweet', '{gluten}'),
('koekje-pack', 'Koekje pack', 'Pack de biscuits', 'Cookie pack', 'علبة حلويات', 600, NULL, 'sweet', '{gluten}');

-- 3. SAMPLE WEEKLY MENU (upcoming Saturday)
-- ------------------------------------------------------------

-- Find the next Saturday from today
DO $$
DECLARE
  next_sat DATE;
  dish RECORD;
BEGIN
  next_sat := CURRENT_DATE + ((6 - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER + 7) % 7)::INTEGER;
  -- If today is Saturday, use today
  IF EXTRACT(DOW FROM CURRENT_DATE) = 6 THEN
    next_sat := CURRENT_DATE;
  END IF;

  FOR dish IN SELECT id FROM dishes WHERE is_active = true
  LOOP
    INSERT INTO weekly_menu (dish_id, available_date, max_portions)
    VALUES (
      dish.id,
      next_sat,
      CASE
        WHEN (SELECT category FROM dishes WHERE id = dish.id) IN ('tajine', 'couscous') THEN 30
        WHEN (SELECT category FROM dishes WHERE id = dish.id) = 'bstilla' THEN 40
        ELSE NULL
      END
    );
  END LOOP;
END;
$$;
