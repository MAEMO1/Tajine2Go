import { z } from "zod";

export const checkoutSchema = z.object({
  locale: z.enum(["nl", "fr", "en", "ar"]),
  items: z
    .array(
      z.object({
        weekly_menu_id: z.string().uuid(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Minimaal 1 item vereist"),
  customer: z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  fulfillment: z.enum(["pickup", "delivery"]),
  delivery_address: z
    .object({
      line1: z.string().min(1),
      postal_code: z.string().min(4).max(10),
      city: z.string().min(1),
      country_code: z.literal("BE"),
    })
    .optional(),
  pickup_slot: z.string().optional(),
  payment_method: z.enum(["online", "cash"]),
  notes: z.string().max(500).optional(),
  invoice: z
    .object({
      company_name: z.string().min(1),
      vat_number: z.string().min(1),
      address_line1: z.string().min(1),
      postal_code: z.string().min(1),
      city: z.string().min(1),
      country_code: z.string().min(2).max(3),
    })
    .optional(),
}).refine(
  (data) => {
    if (data.fulfillment === "delivery" && !data.delivery_address) {
      return false;
    }
    return true;
  },
  { message: "Leveradres is verplicht bij levering", path: ["delivery_address"] },
);

export type CheckoutRequest = z.infer<typeof checkoutSchema>;
