import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-warm2 bg-brand-brown px-4 py-8 text-brand-brown-s">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-heading text-xl text-brand-gold">Tajine2Go</p>
          <p className="text-sm">
            &copy; {year} Tajine2Go. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
