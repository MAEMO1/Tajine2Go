"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { setLenis } from "@/lib/motion/lenis-store";

/**
 * Site-wide smooth scrolling (Lenis) kept in sync with GSAP ScrollTrigger.
 * Disabled for users who prefer reduced motion — they get native scrolling
 * and all scroll-triggered animations collapse to visible end-states.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.115,
      smoothWheel: true,
      anchors: true,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
