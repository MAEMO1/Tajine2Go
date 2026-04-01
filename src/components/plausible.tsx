"use client";

import Script from "next/script";
import { useState, useEffect } from "react";

const COOKIE_KEY = "tajine2go_consent";

export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(COOKIE_KEY) === "granted") {
      setConsented(true);
    }

    function onGrant() {
      setConsented(true);
    }
    window.addEventListener("consent-granted", onGrant);
    return () => window.removeEventListener("consent-granted", onGrant);
  }, []);

  if (!domain || !consented) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
