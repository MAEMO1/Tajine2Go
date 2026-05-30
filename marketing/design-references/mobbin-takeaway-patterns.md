# Mobbin — Takeaway / Food-Ordering Pattern Study

> Pulled live from Mobbin (curated real-product screens) on 2026-05-29, mapped to Tajine2Go's
> actual features: weekly menu (open ~1 day/week), pickup-slot selection, cart + checkout
> (online/cash, pickup/delivery), and atmospheric Belgian-Moroccan brand.
> Companion to the Dishoom / Sweetgreen / Daylesford studies in this folder.

---

## 1. Menu & dish browsing

| App | Screen |
|---|---|
| HelloFresh | https://mobbin.com/screens/8c1c5e91-3a0e-44b7-9212-391020f0fd62 |
| DoorDash (The Melt) | https://mobbin.com/screens/7a69e4bd-b541-4e0b-ac3e-a77310ac4951 |
| sweetgreen | https://mobbin.com/screens/0f06d582-53bf-4c16-8fcc-ea385f31e7ca |
| DoorDash (Most Ordered) | https://mobbin.com/screens/0014b86b-bf3b-4d9e-b32e-7ef50a1a9322 |
| Uber Eats (Jack in the Box) | https://mobbin.com/screens/f2d87112-86b4-4670-98d7-743d8e53d54f |

**Patterns observed**
- **Date-anchored menu header** — HelloFresh: *"Shop for Sun, Aug 10"*. The whole menu is framed around a service date. ⭐ Direct fit for T2G's once-a-week model: header should read *"Menu voor zaterdag 14 dec"* not a generic "Menu".
- **Category filter chips** (HelloFresh: New / High Protein / Seasonal / Bestsellers) and **left-rail category nav** (DoorDash/Uber Eats) for longer menus.
- **Social-proof badges** — "#1 Most liked", "94% (726)", "Bestseller". Cheap trust signal.
- **Scarcity label** — sweetgreen: *"SG REWARDS EXCLUSIVE: 1 WEEK ONLY"*. Limited-time framing.
- **Inline quantity stepper on the card** (HelloFresh "− 1 +") rather than a bare "Add" — fewer clicks for multi-portion orders.
- **Persistent desktop cart** — sweetgreen/Uber Eats keep a slide-over/side cart with line items, running total and a checkout CTA always visible.

**For T2G:** date-anchored menu title · bestseller badge on the week's hero dish · inline steppers on dish rows · persistent side-cart on desktop (drawer on mobile, already present).

---

## 2. Cart & checkout

| App | Screen |
|---|---|
| Uber Eats (delivery details + totals) | https://mobbin.com/screens/f933fbd1-ff1d-4b75-ac25-154cd1c96bbd |
| DoorDash (numbered steps + tip) | https://mobbin.com/screens/d4b6746e-3b80-4ebc-8f5a-3377dd9c83d1 |
| DoorDash (account → shipping → payment) | https://mobbin.com/screens/b4581231-470d-4091-8b2a-465f375df027 |
| Uber Eats (pickup time card) | https://mobbin.com/screens/f64ccb3c-55c0-4129-a418-739af438c60d |
| Uber Eats (loading skeleton) | https://mobbin.com/screens/12575712-adec-4c9b-b208-58e290e44e56 |

**Patterns observed**
- **Two-column checkout** — form on the left, **sticky order summary on the right** (store name, itemised totals, single primary CTA). Totals are *always visible* while filling the form.
- **Numbered steps** — DoorDash: *1. Account details · 2. Shipping details · 3. Payment details*. Reduces cognitive load on a long form.
- **Fulfillment toggle at the top of the card** — Delivery / Pickup segmented control → maps to T2G `fulfillment`.
- **Fulfillment-time options as selectable cards** — "Right now" vs "Fri, Sep 5, 12:00–12:30 PM".
- **Itemised total breakdown** — Subtotal · (Delivery) Fee · Discount · Taxes · **Total** bolded. T2G should show subtotal + delivery fee + total (and 6% BTW line for B2B invoices).
- **Skeleton loaders** in the totals panel during async recalculation (no layout jump).
- **One dominant CTA** ("Continue to payment" / "Place Order") — never two competing primary buttons.

**For T2G:** two-column checkout with a sticky summary · numbered sections (gegevens → afhaling/levering → betaling) · pickup/delivery segmented toggle · always-visible itemised totals · skeleton state while validating stock/postcode.

---

## 3. Pickup-slot selection

| App | Screen |
|---|---|
| foodpanda (collection time sheet) | https://mobbin.com/screens/64418cb5-3cc2-4a53-98b1-71da28fd013b |
| Uber Eats (schedule pick-up) | https://mobbin.com/screens/2e47cd43-64f1-410e-94f1-acf33523b6c4 |
| Honest Greens (brand-forward order) | https://mobbin.com/screens/8870c117-38bc-48f0-a8d7-a9cc9dda397a |
| Honest Greens (time wheel) | https://mobbin.com/screens/2e24194c-f024-4381-889b-c4a68143ab40 |

