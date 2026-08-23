/**
 * Pill-knop in de actiekleur. Oranje betekent op de site consequent "hier kan je klikken".
 * @startingPoint section="Components" subtitle="Bestelknop en actieknoppen" viewport="700x220"
 */
export interface ButtonProps{
  children?: React.ReactNode;
  /** primary = actie-oranje; secondary = omlijnd; onDark = papier op inkt; ghost = tekstlink */
  variant?: 'primary'|'secondary'|'onDark'|'onDarkOutline'|'ghost';
  size?: 'sm'|'md'|'lg';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** extra inline stijl, bv. volle breedte op mobiel */
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;