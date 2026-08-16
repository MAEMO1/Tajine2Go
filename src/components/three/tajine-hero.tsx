"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/motion/gsap";
import type { HeroScene } from "./scene-common";
import { TajineScene } from "./tajine-scene";
import { TeaScene } from "./tea-scene";
import { SilkScene } from "./silk-scene";
import { HeroSceneFallback } from "./hero-scene-fallback";

/**
 * Hosts the WebGL hero scene. Scrolling through the pinned hero scrubs the
 * scene's narrative (tea pour / tajine lid / silk flow), the pointer adds
 * parallax, and the loop pauses offscreen. The static fallback artwork sits
 * underneath and fades out once the scene is live; on WebGL failure or
 * context loss the canvas hides and the fallback returns.
 *
 * Variants (preview via ?hero= query param): "tea" (default) | "tajine" | "silk".
 */
const VARIANTS: Record<string, new (canvas: HTMLCanvasElement) => HeroScene> = {
  tajine: TajineScene,
  tea: TeaScene,
  silk: SilkScene,
};
const DEFAULT_VARIANT = "tea";

export default function TajineHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!wrap || !canvas || !fallback) return;

    const showFallback = () => {
      canvas.classList.add("hidden");
      fallback.classList.remove("opacity-0");
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const variantParam = new URLSearchParams(window.location.search).get("hero");
    const SceneVariant = VARIANTS[variantParam ?? DEFAULT_VARIANT] ?? VARIANTS[DEFAULT_VARIANT];

    let scene: HeroScene;
    try {
      scene = new SceneVariant(canvas);
    } catch {
      showFallback();
      return;
    }
    fallback.classList.add("opacity-0");

    if (process.env.NODE_ENV !== "production") {
      // Test hook: lets headless visual checks drive the scrub directly.
      (window as Window & { __heroScene?: HeroScene }).__heroScene = scene;
    }

    const onContextLost = (event: Event) => {
      event.preventDefault();
      showFallback();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    scene.resize(wrap.clientWidth, wrap.clientHeight);
    const resizeObserver = new ResizeObserver(() => {
      scene.resize(wrap.clientWidth, wrap.clientHeight);
    });
    resizeObserver.observe(wrap);

    let intersectionObserver: IntersectionObserver | undefined;
    let scrollTrigger: ScrollTrigger | undefined;
    let onMove: ((event: MouseEvent) => void) | undefined;

    if (reducedMotion) {
      scene.renderStatic();
    } else {
      scene.start();

      intersectionObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) scene.start();
        else scene.stop();
      });
      intersectionObserver.observe(wrap);

      if (window.matchMedia("(pointer: fine)").matches) {
        onMove = (event: MouseEvent) => {
          scene.setMouse(
            (event.clientX / window.innerWidth) * 2 - 1,
            (event.clientY / window.innerHeight) * 2 - 1,
          );
        };
        window.addEventListener("mousemove", onMove, { passive: true });
      }

      // Pin the hero while the lid opens: the reveal IS the first scroll
      // gesture, instead of finishing after the panel has left the screen.
      wrap.dataset.heroProgress = "0";
      scrollTrigger = ScrollTrigger.create({
        trigger: wrap.closest("section") ?? wrap,
        pin: true,
        anticipatePin: 1,
        start: "top top",
        end: "+=110%",
        scrub: 0.6,
        onUpdate: (self) => {
          scene.setProgress(self.progress);
          wrap.dataset.heroProgress = self.progress.toFixed(3);
        },
      });
    }

    return () => {
      canvas.removeEventListener("webglcontextlost", onContextLost);
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      scrollTrigger?.kill();
      if (onMove) window.removeEventListener("mousemove", onMove);
      scene.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <div ref={fallbackRef} className="absolute inset-0 transition-opacity duration-700">
        <HeroSceneFallback />
      </div>
      <canvas ref={canvasRef} className="relative block h-full w-full" />
    </div>
  );
}
