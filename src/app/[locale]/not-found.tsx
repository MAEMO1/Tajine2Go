import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Wandering tajine — pot, conical lid, knob and rising steam strokes. */
function TajineIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {/* steam */}
        <path d="M44 28c-3-4.5 3-7.5 0-13" opacity={0.45} />
        <path d="M60 24c-3.5-5.5 3.5-9 0-16" opacity={0.7} />
        <path d="M76 28c-3-4.5 3-7.5 0-13" opacity={0.45} />
        {/* lid knob */}
        <circle cx="60" cy="40" r="4.5" />
        {/* conical lid */}
        <path d="M60 44.5C49 49 33 65 28.5 80h63C87 65 71 49 60 44.5Z" />
        {/* rim */}
        <path d="M20 86h80" />
        {/* dish */}
        <path d="M26 86c2 9 14 15 34 15s32-6 34-15" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      <div className="animate-fade-up relative">
        <div className="animate-float text-brand-bronze">
          <TajineIllustration className="h-28 w-28 md:h-32 md:w-32" />
        </div>
      </div>

      <h1 className="animate-fade-up-delay-1 relative mt-2 font-display text-[clamp(90px,18vw,180px)] font-medium leading-[0.9] text-brand-orange">
        404
      </h1>

      <p className="animate-fade-up-delay-2 relative mt-5 max-w-md text-lg leading-relaxed text-brand-brown-m">
        {t("error")}
      </p>

      <div className="animate-fade-up-delay-3 relative mt-9">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-brand-orange px-8 py-3 font-display text-lg font-semibold text-white shadow-[0_6px_20px_rgba(199,90,10,0.3)] transition-colors duration-300 hover:bg-brand-orange-hover active:scale-[0.98]"
        >
          {t("back")}
        </Link>
      </div>
    </div>
  );
}
