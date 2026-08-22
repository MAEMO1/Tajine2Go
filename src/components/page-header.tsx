import { SplitHeading } from "@/components/motion/reveal";

// Menukaart-kop voor alle publieke pagina's: boog-ornament + serif-titel,
// zoals het gedrukte brandmateriaal. Houdt alle pagina's in dezelfde stijl.
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string | null }) {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-14 text-center md:pt-20">
      <svg className="mx-auto w-36 text-brand-bronze" viewBox="0 0 200 54" aria-hidden="true">
        <path
          d="M10,54 Q10,30 40,25 C68,20 82,16 100,4 C118,16 132,20 160,25 Q190,30 190,54"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M22,54 Q22,36 48,31 C72,27 86,22 100,13 C114,22 128,27 152,31 Q178,36 178,54"
          fill="none"
          stroke="#DE5C1B"
          strokeWidth="1.4"
        />
      </svg>
      <SplitHeading as="h1" className="type-h1 mt-3">
        {title}
      </SplitHeading>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-[17px] leading-relaxed text-brand-brown-m">{subtitle}</p>
      )}
    </section>
  );
}
