import { redirect } from "@/i18n/navigation";

/* One-pager: catering staat als ankersectie op de homepagina. */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: "/#catering", locale });
}
