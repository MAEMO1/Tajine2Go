"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/motion/gsap";

/* ------------------------------------------------------------------ */
/* Reveal — fade-up on scroll, the workhorse entrance                  */
/* ------------------------------------------------------------------ */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds added before the tween starts once triggered. */
  delay?: number;
  /** Pixels travelled upward into place. */
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SplitHeading — masked line (or char) reveal via SplitText           */
/* ------------------------------------------------------------------ */

type SplitHeadingProps = {
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** "lines" (default) for editorial copy, "chars" for short wordmarks. */
  split?: "lines" | "chars";
};

export function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  delay = 0,
  split = "lines",
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const instance = SplitText.create(el, {
        type: split,
        mask: split,
        autoSplit: true,
        onSplit(self) {
          const targets = split === "chars" ? self.chars : self.lines;
          return gsap.from(targets, {
            yPercent: 112,
            duration: split === "chars" ? 0.8 : 1.1,
            stagger: split === "chars" ? 0.035 : 0.085,
            delay,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        },
      });
      return () => instance.revert();
    });
    return () => mm.revert();
  }, [delay, split]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Parallax — gentle scrub-linked drift for images and decor           */
/* ------------------------------------------------------------------ */

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** 0.05–0.3 feels right; positive drifts down as you scroll. */
  speed?: number;
};

export function Parallax({ children, className, speed = 0.15 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const distance = speed * 220;
      const tween = gsap.fromTo(
        el,
        { y: -distance },
        {
          y: distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
