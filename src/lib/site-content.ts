import "server-only";

import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeTakeawaySchedule } from "@/lib/menu-data";
import { ORDER_PHONE_NUMBERS, ORDER_PHONE_SUMMARY } from "@/lib/phone";
import type {
  AdminContentSettings,
  BrandAssets,
  BusinessInfo,
  DayName,
  FaqEntry,
  LegalPageContent,
  LegalPages,
  LegalPagesInput,
  Locale,
  LocalizedSiteContent,
  OpeningHoursLine,
  OpeningHoursSpecification,
  TakeawaySchedule,
  TakeawayScheduleDay,
  WebsiteLocaleTextInput,
  WebsiteLocaleTexts,
  WebsiteTexts,
} from "@/types/database";

const LOCALES: Locale[] = ["nl", "fr", "en"];
const DAY_ORDER: DayName[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<Locale, Record<DayName, string>> = {
  nl: {
    monday: "maandag",
    tuesday: "dinsdag",
    wednesday: "woensdag",
    thursday: "donderdag",
    friday: "vrijdag",
    saturday: "zaterdag",
    sunday: "zondag",
  },
  fr: {
    monday: "lundi",
    tuesday: "mardi",
    wednesday: "mercredi",
    thursday: "jeudi",
    friday: "vendredi",
    saturday: "samedi",
    sunday: "dimanche",
  },
  en: {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
};

const COUNTRY_FALLBACKS: Record<Locale, string> = {
  nl: "België",
  fr: "Belgique",
  en: "Belgium",
};

// Fallback zolang er geen uurrooster in de settings staat.
const CLOSED_LABELS: Record<Locale, string> = {
  nl: "6 dagen per week open — uren volgen binnenkort",
  fr: "Ouvert 6 jours sur 7 — horaires bientôt disponibles",
  en: "Open 6 days a week — opening hours coming soon",
};

const EVERY_DAY_PREFIX: Record<Locale, string> = {
  nl: "Elke",
  fr: "Chaque",
  en: "Every",
};

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  name: "Tajine2Go",
  legal_name: "Tajine2Go",
  email: "info@tajine2go.be",
  phone: ORDER_PHONE_SUMMARY,
  address_line: "Brusselsesteenweg 455",
  address_locality: "9050 Gentbrugge",
  address_country: "België",
  vat_number: "BE 1019936687",
  bank_account: "BE00 0000 0000 0000",
  serves_cuisine: ["Moroccan", "North African"],
  price_range: "€€",
  payment_copy: "Bancontact · Cash",
};

const DEFAULT_BRAND_ASSETS: BrandAssets = {
  header_logo_url: null,
  logo_alt: null,
};

const DEFAULT_WEBSITE_TEXTS: Record<Locale, WebsiteLocaleTexts> = {
  nl: {
    home: {
      hero_subtitle: "Met liefde bereid, met respect voor traditie",
      story_text:
        "Tajine2Go brengt de authentieke smaken van Marokko naar Gent. Met liefde bereid, met respect voor traditie, en met de beste verse ingrediënten. Elke week opnieuw.",
      catering_cta_title: "Catering voor uw evenement",
      catering_cta_text:
        "Van bruiloften tot bedrijfsevenementen — wij verzorgen het met authentieke Marokkaanse gerechten.",
    },
    notices: {
      homepage_banner: null,
      closed_message: `Bestellen doe je telefonisch: bel ${ORDER_PHONE_NUMBERS[0].display} of ${ORDER_PHONE_NUMBERS[1].display}.`,
      checkout_notice: null,
    },
    about: {
      body_paragraphs: [
        "Tajine2Go brengt de authentieke smaken van de Marokkaanse keuken naar Gent. Elke week bereiden we verse tajines, couscous en meer met traditionele recepten en de beste ingrediënten.",
        "Onze missie is simpel: iedereen laten genieten van huisgemaakte Marokkaanse gerechten, met de warmte en gastvrijheid die bij onze cultuur hoort.",
        "Naast onze wekelijkse takeaway bieden we ook catering aan voor evenementen, van bruiloften en aqiqa's tot bedrijfsevenementen en iftar.",
      ],
    },
    catering: {
      subtitle: "Laat ons uw evenement verzorgen met authentieke Marokkaanse gerechten.",
      notice: null,
    },
  },
  fr: {
    home: {
      hero_subtitle: "Préparé avec amour, dans le respect de la tradition",
      story_text:
        "Tajine2Go apporte les saveurs authentiques du Maroc à Gand. Préparé avec amour, dans le respect de la tradition et avec les meilleurs ingrédients frais, chaque semaine.",
      catering_cta_title: "Traiteur pour votre événement",
      catering_cta_text:
        "Des mariages aux événements d'entreprise, nous nous en occupons avec des plats marocains authentiques.",
    },
    notices: {
      homepage_banner: null,
      closed_message: `Commandez par téléphone : appelez le ${ORDER_PHONE_NUMBERS[0].display} ou le ${ORDER_PHONE_NUMBERS[1].display}.`,
      checkout_notice: null,
    },
    about: {
      body_paragraphs: [
        "Tajine2Go apporte les saveurs authentiques de la cuisine marocaine à Gand. Chaque semaine, nous préparons des tajines frais, du couscous et bien plus avec des recettes traditionnelles et les meilleurs ingrédients.",
        "Notre mission est simple: permettre à chacun de savourer des plats marocains faits maison, avec la chaleur et l'hospitalité propres à notre culture.",
        "En plus de notre offre hebdomadaire à emporter, nous proposons aussi un service traiteur pour les événements, des mariages et aqiqa aux événements d'entreprise et iftar.",
      ],
    },
    catering: {
      subtitle: "Laissez-nous prendre en charge votre événement avec des plats marocains authentiques.",
      notice: null,
    },
  },
  en: {
    home: {
      hero_subtitle: "Prepared with love, with respect for tradition",
      story_text:
        "Tajine2Go brings the authentic flavours of Morocco to Ghent. Prepared with love, with respect for tradition, and with the best fresh ingredients every single week.",
      catering_cta_title: "Catering for your event",
      catering_cta_text:
        "From weddings to corporate events, we take care of it with authentic Moroccan dishes.",
    },
    notices: {
      homepage_banner: null,
      closed_message: `Order by phone: call ${ORDER_PHONE_NUMBERS[0].display} or ${ORDER_PHONE_NUMBERS[1].display}.`,
      checkout_notice: null,
    },
    about: {
      body_paragraphs: [
        "Tajine2Go brings the authentic flavours of Moroccan cuisine to Ghent. Every week we prepare fresh tajines, couscous and more with traditional recipes and the best ingredients.",
        "Our mission is simple: let everyone enjoy homemade Moroccan dishes with the warmth and hospitality that belong to our culture.",
        "Alongside our weekly takeaway, we also provide catering for events, from weddings and aqiqa to corporate events and iftar.",
      ],
    },
    catering: {
      subtitle: "Let us take care of your event with authentic Moroccan dishes.",
      notice: null,
    },
  },
};

const DEFAULT_LEGAL_PAGES: Record<Locale, LegalPages> = {
  nl: {
    privacy: {
      title: "Privacybeleid",
      body_paragraphs: [
        "We verwerken persoonsgegevens die nodig zijn om bestellingen, leveringen en cateringaanvragen correct af te handelen.",
        "Voor vragen over privacy of gegevensverwerking kunt u contact opnemen via het e-mailadres dat op deze website vermeld staat.",
      ],
    },
    terms: {
      title: "Algemene voorwaarden",
      body_paragraphs: [
        "Bestellingen en cateringaanvragen zijn onder voorbehoud van beschikbaarheid en bevestiging.",
        "Specifieke afspraken over levering, annulering en betaling kunnen per bestelling of offerte verder worden bevestigd.",
      ],
    },
  },
  fr: {
    privacy: {
      title: "Politique de confidentialité",
      body_paragraphs: [
        "Nous traitons les données personnelles nécessaires au bon traitement des commandes, livraisons et demandes traiteur.",
        "Pour toute question relative à la confidentialité ou au traitement des données, vous pouvez nous contacter via l'adresse e-mail mentionnée sur ce site.",
      ],
    },
    terms: {
      title: "Conditions générales",
      body_paragraphs: [
        "Les commandes et demandes traiteur sont soumises à disponibilité et à confirmation.",
        "Les modalités spécifiques de livraison, d'annulation et de paiement peuvent être confirmées séparément pour chaque commande ou devis.",
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy policy",
      body_paragraphs: [
        "We process the personal data needed to handle orders, deliveries and catering requests correctly.",
        "For questions about privacy or data processing, you can contact us via the email address listed on this website.",
      ],
    },
    terms: {
      title: "Terms and conditions",
      body_paragraphs: [
        "Orders and catering requests are subject to availability and confirmation.",
        "Specific arrangements around delivery, cancellation and payment may be confirmed separately for each order or quote.",
      ],
    },
  },
};

const DEFAULT_FAQS: Record<Locale, FaqEntry[]> = {
  nl: [
    {
      id: "faq-ordering",
      question: "Hoe kan ik bestellen?",
      answer: `Bestellen doe je telefonisch: bel ${ORDER_PHONE_NUMBERS[0].display} of ${ORDER_PHONE_NUMBERS[1].display}. We zijn 6 dagen per week open; de exacte openingsuren volgen binnenkort.`,
      sort_order: 0,
      is_active: true,
    },
    {
      id: "faq-pickup",
      question: "Waar kan ik afhalen?",
      answer: "Je haalt je bestelling af op Brusselsesteenweg 455, 9050 Gentbrugge.",
      sort_order: 1,
      is_active: true,
    },
    {
      id: "faq-payment",
      question: "Hoe kan ik betalen?",
      answer: "Bij afhaling betaal je ter plaatse met Bancontact of cash.",
      sort_order: 2,
      is_active: true,
    },
    {
      id: "faq-catering",
      question: "Hoe werkt catering?",
      answer:
        "Stuur ons een aanvraag via het cateringformulier. We nemen contact met je op om je evenement te bespreken en een offerte op maat te maken.",
      sort_order: 4,
      is_active: true,
    },
    {
      id: "faq-cancel",
      question: "Kan ik mijn bestelling annuleren?",
      answer: "Neem contact met ons op en we helpen je graag verder.",
      sort_order: 5,
      is_active: true,
    },
    {
      id: "faq-halal",
      question: "Zijn jullie gerechten halal?",
      answer: "Ja, al onze gerechten worden bereid met halal ingrediënten.",
      sort_order: 6,
      is_active: true,
    },
  ],
  fr: [
    {
      id: "faq-ordering",
      question: "Comment puis-je commander?",
      answer: `Les commandes se font par téléphone : appelez le ${ORDER_PHONE_NUMBERS[0].display} ou le ${ORDER_PHONE_NUMBERS[1].display}. Nous sommes ouverts 6 jours sur 7 ; les horaires exacts suivront bientôt.`,
      sort_order: 0,
      is_active: true,
    },
    {
      id: "faq-pickup",
      question: "Où puis-je retirer ma commande?",
      answer: "Vous retirez votre commande au Brusselsesteenweg 455, 9050 Gentbrugge.",
      sort_order: 1,
      is_active: true,
    },
    {
      id: "faq-payment",
      question: "Comment puis-je payer?",
      answer: "Au retrait, vous payez sur place par Bancontact ou en espèces.",
      sort_order: 2,
      is_active: true,
    },
    {
      id: "faq-catering",
      question: "Comment fonctionne le service traiteur?",
      answer:
        "Envoyez-nous une demande via le formulaire traiteur. Nous vous contacterons pour discuter de votre événement et établir un devis sur mesure.",
      sort_order: 4,
      is_active: true,
    },
    {
      id: "faq-cancel",
      question: "Puis-je annuler ma commande?",
      answer: "Contactez-nous et nous vous aiderons avec plaisir.",
      sort_order: 5,
      is_active: true,
    },
    {
      id: "faq-halal",
      question: "Vos plats sont-ils halal?",
      answer: "Oui, tous nos plats sont préparés avec des ingrédients halal.",
      sort_order: 6,
      is_active: true,
    },
  ],
  en: [
    {
      id: "faq-ordering",
      question: "How can I order?",
      answer: `Ordering is done by phone: call ${ORDER_PHONE_NUMBERS[0].display} or ${ORDER_PHONE_NUMBERS[1].display}. We are open 6 days a week; exact opening hours will follow soon.`,
      sort_order: 0,
      is_active: true,
    },
    {
      id: "faq-pickup",
      question: "Where do I pick up my order?",
      answer: "You pick up your order at Brusselsesteenweg 455, 9050 Gentbrugge.",
      sort_order: 1,
      is_active: true,
    },
    {
      id: "faq-payment",
      question: "How can I pay?",
      answer: "At pickup you pay on the spot with Bancontact or cash.",
      sort_order: 2,
      is_active: true,
    },
    {
      id: "faq-catering",
      question: "How does catering work?",
      answer:
        "Send us a request through the catering form. We will contact you to discuss your event and prepare a tailored quote.",
      sort_order: 4,
      is_active: true,
    },
    {
      id: "faq-cancel",
      question: "Can I cancel my order?",
      answer: "Contact us and we will gladly help you further.",
      sort_order: 5,
      is_active: true,
    },
    {
      id: "faq-halal",
      question: "Are your dishes halal?",
      answer: "Yes, all our dishes are prepared with halal ingredients.",
      sort_order: 6,
      is_active: true,
    },
  ],
};

const SCHEMA_DAY_NAMES: Record<DayName, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function readNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readOptionalNullableString(
  source: Record<string, unknown>,
  key: string,
): string | null | undefined {
  if (!(key in source)) {
    return undefined;
  }

  return readNullableString(source[key]);
}

function readStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseLegacyAddress(address: string) {
  const trimmed = address.trim();
  if (!trimmed) {
    return {
      address_line: "",
      address_locality: "",
      address_country: "",
    };
  }

  const [locality = "", country = ""] = trimmed.split(",").map((part) => part.trim());

  return {
    address_line: "",
    address_locality: locality,
    address_country: country,
  };
}

export function normalizeBusinessInfo(value: unknown): BusinessInfo {
  if (!isRecord(value)) {
    return { ...DEFAULT_BUSINESS_INFO };
  }

  const legacyAddress = readString(value.address);
  const parsedLegacyAddress = parseLegacyAddress(legacyAddress);

  return {
    name: readString(value.name, DEFAULT_BUSINESS_INFO.name),
    legal_name: readString(value.legal_name, readString(value.name, DEFAULT_BUSINESS_INFO.legal_name)),
    email: readString(value.email, DEFAULT_BUSINESS_INFO.email),
    phone: readString(value.phone, DEFAULT_BUSINESS_INFO.phone),
    address_line: readString(value.address_line, parsedLegacyAddress.address_line),
    address_locality: readString(value.address_locality, parsedLegacyAddress.address_locality || DEFAULT_BUSINESS_INFO.address_locality),
    address_country: readString(value.address_country, parsedLegacyAddress.address_country || DEFAULT_BUSINESS_INFO.address_country),
    vat_number: readString(value.vat_number, DEFAULT_BUSINESS_INFO.vat_number),
    bank_account: readString(value.bank_account, DEFAULT_BUSINESS_INFO.bank_account),
    serves_cuisine: readStringArray(value.serves_cuisine, DEFAULT_BUSINESS_INFO.serves_cuisine),
    price_range: readString(value.price_range, DEFAULT_BUSINESS_INFO.price_range),
    payment_copy: readString(value.payment_copy, DEFAULT_BUSINESS_INFO.payment_copy),
  };
}

function normalizeWebsiteLocaleTextInput(value: unknown): WebsiteLocaleTextInput {
  if (!isRecord(value)) {
    return {};
  }

  const hasLegacyFlatNotices =
    "homepage_banner" in value || "closed_message" in value || "checkout_notice" in value;
  const home = isRecord(value.home) ? value.home : {};
  const notices = isRecord(value.notices) ? value.notices : {};
  const about = isRecord(value.about) ? value.about : {};
  const catering = isRecord(value.catering) ? value.catering : {};

  return {
    home: {
      hero_subtitle: readNullableString(home.hero_subtitle) ?? undefined,
      story_text: readNullableString(home.story_text) ?? undefined,
      catering_cta_title: readNullableString(home.catering_cta_title) ?? undefined,
      catering_cta_text: readNullableString(home.catering_cta_text) ?? undefined,
    },
    notices: {
      homepage_banner: hasLegacyFlatNotices
        ? readOptionalNullableString(value, "homepage_banner")
        : readOptionalNullableString(notices, "homepage_banner"),
      closed_message: hasLegacyFlatNotices
        ? readOptionalNullableString(value, "closed_message")
        : readOptionalNullableString(notices, "closed_message"),
      checkout_notice: hasLegacyFlatNotices
        ? readOptionalNullableString(value, "checkout_notice")
        : readOptionalNullableString(notices, "checkout_notice"),
    },
    about: {
      body_paragraphs: Array.isArray(about.body_paragraphs)
        ? readStringArray(about.body_paragraphs)
        : undefined,
    },
    catering: {
      subtitle: readNullableString(catering.subtitle) ?? undefined,
      notice: readOptionalNullableString(catering, "notice"),
    },
  };
}

export function normalizeWebsiteTexts(value: unknown): WebsiteTexts {
  if (!isRecord(value)) {
    return {};
  }

  const localeEntries = Object.entries(value).filter(([key]) => isLocale(key));
  if (localeEntries.length > 0) {
    return Object.fromEntries(
      localeEntries.map(([localeKey, localeValue]) => [
        localeKey,
        normalizeWebsiteLocaleTextInput(localeValue),
      ]),
    ) as WebsiteTexts;
  }

  return Object.fromEntries(
    LOCALES.map((locale) => [locale, normalizeWebsiteLocaleTextInput(value)]),
  ) as WebsiteTexts;
}

function mergeWebsiteLocaleTexts(
  defaults: WebsiteLocaleTexts,
  value: WebsiteLocaleTextInput | undefined,
): WebsiteLocaleTexts {
  return {
    home: {
      hero_subtitle: value?.home?.hero_subtitle ?? defaults.home.hero_subtitle,
      story_text: value?.home?.story_text ?? defaults.home.story_text,
      catering_cta_title:
        value?.home?.catering_cta_title ?? defaults.home.catering_cta_title,
      catering_cta_text:
        value?.home?.catering_cta_text ?? defaults.home.catering_cta_text,
    },
    notices: {
      homepage_banner:
        value?.notices?.homepage_banner !== undefined
          ? value.notices.homepage_banner ?? null
          : defaults.notices.homepage_banner,
      closed_message:
        value?.notices?.closed_message !== undefined
          ? value.notices.closed_message ?? null
          : defaults.notices.closed_message,
      checkout_notice:
        value?.notices?.checkout_notice !== undefined
          ? value.notices.checkout_notice ?? null
          : defaults.notices.checkout_notice,
    },
    about: {
      body_paragraphs:
        value?.about?.body_paragraphs ?? defaults.about.body_paragraphs,
    },
    catering: {
      subtitle: value?.catering?.subtitle ?? defaults.catering.subtitle,
      notice:
        value?.catering?.notice !== undefined
          ? value.catering.notice ?? null
          : defaults.catering.notice,
    },
  };
}

function normalizeBrandAssets(value: unknown): BrandAssets {
  if (!isRecord(value)) {
    return { ...DEFAULT_BRAND_ASSETS };
  }

  return {
    header_logo_url: readNullableString(value.header_logo_url),
    logo_alt: readNullableString(value.logo_alt),
  };
}

function normalizeLegalPageContent(
  value: unknown,
  fallback: LegalPageContent,
): LegalPageContent {
  if (!isRecord(value)) {
    return fallback;
  }

  return {
    title: readString(value.title, fallback.title),
    body_paragraphs:
      Array.isArray(value.body_paragraphs) && readStringArray(value.body_paragraphs).length > 0
        ? readStringArray(value.body_paragraphs)
        : fallback.body_paragraphs,
  };
}

function normalizeLegalPages(value: unknown): Record<Locale, LegalPages> {
  if (!isRecord(value)) {
    return DEFAULT_LEGAL_PAGES;
  }

  return Object.fromEntries(
    LOCALES.map((locale) => {
      const localeValue = isRecord(value[locale]) ? value[locale] : {};
      return [
        locale,
        {
          privacy: normalizeLegalPageContent(localeValue.privacy, DEFAULT_LEGAL_PAGES[locale].privacy),
          terms: normalizeLegalPageContent(localeValue.terms, DEFAULT_LEGAL_PAGES[locale].terms),
        },
      ];
    }),
  ) as Record<Locale, LegalPages>;
}

function sortFaqEntries(entries: FaqEntry[]) {
  return [...entries].sort((a, b) => a.sort_order - b.sort_order);
}

function normalizeFaqArray(
  value: unknown,
  fallback: FaqEntry[],
  options: { allowEmpty?: boolean } = {},
): FaqEntry[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .map((entry, index) => {
      if (!isRecord(entry)) {
        return null;
      }

      const question = readString(entry.question);
      const answer = readString(entry.answer);
      if (!question || !answer) {
        return null;
      }

      return {
        id: readString(entry.id, `faq-${index + 1}`),
        question,
        answer,
        sort_order:
          Number.isFinite(Number(entry.sort_order)) ? Number(entry.sort_order) : index,
        is_active: entry.is_active !== false,
      } satisfies FaqEntry;
    })
    .filter((entry): entry is FaqEntry => entry !== null);

  if (normalized.length === 0) {
    return options.allowEmpty ? [] : fallback;
  }

  return sortFaqEntries(normalized);
}

export function normalizeFaqEntries(value: unknown): Record<Locale, FaqEntry[]> {
  if (!isRecord(value)) {
    return Object.fromEntries(
      LOCALES.map((locale) => [locale, DEFAULT_FAQS[locale]]),
    ) as Record<Locale, FaqEntry[]>;
  }

  return Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      normalizeFaqArray(value[locale], DEFAULT_FAQS[locale], { allowEmpty: true }),
    ]),
  ) as Record<Locale, FaqEntry[]>;
}

