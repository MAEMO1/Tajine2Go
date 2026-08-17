/**
 * Zellige decor — server-safe SVG primitives.
 * The khatam (8-point star: two overlapping rotated squares) is the
 * geometric signature of the redesign; see docs/redesign/design-language.md.
 */

type KhatamProps = {
  className?: string;
};

export function Khatam({ className }: KhatamProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="5.6"
        y="5.6"
        width="12.8"
        height="12.8"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="5.6"
        y="5.6"
        width="12.8"
        height="12.8"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}

/** Solid-fill variant for tiny separators (marquee dots, list markers). */
export function KhatamSolid({ className }: KhatamProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="6.5" y="6.5" width="11" height="11" fill="currentColor" />
      <rect
        x="6.5"
        y="6.5"
        width="11"
        height="11"
        fill="currentColor"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}

/**
 * Tiling khatam lattice used as a low-opacity overlay on ember sections.
 * Color comes from currentColor; control intensity with text/opacity classes.
 */
export function ZelligeOverlay({ className }: KhatamProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern id="t2g-zellige" width="56" height="56" patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth="0.8" fill="none">
            <rect x="16" y="16" width="24" height="24" />
            <rect x="16" y="16" width="24" height="24" transform="rotate(45 28 28)" />
            <circle cx="28" cy="28" r="3.2" />
            <path d="M0 28h11M45 28h11M28 0v11M28 45v11" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#t2g-zellige)" />
    </svg>
  );
}
