import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // `es` is the default: the flavor data and original copy were authored in
  // Spanish and every other locale layers translations on top of it.
  locales: ["es", "en", "pt", "fr", "de", "zh", "ja"],
  defaultLocale: "es",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
