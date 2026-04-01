import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | Tajine2Go",
    template: "%s | Admin | Tajine2Go",
  },
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="nl" dir="ltr" className="flex min-h-full bg-brand-cream">
      {children}
    </div>
  );
}
