# 0005 — Eén familie: Geist over de volle gewichtsas

Status: accepted, 2026-08-21. **Vervangt ADR 0003** ("displayletter Cormorant Garamond").

## Context

ADR 0003 koos Cormorant Garamond als displayletter naast Geist, om het gedrukte
brandmateriaal te volgen. Bij het Mr. Pops-herontwerp (augustus 2026) is die keuze
teruggedraaid.

De gemeten referentie (`docs/design/mrpops-reference-spec.md` §1) bouwt haar hiërarchie
op **schaal en gewicht**, niet op een tweede lettertype: koppen van 144px met een leading
van 90%, uppercase, tegenover body van 18px met 140%. Dat werkt alleen als de displayletter
genoeg gewicht heeft om op 144px massief te staan. Cormorant is een lichte, hoog-contrast
serif; die valt op die schaal juist uit elkaar.

Geist is als variabel font beschikbaar over de volle as 100–900. Daarmee komt het contrast
uit dezelfde familie: Geist 900 uppercase op 144px tegenover Geist 400 op 18px.

## Beslissing

- **Eén familie voor de publieke site: Geist**, geladen als variabel font (100–900).
- **Display**: Geist 800–900, uppercase, tot 144px, `line-height` ≤ 0,90,
  `letter-spacing` +0,05em. Negatieve tracking is verboden.
- **Body en alle cijfers** (prijzen, telefoonnummers, uren): Geist 400. Prijzen met
  `tabular-nums`.
- `--font-display` en `--font-script` in `globals.css` wijzen naar Geist. De bestaande
  `font-display`-classes in de componenten blijven dus staan en verwijzen vanzelf naar
  Geist; ze hoeven niet één voor één omgezet te worden.
- Cormorant Garamond is verwijderd uit `src/app/layout.tsx`.
- Geist Mono blijft alleen als legacy-token; geen nieuwe toepassingen.
- Het woordmerk in het logo is een vaste afbeelding en verandert niet.

### Over de tracking van +0,05em

De briefing noemde +0,05em op elke displaymaat een handtekening van Mr. Pops. Dat is
**niet wat de referentie doet**: in 302 KB CSS staan drie `letter-spacing`-declaraties,
alle drie `.05em`, en geen enkele op een displaymaat — h1, h2 en alle sectiekoppen hebben
er geen. Mr. Pops houdt grote koppen strak via leading (90%), niet via tracking.

Wij voeren +0,05em tóch door. Reden: het is een expliciete merkbeslissing voor Tajine2Go,
en Geist Black is aanzienlijk breder en compacter dan Cervo — uppercase Geist 900 op 144px
verdraagt en vraagt meer tracking dan de smalle Cervo. Het blijft een Tajine2Go-regel,
geen Mr. Pops-regel, en staat als zodanig gemarkeerd in `scripts/refero-gate.mjs`.

## Gevolgen

- CLAUDE.md §5.2 is bijgewerkt.
- ADR 0002 (één grotesk Geist) is daarmee in de kern weer van kracht; ADR 0003 is historisch.
- De utilities `type-h1/h2/h3/type-label` in `globals.css` dragen de displayschaal en zijn
  herschreven naar de gemeten waarden.
- De italic traditiezin uit de oude hero verdwijnt: Geist heeft geen echte italic en een
  schuingetrokken variant is geen vervanging.
