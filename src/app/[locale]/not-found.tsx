import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <h1 className="font-heading text-6xl text-brand-orange">404</h1>
      <p className="mt-4 text-lg text-brand-brown-m">
        {t("error")}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-brand-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-orange-hover"
      >
        {t("back")}
      </Link>
    </div>
  );
}
