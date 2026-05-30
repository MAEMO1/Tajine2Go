"use client";

import { useSyncExternalStore } from "react";

export const COOKIE_KEY = "tajine2go_consent";
const CONSENT_EVENT = "tajine2go-consent-change";

export type ConsentState = "granted" | "denied" | "unset" | "pending";

function getClientSnapshot(): ConsentState {
  if (typeof window === "undefined") {
    return "pending";
  }

  const stored = window.localStorage.getItem(COOKIE_KEY);
  if (stored === "granted" || stored === "denied") {
    return stored;
  }

  return "unset";
}

function getServerSnapshot(): ConsentState {
  return "pending";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(CONSENT_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CONSENT_EVENT, handleChange);
  };
}

export function useConsentState() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export function setConsent(value: Exclude<ConsentState, "pending" | "unset">) {
  window.localStorage.setItem(COOKIE_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
