/** Contactregel met ronde merkoranje badge en witte glyph — het patroon van de flyer-achterkant. */
export interface ContactRowProps{ icon?: 'phone'|'pin'|'mail'|'clock'|'instagram'|'facebook'; /** papier-tekst op donkere secties */ onDark?: boolean; children?: React.ReactNode; }
export declare function ContactRow(props: ContactRowProps): JSX.Element;