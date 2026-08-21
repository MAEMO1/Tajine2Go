# Mr. Pops — gemeten referentiespec

Bron: `https://mrpops.ua/en/`, build `q-g6wNJ5nYx5NbCya871w`, gemeten op 21/08/2026.
Gemeten uit de echte stylesheets (`/_next/static/css/25e2a3a8ce1f048d.css` 90 KB +
`/_next/static/css/499a5aeb94bd1609.css` 212 KB) en de server-gerenderde homepage-HTML.

> **Waarom gemeten en niet uit Refero.** De Refero MCP-server is in deze omgeving niet
> bereikbaar: er bestaat geen `refero_get_style`-tool, er staat geen Refero-server in
> `.mcp.json` of `~/.claude.json`, en de string "refero" komt op deze machine alleen voor
> in het sessietranscript zelf. De waarden hieronder zijn dus rechtstreeks uit de
> referentie gelezen in plaats van uit een tokendump. Elke regel is met een grep-hit te
> herleiden; `scripts/read-reference.mjs` haalt de bronbestanden opnieuw op.
> Zodra de Refero-dump beschikbaar is, wint die bij elk conflict.

Basis: `1rem = 16px` (`html{font-size:16px}`).
Breakpoints: **≤899px** (mobiel) · **900–1199px** (tablet) · **≥1200px** (desktop).

---

## 1. Typeschaal

Displayletter = Cervo, uppercase. Bodyletter = HelveticaNeueCyr.

| rol | ≥1200px | 900–1199px | ≤899px | line-height |
|---|---|---|---|---|
| h1 | **144px** (9rem) | 94px (5.875rem) | 40px (2.5rem) | **90% / 90% / 100%** |
| h2 | 72px (4.5rem) | 56px (3.5rem) | 40px (2.5rem) | 90% / 95% / 100% |
| h3 | 64px (4rem) | 48px (3rem) | 30px (1.875rem) | 100% |
| h4 | 48px | 36px | 24px | 100% |
| body | 18px (1.125rem) | 16px (1rem) | 14px (.875rem) | **140%** |
| UI / formulier | 15px (.9375rem) | idem | idem | 130% |

Regel: hoe groter de maat, hoe strakker de leading. 144/94/72px → 90%; 96/68/56px → 95%;
≤48px en alles op mobiel → 100%. Body 140%, formulieren 130%.

`text-transform:uppercase` komt 56× voor; **54 daarvan declareren in dezelfde regel
`font-family:Cervo`**. Uppercase is geen losse keuze maar hoort bij de displayletter.

### 1.1 Letter-spacing — afwijking t.o.v. de briefing

In 302 KB CSS staan **drie** `letter-spacing`-declaraties, alle drie `.05em`, en **geen
enkele op een displaymaat** (het zijn twee prijslabels en één waarschuwing van 22px).
`h1`, `h2`, alle `*__header__*`-klassen en de marquees hebben géén letter-spacing.

De referentie houdt grote koppen strak via **leading (90%)**, niet via tracking.
De briefing noemt `+0,05em` op elke displaymaat een handtekening van de referentie; dat
is in de bron niet terug te vinden. Wij voeren `+0,05em` tóch door — het is een expliciete
merkbeslissing voor Tajine2Go, en Geist Black uppercase verdraagt op 144px meer tracking
dan Cervo — maar het is een Tajine2Go-regel, geen Mr. Pops-regel.

---

## 2. Kleursysteem

Volledig getokeniseerd in `:root`; het tweede stylesheet (212 KB) bevat vrijwel geen
letterlijke kleur en consumeert alleen `var(--color-*)`.

| token | waarde | rol | Tajine2Go |
|---|---|---|---|
| `--color-bg` | `#fee5ca` | paginabasis, knopvlak van de ghost-knop | crème `#FBF2DC` |
| `--color-contrast` | `#b00e2f` | **de enige accentkleur**: vulling, tekst én rand | terracotta `#B5540F` |
| `--color-text` | `#b00e2f` | lopende tekst is de accentkleur | bruin `#3B1606` |
| `--color-dark` | `#000` | donkere tekst | bruin `#3B1606` |
| `--color-light` | `#fff` | tekst op accentvlakken | crème `#FBF2DC` |
| `--color-overlay` | `hsla(31,96%,89%,.75)` | **warme crème-overlay, geen zwarte scrim** | warm `#F6E8C9` @75% |
| `--color-line` | `#e8e8e8` | scheidslijn | `#A18059` |
| hover-accent | `#980c29` | donkerder accent bij hover | `#93430B` |

- **Verlopen: 1** in de hele site (`linear-gradient(180deg,#f9dec1,#fee5ca)`, één decoratieve band).
- **`prefers-color-scheme` / dark theme: 0 hits.** Light theme locked.
- Geen grijze of koele neutralen in het eigen palet; al het grijs zit in vendor-CSS
  (`react-datepicker`).

### 2.1 Kleurritme homepage

crème (hero) → **accent volvlak** (about) → crème → crème → crème + gradientband →
fotovlak → crème → **accent volvlak** (footer).

Het accent wordt precies **tweemaal** als volvlak ingezet: de sectie direct onder de hero,
en de footer. Daartussen draagt crème alles.

---

## 3. Knoppen — het contrast is de merkregel

