import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths under a valid locale: without this, Next.js
 * bubbles past the locale layout to its default 404 instead of rendering
 * the branded [locale]/not-found.tsx inside the site chrome.
 */
export default function CatchAllPage() {
  notFound();
}
