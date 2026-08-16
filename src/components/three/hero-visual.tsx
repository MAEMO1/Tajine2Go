"use client";

import dynamic from "next/dynamic";
import { HeroSceneFallback } from "./hero-scene-fallback";

const TajineHero = dynamic(() => import("./tajine-hero"), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
});

/** Client boundary so the Three.js chunk stays out of the server bundle. */
export function HeroVisual() {
  return <TajineHero />;
}
