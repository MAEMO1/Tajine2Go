export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

// Menukaart-notatie zoals op de gedrukte kaart: "€ 15" of "€ 15 / 20" (M / L).
function euroCompact(cents: number): string {
  return cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2).replace(".", ",");
}

export function formatMenuPrice(priceCents: number, priceLCents: number | null): string {
  const base = `€ ${euroCompact(priceCents)}`;
  return priceLCents ? `${base} / ${euroCompact(priceLCents)}` : base;
}
