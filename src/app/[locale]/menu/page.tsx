import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { fetchMenuData } from "@/lib/menu-data";
import type { Locale } from "@/types/database";
import { MenuContent } from "./menu-content";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const currentLocale = (await getLocale()) as Locale;
  const menuData = await fetchMenuData(currentLocale);

  return <MenuContent menu={menuData} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "menu" });
  return { title: t("title") };
}