function deriveWindowFromSlots(day: TakeawayScheduleDay): string {
  const firstSlot = day.slots.at(0);
  const lastSlot = day.slots.at(-1);

  if (!firstSlot || !lastSlot) {
    return "";
  }

  const [startsAt] = firstSlot.split("-");
  const [, endsAt] = lastSlot.split("-");

  return startsAt && endsAt ? `${startsAt}-${endsAt}` : "";
}

function getDisplayWindow(day: TakeawayScheduleDay): string {
  return day.open_window || deriveWindowFromSlots(day);
}

function buildOpeningHoursLines(
  schedule: TakeawaySchedule,
  locale: Locale,
): OpeningHoursLine[] {
  return DAY_ORDER.flatMap((dayName) => {
    const day = schedule.days.find((entry) => entry.day === dayName);
    if (!day) {
      return [];
    }

    const window = getDisplayWindow(day);
    if (!window) {
      return [];
    }

    return [
      {
        day: day.day,
        label: DAY_LABELS[locale][day.day],
        window,
      },
    ];
  });
}

function buildOpeningHoursSummary(lines: OpeningHoursLine[], locale: Locale) {
  if (lines.length === 0) {
    return CLOSED_LABELS[locale];
  }

  if (lines.length === 1) {
    return `${EVERY_DAY_PREFIX[locale]} ${lines[0].label} ${lines[0].window}`;
  }

  return lines.map((line) => `${line.label} ${line.window}`).join(" · ");
}

