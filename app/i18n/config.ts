// ─── Supported locales ────────────────────────────────────────────────────────
// `es` is the default because the flavor data and the original UI were authored
// in Spanish; every other locale layers translations on top of it.
export const LOCALES = ["es", "en", "pt", "fr", "de", "zh", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

// Native language names — shown in the corner language switcher.
export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇬🇧",
  pt: "🇧🇷",
  fr: "🇫🇷",
  de: "🇩🇪",
  zh: "🇨🇳",
  ja: "🇯🇵",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
