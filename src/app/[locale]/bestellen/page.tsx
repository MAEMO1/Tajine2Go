import { setRequestLocale, getTranslations } from "next-intl/server";
import { SplitHeading } from "@/components/motion/reveal";
import { Khatam } from "@/components/decor/khatam";
import { resolvePublicOrderConfig } from "@/lib/menu-data";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";
import { CheckoutForm } from "./checkout-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const config = await resolvePublicOrderConfig();
  const content = await fetchPublicSiteContent(locale as Locale);
  const t = await getTranslations({ locale, namespace: "checkout" });

  return (
    <div className="contents">
      {/* ── Page-hero band ── */}
      <section className="relative overflow-hidden">
        <Khatam className="pointer-events-none absolute -top-12 hidden h-48 w-48 text-brand-orange/10 md:block ltr:-right-10 rtl:-left-10" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 md:px-8 md:pb-12 md:pt-24">
          <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-brand-orange">
            <span className="h-px w-12 bg-brand-orange/60" aria-hidden="true" />
            <span>Tajine2Go · Gent</span>
          </div>
          <SplitHeading
            as="h1"
            className="mt-5 text-[clamp(36px,5vw,64px)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-brand-brown"
          >
            {t("title")}
          </SplitHeading>
        </div>
      </section>

      <CheckoutForm
        config={config}
        checkoutNotice={content.website_texts.notices.checkout_notice}
        closedMessage={content.website_texts.notices.closed_message}
      />
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: t("title") };
}