function buildOpeningHoursSpecification(
  schedule: TakeawaySchedule,
): OpeningHoursSpecification[] {
  return DAY_ORDER.flatMap((dayName) => {
    const day = schedule.days.find((entry) => entry.day === dayName);
    if (!day) {
      return [];
    }

    const window = getDisplayWindow(day);
    const [opens = "", closes = ""] = window.split("-");

    if (!opens || !closes) {
      return [];
    }

    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SCHEMA_DAY_NAMES[day.day],
        opens,
        closes,
      },
    ];
  });
}

export function formatBusinessLocation(
  businessInfo: BusinessInfo,
  locale: Locale,
) {
  const parts = [
    businessInfo.address_locality,
    businessInfo.address_country || COUNTRY_FALLBACKS[locale],
  ].filter(Boolean);

  return parts.join(", ");
}

function mergeWebsiteTextPayload(
  existing: Record<Locale, WebsiteLocaleTexts>,
  updates: WebsiteTexts,
) {
  return Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      mergeWebsiteLocaleTexts(existing[locale], updates[locale]),
    ]),
  ) as Record<Locale, WebsiteLocaleTexts>;
}

function mergeFaqPayload(
  existing: Record<Locale, FaqEntry[]>,
  updates: Partial<Record<Locale, FaqEntry[]>>,
) {
  return Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      updates[locale]
        ? normalizeFaqArray(updates[locale], existing[locale], { allowEmpty: true })
        : existing[locale],
    ]),
  ) as Record<Locale, FaqEntry[]>;
}

