"use client";

import Script from "next/script";
import { useConsentState } from "@/lib/consent-store";

export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const consent = useConsentState();

  if (!domain || consent !== "granted") return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
