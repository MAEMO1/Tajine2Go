import "server-only";

import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

const PUBLIC_LOCALE_ROUTE_SUFFIXES = [
  "",
  "/menu",
  "/contact",
  "/catering",
  "/faq",
  "/over-ons",
  "/privacy",
  "/terms",
] as const;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function revalidatePublicLocaleRoutes(mutationContext: string) {
  const failures: Array<{
    path: string;
    scope: "layout" | "page";
    error: string;
  }> = [];

  for (const locale of routing.locales) {
    const localeRoot = `/${locale}`;

    try {
      revalidatePath(localeRoot, "layout");
    } catch (error) {
      failures.push({
        path: localeRoot,
        scope: "layout",
        error: getErrorMessage(error),
      });
    }

    for (const suffix of PUBLIC_LOCALE_ROUTE_SUFFIXES) {
      const path = `${localeRoot}${suffix}`;

      try {
        revalidatePath(path);
      } catch (error) {
        failures.push({
          path,
          scope: "page",
          error: getErrorMessage(error),
        });
      }
    }
  }

  if (failures.length > 0) {
    console.error("Public route revalidation failed:", {
      mutationContext,
      failures,
    });
  }
}
