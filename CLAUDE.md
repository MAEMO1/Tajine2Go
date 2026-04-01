# CLAUDE.md - Tajine2Go v2

> Canonieke implementatiespec voor Tajine2Go.
> Dit bestand is de enige bron van waarheid.
> Lees dit bestand volledig voordat je code schrijft.

---

## 0. Normatieve taal

De sleutelwoorden `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT` en `MAY` zijn bindend.

- `MUST`: harde eis, geen afwijking zonder expliciete specwijziging.
- `SHOULD`: standaardkeuze; alleen afwijken met aantoonbare reden.
- `MAY`: optioneel, niet vereist voor correcte implementatie.

---

## 1. Productidentiteit

| Key | Value |
|---|---|
| Naam | Tajine2Go |
| Concept | Maghrebijnse takeaway, 1 dag per week in v1, later opschaalbaar |
| Extra aanbod | Catering |
| Regio | Gent, Belgie |
| Publieke talen | `nl`, `fr`, `en`, `ar` |
| Admin taal | `nl` only |
| Domein | `tajine2go.be` |
| Primaire doelgroep | Klanten in en rond Gent |
| Brandomgeving | Warm, premium, toegankelijk, Belgisch-Marokkaanse context |

### 1.1 Operationele beslissingen

Deze keuzes zijn vastgezet en mogen niet meer door de implementer worden ingevuld:

- v1 MUST exact 1 takeaway-dag per week ondersteunen.
- De publieke site MUST live werken in `nl`, `fr`, `en` en `ar`.
- De adminomgeving MUST altijd Nederlands blijven.
- Checkout MUST guest checkout ondersteunen; een klantaccount is geen v1-feature.
- Het datamodel MUST wel auth-ready zijn voor een later klantenportaal.
- Cashbetalingen MUST toegestaan zijn voor zowel `pickup` als `delivery`.
- Cashorders MUST direct `confirmed` worden, maar blijven qua betaling `pending` tot effectieve inning.
- Publieke analytics MUST alleen laden na expliciete consent.
- WhatsApp-notificaties MAY ontbreken of falen zonder impact op ordercreatie.

---

## 2. Architectuur en stack

| Laag | Technologie | Status |
|---|---|---|
| Framework | Next.js App Router | MUST |
| Taal | TypeScript strict mode | MUST |
| Database | Supabase PostgreSQL | MUST |
| Auth | Supabase Auth | MUST |
| Styling | Tailwind CSS | MUST |
| State | Zustand | MUST |
| i18n | next-intl | MUST |
| Betalingen | Mollie | MUST |
| E-mail | Resend | MUST |
| PDF | `@react-pdf/renderer` | MUST |
| Opslag | Supabase Storage | MUST |
| Admin charts | Recharts | MUST |
| Publieke analytics | Plausible | MUST, alleen na consent |
| Forms | React Hook Form + Zod | MUST |
| Spam protectie | reCAPTCHA v3 | MUST voor catering |
| Error logging | Sentry | SHOULD |
| Hosting | Vercel | MUST |

### 2.1 Runtime en degradatie

- Het project MUST production-ready integraties ondersteunen.
- Het project SHOULD netjes degraderen wanneer niet-kritieke integraties ontbreken.
- Ontbrekende kritieke server-env vars MUST leiden tot een gesloten, gebruiksvriendelijke fout voor alleen die feature.
- Voorbeelden:
  - Geen `MOLLIE_API_KEY` + online payment gekozen -> checkout route retourneert 503 met gebruiksvriendelijke fout.
  - Geen WhatsApp webhook -> notificatie logt `skipped`, order gaat door.
  - Geen Plausible config of geen consent -> analytics script laadt niet.
  - Geen Sentry DSN -> logging valt terug op server logs.

---

## 3. Environment variables

Maak `.env.local` aan. Secrets MUST NOT gecommit worden.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Admin auth
ADMIN_EMAIL_ALLOWLIST=admin1@tajine2go.be,admin2@tajine2go.be

# Payments
MOLLIE_API_KEY=test_xxx
MOLLIE_WEBHOOK_SECRET=xxx

# Email
RESEND_API_KEY=re_xxx

# Site
NEXT_PUBLIC_SITE_URL=https://tajine2go.be

# Optional integrations
WHATSAPP_WEBHOOK_URL=https://...
RECAPTCHA_SECRET_KEY=xxx
SENTRY_DSN=https://...
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tajine2go.be

