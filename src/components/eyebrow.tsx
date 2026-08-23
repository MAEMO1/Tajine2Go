/*
 * Bovenkopje: Cormorant 600, hoofdletters, ruime letterafstand.
 * Espresso op papier, saffraangoud op inkt. Design system: components/core/Eyebrow.
 */
export function Eyebrow({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={`font-display text-xl font-semibold uppercase tracking-[0.14em] ${
        onDark ? "text-brand-gold" : "text-brand-bronze"
      }`}
    >
      {children}
    </p>
  );
}
