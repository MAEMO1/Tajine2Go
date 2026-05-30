# Tajine2Go — Improvement Roadmap

> Synthesis of three inputs gathered 2026-05-29 via a 10-agent workflow + Mobbin MCP:
> **(A)** code audit of the live frontend against [the design brief](tajine2go-design-brief.md),
> **(C)** 5 competitor research reports (Thuisbezorgd/Just Eat · Uber Eats/Deliveroo · premium
> single-restaurant ordering · weekly-drop/pre-order · catering + Moroccan/halal design),
> **(M)** [Mobbin pattern study](mobbin-takeaway-patterns.md) (23 real-product screens).
>
> Each recommendation is tagged with the sources that independently pointed to it — `[A]` audit gap,
> `[C]` competitor pattern, `[M]` Mobbin. Items backed by all three are the safest, highest-leverage bets.

---

## A. Wat gedaan werd (current state)

The foundations are genuinely strong — this is **not** generic AI UI. The hero is a real, well-executed
piece of editorial design. The weakness is **consistency**: the hero sets a premium editorial bar that the
rest of the site (chrome, menu, checkout, secondary pages) hasn't caught up to yet.

| Area | Brief alignment | One-line verdict |
|---|---|---|
| Homepage hero | **6/10** | Correct editorial type (Gloock + Instrument Serif italic "Marokkaanse" + IBM Plex Mono), real art-directed photo, asymmetric split. Missing the make-or-break status row + orange CTA. |
| Menu & cart | **6/10** | True row layout, orange prices, good sold-out/scarcity UX, real motion. But **no mobile cart drawer** and **no add-to-cart feedback**. |
| Checkout | **5/10** | Functionally the most complete & spec-faithful surface. But off-brand type, weak payment clarity, raw English validation errors, and a `country_code` bug. |
| Design system / chrome | **6/10** | Brand tokens + RTL plumbing solid; hero nails the brief. But header/footer/sticky-bar still run on **Bebas Neue** — two font systems loaded in parallel. |
| Secondary pages | **3/10** | Weakest. Catering/over-ons/faq/contact are a bare skeleton that ignores the homepage editorial system. Over-ons has no storytelling; catering has no quote framing. |

### Two meta-observations

1. **The brand is "split-brained."** The hero uses the editorial stack (Gloock / Instrument Serif / IBM Plex
   Mono); everything else uses the legacy **Bebas Neue** stack — and *both* are loaded simultaneously
   (`src/app/layout.tsx:13`). The editorial migration was started on the hero and never finished. This is the
   single biggest reason the site feels inconsistent rather than premium-throughout.

2. **The ornament work pulls against the brief.** Recent commits (`e4f39cd` 12-point star rosettes,
   `b7bda97` islimi arabesque, `0d556b3` gebs, `5bc7aa7` 8-point star lattice) invested heavily in geometric
   ornament — but the brief's #1 cultural rule is *"ornament ONCE, with reason, never sprinkled."* The good
   news: `hero-canvas.tsx` is currently **dead code** (imported nowhere), so it isn't hurting the live page,
   and the *monochrome* trajectory (colored tiles → gebs relief) is actually the right direction per the
   cultural-design research `[C]`. It just needs to land as a single restrained accent, not a wallpaper.

---

## B. Hoe te verbeteren (prioritized roadmap)

### 🔴 P0 — Highest leverage, do first

#### P0-1 · Surface schedule-derived availability (service-day · hours · fulfillment · cutoff) as ONE source of truth `[A][C][M]` · see [ADR 0001](../../docs/adr/0001-beschikbaarheid-weekpatroon-en-datum-uitzonderingen.md)
**Reframed after grilling (2026-05-29).** The audit assumed T2G was "closed ~6/7 days", but the code already lets
customers **order ahead** for the next service-day whenever takeaway is active — `takeaway_active=false` (*globale
pauze*) is the *only* fully-blocked state. So this is **not** "unblock a blocked flow"; it's (a) make availability
legible and (b) build the new schedule pieces (datum-uitzonderingen + bestel-cutoff, and derive the public
opening-info from the schedule instead of a separate hand-typed text field). Concretely:
- Add a **status row in the hero**: pulse dot + `Volgende service: zaterdag 14 dec · 12—19h` in Geist Mono
  small-caps (the date is already computed in `homepage-menu.tsx:61`). *Audit calls this "the single highest-leverage fix for brief alignment."*
- Add a **persistent "next service + order-by cutoff" ribbon** under the header (reuse `info-strip.tsx`):
  `Volgende afhaaldag za 31/05 · Bestel voor do 18:00`.
- Keep the menu **browsable read-only** when closed (already a hard rule) but add a warm banner stating
  *exactly when ordering re-opens*, with an optional countdown — turn the dead-end into anticipation.
