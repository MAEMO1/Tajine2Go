import { Khatam } from "@/components/decor/khatam";

/**
 * Static stand-in for the WebGL scene: warm ember glow with a khatam
 * watermark. Shown while the chunk loads, on WebGL failure, and as the
 * no-JS baseline (server-rendered by the dynamic() loading state).
 */
export function HeroSceneFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(181,84,15,0.32),transparent_65%)]"
      aria-hidden="true"
    >
      <Khatam className="h-44 w-44 text-brand-gold/30 md:h-64 md:w-64" />
    </div>
  );
}
