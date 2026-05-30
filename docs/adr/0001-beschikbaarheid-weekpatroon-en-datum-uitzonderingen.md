# Beschikbaarheid = basis weekpatroon + datum-uitzonderingen

## Status

accepted

Tajine2Go's publieke beschikbaarheid wordt bepaald door drie gelaagde concepten met een vaste voorrang: **Globale pauze > Datum-uitzondering > Basis weekpatroon**. Het basis weekpatroon legt het terugkerende ritme vast (welke weekdag(en), uren, en afhalen en/of levering); een datum-uitzondering overschrijft dat voor één kalenderdatum (gesloten, óf open met eigen uren + fulfillment); de globale pauze zet alles uit. We kozen deze combinatie omdat een puur wekelijks patroon geen feestdag kan sluiten of een eenmalige extra dag kan openen, en puur per-datum plannen de eigenaar zou dwingen elke week opnieuw te plannen.

Een door de eigenaar instelbare **bestel-cutoff** bepaalt bovendien tot wanneer de eerstvolgende service-dag besteld kan worden (bv. "donderdag 18:00 voor zaterdag" of "X uur vooraf"). Dit staat los van de drie lagen: de lagen bepalen *óf* een datum een service-dag is en met welke uren/fulfillment; de cutoff bepaalt *tot wanneer* die dag bestelbaar is. Na de cutoff is die dag niet langer bestelbaar (menu read-only) en rolt het bestellen door naar de volgende service-dag.

## Gevolgen

- **Verruimt CLAUDE.md §1.1 en §7.1** ("exact 1 takeaway-dag per week" / "precies 1 weekdag"): er kunnen nu 0 of meer service-dagen per week zijn. Beide secties zijn hierop aangepast en verwijzen naar deze ADR.
- **Datum-uitzonderingen zijn een nieuw dataconcept** dat nog niet in het datamodel bestaat. Het moet toegevoegd worden (settings of een aparte structuur), samen met de voorrangslogica in de beschikbaarheidsresolutie (vandaag `resolvePublicOrderConfig`).
- **Eén bron van waarheid:** de publieke site leidt dag/uren/fulfillment af uit dit gelaagde schema, niet uit een los, handmatig getypt openingsuren-tekstveld (vandaag `opening_hours_summary`). Dat losse veld vervalt of wordt automatisch gevuld.
- **Bestel-cutoff** is een nieuw, door de eigenaar instelbaar veld per service-dag (in het basis weekpatroon, per datum-uitzondering te overschrijven). De beschikbaarheidsresolutie moet voorbij verstreken cutoffs doorrollen naar de volgende service-dag; de cutoff is tevens het ankerpunt voor de publieke countdown.
