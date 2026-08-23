/*
 * Scheidingsornament uit het design system (public/brand/ornament.svg).
 * Effen espresso, zoals CLAUDE.md §5.5 voorschrijft — de geschilderde textuur
 * van het origineel is bewust weggelaten.
 *
 * Gebruik: klein merkteken onder een categoriekop in de menukaart.
 */

/* eslint-disable @next/next/no-img-element */

export function OrnamentMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/brand/ornament.svg"
      alt=""
      aria-hidden="true"
      className={`mx-auto block w-[72px] ${className}`}
    />
  );
}
