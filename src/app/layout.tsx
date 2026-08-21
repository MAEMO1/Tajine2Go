import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Eén type-familie voor de hele publieke site: Geist als variabel font (100-900),
// plus Geist Mono voor legacy-restgebruik. Zie docs/adr/0005 (vervangt 0003).
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tajine2Go",
    template: "%s | Tajine2Go",
  },
  description: "Marokkaanse takeaway in Gent",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "Tajine2Go",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#3B1606",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // <html> leeft in de root-layout (admin staat buiten [locale]), dus de locale
  // wordt hier uit de next-intl request-config gelezen in plaats van uit params.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
