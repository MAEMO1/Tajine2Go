import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/components/motion/magnetic";
import { Khatam } from "@/components/decor/khatam";

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
      <Khatam className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 text-brand-orange/[0.05]" />

      <div className="animate-fade-up relative">
        <div className="animate-float text-brand-bronze">
          <TajineIllustration className="h-28 w-28 md:h-32 md:w-32" />
        </div>
      </div>

      <h1 className="animate-fade-up-delay-1 relative mt-2 text-[clamp(96px,20vw,200px)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-brand-orange">
        404
      </h1>

      <p className="animate-fade-up-delay-2 relative mt-5 max-w-md text-lg leading-relaxed text-brand-brown-m">
        {t("error")}
      </p>

      <div className="animate-fade-up-delay-3 relative mt-9">
        <Magnetic>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full bg-brand-orange px-8 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-white shadow-[0_8px_30px_rgba(217,123,26,0.35)] transition-colors duration-300 hover:bg-brand-orange-hover active:scale-[0.98]"
          >
            {t("back")}
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}
