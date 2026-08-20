// Eén bron voor de bestelnummers in de code.
// ponytail: hardcoded constants; koppel aan admin business_info zodra er een echte Supabase-omgeving is.
export const ORDER_PHONE_NUMBERS = [
  { display: "09 310 93 31", tel: "+3293109331" },
  { display: "0451 01 61 44", tel: "+32451016144" },
] as const;

export const ORDER_PHONE_SUMMARY = ORDER_PHONE_NUMBERS.map((n) => n.display).join(" · ");
