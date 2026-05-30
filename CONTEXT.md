# Tajine2Go

Glossarium voor Tajine2Go — een Belgisch-Marokkaanse takeaway met wekelijkse service en catering in Gent. Dit bestand is enkel een woordenlijst: het legt de canonieke termen vast, géén implementatie of beslissingen (die horen in CLAUDE.md en `docs/adr/`).

## Beschikbaarheid & planning

**Basis weekpatroon**:
Het terugkerende weekritme dat vastlegt op welke weekdag(en) er service is, met de uren en of er afgehaald en/of geleverd wordt.
_Avoid_: rooster, schema, weekplanning

**Datum-uitzondering**:
Een afwijking voor één kalenderdatum die het basis weekpatroon overschrijft — ofwel gesloten, ofwel open met eigen uren en afhaal/levering.
_Avoid_: override, special day, uitzonderdag

**Globale pauze**:
De hoofdschakelaar die álle publieke bestellingen uitzet, ongeacht patroon of uitzonderingen.
_Avoid_: gesloten, offline, dicht

**Service-dag**:
Een kalenderdag waarop bestellingen worden klaargemaakt en afgehaald of geleverd — het resultaat van het patroon plus uitzonderingen.
_Avoid_: besteldag, afhaaldag, takeaway-dag

**Vooruitbestellen**:
Een bestelling plaatsen vóór de service-dag, voor een komende service-dag. Dit is de normale gang van zaken, geen aparte modus.
_Avoid_: pre-order, reserveren

**Bestel-cutoff**:
De deadline vóór een service-dag waarna die dag niet meer te bestellen is; daarna rolt het bestellen door naar de volgende service-dag.
_Avoid_: deadline, sluitingstijd, order cutoff

## Fulfillment

**Afhalen**:
Fulfillment waarbij de klant de bestelling zelf ophaalt op de service-dag.
_Avoid_: pickup, ophalen, takeaway (takeaway = het concept, niet deze keuze)

**Levering**:
Fulfillment waarbij de bestelling bezorgd wordt binnen de toegelaten Gentse postcodes.
_Avoid_: bezorging, delivery, thuislevering

**Tijdslot**:
Een afgebakend tijdvenster op de service-dag waarbinnen afgehaald of geleverd wordt, met eigen capaciteit.
_Avoid_: slot, pickup slot, afhaalmoment
