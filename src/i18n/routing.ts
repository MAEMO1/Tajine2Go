import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "fr", "en"],
  defaultLocale: "nl",
  // Iedereen komt binnen op NL (Gent), ongeacht browsertaal of eerdere
  // taalkeuze-cookie; wisselen kan altijd via de taalknoppen.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
