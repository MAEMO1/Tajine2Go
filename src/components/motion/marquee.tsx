"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/gsap";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  /** Pixels per second. */
  speed?: number;
};

/**
 * Infinite horizontal band. Content is rendered twice and translated by
 * -50% in a loop; direction mirrors automatically under RTL. Slows to a
 * crawl on hover; static for reduced motion.
 */
export function Marquee({ children, className, speed = 70 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const isRtl = document.documentElement.dir === "rtl";
      const width = track.scrollWidth / 2;
      if (width === 0) return;
      const duration = width / speed;
      const tween = gsap.to(track, {
        xPercent: isRtl ? 50 : -50,
        ease: "none",
        duration,
        repeat: -1,
      });

      const slow = () => gsap.to(tween, { timeScale: 0.18, duration: 0.6 });
      const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
      track.addEventListener("mouseenter", slow);
      track.addEventListener("mouseleave", fast);

      return () => {
        track.removeEventListener("mouseenter", slow);
        track.removeEventListener("mouseleave", fast);
        tween.kill();
      };
    });
    return () => mm.revert();
  }, [speed]);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