function mergeLegalPagesPayload(
  existing: Record<Locale, LegalPages>,
  updates: LegalPagesInput,
) {
  return Object.fromEntries(
    LOCALES.map((locale) => {
      const localeUpdates = updates[locale];
      const current = existing[locale];

      return [
        locale,
        {
          privacy: normalizeLegalPageContent(localeUpdates?.privacy, current.privacy),
          terms: normalizeLegalPageContent(localeUpdates?.terms, current.terms),
        },
      ];
    }),
  ) as Record<Locale, LegalPages>;
}

async function fetchContentRowsUncached() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", [
      "business_info",
      "website_texts",
      "faq_entries",
      "brand_assets",
      "legal_pages",
      "takeaway_schedule",
    ]);

  if (error) {
    throw new Error("Failed to fetch site content settings");
  }

  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value])) as Record<
    string,
    unknown
  >;

  return settings;
}

const fetchContentRows = cache(fetchContentRowsUncached);

function buildPublicSiteContent(
  locale: Locale,
  settings: Record<string, unknown> = {},
): LocalizedSiteContent {
  const businessInfo = normalizeBusinessInfo(settings.business_info);
  const websiteTexts = mergeWebsiteLocaleTexts(
    DEFAULT_WEBSITE_TEXTS[locale],
    normalizeWebsiteTexts(settings.website_texts)[locale],
  );
  const faqEntries = sortFaqEntries(
    normalizeFaqEntries(settings.faq_entries)[locale].filter((entry) => entry.is_active),
  );
  const brandAssets = normalizeBrandAssets(settings.brand_assets);
  const legalPages = normalizeLegalPages(settings.legal_pages)[locale];
  const schedule = normalizeTakeawaySchedule(settings.takeaway_schedule);
  const openingHoursLines = buildOpeningHoursLines(schedule, locale);

  return {
    business_info: businessInfo,
    website_texts: websiteTexts,
    faq_entries: faqEntries,
    brand_assets: brandAssets,
    legal_pages: legalPages,
    opening_hours_lines: openingHoursLines,
    opening_hours_summary: buildOpeningHoursSummary(openingHoursLines, locale),
    location_text: formatBusinessLocation(businessInfo, locale),
    opening_hours_specification: buildOpeningHoursSpecification(schedule),
  };
}

