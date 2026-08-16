# 0003 — Displayletter: Cormorant Garamond naast Geist

Status: accepted, 2026-08-17. Vervangt ADR 0002 ("één moderne grotesk: Geist").

## Context

ADR 0002 koos één familie (Geist) voor display én body. Tijdens de
familiekeuken-redesign (augustus 2026) besliste de eigenaar dat de site de
klassieke uitstraling van het gedrukte brandmateriaal (menukaart, poster)
moet volgen: een serif voor koppen, met een italic voor de traditiezin in
de hero.

## Beslissing

- Display/koppen: Cormorant Garamond (`font-display`), italic voor de
  hero-traditiezin.
- Body: Geist. Alle cijfers (prijzen, telefoonnummers, uren) staan in
  Geist, ook binnen display-context (beslissing eigenaar 17/08/2026).
- Geist Mono blijft alleen als legacy-token; geen nieuwe toepassingen.
- Vaste typografische schaal via de utilities `type-h1/h2/h3/type-label`
  in `globals.css`.

## Gevolgen

- CLAUDE.md §5.2 beschrijft deze set; ADR 0002 is historisch.
- Great Vibes (script) is verwijderd; de eerdere overweging van een
  aparte scriptletter is definitief afgevoerd.
