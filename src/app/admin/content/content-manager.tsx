"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandAssetField } from "./brand-asset-field";
import type {
  AdminContentSettings,
  BrandAssets,
  BusinessInfo,
  FaqEntry,
  LegalPages,
  Locale,
  WebsiteLocaleTexts,
} from "@/types/database";

type Props = {
  initialContent: AdminContentSettings;
};

type SaveState = "idle" | "saving";
type SaveSectionKey = "business" | "branding" | "home" | "catering" | "about" | "legal" | "faq";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "nl", label: "NL" },
  { value: "fr", label: "FR" },
  { value: "en", label: "EN" },
  { value: "ar", label: "AR" },
];

const INPUT_CLASS =
  "mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none";

export function ContentManager({ initialContent }: Props) {
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<Locale>("nl");
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(initialContent.business_info);
  const [websiteTexts, setWebsiteTexts] = useState<Record<Locale, WebsiteLocaleTexts>>(
    initialContent.website_texts,
  );
  const [faqEntries, setFaqEntries] = useState<Record<Locale, FaqEntry[]>>(
    initialContent.faq_entries,
  );
  const [brandAssets, setBrandAssets] = useState<BrandAssets>(initialContent.brand_assets);
  const [legalPages, setLegalPages] = useState<Record<Locale, LegalPages>>(
    initialContent.legal_pages,
  );
  const [saveState, setSaveState] = useState<Record<SaveSectionKey, SaveState>>({
    business: "idle",
    branding: "idle",
    home: "idle",
    catering: "idle",
    about: "idle",
    legal: "idle",
    faq: "idle",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const localeTexts = websiteTexts[activeLocale];
  const localeFaqs = faqEntries[activeLocale] ?? [];
  const localeLegal = legalPages[activeLocale];

  async function saveSection(section: SaveSectionKey, payload: Record<string, unknown>) {
    setSaveState((current) => ({ ...current, [section]: "saving" }));
    setStatus(null);
    setError(null);

    const response = await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaveState((current) => ({ ...current, [section]: "idle" }));

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error ?? "Opslaan mislukt.");
      return;
    }

    const result = (await response.json()) as AdminContentSettings;
    setBusinessInfo(result.business_info);
    setWebsiteTexts(result.website_texts);
    setFaqEntries(result.faq_entries);
    setBrandAssets(result.brand_assets);
    setLegalPages(result.legal_pages);
    setStatus("Opgeslagen.");
    router.refresh();
  }

  function updateBusinessField(field: keyof BusinessInfo, value: string) {
    setBusinessInfo((current) => ({ ...current, [field]: value }));
  }

  function updateBrandField(field: keyof BrandAssets, value: string) {
    setBrandAssets((current) => ({
      ...current,
      [field]: value || null,
    }));
  }

  function updateLocaleText<K extends keyof WebsiteLocaleTexts>(
    key: K,
    value: WebsiteLocaleTexts[K],
  ) {
    setWebsiteTexts((current) => ({
      ...current,
      [activeLocale]: {
        ...current[activeLocale],
        [key]: value,
      },
    }));
  }

  function updateLegalPage(page: keyof LegalPages, updates: Partial<LegalPages[keyof LegalPages]>) {
    setLegalPages((current) => ({
      ...current,
      [activeLocale]: {
        ...current[activeLocale],
        [page]: {
          ...current[activeLocale][page],
          ...updates,
        },
      },
    }));
  }

  function updateFaqEntry(index: number, updates: Partial<FaqEntry>) {
    setFaqEntries((current) => ({
      ...current,
      [activeLocale]: current[activeLocale].map((entry, currentIndex) =>
        currentIndex === index ? { ...entry, ...updates } : entry,
      ),
    }));
  }

  function addFaqEntry() {
    const nextEntry: FaqEntry = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `faq-${Date.now()}`,
      question: "",
      answer: "",
      sort_order: localeFaqs.length,
      is_active: true,
    };

    setFaqEntries((current) => ({
      ...current,
      [activeLocale]: [...current[activeLocale], nextEntry],
    }));
  }

  function removeFaqEntry(index: number) {
    setFaqEntries((current) => ({
      ...current,
      [activeLocale]: current[activeLocale]
        .filter((_, currentIndex) => currentIndex !== index)
        .map((entry, currentIndex) => ({ ...entry, sort_order: currentIndex })),
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-brand-brown">Publieke content</h1>
        <p className="mt-2 max-w-3xl text-sm text-brand-brown-s">
          Beheer hier de publieke bedrijfsinfo, branding, homepage-copy, catering-copy, legal
          pagina&apos;s, over-ons inhoud en FAQ per taal. Openingsuren blijven uit de planning komen.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {status && <p className="text-sm text-green-700">{status}</p>}

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl text-brand-bronze">Business</h2>
            <p className="mt-1 text-sm text-brand-brown-s">
              Deze gegevens voeden info strip, footer, contactpagina en JSON-LD.
            </p>
          </div>
          <button
            type="button"
            onClick={() => saveSection("business", { business_info: businessInfo })}
            disabled={saveState.business === "saving"}
            className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
          >
            {saveState.business === "saving" ? "Opslaan..." : "Business opslaan"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Publieke naam">
            <input
              value={businessInfo.name}
              onChange={(event) => updateBusinessField("name", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Juridische naam">
            <input
              value={businessInfo.legal_name}
              onChange={(event) => updateBusinessField("legal_name", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="E-mail">
            <input
              type="email"
              value={businessInfo.email}
              onChange={(event) => updateBusinessField("email", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Telefoon">
            <input
              value={businessInfo.phone}
              onChange={(event) => updateBusinessField("phone", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Adresregel">
            <input
              value={businessInfo.address_line}
              onChange={(event) => updateBusinessField("address_line", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Plaats">
            <input
              value={businessInfo.address_locality}
              onChange={(event) => updateBusinessField("address_locality", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Land">
            <input
              value={businessInfo.address_country}
              onChange={(event) => updateBusinessField("address_country", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="BTW-nummer">
            <input
              value={businessInfo.vat_number}
              onChange={(event) => updateBusinessField("vat_number", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Bankrekening">
            <input
              value={businessInfo.bank_account}
              onChange={(event) => updateBusinessField("bank_account", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Prijsrange">
            <input
              value={businessInfo.price_range}
              onChange={(event) => updateBusinessField("price_range", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Keukens (komma-gescheiden)">
            <input
              value={businessInfo.serves_cuisine.join(", ")}
              onChange={(event) =>
                setBusinessInfo((current) => ({
                  ...current,
                  serves_cuisine: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Payment copy">
            <input
              value={businessInfo.payment_copy}
              onChange={(event) => updateBusinessField("payment_copy", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl text-brand-bronze">Branding</h2>
            <p className="mt-1 text-sm text-brand-brown-s">
              Beheer het publieke header-logo. Zonder logo-URL valt de site terug op `/logo.png`.
            </p>
          </div>
          <button
            type="button"
            onClick={() => saveSection("branding", { brand_assets: brandAssets })}
            disabled={saveState.branding === "saving"}
            className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
          >
            {saveState.branding === "saving" ? "Opslaan..." : "Branding opslaan"}
          </button>
        </div>

        <div className="mt-6">
          <BrandAssetField
            value={brandAssets.header_logo_url ?? ""}
            altValue={brandAssets.logo_alt ?? ""}
            onUrlChange={(value) => updateBrandField("header_logo_url", value)}
            onAltChange={(value) => updateBrandField("logo_alt", value)}
          />
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl text-brand-bronze">Gelokaliseerde content</h2>
            <p className="mt-1 text-sm text-brand-brown-s">
              Kies een taal en beheer de copy voor homepage, catering, legal, about en FAQ.
            </p>
          </div>
          <div className="flex gap-2">
            {LOCALES.map((locale) => (
              <button
                key={locale.value}
                type="button"
                onClick={() => setActiveLocale(locale.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activeLocale === locale.value
                    ? "bg-brand-orange text-white"
                    : "bg-brand-warm text-brand-brown hover:bg-brand-warm2"
                }`}
              >
                {locale.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-brand-warm2 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg text-brand-brown">Homepage & notices</h3>
                <p className="mt-1 text-sm text-brand-brown-s">
                  Hero, verhaal en publieke notices voor {activeLocale.toUpperCase()}.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  saveSection("home", {
                    website_texts: {
                      [activeLocale]: {
                        home: localeTexts.home,
                        notices: localeTexts.notices,
                      },
                    },
                  })
                }
                disabled={saveState.home === "saving"}
                className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
              >
                {saveState.home === "saving" ? "Opslaan..." : "Homepage opslaan"}
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Field label="Hero subtitle">
                <textarea
                  rows={3}
                  value={localeTexts.home.hero_subtitle}
                  onChange={(event) =>
                    updateLocaleText("home", {
                      ...localeTexts.home,
                      hero_subtitle: event.target.value,
                    })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Story tekst">
                <textarea
                  rows={4}
                  value={localeTexts.home.story_text}
                  onChange={(event) =>
                    updateLocaleText("home", {
                      ...localeTexts.home,
                      story_text: event.target.value,
                    })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Catering CTA titel">
                <input
                  value={localeTexts.home.catering_cta_title}
                  onChange={(event) =>
                    updateLocaleText("home", {
                      ...localeTexts.home,
                      catering_cta_title: event.target.value,
                    })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Catering CTA tekst">
                <textarea
                  rows={3}
                  value={localeTexts.home.catering_cta_text}
                  onChange={(event) =>
                    updateLocaleText("home", {
                      ...localeTexts.home,
                      catering_cta_text: event.target.value,
                    })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Homepage banner">
                <textarea
                  rows={2}
                  value={localeTexts.notices.homepage_banner ?? ""}
                  onChange={(event) =>
                    updateLocaleText("notices", {
                      ...localeTexts.notices,
                      homepage_banner: event.target.value || null,
                    })
                  }
                  placeholder="Leeg laten om te verbergen"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Gesloten boodschap">
                <textarea
                  rows={3}
                  value={localeTexts.notices.closed_message ?? ""}
                  onChange={(event) =>
                    updateLocaleText("notices", {
                      ...localeTexts.notices,
                      closed_message: event.target.value || null,
                    })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Checkout notice">
                <textarea
                  rows={3}
                  value={localeTexts.notices.checkout_notice ?? ""}
                  onChange={(event) =>
                    updateLocaleText("notices", {
                      ...localeTexts.notices,
                      checkout_notice: event.target.value || null,
                    })
                  }
                  placeholder="Leeg laten om te verbergen"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-brand-warm2 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg text-brand-brown">Catering page</h3>
                <p className="mt-1 text-sm text-brand-brown-s">
                  Subtitle en optionele notice boven het publieke cateringformulier.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  saveSection("catering", {
                    website_texts: {
                      [activeLocale]: {
                        catering: localeTexts.catering,
                      },
                    },
                  })
                }
                disabled={saveState.catering === "saving"}
                className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
              >
                {saveState.catering === "saving" ? "Opslaan..." : "Catering opslaan"}
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Field label="Subtitle">
                <textarea
                  rows={4}
                  value={localeTexts.catering.subtitle}
                  onChange={(event) =>
                    updateLocaleText("catering", {
                      ...localeTexts.catering,
                      subtitle: event.target.value,
                    })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Notice">
                <textarea
                  rows={3}
                  value={localeTexts.catering.notice ?? ""}
                  onChange={(event) =>
                    updateLocaleText("catering", {
                      ...localeTexts.catering,
                      notice: event.target.value || null,
                    })
                  }
                  placeholder="Leeg laten om te verbergen"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-brand-warm2 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg text-brand-brown">About</h3>
                <p className="mt-1 text-sm text-brand-brown-s">
                  Eén paragraaf per blok, gescheiden door een lege regel.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  saveSection("about", {
                    website_texts: {
                      [activeLocale]: {
                        about: localeTexts.about,
                      },
                    },
                  })
                }
                disabled={saveState.about === "saving"}
                className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
              >
                {saveState.about === "saving" ? "Opslaan..." : "About opslaan"}
              </button>
            </div>

            <Field label="Body paragrafen">
              <textarea
                rows={12}
                value={localeTexts.about.body_paragraphs.join("\n\n")}
                onChange={(event) =>
                  updateLocaleText("about", {
                    body_paragraphs: event.target.value
                      .split(/\n\s*\n/)
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean),
                  })
                }
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <div className="rounded-xl border border-brand-warm2 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg text-brand-brown">Legal</h3>
                <p className="mt-1 text-sm text-brand-brown-s">
                  Beheer privacy en voorwaarden voor {activeLocale.toUpperCase()}.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  saveSection("legal", {
                    legal_pages: {
                      [activeLocale]: localeLegal,
                    },
                  })
                }
                disabled={saveState.legal === "saving"}
                className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
              >
                {saveState.legal === "saving" ? "Opslaan..." : "Legal opslaan"}
              </button>
            </div>

            <div className="mt-5 space-y-6">
              <div className="rounded-xl bg-brand-warm/40 p-4">
                <h4 className="font-semibold text-brand-brown">Privacy</h4>
                <Field label="Titel">
                  <input
                    value={localeLegal.privacy.title}
                    onChange={(event) =>
                      updateLegalPage("privacy", { title: event.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Body paragrafen">
                  <textarea
                    rows={6}
                    value={localeLegal.privacy.body_paragraphs.join("\n\n")}
                    onChange={(event) =>
                      updateLegalPage("privacy", {
                        body_paragraphs: event.target.value
                          .split(/\n\s*\n/)
                          .map((paragraph) => paragraph.trim())
                          .filter(Boolean),
                      })
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>

              <div className="rounded-xl bg-brand-warm/40 p-4">
                <h4 className="font-semibold text-brand-brown">Voorwaarden</h4>
                <Field label="Titel">
                  <input
                    value={localeLegal.terms.title}
                    onChange={(event) =>
                      updateLegalPage("terms", { title: event.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Body paragrafen">
                  <textarea
                    rows={6}
                    value={localeLegal.terms.body_paragraphs.join("\n\n")}
                    onChange={(event) =>
                      updateLegalPage("terms", {
                        body_paragraphs: event.target.value
                          .split(/\n\s*\n/)
                          .map((paragraph) => paragraph.trim())
                          .filter(Boolean),
                      })
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-brand-warm2 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg text-brand-brown">FAQ</h3>
              <p className="mt-1 text-sm text-brand-brown-s">
                Sorteer met `sort order`. Inactieve items worden publiek niet getoond.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addFaqEntry}
                className="rounded-lg border border-brand-orange px-4 py-2 text-sm font-semibold text-brand-orange hover:bg-brand-warm"
              >
                + FAQ
              </button>
              <button
                type="button"
                onClick={() =>
                  saveSection("faq", {
                    faq_entries: {
                      [activeLocale]: localeFaqs,
                    },
                  })
                }
                disabled={saveState.faq === "saving"}
                className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
              >
                {saveState.faq === "saving" ? "Opslaan..." : "FAQ opslaan"}
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {localeFaqs.map((entry, index) => (
              <div key={entry.id} className="rounded-xl bg-brand-warm/40 p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_140px_140px]">
                  <div className="space-y-4">
                    <Field label="Vraag">
                      <input
                        value={entry.question}
                        onChange={(event) =>
                          updateFaqEntry(index, { question: event.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Antwoord">
                      <textarea
                        rows={4}
                        value={entry.answer}
                        onChange={(event) =>
                          updateFaqEntry(index, { answer: event.target.value })
                        }
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>

                  <Field label="Sort order">
                    <input
                      type="number"
                      value={entry.sort_order}
                      onChange={(event) =>
                        updateFaqEntry(index, {
                          sort_order: Number(event.target.value) || 0,
                        })
                      }
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <div className="flex flex-col justify-between gap-3">
                    <label className="mt-7 flex items-center gap-2 text-sm text-brand-brown">
                      <input
                        type="checkbox"
                        checked={entry.is_active}
                        onChange={(event) =>
                          updateFaqEntry(index, { is_active: event.target.checked })
                        }
                      />
                      Actief
                    </label>
                    <button
                      type="button"
                      onClick={() => removeFaqEntry(index)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {localeFaqs.length === 0 && (
              <p className="text-sm text-brand-brown-s">
                Nog geen FAQ-items voor deze taal.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-brand-brown-m">{label}</span>
      <div>{children}</div>
    </label>
  );
}
