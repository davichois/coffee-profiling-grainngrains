import type { Metadata } from "next";
import { routing, type Locale } from "./routing";
import { HREFLANG } from "./locales";
import { BRAND_ALIASES } from "@/src/lib/site";

// Build hreflang alternates (+ x-default) for a path suffix ("" or "/peru").
export function buildAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[HREFLANG[loc]] = `/${loc}${path}`;
  }
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return {
    canonical: `/${locale}${path}`,
    languages,
  };
}

// Merge page keywords with every brand spelling.
export function withBrandKeywords(keywords: string[]): string[] {
  return Array.from(new Set([...keywords, ...BRAND_ALIASES]));
}