export async function fetchAdminContentSettings(
  options: { fresh?: boolean } = {},
): Promise<AdminContentSettings> {
  const settings = options.fresh ? await fetchContentRowsUncached() : await fetchContentRows();
  const businessInfo = normalizeBusinessInfo(settings.business_info);
  const websiteTextInput = normalizeWebsiteTexts(settings.website_texts);
  const faqEntries = normalizeFaqEntries(settings.faq_entries);
  const brandAssets = normalizeBrandAssets(settings.brand_assets);
  const legalPages = normalizeLegalPages(settings.legal_pages);

  return {
    business_info: businessInfo,
    website_texts: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        mergeWebsiteLocaleTexts(DEFAULT_WEBSITE_TEXTS[locale], websiteTextInput[locale]),
      ]),
    ) as Record<Locale, WebsiteLocaleTexts>,
    faq_entries: faqEntries,
    brand_assets: brandAssets,
    legal_pages: legalPages,
  };
}

export async function fetchPublicSiteContent(
  locale: Locale,
): Promise<LocalizedSiteContent> {
  // De publieke site draait volledig op de content in code: de gekoppelde
  // database bevat nog oude gegevens (zaterdag-uurrooster, oud adres) uit een
  // eerdere fase. De admin-contentmodule leest/schrijft de database wel; die
  // gaat pas weer de publieke site voeden zodra de database is bijgewerkt
  // (beslissing eigenaar 17/08/2026).
  return buildPublicSiteContent(locale);
}