- Where a dish or the week is sold out, capture forward demand: *"Uitverkocht — volgende afhaaldag za 7/6, laat je mailen"* (notify-me for the next drop).
- Files: `src/app/[locale]/page.tsx:90` (hero status), `src/components/info-strip.tsx` (ribbon), `globals.css` (add `@keyframes pulse`), `checkout-form.tsx:219` (closed-state).

#### P0-2 · Consolidate on ONE modern grotesk (Geist) — remove BOTH Bebas Neue AND the editorial set `[A][C]` · see [ADR 0002](../../docs/adr/0002-lettertype-een-moderne-grotesk-geist.md)
**Decision (2026-05-29): no editorial / no serif.** Make the *whole* site speak one clean voice — **Geist** for titles + body
(hierarchy via weight/size/tracking), **Geist Mono** for labels/prices/order codes, Noto Sans Arabic for `ar`. Delete
**both** legacy stacks (Bebas Neue/Source Sans 3 *and* Gloock/Instrument Serif/IBM Plex Mono) currently loaded in
parallel in `layout.tsx` — cuts payload and ends the split-brain. The hero's italic-serif accent on "Marokkaanse" is
re-expressed within Geist (weight/colour, not a serif italic).
- Header nav + footer headings → mono small-caps or Gloock (`header.tsx:273`, `footer.tsx`).
- Menu H1, dish names & price figure → Gloock; category labels → mono small-caps (`dish-row.tsx:50`, `menu-content.tsx:57`).
- Checkout H1 + section labels → Gloock + mono (`checkout-form.tsx:190`).
- All four secondary-page H1s → homepage masthead pattern (`over-ons/page.tsx:15` etc.).
- Remove the abandoned `--font-*` set + its `next/font` imports (`layout.tsx:13`).

#### P0-3 · Fix the mobile cart + add-to-cart feedback `[A][C][M]`
Two functional holes that hurt the core flow on the most common device.
- **Mobile cart drawer/bottom-sheet** — the editable `CartDrawer` is desktop-only (`cart-drawer.tsx:35`,
  `hidden md:flex`); on mobile `StickyBar` just links to `/bestellen`. This **violates CLAUDE.md §5.4**.
  Make the drawer open as a bottom-sheet under `md`.
- **Add-to-cart confirmation** — `addItem` fires silently (`dish-row.tsx:91`): no toast, no count-badge
  animation, no `aria-live`. Add immediate visual confirmation + a polite live-region announcement.
- **Persistent basket bar + min-order progress nudge** `[C][M]`: *"Nog €4,50 tot het minimum van €20"* with the
  checkout CTA disabled until met (uses existing `min_order_cents`).

#### P0-4 · Checkout correctness + trust fixes `[A][C][M]`
Quick, high-impact, and two of these are genuine **spec violations / bugs**:
- **`country_code` bug** — `register()` + `value="BE"` on a hidden input isn't reliably written to RHF state
  (`checkout-form.tsx:374,465`); with `z.literal('BE')` this can **reject delivery/B2B orders**. Use
  `setValue`/`defaultValues` or a `Controller`. *(Verify a delivery + invoice submission carries `country_code`.)*
- **Localize Zod messages** — bare `.email()`/`.min(1)` surface raw English errors under fields
  (`validations/checkout.ts:16`), **violating the user-friendly-error hard rule** and breaking i18n.
- **Payment-method clarity** — render online/cash as bordered selectable cards with **Bancontact/iDEAL/Visa-MC
  logos** and a reassurance line (*"Veilig betalen via Mollie"* / *"Betaal cash bij afhaling"*). Belgian payment
  recognizability is a known conversion lever (`checkout-form.tsx:379`).

---

### 🟠 P1 — Strong improvements

#### P1-1 · Upgrade the pickup-slot picker `[A][C][M]`
Replace the bare `<select>` with a **visual time-pill grid** in 3 states — selectable / selected (orange fill) /
**full-disabled-but-visible** (greyed "Vol", never hidden — Baymard: hiding makes users underestimate options).
Default to the next available slot. Drive per-slot capacity from the existing model. Pattern: foodpanda day-tabs +
radio list `[M]`. (`checkout-form.tsx:323`)

#### P1-2 · Two-column checkout with sticky summary + numbered sections `[A][C][M]`
Move from one tall single column to a **two-column layout**: form left, **always-visible itemised order summary
right** (Uber Eats/DoorDash `[M]`). Number the sections (`00 Overzicht / 01 Gegevens / 02 Afhaling / 03 Betaling`)
with hairline rules. Add a **sticky bottom total + CTA on mobile**. Inline on-blur validation with positive
confirmation (green-check *"binnen leverzone"* on postcode). (`checkout-form.tsx:192`)

