import Image from "next/image";

type Props = {
  locale: string;
  message: string;
  titleLineOne: string;
  titleLineTwo: string;
  instagramLabel: string;
  instagramQrAlt: string;
  facebookLabel: string;
  languageNavigationLabel: string;
};

const languages = [
  { locale: "nl", label: "NL" },
  { locale: "fr", label: "FR" },
  { locale: "en", label: "EN" },
];

export function ComingSoon({
  locale,
  message,
  titleLineOne,
  titleLineTwo,
  instagramLabel,
  instagramQrAlt,
  facebookLabel,
  languageNavigationLabel,
}: Props) {
  return (
    <main className="relative isolate flex min-h-[100svh] overflow-hidden bg-brand-brown text-brand-cream">
      <div
        aria-hidden="true"
        className="coming-soon-pattern pointer-events-none absolute inset-0 -z-10"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-7 sm:px-10 sm:py-10 lg:px-14">
        <div className="flex items-start justify-between gap-8">
          <Image
            src="/brand/logo/tajine2go-horizontal-dark.svg"
            alt="Tajine2Go"
            width={242}
            height={82}
            priority
            unoptimized
            className="h-auto w-[180px] sm:w-[220px]"
          />

          <nav aria-label={languageNavigationLabel} className="flex gap-1">
            {languages.map((language) => {
              const isCurrent = language.locale === locale;

              return (
                <a
                  key={language.locale}
                  href={`/${language.locale}`}
                  lang={language.locale}
                  hrefLang={language.locale}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs font-semibold tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
                    isCurrent
                      ? "bg-brand-cream text-brand-brown"
                      : "text-brand-cream hover:bg-brand-cream/10"
                  }`}
                >
                  {language.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-1 items-center py-12 sm:py-16 lg:py-20">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-20">
            <div className="max-w-3xl">
              <h1 className="text-balance font-display text-[clamp(3.1rem,12vw,6rem)] font-medium leading-[0.82] tracking-[-0.035em] text-brand-cream">
                {titleLineOne}
                <span className="block text-brand-gold">{titleLineTwo}</span>
              </h1>

              <div className="mt-8 h-px w-20 bg-brand-gold sm:mt-10" />

              <p className="mt-5 max-w-[34rem] text-pretty text-lg leading-relaxed text-brand-cream/85 sm:text-xl">
                {message}
              </p>
            </div>

            <div className="grid w-fit grid-cols-[124px_minmax(0,1fr)] items-center gap-5 sm:grid-cols-[144px_minmax(0,1fr)] lg:block lg:w-full lg:text-center">
              <a
                href="https://www.instagram.com/tajine2go.gent"
                target="_blank"
                rel="noopener noreferrer"
                className="group/qr block w-fit rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold lg:mx-auto"
              >
                <Image
                  src="/brand/qr/tajine2go-qr-instagram.png"
                  alt={instagramQrAlt}
                  width={188}
                  height={216}
                  loading="eager"
                  className="h-auto w-[124px] shadow-[0_12px_32px_rgba(24,6,2,0.22)] transition-transform duration-300 group-hover/qr:-translate-y-1 sm:w-[144px] lg:w-[188px]"
                />
              </a>

              <div>
                <span className="block text-sm font-medium leading-snug text-brand-cream/75 lg:mt-5">
                  {instagramLabel}
                </span>
                <a
                  href="https://www.instagram.com/tajine2go.gent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block w-fit rounded-sm font-semibold text-brand-cream underline decoration-brand-gold/60 underline-offset-4 transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold lg:mx-auto"
                >
                  @tajine2go.gent
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61590037020545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 w-fit items-center rounded-sm text-sm font-semibold text-brand-cream underline decoration-brand-gold/60 underline-offset-4 transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold lg:mx-auto"
                >
                  {facebookLabel}
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm font-medium tracking-[0.08em] text-brand-cream/70">
          Gent
        </p>
      </div>
    </main>
  );
}
