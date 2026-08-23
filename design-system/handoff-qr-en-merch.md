# Handoff: QR-standaard, merch-kaarten en deck

## Overzicht
Sessie van 23/08/2026 op het Tajine2Go-designsysteem. Drie soorten werk: de A4 QR-standaard is
verkleind en printklaar gemaakt, de gecombineerde merchkaart is opgesplitst in zes losse kaarten,
en er is een presentatietemplate van de QR-standaard toegevoegd.

## Over de bestanden
Alles in dit systeem is een **ontwerpreferentie in HTML** — geen productiecode om over te nemen.
De opdracht bij implementatie is de ontwerpen na te bouwen in de bestaande omgeving van de repo
(Next.js + Tailwind, `MAEMO1/Tajine2Go`) met de patronen die daar al staan. De kaarten in
`guidelines/` zijn specimens: ze documenteren maten en kleuren, ze zijn geen componenten.

## Fidelity
**Hi-fi.** Alle maten, kleuren en typografie zijn definitief en in millimeters/punten uitgedrukt
voor drukwerk. Uitzondering: de menufoto's op de website zijn nog placeholders.

## Wat er is gewijzigd

### 1. QR-standaard (`guidelines/qr-standaard.html`)
Kaartnaam nu **"QR-standaard wireframe"** (groep Toepassingen).
- Logo bovenaan: 38 mm → **30,4 mm** (−20%).
- Kopregel "Bestel en volg ons" → **"Laat van je horen"**, corpsgrootte 0,8em, marge 2 → 1,6 mm.
- Ornament: 150 → **120 px**, marge 3 → 2,4 mm.
- QR-blok staat hoger: `top` 104 mm → **92 mm**.
- Nissen: 17,5 → **14 mm** breed; QR-codes 9 → **7,2 mm**.
- Labels **5,6 pt**, waarden **5 pt**; rijafstand 2 → 1,6 mm.
- Vierde kolom: het woord **"Google" staat nu boven de vijf sterren** in plaats van ernaast.
- Kaderopbouw onveranderd: buitenkader 190 mm op 20 mm van de rand, binnenkader 152 mm,
  ring ertussen blijft leeg papier.

### 2. Printversie (`guidelines/qr-standaard-print.html`)
Nieuwe A4-kopie op `doc-page` (`size="a4"`), animaties bevroren, `print-color-adjust:exact`.
Dit bestand is de bron voor de PDF-export; het wireframe blijft het werkbestand.
Bij wijziging aan het wireframe moet deze kopie opnieuw gegenereerd worden.

### 3. Mockup (`guidelines/qr-standaard-mockup.html`)
Nieuwe kaart onder Toepassingen: de plexi-tafelstandaard.
Beeld: `assets/mockups/tajine2go-qr-standaard-mockup.png` (op 23/08 vervangen door de nieuwste
render met kaarthouder en gouden voet). Drie uitvoeringsspecs eronder: plexi + gouden voet,
gefreesde boogcontour, kaarthouder aan de voet.

### 4. Merch opgesplitst — zes losse kaarten, nieuwe groep **Merch**
`guidelines/merch-vier-assets.html` is verwijderd. In plaats daarvan:

| Bestand | Kaart | Maat |
|---|---|---|
| `merch-sleutelhanger.html` | Sleutelhanger | 45 mm hout, contoursnede, ring 25 mm |
| `merch-lepel.html` | Lepelsleutelhanger | 115 × 25 mm staal, kaartje 100 × 70 mm |
| `merch-pen.html` | Pen | balpen, kraftpapieren huls, logo ca. 30 mm |
| `merch-hartje.html` | Hartsleutelhanger | 30 mm gelaserd hout |
| `merch-qr-tafelkaart.html` | QR-tafelkaart A6 | 74 × 105 mm (paneel 83 mm + voet 22 mm) |
| `merch-visitekaartje.html` | Visitekaartje | 85 × 55 mm, 400 g mat |

Gedeelde stijl staat in **`guidelines/merch.css`** — die laden alle zes naast `styles.css`.

Op de sleutelhanger is de gegenereerde QR uit de leveranciersmockup vervangen door de echte
merkcode: `assets/reference/keychain-mockup-qr.png` bevat `tajine2go-qr-ink-on-paper.svg`
1-op-1 ingezet op dezelfde plek, met witruimte van vier vakjes.

Hartmockup opgeschaald naar `assets/reference/hart-mockup-2k.png` (2048 × 740). Dat is
interpolatie van het 415 px-origineel, niet nieuwe scherpte — voor druk is het bronbestand
van de leverancier nodig.

### 5. Deck-template (`templates/qr-standaard-deck/`)
`QrStandaardDeck.dc.html` op `deck-stage`, 1920 × 1080, zes slides: titel, het blad,
kaderopbouw (drie delen), vier codes, drukspecs, nog aan te leveren.
Design system laadt via `ds-base.js`. Geëxporteerd als `tajine2go-qr-standaard.pptx`.

### 6. Standalone exports (projectroot)
`Tajine2Go Sierkader.html` en `Tajine2Go Boogkader.html` — zelfstandige bestanden met alle
assets ingebakken, werken offline.

## Design tokens
Onveranderd deze sessie. Zes vaste kleuren in `tokens/colors.css`:
papier `#FDF3E2`, inkt `#440C00`, espresso `#834620`, merkoranje `#DE5C1B`,
saffraangoud `#FDAD47`, meritorange (placeholder-vlakken).
Typografie: Cormorant Garamond (display), Geist (body/UI), beide Google Fonts.
Spatiëring: 4/8/12/16/24/32/48/64 px. Knopradius 6 px.

## Assets toegevoegd of gewijzigd
- `assets/mockups/tajine2go-qr-standaard-mockup.png` — nieuwe plexi-render (vervangt de oude).
- `assets/reference/keychain-mockup-qr.png` — sleutelhanger met echte merk-QR.
- `assets/reference/hart-mockup-2k.png` — opgeschaalde hartmockup.
- `guidelines/merch.css` — nieuw, gedeelde specimenstijl.

## Openstaand
1. QR-codes voor Instagram, Facebook en Google review als SVG. Codes worden exact overgenomen,
   nooit nagemaakt of gegenereerd.
2. Het zellige-patroon als **echte** vector. De twee aangeleverde SVG's in `uploads/`
   (`brand-pattern-tile-sharp.svg`, `brand-pattern-tile-2x.svg`) zijn pixeltraces van dezelfde
   440 × 275 bitmap — duizenden 1 × 1 blokjes, `shape-rendering="crispEdges"`, identieke
   padgegevens. Ze schalen niet beter dan de PNG en wegen enkele MB's. Niet ingezet.
3. Definitieve iconen voor Instagram, Facebook en de sterren (nu Lucide, tijdelijk).
4. Echte foodfotografie voor het menu.
5. Openingsuren vastleggen en het primaire telefoonnummer bevestigen (er staan er twee).

## Bestanden om te bekijken
```
guidelines/qr-standaard.html            wireframe, alle maten
guidelines/qr-standaard-print.html      A4 printversie
guidelines/qr-standaard-mockup.html     mockupkaart
guidelines/merch-*.html                 zes losse merchkaarten
guidelines/merch.css                    gedeelde specimenstijl
templates/qr-standaard-deck/            deck-template
tokens/                                 kleuren, typografie, spatiëring
```
