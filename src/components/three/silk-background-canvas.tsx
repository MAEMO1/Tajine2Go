"use client";

import { useEffect, useRef } from "react";
import { SilkBackgroundScene } from "./silk-background-scene";

/**
 * Fixed fullscreen canvas behind all content (negative z-index paints above
 * the body background but under everything in flow). Feeds the shader the
 * page scroll progress, the pointer, and pauses when the tab is hidden.
 */
export default function SilkBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: SilkBackgroundScene;
    try {
      scene = new SilkBackgroundScene(canvas);
    } catch {
      canvas.classList.add("hidden");
      return;
    }

    const onContextLost = (event: Event) => {
      event.preventDefault();
      canvas.classList.add("hidden");
      scene.stop();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const resize = () => scene.resize(window.innerWidth, window.innerHeight);
    resize();
    window.addEventListener("resize", resize);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let onScroll: (() => void) | undefined;
    let onMove: ((event: MouseEvent) => void) | undefined;
    let onVisibility: (() => void) | undefined;

    if (reducedMotion) {
      scene.renderStatic();
    } else {
      onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scene.setScroll(max > 0 ? window.scrollY / max : 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      if (window.matchMedia("(pointer: fine)").matches) {
        onMove = (event: MouseEvent) => {
          scene.setMouse(
            (event.clientX / window.innerWidth) * 2 - 1,
            (event.clientY / window.innerHeight) * 2 - 1,
          );
        };
        window.addEventListener("mousemove", onMove, { passive: true });
      }

      onVisibility = () => {
        if (document.hidden) scene.stop();
        else scene.start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      scene.start();
    }

    return () => {
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("resize", resize);
      if (onScroll) window.removeEventListener("scroll", onScroll);
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
      scene.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
