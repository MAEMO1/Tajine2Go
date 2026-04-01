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


-- 2. SAMPLE DISHES
-- ------------------------------------------------------------

INSERT INTO dishes (slug, name_nl, name_fr, name_en, name_ar, description_nl, description_fr, description_en, description_ar, price_cents, category, allergens) VALUES
(
  'tajine-kip',
  'Tajine met kip', 'Tajine au poulet', 'Chicken tagine', 'طاجين الدجاج',
  'Malse kip met olijven en ingelegde citroen, langzaam gegaard in traditionele kruiden.',
  'Poulet tendre aux olives et citron confit, mijoté lentement aux épices traditionnelles.',
  'Tender chicken with olives and preserved lemon, slow-cooked in traditional spices.',
  'دجاج طري بالزيتون والليمون المخلل، مطهو ببطء بالتوابل التقليدية.',
  1450, 'main', '{}'
),
(
  'tajine-lam',
  'Tajine met lam', 'Tajine d''agneau', 'Lamb tagine', 'طاجين اللحم',
  'Mals lamsvlees met pruimen en amandelen in een zoet-hartige saus.',
  'Agneau tendre aux pruneaux et amandes dans une sauce aigre-douce.',
  'Tender lamb with prunes and almonds in a sweet-savoury sauce.',
  'لحم غنم طري بالبرقوق واللوز في صلصة حلوة ومالحة.',
  1650, 'main', '{}'
),
(
  'couscous-groenten',
  'Couscous met groenten', 'Couscous aux légumes', 'Vegetable couscous', 'كسكس بالخضر',
  'Luchtige couscous met seizoensgroenten en pikante bouillon.',
  'Couscous léger aux légumes de saison et bouillon épicé.',
  'Fluffy couscous with seasonal vegetables and spicy broth.',
  'كسكس خفيف بالخضر الموسمية ومرق حار.',
  1250, 'main', '{gluten}'
),
(
  'pastilla-kip',
  'Pastilla met kip', 'Pastilla au poulet', 'Chicken pastilla', 'بسطيلة الدجاج',
  'Krokante filodeeg gevuld met gekruide kip, amandelen en kaneel.',
  'Pâte filo croustillante farcie de poulet épicé, amandes et cannelle.',
  'Crispy filo pastry filled with spiced chicken, almonds and cinnamon.',
  'عجينة فيلو مقرمشة محشوة بالدجاج المتبل واللوز والقرفة.',
  1350, 'main', '{gluten,nuts}'
),
(
  'harira',
  'Harira soep', 'Soupe Harira', 'Harira soup', 'حريرة',
  'Rijke Marokkaanse soep met linzen, kikkererwten en verse kruiden.',
  'Riche soupe marocaine aux lentilles, pois chiches et herbes fraîches.',
  'Rich Moroccan soup with lentils, chickpeas and fresh herbs.',
  'حساء مغربي غني بالعدس والحمص والأعشاب الطازجة.',
  750, 'side', '{}'
),
(
  'baklava',
  'Baklava', 'Baklava', 'Baklava', 'بقلاوة',
  'Huisgemaakte baklava met pistache en honing.',
  'Baklava maison à la pistache et au miel.',
  'Homemade baklava with pistachio and honey.',
  'بقلاوة منزلية بالفستق والعسل.',
  550, 'dessert', '{gluten,nuts}'
);

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
        WHEN (SELECT category FROM dishes WHERE id = dish.id) = 'main' THEN 30
        WHEN (SELECT category FROM dishes WHERE id = dish.id) = 'side' THEN 40
        ELSE NULL
      END
    );
  END LOOP;
END;
$$;
