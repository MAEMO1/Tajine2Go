import { setRequestLocale, getTranslations } from "next-intl/server";
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

  return (
    <CheckoutForm
      config={config}
      checkoutNotice={content.website_texts.notices.checkout_notice}
      closedMessage={content.website_texts.notices.closed_message}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: t("title") };
}
