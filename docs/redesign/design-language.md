# Tajine2Go — Design Language v3 "Op zacht vuur"

> Bindend voor de 2026 redesign. Vult CLAUDE.md §5 aan — overtreedt het nooit.
> Concept: de site als slow-cooked zintuiglijke ervaring. Warmte, stoom, terracotta,
> zellige-geometrie. Scrollen = het deksel van de tajine optillen.

## 0. Onaantastbaar (uit CLAUDE.md)

- Brand kleuren exact zoals in `globals.css` `@theme` (brand-orange `#E75A0A`, cream `#FFF8EA`, brown `#3B1606`, …) — afgeleid van het officiële brand kit (Spice Orange / Saffron Gold / Tajine Dark Brown / Soft Cream).
- Eén lettertype-familie: **Geist** (display én body, hiërarchie via gewicht/grootte/tracking), **Geist Mono** voor kickers/labels/prijzen/cijfers, **Noto Sans Arabic** voor `ar`.
- Dish-lijsten zijn **rijen**, nooit een card-grid. Prijzen prominent: zwaar Geist-gewicht of Geist Mono, brand-orange.
- Primaire knop `bg-brand-orange text-white`; secundair bruine outline. Inputs `border-brand-brown-s rounded-lg text-sm`.
- Logo: officieel brand kit primary horizontal (`/brand/logo/…`, fallback in header) + admin override via `brand_assets.header_logo_url`. Usage guide: min. 180px breed, 10% clearspace, nooit herkleuren of uitrekken.
- Geen inline styles in JSX (GSAP runtime-styles zijn de animatie-engine, dat is OK). Afbeeldingen via `next/image` (bestaande logo-`<img>` uitzondering blijft).
- Alle interne links via `@/i18n/navigation` (nooit `next/link`). Server Components by default; `'use client'` alleen in motion/interactie-bladeren.
- CMS-copy (site-content props) altijd dynamisch renderen, nooit hardcoden. i18n keys in alle 4 talen.

## 1. Visuele richting

1. **Licht ↔ donker ritme.** De site was 100% cream. Nu wisselen secties: cream → warm →
   **ember** (diep bruin `bg-brand-brown`, tekst cream, oranje accenten) → cream. Het
   donkere "smeulende" story-blok is het dramatische hart van de homepage.
2. **Extreme typografische schaal.** Display: `font-sans` uppercase, `font-weight` 650–800,
   `tracking-[-0.03em]`, maten via `clamp()` tot ±`11rem` op desktop. Kickers: Geist Mono,
   11px, `tracking-[0.3em]`, uppercase, brand-orange, met een liggend streepje ervoor.
   Lichaamstekst rustig: 16–17px, `leading-[1.7]`, brand-brown-m.
3. **Zellige-geometrie als signatuur.** Het 8-puntige khatam-sterretje (SVG, twee
   over elkaar gedraaide vierkanten) als: sectie-divider, lijstmarkering, marquee-separator,
   draaiend accent. Subtiel patroon-overlay (≤6% opacity) op ember-secties.
4. **Korrel + diepte.** Bestaande grain-overlay blijft. Schaduwen warm en zacht:
   `shadow-[0_25px_60px_-20px_rgba(45,27,10,0.35)]`.

## 2. Motion-systeem (GSAP 3.15 + Lenis)

Centrale infra in `src/components/motion/` + `src/lib/motion/gsap.ts` (registreert
ScrollTrigger + SplitText, exporteert gsap). **Gebruik altijd deze componenten,
schrijf geen losse gsap-code per pagina.**

| Component | Gedrag |
|---|---|
| `<MotionProvider>` | Lenis smooth scroll gesynct met ScrollTrigger; uit bij `prefers-reduced-motion` en op touch blijft native momentum. Gemount in `[locale]/layout.tsx`. |
| `<SplitHeading as="h2">` | SplitText line-mask reveal: regels `yPercent:110→0`, stagger 0.08, `power4.out`, on-scroll. **Voor `ar`: géén split** (ligaturen!) — hele element fade-up. |
| `<Reveal>` | Fade-up 28px / 0.9s `power3.out`, `once`. Props: `delay`, `y`. Vervangt framer ScrollReveal in nieuwe code. |
| `<Parallax speed={0.x}>` | Subtiele y-parallax via ScrollTrigger scrub. |
| `<Magnetic>` | CTA's trekken ≤8px naar cursor, elastic terug. Alleen `pointer:fine`. |
| `<Marquee>` | Oneindige band (GSAP ticker), RTL-bewust (richting spiegelt), pauzeert traag op hover. |
| `<CustomCursor>` | Dot + ring, groeit op links/knoppen (`data-cursor="hover"`), label-variant via `data-cursor-label`. Alleen `pointer:fine`, verdwijnt bij reduced-motion. |
| `<TajineHero>` | Three.js scène, zie §3. |

