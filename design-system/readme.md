# Tajine2Go Design System

Marokkaans afhaalrestaurant in Gentbrugge (Brusselsesteenweg 455, 9050), voor Gent en omgeving. Authentieke, langzaam bereide Marokkaanse thuisgerechten — tajine en couscous — online besteld en snel opgehaald. Ook catering. Kernboodschap: **"Langzaam bereid. Snel opgehaald."** Snel afhalen ≠ snel bereid; het lange kookproces is al gedaan.

**Merkgevoel:** warm, huiselijk, persoonlijk, gastvrij, smaakvol, authentiek, toegankelijk, betrouwbaar, hedendaags. "Kom binnen, voel je thuis en eet iets lekkers." Géén fastfood-look, geen toeristische 1001-nacht-clichés, geen overdaad aan goud of drukke patronen, maar ook niet koud-minimalistisch.

**Bronnen** (lokaal aangeleverde mappen, read-only): `Tajine2Go merk/` (logo's, merkelementen, drukwerk, socials, kleuren+letters), `1 Vector (SVG)/` en `2 PNG transparant/` (frame + ornament), `2 QR-codes/`, `4 Beker/`. Kleuren en typografie komen uit `5 Kleuren en letters/` (afgeleid van CLAUDE.md 5.1/5.2 in de merkrepo). Website: https://www.tajine2go.be — Tel. 09 377 32 51 / 0451 01 61 44 — info@tajine2go.be — BTW BE 1019936687.

## CONTENT FUNDAMENTALS
- **Taal:** Nederlands (Vlaams). Klant wordt persoonlijk aangesproken met "je"; het merk zegt "wij/we".
- **Toon:** hartelijk, eenvoudig, persoonlijk, smakelijk, respectvol, zelfverzekerd zonder claims. Nooit "de beste"; wel zorg tonen. Niet schreeuwerig-commercieel.
- **Casing:** zinnen in gewone zinskast; bovenkopjes (eyebrows) in HOOFDLETTERS met ruime letterafstand.
- **Emoji:** nooit.
- **Kernzinnen (richting, geen definitieve slogans):** "Langzaam bereid. Snel opgehaald." · "De warmte van Marokko, klaar om mee te nemen." · "Met liefde bereid, met respect voor traditie." (deze traditiezin staat cursief in Cormorant in de hero) · "Bestel, haal af en geniet thuis."
- **Voorbeeldcopy (uit specimen):** "Bestel telefonisch op 09 310 93 31. Wij bereiden alles vers op de dag zelf, met kruiden uit Marokko en groenten van de markt in Gentbrugge."
- **CTA:** "Bestel nu" is dé hoofdactie, altijd zichtbaar.

## VISUAL FOUNDATIONS
- **Kleuren — exact zes, er komt geen zevende bij:** papier `#FDF3E2` (achtergrond), inkt `#440C00` (tekst/koppen/prijzen), espresso `#834620` (zachte tekst, ornamenten), actie `#B84A10` (knoppen en links — oranje betekent consequent "hier kan je klikken"), merkoranje `#DE5C1B` (vlakken/vormen, NOOIT tekst), saffraangoud `#FDAD47` (lijnkleur op donker, NOOIT op licht: contrast op papier is 1,70). Hover op actie: `#93430B`.
- **Typografie:** Cormorant Garamond (500/600) voor koppen en display, cursief voor de traditiezin. Geist voor lopende tekst en ALLE cijfers (prijzen, uren, telefoonnummers). Maten: h1 34–56px, h2 28–44px, eyebrow 20px uppercase ruime tracking, body 17px, prijzen Geist bold in inkt (nooit oranje). Beide fonts gratis (OFL) via Google Fonts.
- **Achtergrond:** vlak papier-crème; donkere secties in inkt met papier-tekst en saffraangoud-lijnen. Het zellige-patroon (raster-PNG, wordt extern hertekend) alleen als randtextuur, met mate.
- **Motieven:** het sierkader (`tajine2go-frame.svg` — moskeeboog, inktlijn buiten, saffraanlijn binnen met bewust verschoven schaduweffect) en het scheidingsornament (`tajine2go-ornament.svg`, effen espresso). Spaarzaam gebruiken; rust en ademruimte bewaren.
- **Knoppen:** pill-vorm, actiekleur, papier-tekst; hover → actie-hover (donkerder). Links in actiekleur.
- **Hoeken:** pill voor knoppen, 16px kaarten, 24px grotere platen. **Schaduwen:** heel zacht, inkt-getint (`rgba(68,12,0,.08)`), iets dieper op hover.
- **Animatie:** minimaal — korte fades/kleurovergangen (150–250ms ease); geen lange animaties (expliciete klantwens).
- **Fotografie:** warm, natuurlijk licht, echte gerechten centraal, huiselijk-sfeervol, geloofwaardig; geen kunstmatig bewerkte stockbeelden. Warme kleurtemperatuur, aardetinten, keramiek/zellige als props.
- **Nooit:** merkoranje als tekstkleur; saffraangoud op lichte ondergrond; een zevende kleur; logo vervormen of hertekenen; QR-codes opnieuw genereren of bijsnijden (witruimte van 4 vakjes hoort erbij).

## ICONOGRAPHY
- Geen eigen icoonset. Drukwerk gebruikt ronde merkoranje badges met witte glyphs (telefoon, pin, mail). Voor web: **Lucide via CDN** als substituut (zelfde eenvoudige lijnstijl) — dit is een gevlagde substitutie, geen merkbron.
- Merk-iconografie = het tajine-icoon zelf (`assets/logo/tajine2go-icon.svg`), het ornament en het frame. Geen emoji, geen unicode-iconen.
- QR-codes staan in `assets/qr/` en zijn exact overgenomen; standaardkeuze is `tajine2go-qr-ink-on-paper.svg`.

## Logo-gebruik
Naamschema `tajine2go-<vorm>-<ondergrond>`: horizontal / stacked / wordmark / icon / badge × light / dark, plus mono-black en mono-espresso. SVG altijd eerst. Badge = horizontal-dark op inktplaat. Volle-kleurlogo nooit op wit zonder papier-achtergrond (crème woordmerk valt weg).

## Index
- `styles.css` → `tokens/colors.css`, `tokens/typography.css`, `tokens/shape.css`
- `assets/data/menu.js` — officiële menudata (NL/FR/EN, prijzen M/L)
- `assets/logo/` (14 SVG-varianten) · `assets/elements/` (frame, ornament, pattern.png) · `assets/qr/` · `assets/socials/` · `assets/reference/` (flyer, kleur- en letterspecimen — bron, niet voor productie)
- `guidelines/` — specimen cards (Design System tab)
- `components/core/` — Button, OrderBar, Eyebrow, Ornament, ArchFrame, DishCard, ContactRow, SectionDark
- `ui_kits/website/` — homepagina-recreatie (richtinggevend ontwerp, nog geen bestaande site om te kopiëren)
- `SKILL.md` — agent skill entry

## Open punten
- Openingsuren zijn nog te bepalen — overal aangeduid als "openingsuren volgen".
- Gerechtfoto's ontbreken; placeholders in merkoranje.

## Intentional additions
- **Lucide CDN-iconen** — geen merkicoonset aanwezig; zelfde lijnstijl als de flyer-badges. Vervang gerust door een definitieve set.
- **Website-componenten** (OrderBar, DishCard…) — er bestaat nog geen live site; deze zijn afgeleid van flyer, specimen en briefing als startpunt voor fase 1.