#### P1-3 · Surface honest scarcity + the 15-min hold timer consistently `[A][C][M]`
Scarcity is T2G's differentiator and the schema already supports it. Keep sold-out dishes **visible** with an
elegant `Uitverkocht` pill + disabled add; show bounded `Nog X porties` only when `max_portions` is set (never
fake it when `null`). Carry the cutoff countdown into the cart, and give the real **15-min online-payment hold**
(`payment_expires_at`) a UI home: *"Je porties zijn 15 min gereserveerd."* (`dish-row.tsx:77`)

#### P1-4 · Rebuild the secondary pages (weakest area, 3/10) `[A][C]`
- **Over-ons** → asymmetric two-column story: `hero-storefront.jpg` photo, Gloock dropcap, one **NL + AR
  pull-quote** (Arabic smaller, in olive — quiet companion). (`over-ons/page.tsx:17`)
- **Catering** → quote framing: free-quote promise + **24h response SLA**, event-type as **icon cards** (incl.
  aqiqa/iftar), guest-count buckets, optional budget field (`budget_cents` exists), and a **customer auto-ack
  email** after submit. Mirror the terracotta catering block. (`catering-form.tsx:101`)
- **FAQ** → hairline-separated rows with mono index numbers + rotating chevron. (`faq/page.tsx:18`)
- **Contact** → add a static storefront image/map; promote the catering note to a CTA.

---

### 🟡 P2 — Polish & differentiation

- **P2-1 · Reconcile the ornament** `[A][C]` — do **not** mount `hero-canvas.tsx`; reduce to a single restrained
  **monochrome** Maghrebi hairline accent (one line under the H1). Remove redundant decorations (grain + diamond
  + zellige-dots). Authenticity should come from **content** (provenance, real dish names, halal cues), not tile
  density. (`hero-canvas.tsx:6`, `page.tsx:237`)
- **P2-2 · Push the hero further** `[A]` — H1 toward `clamp(64px,10vw,150px)`, leading `0.92`; add the
  **steam-rise** animation + an **ingredient marquee** (brief's missing motion). Make the primary hero CTA the
  **solid orange pill** + secondary an underlined text link (currently both brown). (`page.tsx:98,117`)
- **P2-3 · Bilingual dish names** `[A][C]` — surface `name_ar` on `MenuDish` and render as a quiet secondary
  line (*Dajaj b'Zaytun*) under the NL name. (`menu-data.ts:177`)
- **P2-4 · Section rhythm + canvas token** `[A]` — increase desktop section spacing toward `py-32` (128px),
  standardize a `1320px` max width, and warm the cream toward `#FBF6EC` (retire the one-off `#F4F0E8`). (`globals.css:9`)
- **P2-5 · Order-status page as a branded moment** `[C][M]` — multi-step tracker (Bevestigd → In bereiding →
  Klaar → Afgehaald) on the token-gated `/order/[id]`, restating the pickup slot — using only the minimal fields
  the spec allows.
- **P2-6 · RTL hardening** `[A][C]` — Arabic needs its own type scale (≈18–20px, line-height ≥1.8, **no**
  letter-spacing), logical properties site-wide, and `<bdi>` around embedded Latin (email, `T2G-0001`, prices).
- **P2-7 · Email-based reorder** `[C]` — one-tap "Opnieuw bestellen" for weekly regulars (high retention value;
  datamodel is auth-ready).

---

### ⚡ Quick hard-rule / correctness fixes (do alongside P0 — each is small)

| Fix | Rule broken | File |
|---|---|---|
| `country_code` hidden-input not written to form state | correctness bug (breaks delivery/B2B) | `checkout-form.tsx:374,465` |
| Raw English Zod validation messages | Hard rule 12 (user-friendly errors) + i18n | `validations/checkout.ts:16` |
| Catering form inputs styled via `<style jsx>` with hardcoded hex `9C8468`/`D97B1A` | Hard rules 6 (no hardcoded brand values) + 11 (no inline styles) | `catering-form.tsx:172-184` |
| Catering placeholder `style={{ backgroundImage… }}` | Hard rule 11 (no inline styles) | `page.tsx:314` |
| Catering: past `event_date` submittable; no GDPR consent line | data quality / compliance | `catering-form.tsx:145` |

---

## C. The "if you only do three things" version

1. **Make the closed days sell.** Status ribbon + pulse-dot "Volgende service" + pre-order framing + sold-out
   notify-me. (P0-1)
2. **Finish the editorial system everywhere.** Retire Bebas Neue; one consistent premium voice from hero to
   confirmation. (P0-2)
3. **Fix the mobile cart + checkout correctness.** Bottom-sheet cart, add-to-cart feedback, `country_code` bug,
   localized errors, Belgian payment cards. (P0-3 + P0-4)
