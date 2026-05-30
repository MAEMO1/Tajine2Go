# Tajine2Go — Design Brief

> Synthesized from skillui extractions of Dishoom, Sweetgreen, and Daylesford. This brief drives the homepage mockup rebuild.
>
> ⚠️ **Achterhaald op typografie (2026-05-29).** De editorial serif-richting (Fraunces/Gloock + Instrument Serif + IBM Plex Mono) is verlaten. Canoniek lettertype is nu één moderne grotesk: **Geist** (+ Geist Mono), Noto Sans Arabic voor `ar`. Zie `docs/adr/0002-lettertype-een-moderne-grotesk-geist.md` en CLAUDE.md §5.2. De rest van deze brief (kleur, layout, spacing, motion, foto-richting, culturele restraint) blijft geldig.

---

## Why the previous mockups failed

1. **Timid typography.** Used `clamp(52px, 7vw, 108px)` for hero headings. Dishoom uses 145px Georgia for H1. Premium dining demands bigger, bolder type.
2. **Generic AI aesthetics.** Tailwind utility-soup without an opinionated design system. No clear point of view.
3. **Mobbin references not metabolized.** I described atmospheric photography but used random Unsplash tagine shots. Squarespace's "Culinary Revolution" works because of *intentional* photo art-direction.
4. **Decorative ornament substituting for design.** Zellige tiles and 8-point stars were sprinkled on, not integrated. Cultural respect ≠ visual clichés.
5. **No motion.** Dishoom has 22 keyframe animations including themed illustrations. Static HTML feels dead next to real premium food brands.

---

## What real premium food brands actually do

### Dishoom — Cultural premium, atmospheric (closest match to T2G aspiration)

