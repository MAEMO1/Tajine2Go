import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /admin (admin panel, NL only)
    // - /_next (Next.js internals)
    // - /favicon.ico, /robots.txt, etc.
    "/((?!api|admin|_next|.*\\..*).*)",
  ],
};
