import type { Locale } from "./routing";

// Native language names + flags — shown in the language switcher.
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

// OpenGraph locale codes (underscored BCP-47).
export const OG_LOCALE: Record<Locale, string> = {
  es: "es_ES",
  en: "en_US",
  pt: "pt_BR",
  fr: "fr_FR",
  de: "de_DE",
  zh: "zh_CN",
  ja: "ja_JP",
};

// hreflang codes for <link rel="alternate">.
export const HREFLANG: Record<Locale, string> = {
  es: "es",
  en: "en",
  pt: "pt-BR",
  fr: "fr",
  de: "de",
  zh: "zh-CN",
  ja: "ja",
};
