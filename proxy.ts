import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "./app/i18n/config";

// Pick the best supported locale from the Accept-Language header.
function getLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const code = part.split(";")[0].trim().toLowerCase();
      const base = code.split("-")[0];
      const match = LOCALES.find((l) => l === code || l === base);
      if (match) return match;
    }
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already prefixed with a supported locale? Let it through.
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  // Redirect everything else to the locale-prefixed path.
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Run on everything except Next internals, API routes and static assets.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
