# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primair: klanten in en rond Gent die telefonisch bestellen en afhalen. Publieke talen: nl, fr, en (Arabisch geschrapt, beslissing eigenaar 17/08/2026).
- Secundair: cateringklanten voor events (trouwfeest, aqiqa, corporate, begrafenis, iftar) die een aanvraag indienen en manueel opgevolgd worden.
- Intern: de uitbater zelf via een Nederlandstalige adminomgeving (orders, menu, klanten, catering, analytics).

## Product Purpose

Website voor Tajine2Go, een Belgisch-Marokkaanse takeaway in Gent. Bestellen gaat in de huidige release telefonisch (beslissing eigenaar, augustus 2026): de site toont de vaste menukaart en de belnummers; catering is een tweede omzetstroom met een aanvraagformulier. Succes = de klant vindt menu en nummer in een paar seconden, en een admin die de hele operatie solo kan draaien. De online-bestelflow (guest checkout, Mollie) blijft als slapend contract bestaan voor later.

## Positioning

Huisgemaakt en beperkt: een vaste menukaart met 18 gerechten, vers en traag gegaard. Ambacht is de kern — geen fastfood-versie van de Marokkaanse keuken. De klassieke menukaart-uitstraling van het drukwerk (serif-koppen, puntjeslijnen, ornamenten) draagt dat online.

## Operating Context

- 6 dagen per week open; exacte openingsuren volgen nog (eigenaar). Beschikbaarheid = basis weekpatroon + datum-uitzonderingen + globale pauze (voorrang: pauze > uitzondering > patroon). Zie CONTEXT.md voor canonieke termen en docs/adr/ voor beslissingen.
- Bestellen gaat telefonisch; de online-bestelflow (cutoff, voorraad per service-dag, Mollie met 15-minuten stock hold) is een slapend contract voor een latere release (CLAUDE.md §1.1).
- Belgische context: EUR, 6% BTW op voeding, DD/MM/YYYY.

## Capabilities and Constraints

- Stack en implementatiecontract liggen bindend vast in CLAUDE.md (Next.js App Router, Supabase, Tailwind, next-intl, Mollie, Resend, Vercel). Admin blijft altijd Nederlands.
- Slapende bestelflow (voor later): guest checkout only, datamodel auth-ready voor een klantenportaal, publieke orderstatus via bearer token zonder login.
- Dish-lijsten zijn rijen, nooit een card-grid (harde regel).

## Brand Commitments

- Officieel brand kit (aangeleverd 16/08/2026, bron: `Tajine2Go_logo_full.zip`) is bindend: primary horizontal logo (tajine-op-wieltjes + wordmark), stacked, icon-only, wordmark, mono en dark-badge varianten. Web-assets staan in `public/brand/`; favicons/manifest in `public/` root; bronbestanden (print, masters, social) bewaart de eigenaar buiten de repo.
- Kleurenpalet (beslissing eigenaar 16/08/2026, verfijnd op het drukwerk): accent is terracotta #D2691E (uit het zellige-patroon, gedempt t.o.v. kit-Spice-Orange), achtergrond warm papier #FBF2DC (zoals menukaart/poster i.p.v. kit-webwit #FFF8EA); Saffron Gold #F5A400, Tajine Dark Brown #3B1606 en Warm Brown #78320C blijven uit het kit. Site-tokens in `globals.css` @theme en CLAUDE.md §5.1 zijn de bron.
- Logo-regels uit de usage guide: min. 180px breed (primary), 10% clearspace, nooit uitrekken of herkleuren buiten de meegeleverde varianten, dark badge op donkere ondergronden, favicon nooit als header-logo.
- Typografie: Cormorant Garamond voor display/koppen, Geist voor body en alle cijfers (prijzen, telefoonnummers). Bindend via CLAUDE.md §5.2 en docs/adr/0003. docs/redesign/design-language.md is historisch (beschrijft de geschrapte v3-richting).
- Toon: warm, premium, toegankelijk, Belgisch-Marokkaans.

## Evidence on Hand

- Echte foodfoto's bestaan of komen er binnenkort (aan te leveren door de eigenaar); tot ze in de repo staan blijven placeholders de default.
- Geen echte reviews of testimonials beschikbaar — nooit verzinnen.
- Geen cijfers, pers of cases — nooit verzinnen.

## Product Principles

1. De vaste kaart eerlijk tonen: huisgemaakt en beperkt is een feature, geen gebrek.
2. Bestellen frictieloos: menu en belnummer in een paar seconden vindbaar; cash blijft altijd mogelijk.
3. Drie talen (nl, fr, en) zijn gelijkwaardig.
4. De admin moet door één persoon naast een andere job te bedienen zijn.
5. Nooit bewijs fabriceren: geen verzonnen reviews, foto's van andermans eten, of cijfers.

## Accessibility & Inclusion

- `prefers-reduced-motion` schakelt alle scrub/parallax/split-animaties uit; content blijft zonder JS zichtbaar (progressive enhancement, vastgelegd in de design language).

<!-- Eigenaarschap: eigen zaak (familie); de gebruiker is de productbeslisser. -->
