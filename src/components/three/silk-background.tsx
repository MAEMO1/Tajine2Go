"use client";

import dynamic from "next/dynamic";

const SilkBackgroundCanvas = dynamic(() => import("./silk-background-canvas"), {
  ssr: false,
});

/**
 * Client boundary for the site-wide ambient silk layer. Renders nothing on
 * the server — the body's cream background is the no-JS/loading baseline,
 * and the shader starts from that exact color so there is no pop-in.
 */
export function SilkBackground() {
  return <SilkBackgroundCanvas />;
}
