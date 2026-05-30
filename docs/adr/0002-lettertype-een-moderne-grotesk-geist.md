# Lettertype = één moderne grotesk (Geist), géén Bebas en géén editorial-serif

## Status

accepted

Supersedes het lettertypedeel van CLAUDE.md §5.2 (Bebas Neue / Source Sans 3) én de editorial-typografie uit de design-brief (Gloock / Instrument Serif / IBM Plex Mono).

De publieke site gebruikt **één moderne grotesk, Geist** (via `next/font`), voor zowel titels als body — gewicht, grootte en tracking maken de hiërarchie, niet een tweede displayletter. **Geist Mono** dient voor labels, prijzen/numerieke waarden en codes (bv. ordernummers `T2G-0001`). Arabisch blijft **Noto Sans Arabic** als neutrale companion.

We kozen dit boven (a) Bebas Neue + Source Sans 3 uit de oorspronkelijke spec en (b) de editorial serif-set die op de live hero stond: de eigenaar wil expliciet géén editorial/serif-look, en één strakke grotesk geeft een clean, premium en goed leesbaar geheel zoals moderne food-merken (Uber Eats, Deliveroo, Sweetgreen).

## Gevolgen

- **Eén familie, twee stacks verdwijnen.** Zowel Bebas Neue/Source Sans 3 als Gloock/Instrument Serif/IBM Plex Mono (en het parallel laden van beide in `layout.tsx`) worden verwijderd. Minder font-payload en één consistente stem over hero, chrome, menu, checkout en secundaire pagina's — dat lost het "split-brained" probleem uit de audit op.
- **CLAUDE.md §5.2 is aangepast** naar Geist (+ Geist Mono) + Noto Sans Arabic.
- **De design-brief is achterhaald** op het punt van typografie (editorial serif); er staat een deprecatie-noot bovenaan die naar deze ADR verwijst.
- **De hero** verliest zijn Gloock/Instrument-Serif-behandeling; het accent op "Marokkaanse" wordt heroverwogen binnen Geist (gewicht/kleur i.p.v. een italic serif).
