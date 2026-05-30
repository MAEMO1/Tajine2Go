import { setRequestLocale, getTranslations } from "next-intl/server";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale } from "@/types/database";
import { CateringForm } from "./catering-form";

type Props = { params: Promise<{ locale: string }> };

export default async function CateringPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await fetchPublicSiteContent(locale as Locale);

  return (
    <CateringForm
      subtitle={content.website_texts.catering.subtitle}
      notice={content.website_texts.catering.notice}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catering" });
  return { title: t("title") };
}
