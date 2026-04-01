import { setRequestLocale, getTranslations } from "next-intl/server";
import { CateringForm } from "./catering-form";

type Props = { params: Promise<{ locale: string }> };

export default async function CateringPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CateringForm />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catering" });
  return { title: t("title") };
}
