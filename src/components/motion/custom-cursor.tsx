"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/gsap";

const INTERACTIVE = "a, button, [role='button'], label, input, select, textarea, summary";

/**
 * Decorative cursor: a small orange dot with a trailing ring that grows
 * over interactive elements. The markup is always rendered (invisible);
 * listeners only attach for fine pointers without reduced motion, so
 * touch users pay nothing. Purely an enhancement.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    let visible = false;

    const onMove = (event: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      const target = event.target;
      const interactive =
        target instanceof Element && target.closest(INTERACTIVE) !== null;
      gsap.to(ring, {
        scale: interactive ? 2.1 : 1,
        opacity: interactive ? 0.45 : 1,
        duration: 0.3,
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.25 });
    };
    const onDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.15 });
    };
    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "back.out(2)" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120] hidden md:block">
      <div
        ref={dotRef}
        className="invisible absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-brand-orange opacity-0"
      />
      <div
        ref={ringRef}
        className="invisible absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-brand-orange/70 opacity-0"
      />
    </div>
  );
}