- **Type**: Georgia serif at HUGE scale (H1 145px, H2 108px, H3 100px) paired with Gill Sans Nova for body.
- **Custom brand font**: "DishoomBattersea" — a hand-crafted display font for headlines. Distinguishes them from every other restaurant on the web.
- **Palette**: white background (#ffffff), light cream surface (#f5f5f5), accents in deep cherry red (#952b25), warm coral (#e1a894), olive (#c4bfaf). NOT dark.
- **Animations**: 22 keyframes including themed (chef walla, food covent garden 1-4). Motion IS the brand.
- **Spacing**: 4px base, scale up to 24, max content 1279px.

### Sweetgreen — Modern functional, dark with bold accent

- **Theme**: Dark forest green page (#00473c), near-black surfaces (#0e150e), cream text (#f4f3e7).
- **One vivid accent**: Electric chartreuse #e6ff55 for CTAs, links, focus rings. Single color does ALL the work.
- **Type**: Custom SweetSans / SweetSansText (sans serif).
- **Shapes**: Pill buttons (radius up to 1000px), 24px card radius.
- **Motion**: Subtle, 150-300ms transitions.

### Daylesford — Premium farm-to-table, refined

- **Theme**: Burgundy/aubergine (#35292b) background, deep navy (#00112c) surfaces.
- **Accent**: Electric blue #0066ff against the warm dark.
- **Type**: Trade Gothic LT Light — refined geometric sans, NOT serif. Premium English brand.
- **Motion**: Expressive — bounce, ping, pulse, slideUp, fadeIn, spin all active.

---

## Tajine2Go-specific synthesis

### Core principle

**Tajine2Go is Belgian-Moroccan, not just Moroccan.** That dual identity is the design opportunity:
- Belgian = restrained, refined, considered, magazine-quality
- Moroccan = warm, generous, ornamented, atmospheric

The best execution is a **light cream canvas** (Belgian restraint) with **dramatic Moroccan warmth in photography and accent color**. NOT a dark site covered in zellige tiles.

### Concrete design tokens

```css
/* TYPE — push the scale way bigger than v1 mockups */
--font-display: 'Fraunces', serif;           /* serif with personality, variable weight */
--font-body: 'Inter', 'Source Sans 3', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--font-arabic: 'Tajawal', 'Noto Sans Arabic', sans-serif;

--h1-size: clamp(72px, 12vw, 180px);   /* WAS 56-140px. Push it. */
--h2-size: clamp(48px, 7vw, 108px);
--h3-size: clamp(32px, 4vw, 56px);
--lede-size: clamp(20px, 1.8vw, 28px); /* italic lede paragraphs */

--leading-display: 0.92;  /* tight on display */
--leading-body: 1.65;     /* generous on reading */
--tracking-display: -0.025em;
--tracking-label: 0.28em;

/* COLOR — Light Belgian canvas, Moroccan warmth */
--canvas: #FBF6EC;        /* warm cream, slightly more saturated than current */
--canvas-2: #F2E9D6;      /* card surface */
--ink: #1F1611;           /* deep brown-black, NOT pure black */
--ink-2: #4A382A;         /* secondary text */
--ink-3: #8B7860;         /* muted text */
--orange: #D97B1A;        /* T2G signature — use BOLDLY, not as accent */
--orange-deep: #A35408;
--saffron: #E8B339;       /* highlight, slightly warmer than gold */
--olive: #5B5A3B;         /* deep olive for sophistication */
--terracotta: #B85D2C;    /* secondary warm */

/* SPACING — generous, magazine-like */
--space-1: 4px;
--space-2: 8px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
--space-32: 128px;    /* between sections */
--space-48: 192px;    /* hero breathing room */

/* RADIUS — restrained, not bubbly */
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 8px;
--radius-pill: 999px;  /* buttons only */

/* SHADOWS — atmospheric, not floating */
--shadow-sm: 0 1px 2px rgba(31,22,17,0.06);
--shadow-md: 0 4px 12px -2px rgba(31,22,17,0.12);
--shadow-lg: 0 24px 60px -12px rgba(31,22,17,0.35);
--shadow-photo: 0 32px 80px -16px rgba(31,22,17,0.45);
```

### Layout system

- **Max content width**: 1320px (between Sweetgreen 1226 and Dishoom 1279)
- **Editorial grid**: 12 columns, but content lives in 8-10 most of the time
- **Asymmetric hero**: photo on one side, oversized typography on other (Dishoom pattern)
- **Hairline rules**: 1px solid ink at section boundaries (magazine craft)
- **Magazine masthead**: keep the "EDITIE Nº 01 · MEI MMXXVI" element but elevate it

### Hero pattern (the make-or-break section)

**Don't do this** (what I did before):
- Generic large centered serif
- Tailwind utility classes
- Random Unsplash food photo

**Do this**:
- Asymmetric split: **62/38** photo-to-text or text-to-photo
- Hero photo is FOCAL — a single, perfectly art-directed image (steam rising from tajine, hands placing dish, riad courtyard light)
- Typography spans 4-5 lines, mixes Fraunces regular + italic + accent color (current "Marokkaanse" italic orange treatment is correct, just bigger)
- Status row at top: pulse dot + "Volgende service: Zaterdag 14 dec · 12—19h" — in mono, small caps
- CTA: solid orange pill on cream canvas, secondary "Bekijk menu" as underlined text link (not boxed)

### Section rhythm

```
01. STATUS BAR        (slim, sticky, mono)
02. NAV               (magazine masthead style — center-anchored logo)
03. HERO              (asymmetric, photo + oversized type)
04. STATUS BANNER     (Sweetgreen pattern — "Open vandaag" or "Next service")
05. USP STRIP         (numbered 00/01/02/03 with hairlines — Dishoom craft)
06. MENU PREVIEW      (3 dishes — editorial split, 1 featured + 2 secondary)
07. STORY             (asymmetric, atmospheric photo + dropcap text, NL+AR bilingual quote)
08. CATERING          (full-bleed warm color block — terracotta, not orange)
09. FOOTER            (colophon style)
```

### Imagery direction

- **Hero**: warm tagine steam, hands serving, candle-lit table — NOT generic Moroccan tagine on white plate
- **Dish thumbnails**: top-down, dark wood background, single dish, dramatic side-light
- **Story**: hands kneading dough, market spice piles, riad doorway light, Atlas mountains — atmospheric *places*, not generic food
- **Use real T2G assets when possible**: `/hero-storefront.jpg`, `/hero-animation.webm` are already in `/public`

### Motion (this was completely missing before)

Inspired by Dishoom's 22 keyframes:
- **Steam rise** on hero (CSS `@keyframes steam` — soft white blur drifting up)
- **Stagger reveal** on dish cards (each fades+slides up 100ms apart)
- **Pulse dot** on status indicator
- **Hover lift** on dish thumbnails (translateY(-4px) + shadow grow)
- **Counter** for "served meals" stat — animate from 0 to target on scroll
- **Marquee** for ingredients ticker (slow horizontal scroll: "ras el hanout · saffraan · citroen confit · munt · koriander...")

### Cultural authenticity — done with respect

- **Don't**: sprinkle zellige tile backgrounds, 8-point stars, mihrab arches randomly
- **Do**: use one well-chosen Maghrebi pattern as a hairline accent (a single line of geometric ornament under H1)
- **Do**: include Arabic typography as *quiet companion*, not equal billing — under a NL heading, smaller, in olive color
- **Do**: name dishes in original (Dajaj b'Zaytun) alongside Dutch (Tajine kip met olijven)

---

## Three direction proposals — built on this synthesis

These are NOT cosmetic skins. They're three distinct *positioning* choices for Tajine2Go.

### Direction A — "L'Atelier" (premium artisan)

**Inspiration**: Dishoom + Daylesford fused
- Cream canvas with deep aubergine accent sections
- Fraunces serif at huge sizes, italic accent for "Marokkaanse"
- Big editorial photography, hand-drawn ingredient illustrations
- Tone: chef-driven, craft-focused, "this is the master's table"
- Status pill: gold #E8B339 on dark
- Hero: asymmetric photo-right with massive ragged-right type

### Direction B — "Riad Saturday" (atmospheric storytelling)

**Inspiration**: Dishoom atmospheric mode, cinematic
- Cream canvas BUT hero is full-bleed dark photo with type overlaid
- Story-led: photo → headline → photo → headline rhythm
- Tone: "every Saturday, we open the doors to the riad"
- Status pill: pulse dot, "Next service in 3 days 14 hours"
- Hero: full-bleed dark warm photo, centered type, slow steam animation

### Direction C — "Marché du Samedi" (modern functional, warm)

**Inspiration**: Sweetgreen functional, but on cream not dark
- Cream canvas, single-color orange accent everywhere
- Pill buttons, big photo cards, generous whitespace
- Tone: "the easiest, freshest weekly meal in Gent"
- Status pill: orange pill button-style with "Open vandaag · 12—19h"
- Hero: horizontal grid of 3 dishes with prices, no big hero photo

---

## Acceptance criteria

A mockup is good if:
- Hero H1 is at least 100px on desktop (current was 108-140 max — push higher)
- Status banner is sticky-visible and uses the pulse dot pattern
- Photography is referenced as if real (not generic placeholders even at mockup stage — pick specific Unsplash IDs with intent)
- One animation is implemented (steam, pulse, or stagger)
- Typography mixes serif display with mono small caps labels (Dishoom signature)
- Cultural elements (Arabic, ornament) appear ONCE, with reason, not sprinkled
- Cream canvas with confident orange use — NOT dark, NOT pattern-covered
- Generous spacing — sections separated by 128px+ on desktop

---

## Asset checklist

Already in `/public`:
- `hero-storefront.jpg` — actual Tajine2Go storefront photo (USE THIS for at least one direction)
- `hero-animation.webm` / `.mp4` — animated hero
- `logo-tajine2go.svg` / variants

Need (if building production):
- 3-4 dish photos shot top-down on dark wood
- 2-3 atmospheric story photos (hands, market, doorway)
- 1 chef portrait or kitchen action shot
