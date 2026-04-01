import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "fr", "en", "ar"],
  defaultLocale: "nl",
});

export type Locale = (typeof routing.locales)[number];