# Background jobs
CRON_SECRET=xxx
```

### 3.1 Env regels

- `SUPABASE_SERVICE_ROLE_KEY` MUST alleen server-side gebruikt worden.
- `MOLLIE_API_KEY` MUST alleen server-side gebruikt worden.
- `ADMIN_EMAIL_ALLOWLIST` MUST server-side gelezen worden en case-insensitive vergeleken worden.
- `CRON_SECRET` MUST gebruikt worden om cron routes te beschermen.

---

## 4. Doelstructuur van het project

De uiteindelijke repo MUST minimaal deze structuur hebben:

```text
tajine2go/
├── CLAUDE.md
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── public/
│   ├── logo.png
│   ├── hero-animation.webm
│   ├── hero-fallback.png
│   └── fonts/
├── messages/
│   ├── nl.json
│   ├── fr.json
│   ├── en.json
│   └── ar.json
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 002_seed_data.sql
│   └── config.toml
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── menu/page.tsx
│   │   │   ├── bestellen/page.tsx
│   │   │   ├── order/[id]/page.tsx
│   │   │   ├── catering/page.tsx
│   │   │   ├── over-ons/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── not-found.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── orders/[id]/page.tsx
│   │   │   ├── menu/page.tsx
│   │   │   ├── menu/[id]/page.tsx
│   │   │   ├── catering/page.tsx
│   │   │   ├── catering/[id]/page.tsx
│   │   │   ├── klanten/page.tsx
│   │   │   ├── klanten/[id]/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   └── instellingen/page.tsx
│   │   ├── api/
│   │   │   ├── checkout/route.ts
│   │   │   ├── menu/route.ts
│   │   │   ├── order/[id]/route.ts
│   │   │   ├── catering/route.ts
│   │   │   ├── webhooks/mollie/route.ts
│   │   │   ├── admin/orders/route.ts
│   │   │   ├── admin/dishes/route.ts
│   │   │   ├── admin/dishes/[id]/route.ts
│   │   │   ├── admin/catering/route.ts
│   │   │   ├── admin/customers/route.ts
│   │   │   ├── admin/customers/[id]/route.ts
│   │   │   ├── admin/settings/route.ts
│   │   │   ├── admin/invoices/route.ts
│   │   │   ├── admin/quotes/route.ts
│   │   │   ├── admin/refund/route.ts
│   │   │   ├── admin/export/route.ts
│   │   │   └── cron/release-expired-orders/route.ts
│   │   ├── error.tsx
│   │   └── global-error.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── middleware.ts
├── tests/
│   ├── e2e/
│   └── unit/
└── playwright.config.ts
```

### 4.1 Structuurregels

- Admin routes MUST buiten `[locale]` leven.
- Publieke pages MUST onder `[locale]` leven.
- Alle backend toegang MUST via Route Handlers of server-only helpers lopen.
- Cron voor stock release MUST een aparte route hebben.

---

## 5. Design systeem

Het merk is bindend. Implementers MUST de visuele richting volgen en mogen deze niet vervangen door generieke UI.

### 5.1 Kleurensysteem

Gebruik deze custom colors in `tailwind.config.ts`:

```ts
colors: {
  brand: {
    orange: '#D97B1A',
    'orange-hover': '#BF6A10',
    gold: '#EDAC2A',
    bronze: '#8C4E10',
    cream: '#FFFCF5',
    warm: '#FFF3E0',
    warm2: '#FFE8C8',
    brown: '#2D1B0A',
    'brown-m': '#5C4023',
    'brown-s': '#9C8468',
  }
}
```

### 5.2 Typografie

```ts
fontFamily: {
  heading: ['Bebas Neue', 'sans-serif'],
  body: ['Source Sans 3', 'sans-serif'],
  arabic: ['Noto Sans Arabic', 'sans-serif'],
}
```

Laad fonts via `next/font/google`.

### 5.3 Componentregels

- Primaire knop MUST `bg-brand-orange`, `text-white`, `rounded-lg` gebruiken.
- Secundaire knop MUST een bruine outlinevariant gebruiken.
- Kaarten MUST `bg-brand-cream`, `shadow-sm`, `rounded-xl` gebruiken.
- Inputs MUST `border-brand-brown-s`, `rounded-lg`, `text-sm` gebruiken.
- Dish cards MUST rij-layout gebruiken, geen uniforme card-grid.
- Prijzen MUST prominent in heading font en brand orange getoond worden.

### 5.4 Responsive en RTL

- Desktop boven 900px MUST hero en admin in 2-kolom layout tonen.
- Mobile onder 600px MUST cart als bottom sheet of drawer tonen.
- Bij `locale === 'ar'` MUST `<html dir="rtl">` gezet worden.
- RTL padding, alignment en icon richting MUST gespiegeld worden.

---

## 6. Databasecontract

Deze sectie beschrijft het definitieve datamodel. SQL mag hiervan afgeleid worden, maar de implementer mag de betekenis niet wijzigen.

### 6.1 Enums

De database MUST minimaal deze enums bevatten:

- `order_status`: `pending`, `confirmed`, `preparing`, `ready`, `out_for_delivery`, `completed`, `cancelled`
- `fulfillment_type`: `pickup`, `delivery`
- `payment_method`: `online`, `cash`
- `payment_status`: `pending`, `paid`, `failed`, `refunded`
- `catering_status`: `new`, `in_contact`, `quote_sent`, `confirmed`, `completed`, `cancelled`
- `event_type`: `wedding`, `aqiqa`, `corporate`, `funeral`, `iftar`, `other`

### 6.2 Tabellen

#### `dishes`

- `id UUID PK`
- `slug TEXT UNIQUE NOT NULL`
- `name_nl TEXT NOT NULL`
- `name_fr TEXT`
- `name_en TEXT`
- `name_ar TEXT`
- `description_nl TEXT`
- `description_fr TEXT`
- `description_en TEXT`
- `description_ar TEXT`
- `price_cents INTEGER NOT NULL`
- `image_url TEXT`
- `category TEXT NOT NULL DEFAULT 'main'`
- `allergens TEXT[] NOT NULL DEFAULT '{}'`
- `is_active BOOLEAN NOT NULL DEFAULT true`
- timestamps

#### `weekly_menu`

- `id UUID PK`
- `dish_id UUID NOT NULL FK -> dishes.id`
- `available_date DATE NOT NULL`
- `max_portions INTEGER NULL`
- `portions_sold INTEGER NOT NULL DEFAULT 0`
- `is_soldout GENERATED`
- timestamps
- `UNIQUE(dish_id, available_date)`

Interpretatie:

- `max_portions IS NULL` betekent onbeperkte voorraad.
- `portions_sold` MUST zowel betaalde als nog geldige gereserveerde porties representeren.

#### `customers`

- `id UUID PK`
- `auth_user_id UUID NULL UNIQUE`
- `email TEXT UNIQUE`
- `phone TEXT`
- `first_name TEXT NOT NULL`
- `last_name TEXT NOT NULL`
- `address_street TEXT`
- `address_city TEXT DEFAULT 'Gent'`
- `address_zip TEXT`
- `company_name TEXT`
- `vat_number TEXT`
- `tags TEXT[] NOT NULL DEFAULT '{}'`
- `notes TEXT`
- `is_vip BOOLEAN NOT NULL DEFAULT false`
- `is_blocked BOOLEAN NOT NULL DEFAULT false`
- `blocked_reason TEXT`
- timestamps

Regels:

- `auth_user_id` MUST gereserveerd zijn voor een toekomstig klantenportaal.
- v1 MUST NOT vereisen dat `auth_user_id` gevuld is.

#### `orders`

- `id UUID PK`
- `order_number SERIAL UNIQUE`
- `customer_id UUID FK -> customers.id`
- `status order_status NOT NULL DEFAULT 'pending'`
- `fulfillment fulfillment_type NOT NULL`
- `pickup_slot TEXT`
- `delivery_address_line1 TEXT`
- `delivery_postal_code TEXT`
- `delivery_city TEXT`
- `delivery_country_code TEXT DEFAULT 'BE'`
- `delivery_fee_cents INTEGER NOT NULL DEFAULT 0`
- `subtotal_cents INTEGER NOT NULL`
- `total_cents INTEGER NOT NULL`
- `payment_method payment_method NOT NULL`
- `payment_status payment_status NOT NULL DEFAULT 'pending'`
- `mollie_payment_id TEXT`
- `mollie_refund_id TEXT`
- `refund_amount_cents INTEGER`
- `refund_reason TEXT`
- `notes TEXT`
- `order_date DATE NOT NULL`
- `payment_expires_at TIMESTAMPTZ`
- `stock_reserved_until TIMESTAMPTZ`
- `confirmed_at TIMESTAMPTZ`
- `cancelled_at TIMESTAMPTZ`
- `cancel_reason TEXT`
- `public_status_token_hash TEXT NOT NULL`
- `invoice_requested BOOLEAN NOT NULL DEFAULT false`
- `invoice_company_name TEXT`
- `invoice_vat_number TEXT`
- `invoice_address_line1 TEXT`
- `invoice_postal_code TEXT`
- `invoice_city TEXT`
- `invoice_country_code TEXT`
- timestamps

Regels:

- `public_status_token_hash` MUST een SHA-256 hash zijn van een random bearer token.
- Het ruwe token MUST alleen eenmalig teruggestuurd worden in checkout redirect data.
- Online orders MUST bij creatie `payment_expires_at = now() + 15 minutes` krijgen.
- Online orders MUST bij creatie `stock_reserved_until = payment_expires_at` krijgen.
- Cash orders MUST `status='confirmed'` en `payment_status='pending'` krijgen.
- Cash orders MUST NOT door een payment expiry job geannuleerd worden.

#### `order_items`

- `id UUID PK`
- `order_id UUID NOT NULL FK -> orders.id`
- `weekly_menu_id UUID NOT NULL FK -> weekly_menu.id`
- `dish_id UUID NOT NULL FK -> dishes.id`
- `dish_name_snapshot JSONB NOT NULL`
- `quantity INTEGER NOT NULL DEFAULT 1`
- `unit_price_cents INTEGER NOT NULL`
- `line_total_cents GENERATED ALWAYS AS (quantity * unit_price_cents) STORED`

Regels:

- `dish_name_snapshot` MUST exact deze shape volgen:

```json
{
  "nl": "string",
  "fr": "string | null",
  "en": "string | null",
  "ar": "string | null"
}
```

- De orderhistoriek MUST nooit breken wanneer een dish later aangepast wordt.

#### `invoices`

- `id UUID PK`
- `invoice_number SERIAL UNIQUE`
- `order_id UUID NOT NULL UNIQUE FK -> orders.id`
- `customer_id UUID FK -> customers.id`
- `billing_name TEXT NOT NULL`
- `company_name TEXT NOT NULL`
- `vat_number TEXT NOT NULL`
- `billing_address_line1 TEXT NOT NULL`
- `billing_postal_code TEXT NOT NULL`
- `billing_city TEXT NOT NULL`
- `billing_country_code TEXT NOT NULL`
- `subtotal_cents INTEGER NOT NULL`
- `vat_rate DECIMAL(4,2) NOT NULL DEFAULT 6.00`
- `vat_cents INTEGER NOT NULL`
- `total_cents INTEGER NOT NULL`
- `pdf_url TEXT`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

Regels:

- Er MUST maximaal 1 factuur per order bestaan.
- Een factuur MUST alleen gegenereerd worden voor orders met volledige factuurdata.

#### `catering_requests`

- `id UUID PK`
- `customer_id UUID FK -> customers.id`
- `status catering_status NOT NULL DEFAULT 'new'`
- `event_type event_type NOT NULL`
- `event_date DATE`
- `guest_count INTEGER`
- `budget_cents INTEGER`
- `dietary_needs TEXT`
- `message TEXT`
- `admin_notes TEXT`
- `fulfillment fulfillment_type`
- `delivery_address TEXT`
- `quoted_amount_cents INTEGER`
- timestamps

#### `catering_quotes`

- `id UUID PK`
- `request_id UUID NOT NULL FK -> catering_requests.id`
- `quote_number SERIAL UNIQUE`
- `items JSONB NOT NULL`
- `subtotal_cents INTEGER NOT NULL`
- `vat_cents INTEGER NOT NULL`
- `total_cents INTEGER NOT NULL`
- `vat_rate DECIMAL(4,2) NOT NULL DEFAULT 6.00`
- `terms TEXT`
- `valid_until DATE`
- `notes TEXT`
- `pdf_url TEXT`
- `sent_at TIMESTAMPTZ`
- timestamps

#### `notification_log`

- `id UUID PK`
- `type TEXT NOT NULL`
- `recipient TEXT NOT NULL`
- `channel TEXT NOT NULL`
- `reference_id UUID`
- `status TEXT NOT NULL DEFAULT 'sent'`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

#### `settings`

- `key TEXT PK`
- `value JSONB NOT NULL`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### 6.3 Views

De volgende views MUST bestaan:

- `dish_rankings`
- `daily_summary`
- `customer_value`
- `vat_summary`
- `catering_revenue`

Hun functionele betekenis MUST gelijk blijven aan de eerdere v1-spec:

- dish ranking per dish
- omzet per dag
- lifetime value per klant
- maandelijkse BTW-samenvatting
- cateringrevenue per event type

### 6.4 Indexen

De volgende indexen MUST bestaan:

- `orders(order_date)`
- `orders(status)`
- `orders(customer_id)`
- `orders(payment_expires_at)`
- `weekly_menu(available_date)`
- `order_items(dish_id)`
- `order_items(weekly_menu_id)`
- `catering_requests(status)`
- `customers(email)`
- `customers(is_blocked)` partial where blocked
- `invoices(order_id)`
- `notification_log(reference_id)`

### 6.5 RLS en toegangsmodel

RLS MUST enabled zijn op minimaal:

- `orders`
- `customers`
- `catering_requests`
- `invoices`
- `catering_quotes`
- `notification_log`
- `settings`

RLS regels:

- v1 MUST geen open publieke policies hebben op order- of klantdata.
- Publieke datatoegang MUST via server Route Handlers verlopen.
- Adminfunctionaliteit MUST via server-side allowlist checks verlopen, daarna via service-role client.
- Omdat checkout guest-based is, mag de publieke site geen directe client-side writes op gevoelige tabellen krijgen.
- Als een tabel directe browsertoegang niet nodig heeft, SHOULD er in v1 geen permissive policy voor bestaan.

### 6.6 Databasefuncties

Er MUST database-RPC of equivalente transactionele logica bestaan voor voorraadbeheer:

- `reserve_weekly_menu_portions(menu_id uuid, qty integer)`:
  - verhoogt `portions_sold` alleen als voldoende voorraad beschikbaar is
  - behandelt `max_portions IS NULL` als onbeperkt
- `release_weekly_menu_portions(menu_id uuid, qty integer)`:
  - verlaagt `portions_sold`
  - mag nooit onder 0 gaan

De applicatie MUST deze atomaire functies gebruiken. Losse read-then-write stock updates zijn verboden.

---

## 7. Seed configuratie

De initiële seed MUST minimaal deze settings bevatten:

- `takeaway_schedule`
- `delivery_config`
- `business_info`
- `takeaway_active`
- `min_order_cents`
- `payment_methods`
- `notifications`
- `website_texts`

### 7.1 Functionele defaults

- `takeaway_schedule.days` MUST in v1 precies 1 weekdag bevatten.
- `delivery_config.zip_codes` MUST beperkt zijn tot expliciet ondersteunde Gentse postcodes.
- `payment_methods` MUST standaard `bancontact`, `ideal`, `visa_mc` en `cash` ondersteunen.
- `takeaway_active.active=false` MUST de publieke bestelflow volledig blokkeren.

---

## 8. Auth en security

### 8.1 Admin toegang

- Alle admin routes MUST een geldige Supabase Auth sessie vereisen.
- Alle admin routes MUST daarna het session e-mailadres case-insensitive vergelijken met `ADMIN_EMAIL_ALLOWLIST`.
- Geen match -> `403`.
- Geen sessie -> `401`.
- Admin UI MUST gebruikersvriendelijke foutpaden tonen, maar API's MUST correcte statuscodes retourneren.

### 8.2 Publieke orderstatus

Publieke orderstatus gebruikt een bearer token, niet login.

Regels:

- Bij ordercreatie MUST een random token van minimaal 32 bytes gegenereerd worden.
- Alleen de SHA-256 hash MUST in `orders.public_status_token_hash` worden opgeslagen.
- Checkout MUST een redirect URL teruggeven in de vorm:

```text
/[locale]/order/{orderId}?token={rawToken}
```

- Zowel `/[locale]/order/[id]` als `/api/order/[id]` MUST het token vereisen.
- Zonder geldig token MUST de response een generieke not-found of unauthorized fout geven.
- De publieke orderpagina MUST alleen tonen:
  - ordernummer
  - orderstatus
  - fulfillment type
  - pickup slot of levermoment-indicatie
  - totaalbedrag

### 8.3 Secrets en browsergrenzen

- Service role keys MUST NOT client-side beschikbaar zijn.
- Mollie API key MUST NOT client-side beschikbaar zijn.
- Ruwe publieke ordertokens MUST NOT gelogd worden.
- Factuur- en klantdata MUST NOT via query params lekken.
- Stack traces MUST NOT aan eindgebruikers getoond worden.

---

## 9. API contracten

Alle inputvalidatie MUST via Zod gebeuren, zowel client als server.

### 9.1 `POST /api/checkout`

#### Input

```ts
type CheckoutRequest = {
  locale: 'nl' | 'fr' | 'en' | 'ar'
  items: {
    weekly_menu_id: string
    quantity: number
  }[]
  customer: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  fulfillment: 'pickup' | 'delivery'
  delivery_address?: {
    line1: string
    postal_code: string
    city: string
    country_code: 'BE'
  }
  pickup_slot?: string
  payment_method: 'online' | 'cash'
  notes?: string
  invoice?: {
    company_name: string
    vat_number: string
    address_line1: string
    postal_code: string
    city: string
    country_code: string
  }
}
```

#### Validatieregels

- `items` MUST minimaal 1 item bevatten.
- Elke `quantity` MUST integer >= 1 zijn.
- `weekly_menu_id` MUST bestaan en actief verkoopbaar zijn.
- `delivery_address` MUST verplicht zijn als `fulfillment='delivery'`.
- `pickup_slot` MUST verplicht zijn als slot mode `slots` of `both` vereist.
- `payment_method='cash'` MUST toegestaan blijven voor pickup en delivery.
- Als `invoice` aanwezig is, MUST alle velden verplicht en niet-leeg zijn.

#### Flow

1. Valideer Zod payload.
2. Check `takeaway_active`; indien false -> 409 met gebruiksvriendelijke fout.
3. Check minimum order bedrag.
4. Check klantblokkade op e-mail.
5. Als `fulfillment='delivery'`, valideer postcode tegen `delivery_config.zip_codes`.
6. Haal actuele `weekly_menu` en `dish` data server-side op.
7. Reserveer per item voorraad via transactionele DB-functie.
8. Upsert klant op e-mail.
9. Maak order met snapshots en `public_status_token_hash`.
10. Maak `order_items` met `dish_name_snapshot`.
11. Als `payment_method='online'`:
    - zet `payment_status='pending'`
    - zet `payment_expires_at = now() + 15 minutes`
    - maak Mollie payment
    - retourneer redirect naar Mollie
12. Als `payment_method='cash'`:
    - zet `status='confirmed'`
    - zet `payment_status='pending'`
    - stuur orderbevestiging e-mail
    - genereer factuur als `invoice` aanwezig is
    - stuur admin notificaties
    - retourneer redirect naar publieke orderstatus

#### Output

```ts
type CheckoutResponse = {
  orderId: string
  redirectUrl: string
}
```

### 9.2 `POST /api/webhooks/mollie`

#### Flow

1. Verifieer webhook request met `MOLLIE_WEBHOOK_SECRET`.
2. Haal payment status op via Mollie API.
3. Zoek order op basis van `mollie_payment_id`.
4. Verwerk idempotent.
5. Als `paid`:
   - zet `payment_status='paid'`
   - zet `status='confirmed'`
   - zet `confirmed_at=now()`
   - stuur orderbevestiging e-mail
   - genereer factuur als factuurdata aanwezig is
   - stuur admin notificaties
6. Als `failed`:
   - zet `payment_status='failed'`
   - zet `status='cancelled'`
   - zet `cancel_reason='payment_failed'`
   - release stock
7. Als `expired`:
   - zet `payment_status='failed'`
   - zet `status='cancelled'`
   - zet `cancel_reason='payment_expired'`
   - release stock
8. Als `refunded`:
   - zet `payment_status='refunded'`
   - bewaar refund metadata

### 9.3 `POST /api/catering`

#### Input

```ts
type CateringRequestPayload = {
  first_name: string
  last_name: string
  email: string
  phone: string
  event_type: 'wedding' | 'aqiqa' | 'corporate' | 'funeral' | 'iftar' | 'other'
  event_date: string
  guest_count: number
  dietary_needs?: string
  message?: string
  recaptcha_token: string
}
```

#### Flow

1. Valideer input.
2. Verifieer reCAPTCHA.
3. Rate limit: max 3 requests per e-mail per kalenderdag.
4. Upsert klant.
5. Maak `catering_request`.
6. Stuur admin e-mail.
7. Stuur optioneel WhatsApp.
8. Log alle notificaties.
9. Retourneer `{ success: true }`.

### 9.4 `GET /api/menu`

#### Query

- `date=YYYY-MM-DD` optional

#### Gedrag

- Zonder `date` MUST de eerstvolgende actieve takeaway-datum gekozen worden.
- Response MUST `takeaway_active`, slotconfig en dishes in correcte locale bevatten.
- `portions_remaining` MUST `null` zijn als `max_portions IS NULL`.

#### Output

```ts
type MenuResponse = {
  date: string
  is_active: boolean
  slot_mode: 'slots' | 'open' | 'both'
  slots: string[]
  open_window: string
  dishes: {
    id: string
    weekly_menu_id: string
    slug: string
    name: string
    description: string
    price_cents: number
    image_url: string | null
    category: string
    allergens: string[]
    is_soldout: boolean
    portions_remaining: number | null
  }[]
}
```

### 9.5 `GET /api/order/[id]`

Regels:

- Vereist `token` query param.
- Valideert hash tegen `public_status_token_hash`.
- Geeft alleen minimale statusdata terug.
- Geeft geen klantgegevens, notities of volledige itemlijst terug.

### 9.6 Admin API's

Alle admin API's MUST eerst auth checken, daarna allowlist checken.

| Route | Method | Functie |
|---|---|---|
| `/api/admin/orders` | `GET` | lijst met filters |
| `/api/admin/orders` | `PATCH` | update orderstatus, items of afronding |
| `/api/admin/dishes` | `GET`, `POST` | lijst en create |
| `/api/admin/dishes/[id]` | `PATCH`, `DELETE` | update en delete |
| `/api/admin/catering` | `GET`, `PATCH` | lijst en status/notities |
| `/api/admin/customers` | `GET` | lijst met zoek en tagfilters |
| `/api/admin/customers/[id]` | `PATCH` | notes, VIP, blokkeren |
| `/api/admin/settings` | `GET`, `PATCH` | site settings |
| `/api/admin/refund` | `POST` | volledige of partiele refund |
| `/api/admin/invoices` | `POST` | factuur PDF genereren |
| `/api/admin/quotes` | `POST` | offerte PDF genereren |
| `/api/admin/export` | `GET` | CSV export |

### 9.7 `POST /api/admin/refund`

Input:

```ts
type RefundRequest = {
  order_id: string
  amount_cents?: number
  reason: string
}
```

Regels:

- `amount_cents` afwezig betekent volledige refund.
- `amount_cents` aanwezig betekent partiele refund.
- Alleen online betaalde orders met Mollie payment id mogen via Mollie refunded worden.
- Admin MUST gebruiksvriendelijke fout krijgen als refund niet mogelijk is.

### 9.8 `POST /api/cron/release-expired-orders`

Doel:

- zoekt orders waar:
  - `payment_method='online'`
  - `status='pending'`
  - `payment_status='pending'`
  - `payment_expires_at <= now()`
- zet deze op `status='cancelled'`
- zet `cancel_reason='payment_expired'`
- release stock

Beveiliging:

- route MUST `Authorization: Bearer <CRON_SECRET>` of equivalente header vereisen

---

## 10. Checkout en order lifecycle

### 10.1 Bestelflow

```text
Menu -> Cart -> Checkout -> POST /api/checkout
  -> online: Mollie redirect -> webhook -> confirmed
  -> cash: direct confirmed -> publieke orderstatus