export async function updateContentSettings(
  updates: Partial<{
    business_info: Partial<BusinessInfo>;
    website_texts: WebsiteTexts;
    faq_entries: Partial<Record<Locale, FaqEntry[]>>;
    brand_assets: Partial<BrandAssets>;
    legal_pages: LegalPagesInput;
  }>,
) {
  const supabase = createAdminClient();
  const currentSettings = await fetchAdminContentSettings();

  const payload: { key: string; value: unknown }[] = [];

  if (updates.business_info) {
    payload.push({
      key: "business_info",
      value: normalizeBusinessInfo({
        ...currentSettings.business_info,
        ...updates.business_info,
      }),
    });
  }

  if (updates.website_texts) {
    const normalizedWebsiteTexts = normalizeWebsiteTexts(updates.website_texts);
    payload.push({
      key: "website_texts",
      value: mergeWebsiteTextPayload(
        currentSettings.website_texts,
        normalizedWebsiteTexts,
      ),
    });
  }

  if (updates.faq_entries) {
    payload.push({
      key: "faq_entries",
      value: mergeFaqPayload(currentSettings.faq_entries, updates.faq_entries),
    });
  }

  if (updates.brand_assets) {
    payload.push({
      key: "brand_assets",
      value: normalizeBrandAssets({
        ...currentSettings.brand_assets,
        ...updates.brand_assets,
      }),
    });
  }

  if (updates.legal_pages) {
    payload.push({
      key: "legal_pages",
      value: mergeLegalPagesPayload(currentSettings.legal_pages, updates.legal_pages),
    });
  }

  if (payload.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("settings")
    .upsert(payload, { onConflict: "key" });

  if (error) {
    throw new Error("Failed to update site content settings");
  }
}
