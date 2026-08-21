# 0004 — Knopcontrast: gevulde pil versus scherpe ghost

Status: accepted, 2026-08-21.

## Context

Bij het Mr. Pops-herontwerp van de publieke site (augustus 2026) is de vorm van de
knoppen geen detail maar een merkkenmerk. In de gemeten referentie
(`docs/design/mrpops-reference-spec.md` §3) staan twee knoppen bewust tegenover elkaar:

- de primaire actie is **volledig afgerond en gevuld** met de enige accentkleur;
- de secundaire actie heeft **scherpe hoeken en een rand van precies 1px** in diezelfde
  accentkleur, op een crème vlak.

Het contrast tussen die twee vormen draagt de hiërarchie. Twee knoppen met dezelfde
radius, of een primaire knop met `rounded-md`, laten dat contrast verdwijnen.

## Beslissing

- **Primaire actie**: gevuld met `brand-orange-hover` (#B5540F), witte tekst,
  **pil-vormig** (`rounded-full`, radius ≥ halve knophoogte), minimale hoogte 44px,
  geen rand, **geen schaduw**.
- **Secundaire actie (ghost)**: `rounded-none` (radius exact 0), rand exact `1px solid`
  in een paletkleur, transparante of crème vulling, minimale hoogte 44px.
- Per scherm hoort er hooguit één gevulde primaire actie te staan.
- #B5540F blijft de enige gevulde CTA-kleur. Het accent #D2691E haalt zelf geen AA op
  wit (zie CLAUDE.md §5.3) en wordt niet als knopvulling gebruikt.

### Merkvertaling

Mr. Pops geeft de primaire actie de vorm van een **cirkel** met de tekst ernaast. Wij
nemen de *rol*regel over — gevuld en volledig afgerond tegenover scherp met 1px rand —
maar niet die vorm: onze CTA's dragen hun label in de knop ("Bel en bestel"), en dan is
een pil de juiste vertaling van "volledig afgerond". Het contrast tussen de twee knoppen
blijft identiek aan de referentie.

## Gevolgen

- `scripts/refero-gate.mjs` meet dit: `primaire CTA gevuld`, `primaire CTA pil-vormig`,
  `ghost-knop scherpe hoeken`, `ghost-knop 1px rand` en `knopcontrast gevuld-vs-scherp`.
- CLAUDE.md §5.3 is bijgewerkt: de eerdere regel "primaire knop MUST `rounded-md`
  gebruiken" is vervangen door de pilvorm.
- Bestaande knoppen met `rounded-md` en `shadow-[...]` buiten de hero moeten per eenheid
  meegenomen worden; ze vallen om zodra de gate zonder `--unit` over de hele pagina loopt.
