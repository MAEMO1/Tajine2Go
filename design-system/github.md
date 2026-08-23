repo: MAEMO1/Tajine2Go
branch: main
url: https://github.com/MAEMO1/Tajine2Go

## Last sync
date: 2026-08-23T00:03:35Z

### Updated in this project
- Palet en typografie geverifieerd tegen `src/app/globals.css` — identiek aan de tokens hier.
- Legacy-kleuren toegevoegd als aparte tokengroep (brand-warm, warm2, brown-m, brown-s).
- Knopradius gecorrigeerd van pill naar `rounded-md` (6px), conform `header.tsx`.
- Korrel-overlay (grain, 2,5% opacity) gedocumenteerd als merkmotief.

## Screen map
| Scherm hier | Bron in de repo |
|---|---|
| `ui_kits/website/index.html` (homepagina) | `src/app/[locale]/page.tsx`, `src/components/hero-canvas.tsx`, `homepage-menu.tsx`, `info-strip.tsx`, `footer.tsx` |
| `ui_kits/website/contact.html` | `src/app/[locale]/contact/`, `src/lib/site-content.ts` |
| Navigatie (`SiteNav.jsx`) | `src/components/header.tsx`, `phone-order-button.tsx` |
| Menurijen | `src/components/dish-row.tsx`, `src/lib/menu-data.ts` |
| Tokens | `src/app/globals.css` (`@theme inline`), `docs/adr/0002`, `docs/adr/0003` |

## Niet overgenomen
De repo bevat een uitgebreid motion-systeem (GSAP + Lenis, Three.js-hero) beschreven in
`docs/redesign/design-language.md` — dat document is in de repo zelf als VEROUDERD gemarkeerd
(17/08/2026) en is hier niet gevolgd. CLAUDE.md §5 is de bindende bron.