**Patterns observed**
- **Day tabs + time-range radio list** — foodpanda: day tabs (Today / Fri / Sat) → list of ranges (00:00–01:00). Clean and scannable. ⭐ Ideal for T2G's single service day broken into slots.
- **ASAP vs Schedule** — "Pick up now" vs "Schedule for later (plan up to 2 days ahead)". T2G is almost always *schedule-only* (closed 6 days), so default to the schedule list.
- **Time wheel picker** (Honest Greens) — premium, tactile; "Confirm time" pill to commit.
- **Brand stays in the flow** — Honest Greens overlays editorial type ("HEY, ALEX.") on a full-bleed food photo *inside* the order screen. The ordering UI doesn't have to look like a utility form. ⭐ Key reference for keeping T2G's editorial identity through checkout.

**For T2G:** slot picker = day label ("Zaterdag 14 dec") + radio list of pickup windows (12:00–12:30, …) with capacity/sold-out state per slot · explicit "Bevestig tijdslot" · keep brand type + warmth in the flow.

---

## 4. Atmospheric hero / brand homepage

| App | Screen |
|---|---|
| Squarespace ("Culinary Revolution", panel) | https://mobbin.com/screens/6e7210a1-384a-4a6b-b30e-cf446394e1b9 |
| Squarespace (centered serif, courtyard) | https://mobbin.com/screens/6f2641ba-4b70-4aad-b0f8-db81e7cddbe2 |
| Blue Apron (italic accent headline) | https://mobbin.com/screens/805f4252-63f7-4022-94b2-7aa624e655e6 |
| sweetgreen (full-bleed hands + bowl) | https://mobbin.com/screens/effd4864-d9f6-434b-9269-aebea371d1ab |
| Squarespace (translucent panel detail) | https://mobbin.com/screens/493f4d19-6dfb-49af-af9f-ba9e3bb187d5 |

**Patterns observed**
- **Big serif display over atmospheric photo** — confirms the design brief. The courtyard-light Squarespace template is strikingly close to T2G's "Riad Saturday" direction.
- **Italic accent on one key word** — Blue Apron: "Meet the *new* Blue Apron". ⭐ Exactly the brief's planned italic treatment on *"Marokkaanse"*.
- **Translucent color-block text panel** over the photo (Squarespace, sage-green) — gives type contrast without darkening the whole image. T2G could use a translucent terracotta/olive panel.
- **Masthead nav** — centered logo, social icons, single pill CTA ("Custom Order" / "Book now" / "ORDER NOW").
- **Hands-serving / courtyard photography** — sweetgreen & Squarespace both use human-touch, warm-light imagery (matches the brief's imagery direction, away from generic plated-on-white shots).

**For T2G:** keep the planned asymmetric serif hero + italic "Marokkaanse" · consider a translucent terracotta panel for the lede over the storefront/tagine photo · masthead nav with one orange pill CTA.

---

## 5. Closed / sold-out / order-for-later  ⭐ MOST IMPORTANT FOR T2G

T2G is **closed 6 days out of 7** — so "what happens when we're closed" is not an edge case, it's the *default* state most visitors land in.

| App | Screen |
|---|---|
| CHOPT ("closed → schedule an order") | https://mobbin.com/screens/f51f6399-6a7c-4756-9a2e-d0439202e6fb |
| Uber Eats / Philz ("opens at 7AM, schedule") | https://mobbin.com/screens/cbcfbed8-fbd5-46ce-9c67-14c1f8bb3707 |
| DoorDash / Salt & Straw ("currently closed") | https://mobbin.com/screens/0d80d631-65bd-4414-a730-65cc1b383d0a |
| Yelp / Grubhub ("takeout by tomorrow") | https://mobbin.com/screens/5d05fc59-b6b2-4132-a5be-6c0aa64436f4 |

**Patterns observed**
- **Closed never dead-ends.** Every example converts "we're closed" into *"schedule an order for later"*:
  - CHOPT: *"Closed • Opens tomorrow at 10:30am … You can still place an order for a later date. You'll choose your pickup date and time during checkout."* + **SCHEDULE AN ORDER**.
  - Philz: *"This store is closed right now, but you can schedule an order for later."* + day/time list + **Select time**.
  - Grubhub: *"Takeout by Tomorrow 10:15 AM — currently closed and will take your order for tomorrow. You can change your time at checkout."*
- **Clear next-open line** in an accent colour ("Closed • Opens tomorrow at 10:30am").
- **Menu stays browsable** while closed (which T2G's spec already requires — read-only menu).

**For T2G — the big reframe:** today `takeaway_active=false` simply *blocks* checkout. Instead, treat the closed state like these apps: a prominent *"Volgende service: zaterdag 14 dec · pre-order nu"* banner with a **pre-order CTA** that opens the menu and lets the customer reserve for the next service day. This turns 6 dead days into 6 selling days. (Respect the spec's hard rule that checkout is blocked while inactive — but a *pre-order for the next active date* is a distinct, allowed flow worth designing.)

---

## Top takeaways to feed the improvement roadmap

1. **Reframe the closed state into pre-order** (CHOPT pattern) — highest-leverage, T2G-specific.
2. **Date-anchor the menu** ("Menu voor zaterdag …") — HelloFresh.
3. **Two-column checkout with sticky itemised summary + numbered steps** — Uber Eats / DoorDash.
4. **Day-tab + radio-list pickup slot picker with per-slot capacity** — foodpanda.
5. **Keep editorial brand identity inside the ordering flow** — Honest Greens.
6. **Italic-accent serif hero + translucent warm panel** — Blue Apron / Squarespace.
7. **Bestseller / "1 week only" badges + inline steppers + persistent cart** — sweetgreen / HelloFresh.
