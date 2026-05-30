export const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-emerald-100 text-emerald-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export const statusLabels: Record<string, string> = {
  pending: "In afwachting",
  confirmed: "Bevestigd",
  preparing: "In bereiding",
  ready: "Klaar",
  out_for_delivery: "Onderweg",
  completed: "Afgerond",
  cancelled: "Geannuleerd",
};

export const paymentStatusLabels: Record<string, string> = {
  pending: "In afwachting",
  paid: "Betaald",
  failed: "Mislukt",
  refunded: "Terugbetaald",
};
