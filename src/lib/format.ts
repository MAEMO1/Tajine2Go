export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
