import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { PlausibleScript } from "@/components/plausible";
import { StickyBar } from "@/components/sticky-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { fetchPublicSiteContent } from "@/lib/site-content";
import type { Locale as DatabaseLocale } from "@/types/database";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const content = await fetchPublicSiteContent(locale as DatabaseLocale);

  const isRtl = locale === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} lang={locale} className="flex min-h-full flex-col">
      <NextIntlClientProvider locale={locale}>
        <MotionProvider>
          <Header
            logoUrl={content.brand_assets.header_logo_url}
            logoAlt={content.brand_assets.logo_alt ?? content.business_info.name}
            brandName={content.business_info.name}
          />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <StickyBar />
          <CookieConsent />
          <PlausibleScript />
        </MotionProvider>
      </NextIntlClientProvider>
    </div>
  );
}
