/**
 * Gerechtkaart voor menu-overzichten: fotovlak, naam in Cormorant, prijs in Geist vet (inkt, nooit oranje).
 * @startingPoint section="Components" subtitle="Menukaart voor een gerecht" viewport="700x300"
 */
export interface DishCardProps{
  name: string;
  description?: string;
  /** bv. "€ 17,50" — altijd Geist vet in inkt */
  price: string;
  image?: string;
  /** bv. "Populair" */
  badge?: string;
}
export declare function DishCard(props: DishCardProps): JSX.Element;