import { redirect } from "@/i18n/navigation";

/* One-pager: het menu staat als ankersectie op de homepagina. */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: "/#menu", locale });
}