| | primair (`button_goto`) | ghost (`button_stroke`) |
|---|---|---|
| vorm | **volledig rond** (`border-radius:50%`) | **scherpe hoeken** (geen radius) |
| vulling | gevuld met `--color-contrast` (variant `kind_fill`) | `--color-bg` (crème) |
| rand | geen; een geanimeerde SVG-cirkel | **`border:1px solid var(--color-contrast)`** |
| hoogte | `--button-goto-size` (cirkel) | **`3rem` = 48px** |
| padding | n.v.t. (tekst naast de cirkel, `margin-left:1.25rem`) | **`0 1.25rem` = 0 20px** |
| type | Cervo 500, **uppercase**, 18px, lh 75% | HelveticaNeueCyr 400, geen uppercase, 15px, lh 130% |
| hover | tekst → wit | `:after` scaleY 0→1 vult met accent, tekst → wit |

**De rolregel die onverkort geldt:** primair = gevuld + volledig afgerond; secundair =
scherp + 1px rand. Alleen de *vorm* van "volledig afgerond" vertalen we: Mr. Pops gebruikt
een cirkel met de tekst ernaast, wij een pil met de tekst erin (ADR 0004). Dat is de
merkvertaling; het contrast tussen de twee knoppen blijft identiek.

---

## 4. Invoervelden

```css
.input_form_input__input { background: transparent; border: 0; outline: none;
                           padding: .625rem 1.875rem 0 0; font-size: 1rem; }
.input_form_input:before  { content:""; position:absolute; bottom:0;
                            width:100%; height:1px; background-color: currentColor; }
.input_form_input:after   { bottom:-3px; transform: scaleX(0); transition: transform .35s; }
.input_form_input.focus:after { transform: scale(1); }
```

- **Alleen een onderrand**, getekend als 1px pseudo-element — niet als `border`.
- **Geen border-radius**, nergens.
- Achtergrond transparant; veldhoogte `3.75rem` (60px); veldtekst 16px.
- Focus = een tweede lijn die van links uitrolt.
- Zwevend label: 15px → 12px zodra het veld gevuld of gefocust is.
- Er is **geen** `textarea` in het systeem; het berichtveld is een `input type="text"`.

---

## 5. Layout en ritme

- **Geen max-width container.** Geen enkele waarde in de buurt van 1200px/1440px.
  In plaats daarvan een vloeiende gutter `--wrap`: `2.08vw` desktop (~30px @1440),
  `1.875rem` (30px) tablet, `1.25rem` (20px) mobiel. Alles staat edge-to-edge
  binnen die gutter: `--content-area: calc(100vw - var(--wrap) * 2)`.
- **Spacingritme** (462 gemeten tokens, 66% een veelvoud van 10px), drie registers:

  | register | waarden | frequentie |
  |---|---|---|
  | element | **10px / 20px** | 27× / 81× |
  | blok, kaart | **30px / 40px** | 53× / 67× |
  | **sectie** | **90 / 100 / 120 / 150 / 180px** desktop | halveert ruwweg op mobiel |

  De briefing noemt 40px als sectie-afstand; gemeten is 40px een **kaart**waarde.
  Echte sectie-afstanden op de homepage zijn 100–260px.
- **Heldenvlak = exact 100% viewporthoogte** (`min-height:calc(100*var(--vh))`), content
  onderaan uitgelijnd (`justify-content:flex-end`), `padding-top:120px`,
  `padding-bottom:54px` desktop. Headerhoogte 90px desktop.
- `100svh`/`100dvh` worden niet gebruikt; de site rekent met een JS-gestuurde `--vh`.

---

## 6. Beeldbehandeling — afwijking t.o.v. de briefing

De briefing zegt dat beelden "not contained by frames or masks" zijn. **Gemeten is het
omgekeerde:** beelden staan nooit vrij. Ze zitten altijd in een container met
`overflow:hidden`, een aspect-ratio via `padding-top` (`aspect-ratio` wordt niet gebruikt)
en een afronding die het merk draagt.

Twee signaturen:

1. **Eén afgeronde hoek, alternerend.** 40px desktop / 30px tablet / 20px mobiel, op
   precies één hoek; de galerij wisselt per item links/rechts, en losse beelden ronden af
   naar de buitenrand toe:
   ```css
   .image_marquee__item:nth-child(odd)  > * { border-radius: 0 2.5rem 0 0 }
   .image_marquee__item:nth-child(2n+2) > * { border-radius: 2.5rem 0 0 0 }
   .home_about__left_image  .img { border-radius: 2.5rem 0 0 0 }
   .home_about__right_image .img { border-radius: 0 2.5rem 0 0 }
   ```
2. **De boog.** Radius = de halve breedte op beide bovenhoeken, onderhoeken scherp:
   ```css
   .home_giftbox .scene__video { border-radius: calc(var(--width)/2) calc(var(--width)/2) 0 0 }
   ```
   Dit is precies de booggewelf-vorm die wij voor eenheid 2 willen — hij zit dus ín de
   referentie en hoeft niet elders geleend te worden.

Verder: `clip-path` en `mask-image` komen op beeld **niet** voor (de enige `clip-path` van
de site snijdt een boog uit de bovenrand van de footer). `img { border-style: none }` —
beelden hebben nooit een rand. `object-fit:cover` 14×. Beelden staan **staand**:
aspect-ratio 133–143%.

---

## 7. Wat de referentie níét doet

- Geen verlopen (op één decoratieve band na).
- Geen zwarte scrim; de enige overlay is warm crème op 75%.
- Geen dark theme.
- Geen negatieve tracking (en op display: geen tracking).
- Geen randen om beeld.
- Geen `prefers-reduced-motion` — **hier wijken wij bewust af**: onze bestaande GSAP- en
  Lenis-opzet respecteert reduced motion al, en dat houden we.