**Regels:** alle x-bewegingen spiegelen voor RTL (`dir === 'rtl'` ⇒ x × −1).
`prefers-reduced-motion: reduce` ⇒ geen scrub/parallax/split; alles wordt direct
zichtbaar (gsap.matchMedia). Animaties zijn progressive enhancement: zonder JS is
alle content zichtbaar (start-states via gsap.set in effect, nooit via CSS `opacity:0`).

## 3. Three.js hero — "het deksel gaat open"

`src/components/three/` — vanilla Three.js (geen react-three-fiber), client-only,
lazy via `next/dynamic` + `ssr:false`. Scène:

- **Procedurale tajine**: LatheGeometry-schotel + conisch deksel + knop, terracotta
  materiaal (kleuren uit brand-palet: bronze/orange/brown), warme key-light + rim.
- **Stoom**: ~180 zachte additive sprites (canvas-radial-gradient texture), stijgen
  met sinus-drift, faden uit.
- **Specerijen-stof**: kleine goud/oranje particles voor diepte.
- **Interactie**: muis-parallax (camera-lerp); ScrollTrigger-scrub tilt het deksel
  omhoog terwijl je door de hero scrolt en de stoom intensiveert.
- **Degradatie**: WebGL-fail / reduced-motion / `saveData` ⇒ statisch beeld
  (warme gradient + logo-silhouet). DPR ≤ 2, pauze wanneer offscreen, dispose on unmount.

## 4. Micro-interacties (verplichte details)

- **Dish row**: hover ⇒ foto zoomt 1.06 + roteert 1°, oranje accentlijn schuift in,
  prijs kleurt feller. Add-to-cart: knop morft naar ✓, een **vliegende dot** animeert
  van knop naar cart-badge (GSAP flip-achtig: fixed dot, bezier naar badge), badge popt.
- **Header**: krimpt bij scroll (bestaand), nav-links krijgen schuivende underline,
  cart-icoon wiebelt (`rotate ±8°`) bij elke toevoeging.
- **Knoppen**: primair = magnetic + pijl die 4px doorschuift op hover; actief `scale .98`.
- **Accordion (FAQ)**: native `<details>` blijft (server!), custom chevron roteert,
  content glijdt open via CSS grid-rows trick.
- **404**: dwalende tajine-illustratie + grote 404 in display-schaal.

## 5. Sectie-anatomie homepage (volgorde bindend)

1. **Hero** (full-viewport, `bg-[#F8F3E9]`-achtig licht): links kicker + SplitText-kop
   (`heroTitleA` + *accent in brand-orange* + `heroTitleB`) + subtitle (CMS) + CTA's
   (magnetic) + service-chip (datum/cutoff). Rechts/achter: TajineHero-canvas.
   Onderaan: scroll-cue + **live marquee** (volgende service · cutoff · Gent · ster-separators).
2. **USP-strip**: 3 items, icon-draw-in, hover-lift.
3. **Menu van de week** (`#menu`): sticky categorie-pills (bestaande logica behouden),
   editorial sectiekop met SplitText, dish rows met micro-interacties.
4. **Story — ember-sectie** (donker): SplitHeading in cream, CMS `story_text`,
   parallax-foto met clip-reveal (`hero-storefront.jpg`), zellige-overlay, link naar over-ons.
5. **Catering CTA** (warm): clip-reveal beeldvlak, event-type chips, magnetic CTA's (CMS-copy).
6. **Footer**: gigantisch wordmark (scroll-reveal per letter), dan bestaande kolommen.

## 6. Subpagina-patroon

Elke subpagina opent met een **page-hero band**: kicker (mono, oranje) + display-kop
(SplitHeading) + eventuele CMS-subtitle, op cream met subtiel khatam-watermerk.
Daarna content in het bestaande data-contract. Bestellen/checkout: alléén visuele
restyling (inputs per spec, kaarten, reveals) — **alle form-logica, useEffects,
Zod-koppeling en redirects blijven byte-voor-byte qua gedrag**. Order-status: minimale
data (5 velden) blijft; voeg een status-tijdlijn-visual toe op basis van de 7 statussen.

## 7. Performance & a11y budget

- Three.js alleen op de homepage-hero; bundel lazy; geen fiber.
- LCP-element (hero-kop) rendert server-side; canvas is enhancement.
- `prefers-reduced-motion` overal gerespecteerd; focus-visible ringen
  (`outline-brand-orange`) op alle interactieve elementen; cursor-component is
  puur decoratief (geen `cursor: none` zonder fallback-focus-stijlen).
- ar/RTL: logical properties (`start/end`), marquee/parallax gespiegeld, geen SplitText-chars.
