import { z } from "zod";

type MessageGetter = (key: string) => string;

// Server-side / fallback messages (admin & API are not shown to end users,
// the public form injects localized messages via createCheckoutSchema(t)).
const DEFAULT_MESSAGES: Record<string, string> = {
  required: "Dit veld is verplicht",
  email: "Vul een geldig e-mailadres in",
  postalCode: "Vul een geldige postcode in",
  minItems: "Voeg minstens één gerecht toe",
  deliveryAddressRequired: "Leveradres is verplicht bij levering",
};

const defaultMessages: MessageGetter = (key) => DEFAULT_MESSAGES[key] ?? key;

export function createCheckoutSchema(t: MessageGetter = defaultMessages) {
  return z
    .object({
      locale: z.enum(["nl", "fr", "en", "ar"]),
      items: z
        .array(
          z.object({
            weekly_menu_id: z.string().uuid(),
            quantity: z.number().int().min(1),
          }),
        )
        .min(1, t("minItems")),
      customer: z.object({
        first_name: z.string().min(1, t("required")).max(100),
        last_name: z.string().min(1, t("required")).max(100),
        email: z.string().email(t("email")),
        phone: z.string().optional(),
      }),
      fulfillment: z.enum(["pickup", "delivery"]),
      delivery_address: z
        .object({
          line1: z.string().min(1, t("required")),
          postal_code: z.string().min(4, t("postalCode")).max(10, t("postalCode")),
          city: z.string().min(1, t("required")),
          country_code: z.literal("BE"),
        })
        .optional(),
      pickup_slot: z.string().optional(),
      payment_method: z.enum(["online", "cash"]),
      notes: z.string().max(500).optional(),
      invoice: z
        .object({
          company_name: z.string().min(1, t("required")),
          vat_number: z.string().min(1, t("required")),
          address_line1: z.string().min(1, t("required")),
          postal_code: z.string().min(1, t("postalCode")),
          city: z.string().min(1, t("required")),
          country_code: z.string().min(2).max(3),
        })
        .optional(),
    })
    .refine((data) => !(data.fulfillment === "delivery" && !data.delivery_address), {
      message: t("deliveryAddressRequired"),
      path: ["delivery_address"],
    });
}

// Canonical schema used server-side (API) and for the inferred request type.
export const checkoutSchema = createCheckoutSchema();
export type CheckoutRequest = z.infer<typeof checkoutSchema>;