```

### 10.2 Lifecycle regels

- Voor online checkout MUST stock direct gereserveerd worden.
- De stock hold MUST 15 minuten geldig zijn.
- Een webhook `paid` MUST de hold omzetten naar definitieve bevestiging zonder extra stockmutatie.
- Een webhook `failed` of `expired` MUST stock direct vrijgeven.
- De cron route MUST alleen dienen als backstop voor vergeten of gemiste terminale payments.
- Cashorders MUST direct bevestigd worden en houden hun stock definitief vast.

### 10.3 Gesloten toestand

- Als `takeaway_active=false`, MUST homepage een duidelijke banner tonen.
- Menu MUST nog read-only zichtbaar mogen zijn.
- Checkout en add-to-cart MUST geblokkeerd zijn.

---

## 11. Admin productregels

### 11.1 Dashboard

MUST tonen:

- omzet vandaag
- bestellingen vandaag
- omzet deze week
- gemiddelde orderwaarde
- omzet per dag, laatste 30 dagen
- top 5 gerechten
- pickup/delivery ratio
- online/cash ratio

### 11.2 Orders

- Nieuwe orders SHOULD realtime bovenaan verschijnen.
- Orderdetail MUST refundactie, statusupdates en factuurdownload bevatten.
- Cashorders MUST door admin op een later moment als betaald of afgerond gemarkeerd kunnen worden.

### 11.3 Menu

- Dishes tab MUST CRUD in 4 talen ondersteunen.
- Weekplanner MUST datumplanning en portielimieten ondersteunen.

### 11.4 Catering

- Kanban per status MUST ondersteund worden.
- Offertes worden in v1 manueel opgevolgd; er is geen klant-self-service quote acceptatie.

### 11.5 Klanten

- Zoek MUST werken op naam, e-mail en telefoon.
- Blokkeren van klant MUST checkout op e-mailniveau verhinderen met generieke foutmelding.

### 11.6 Analytics

- Omzetgrafieken per dag, week en maand MUST ondersteund worden.
- BTW-overzicht MUST per maand exporteerbaar zijn.

---

## 12. Notificaties

E-mail is verplicht. WhatsApp is best effort.

| Trigger | Kanaal | Verplicht | Ontvanger |
|---|---|---|---|
| Nieuwe online order betaald | E-mail | Ja | Klant |
| Nieuwe cash order bevestigd | E-mail | Ja | Klant |
| Nieuwe B2B order | E-mail + PDF | Ja | Klant |
| Bestelling klaar | E-mail | Ja | Klant |
| Nieuwe bestelling | E-mail | Ja | Admin |
| Nieuwe bestelling | WhatsApp | Nee | Admin |
| Nieuwe catering aanvraag | E-mail | Ja | Admin |
| Nieuwe catering aanvraag | WhatsApp | Nee | Admin |

Regels:

- Elke notificatie MUST een `notification_log` record schrijven.
- WhatsApp-falen MUST `status='failed'` of `status='skipped'` loggen maar mag de hoofdflow niet breken.

---

## 13. i18n, SEO en metadata

### 13.1 i18n

- `messages/nl.json`, `fr.json`, `en.json`, `ar.json` MUST dezelfde sleutelstructuur delen.
- `ar` MUST RTL renderen.
- Admin copy MUST Nederlands blijven.

### 13.2 SEO

- Elke publieke pagina MUST metadata hebben.
- Homepage MUST JSON-LD voor `FoodEstablishment` bevatten.
- Sitemap SHOULD aanwezig zijn.

---

## 14. Buildvolgorde

Werk in deze volgorde. Elke stap MUST functioneel zijn voor je doorgaat.

### Stap 1: Fundament

1. Next.js app opzetten
2. Tailwind tokens en fonts instellen
3. `next-intl` instellen
4. Middleware voor locale routing
5. Supabase clients instellen
6. Basis publieke layout bouwen
7. Deploybare basis naar Vercel

### Stap 2: Menu en cart

1. Database migraties schrijven
2. Seed data laden
3. `GET /api/menu`
4. Menu UI en dish row cards
5. Zustand cart
6. Cart drawer

### Stap 3: Checkout en betalingen

1. Checkout form flow
2. Zod schema's
3. `POST /api/checkout`
4. Mollie create payment
5. Mollie webhook
6. Publieke orderstatus met token
7. Factuur PDF
8. Cron voor expired orders

### Stap 4: Admin basis

1. Supabase login
2. Allowlist auth guard
3. Dashboard
4. Orders
5. Dishes

### Stap 5: Admin uitgebreid

1. Weekplanner
2. Klantenbeheer
3. Catering inbox
4. Quotes
5. Refunds
6. Settings

### Stap 6: Publieke pagina's

1. Homepage
2. Catering pagina
3. Over ons
4. FAQ
5. Contact
6. 404 en 500

### Stap 7: Analytics en polish

1. Admin analytics
2. CSV export
3. SEO
4. Cookie consent
5. Performance audit

---

## 15. Test- en acceptatiecriteria

### 15.1 Checkout

- Online payment reserveert direct stock.
- Niet-betaalde online order vervalt na 15 minuten en geeft stock terug.
- Cash pickup order wordt direct bevestigd.
- Cash delivery order wordt direct bevestigd.
- Geblokkeerde klant krijgt generieke fout.
- Levering buiten toegelaten postcode faalt.
- B2B order zonder volledige factuurdata faalt.

### 15.2 Security

- Admin route zonder sessie geeft `401`.
- Admin route met sessie buiten allowlist geeft `403`.
- Publieke orderstatus zonder token geeft geen data.
- Publieke orderstatus met fout token geeft geen data.
- Service role of Mollie keys zijn nergens client-side zichtbaar.

### 15.3 Facturatie en refunds

- Betaalde of bevestigde B2B-order genereert exact 1 factuur.
- Volledige refund werkt.
- Partiele refund werkt.
- Refundstatus wordt correct opgeslagen.

### 15.4 i18n en UI

- Publieke site werkt in `nl`, `fr`, `en`, `ar`.
- Arabisch rendert RTL correct.
- Admin blijft Nederlands.
- Dish list gebruikt row layout, geen generieke card-grid.

### 15.5 Operaties

- `takeaway_active=false` blokkeert checkout volledig.
- WhatsApp-falen blokkeert geen order.
- Plausible script laadt alleen na consent.

---

## 16. Hard rules

Deze regels mogen nooit overtreden worden:

1. TypeScript strict mode. Geen `any`, geen `@ts-ignore`.
2. Server Components by default. Alleen `'use client'` waar nodig.
3. Prijzen altijd in centen.
4. Geen service role key client-side.
5. Geen Mollie key client-side.
6. Geen secrets hardcoded.
7. Alle formulieren valideren met Zod.
8. Alle DB-queries via Supabase client of Supabase RPC.
9. Geen raw SQL in applicatiecode.
10. Afbeeldingen via `next/image`.
11. Geen inline styles.
12. Klantfouten moeten gebruiksvriendelijk zijn.
13. Ordernummers gebruiken formaat `T2G-0001`.
14. BTW voor voeding is 6%.
15. Belgische context overal: EUR, Belgische postcodes, DD/MM/YYYY.
16. GDPR-compliant consent voor publieke analytics.
17. Publieke ordertoegang alleen via geldig bearer token.
18. Voorraadmutaties alleen transactioneel en atomair.

---

## 17. Defaults bij ontbrekende info

Als een implementer tijdens de bouw informatie mist, gelden deze defaults:

- Gebruik placeholders voor copy, logo, hero video en afbeeldingen.
- Behandel WhatsApp als optionele integratie.
- Gebruik Supabase Storage voor PDF-opslag.
- Gebruik Vercel Cron voor order expiry cleanup.
- Houd cateringbevestiging manueel; geen klant-self-service quote acceptatie.

Afwijken van deze defaults mag alleen als dit document expliciet aangepast wordt.
