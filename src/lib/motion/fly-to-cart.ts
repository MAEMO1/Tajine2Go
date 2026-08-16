"use client";

import { gsap } from "@/lib/motion/gsap";

/**
 * Launches a small orange dot from `fromEl` to the first visible cart target
 * (`[data-cart-target]`: the header cart on desktop, the sticky bar badge on
 * mobile), then pops the target. No-ops gracefully when nothing is visible.
 */
export function flyToCart(fromEl: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = Array.from(
    document.querySelectorAll<HTMLElement>("[data-cart-target]"),
  );
  const target = targets.find((el) => el.offsetParent !== null);
  if (!target) return;

  const from = fromEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const dot = document.createElement("div");
  dot.setAttribute("aria-hidden", "true");
  dot.className =
    "pointer-events-none fixed z-[110] h-3.5 w-3.5 rounded-full bg-brand-orange shadow-[0_2px_8px_rgba(217,123,26,0.5)]";
  document.body.appendChild(dot);

  const startX = from.left + from.width / 2 - 7;
  const startY = from.top + from.height / 2 - 7;
  const endX = to.left + to.width / 2 - 7;
  const endY = to.top + to.height / 2 - 7;

  gsap.set(dot, { x: startX, y: startY });

  const tl = gsap.timeline({
    onComplete: () => {
      dot.remove();
      gsap.fromTo(
        target,
        { scale: 1 },
        { scale: 1.25, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" },
      );
    },
  });

  // Slight arc: x eases out while y eases in, like a tossed pinch of saffron.
  tl.to(dot, { x: endX, duration: 0.55, ease: "power1.out" }, 0)
    .to(dot, { y: endY, duration: 0.55, ease: "power2.in" }, 0)
    .to(dot, { scale: 0.4, opacity: 0.9, duration: 0.55, ease: "power1.in" }, 0);
}
