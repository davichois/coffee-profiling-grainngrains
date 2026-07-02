import type { Metadata } from "next";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "./config";
import { BRAND_ALIASES } from "../config/site";

interface PageSeo {
  title: string;
  description: string;
}

interface LocaleSeo {
  home: PageSeo;
  peru: PageSeo;
  // Localized keywords (brand aliases are appended automatically).
  keywords: string[];
  peruKeywords: string[];
}

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

// hreflang codes for alternates.
const HREFLANG: Record<Locale, string> = {
  es: "es",
  en: "en",
  pt: "pt-BR",
  fr: "fr",
  de: "de",
  zh: "zh-CN",
  ja: "ja",
};

export const SEO: Record<Locale, LocaleSeo> = {
  es: {
    home: {
      title: "Rueda de Sabores de Grain & Grains | Cata de Café de Especialidad",
      description:
        "Rueda de sabores interactiva de Grain & Grains (Grain and Grains). Explora la taxonomía SCA para cata de café de especialidad: afrutado, floral, tostado, dulce y más.",
    },
    peru: {
      title: "Rueda de Sabores del Café Peruano | Grain & Grains",
      description:
        "Rueda de sabores del café peruano de Grain & Grains: frutas amazónicas y andinas, ajíes, cacao nativo chuncho y porcelana, lúcuma y los sabores únicos del Perú.",
    },
    keywords: [
      "rueda de sabores",
      "rueda de sabores de café",
      "rueda de sabores de Grain & Grains",
      "rueda de sabores de Grain and Grains",
      "cata de café",
      "catación de café",
      "café de especialidad",
      "rueda de sabores SCA",
      "perfil de café",
      "notas de cata",
    ],
    peruKeywords: [
      "café peruano",
      "rueda de sabores café peruano",
      "cacao chuncho",
      "lúcuma",
      "ajíes peruanos",
    ],
  },
  en: {
    home: {
      title: "Grain & Grains Flavor Wheel | Specialty Coffee Tasting",
      description:
        "Interactive Grain & Grains (Grain and Grains) coffee flavor wheel. Explore the full SCA taxonomy for specialty coffee tasting — fruity, floral, roasted, sweet and more.",
    },
    peru: {
      title: "Peruvian Coffee Flavor Wheel | Grain & Grains",
      description:
        "Grain & Grains Peruvian coffee flavor wheel: Amazonian and Andean fruits, chilies, native chuncho and porcelana cacao, lucuma and Peru's unique flavors.",
    },
    keywords: [
      "flavor wheel",
      "coffee flavor wheel",
      "Grain & Grains flavor wheel",
      "coffee tasting",
      "specialty coffee",
      "SCA flavor wheel",
      "coffee cupping",
      "coffee profiling",
      "tasting notes",
    ],
    peruKeywords: [
      "Peruvian coffee",
      "Peruvian coffee flavor wheel",
      "chuncho cacao",
      "lucuma",
      "Peruvian chilies",
    ],
  },
  pt: {
    home: {
      title: "Roda de Sabores da Grain & Grains | Prova de Café Especial",
      description:
        "Roda de sabores interativa da Grain & Grains (Grain and Grains). Explore a taxonomia SCA para prova de café especial: frutado, floral, torrado, doce e mais.",
    },
    peru: {
      title: "Roda de Sabores do Café Peruano | Grain & Grains",
      description:
        "Roda de sabores do café peruano da Grain & Grains: frutas amazônicas e andinas, pimentas, cacau nativo chuncho e porcelana, lúcuma e os sabores únicos do Peru.",
    },
    keywords: [
      "roda de sabores",
      "roda de sabores de café",
      "roda de sabores da Grain & Grains",
      "prova de café",
      "café especial",
      "roda de sabores SCA",
      "análise sensorial de café",
      "notas de prova",
    ],
    peruKeywords: [
      "café peruano",
      "roda de sabores café peruano",
      "cacau chuncho",
      "lúcuma",
      "pimentas peruanas",
    ],
  },
  fr: {
    home: {
      title: "Roue des Saveurs Grain & Grains | Dégustation de Café de Spécialité",
      description:
        "Roue des saveurs interactive Grain & Grains (Grain and Grains). Explorez la taxonomie SCA pour la dégustation de café de spécialité : fruité, floral, torréfié, sucré et plus.",
    },
    peru: {
      title: "Roue des Saveurs du Café Péruvien | Grain & Grains",
      description:
        "Roue des saveurs du café péruvien Grain & Grains : fruits amazoniens et andins, piments, cacao natif chuncho et porcelana, lúcuma et les saveurs uniques du Pérou.",
    },
    keywords: [
      "roue des saveurs",
      "roue des arômes du café",
      "roue des saveurs Grain & Grains",
      "dégustation de café",
      "café de spécialité",
      "roue des saveurs SCA",
      "cupping café",
      "notes de dégustation",
    ],
    peruKeywords: [
      "café péruvien",
      "roue des saveurs café péruvien",
      "cacao chuncho",
      "lúcuma",
      "piments péruviens",
    ],
  },
  de: {
    home: {
      title: "Grain & Grains Aromenrad | Verkostung von Spezialitätenkaffee",
      description:
        "Interaktives Grain & Grains (Grain and Grains) Kaffee-Aromenrad. Entdecke die SCA-Taxonomie zur Verkostung von Spezialitätenkaffee: fruchtig, blumig, geröstet, süß und mehr.",
    },
    peru: {
      title: "Aromenrad für peruanischen Kaffee | Grain & Grains",
      description:
        "Grain & Grains Aromenrad für peruanischen Kaffee: Amazonas- und Andenfrüchte, Chilis, nativer Chuncho- und Porcelana-Kakao, Lúcuma und die einzigartigen Aromen Perus.",
    },
    keywords: [
      "Aromenrad",
      "Kaffee-Aromenrad",
      "Grain & Grains Aromenrad",
      "Kaffeeverkostung",
      "Spezialitätenkaffee",
      "SCA Aromenrad",
      "Cupping",
      "Verkostungsnotizen",
    ],
    peruKeywords: [
      "peruanischer Kaffee",
      "Aromenrad peruanischer Kaffee",
      "Chuncho-Kakao",
      "Lúcuma",
      "peruanische Chilis",
    ],
  },
  zh: {
    home: {
      title: "Grain & Grains 咖啡风味轮 | 精品咖啡品鉴",
      description:
        "Grain & Grains（Grain and Grains）交互式咖啡风味轮。探索完整的 SCA 风味分类进行精品咖啡品鉴：果香、花香、烘焙、甜感等。",
    },
    peru: {
      title: "秘鲁咖啡风味轮 | Grain & Grains",
      description:
        "Grain & Grains 秘鲁咖啡风味轮：亚马逊与安第斯水果、辣椒、原生 chuncho 与 porcelana 可可、lúcuma 以及秘鲁独特风味。",
    },
    keywords: [
      "风味轮",
      "咖啡风味轮",
      "Grain & Grains 风味轮",
      "咖啡品鉴",
      "精品咖啡",
      "SCA 风味轮",
      "杯测",
      "品鉴笔记",
    ],
    peruKeywords: [
      "秘鲁咖啡",
      "秘鲁咖啡风味轮",
      "chuncho 可可",
      "lúcuma",
      "秘鲁辣椒",
    ],
  },
  ja: {
    home: {
      title: "Grain & Grains フレーバーホイール | スペシャルティコーヒーのテイスティング",
      description:
        "Grain & Grains（Grain and Grains）のインタラクティブなコーヒーフレーバーホイール。SCA分類でスペシャルティコーヒーをテイスティング：フルーティー、フローラル、ロースト、甘みなど。",
    },
    peru: {
      title: "ペルーコーヒー フレーバーホイール | Grain & Grains",
      description:
        "Grain & Grains のペルーコーヒー用フレーバーホイール：アマゾン・アンデスの果実、唐辛子、在来チュンチョ／ポルセラナカカオ、ルクマなどペルー独自の風味。",
    },
    keywords: [
      "フレーバーホイール",
      "コーヒーフレーバーホイール",
      "Grain & Grains フレーバーホイール",
      "コーヒーテイスティング",
      "スペシャルティコーヒー",
      "SCA フレーバーホイール",
      "カッピング",
      "テイスティングノート",
    ],
    peruKeywords: [
      "ペルーコーヒー",
      "ペルーコーヒー フレーバーホイール",
      "チュンチョカカオ",
      "ルクマ",
      "ペルーの唐辛子",
    ],
  },
};

// Build hreflang alternates (+ x-default) for a given path suffix ("" or "/peru").
export function buildAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[HREFLANG[loc]] = `/${loc}${path}`;
  }
  languages["x-default"] = `/${DEFAULT_LOCALE}${path}`;
  return {
    canonical: `/${locale}${path}`,
    languages,
  };
}

// Merge page keywords with every brand spelling.
export function withBrandKeywords(keywords: string[]): string[] {
  return Array.from(new Set([...keywords, ...BRAND_ALIASES]));
}
