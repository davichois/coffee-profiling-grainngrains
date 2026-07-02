import type { Locale } from "./config";

// ─── UI chrome strings (everything that is not a flavor name or the cupping
// description). One entry per supported locale. ──────────────────────────────
export interface UIStrings {
  tagline: string; // logo tagline
  navSca: string;
  navPeru: string;
  exportLabel: string;
  exportTitle: string;
  promptExplore: string;
  promptDrag: string;
  tastingNotes: string; // "Notas de cata"
  language: string; // language switcher aria-label / heading
  footer: string;
  // Access gate screen
  blockedTitle: string;
  blockedMessage: string;
  blockedCta: string;
  // Score qualifiers, from best to worst.
  scoreExceptional: string;
  scoreExcellent: string;
  scoreVeryGood: string;
  scoreGood: string;
  scoreFair: string;
  scoreAverage: string;
  scoreDefective: string;
}

export const UI: Record<Locale, UIStrings> = {
  es: {
    tagline: "Rueda de sabores",
    navSca: "Rueda SCA",
    navPeru: "Rueda Perú",
    exportLabel: "Exportar",
    exportTitle: "Exportar como PNG",
    promptExplore: "Toca un segmento para explorar",
    promptDrag: "Arrastra la rueda para girarla",
    tastingNotes: "Notas de cata",
    language: "Idioma",
    footer: "© 2026 Grain'N'Grains · Inspirada en la SCA",
    blockedTitle: "Acceso bloqueado",
    blockedMessage:
      "Si deseas probar la rueda de sabores, compra un café de Grain & Grains para sumergirte en esta aventura.",
    blockedCta: "Comprar café",
    scoreExceptional: "Excepcional",
    scoreExcellent: "Excelente",
    scoreVeryGood: "Muy Bueno",
    scoreGood: "Bueno",
    scoreFair: "Aceptable",
    scoreAverage: "Regular",
    scoreDefective: "Con Defectos",
  },
  en: {
    tagline: "Flavor wheel",
    navSca: "SCA Wheel",
    navPeru: "Peru Wheel",
    exportLabel: "Export",
    exportTitle: "Export as PNG",
    promptExplore: "Tap a segment to explore",
    promptDrag: "Drag the wheel to spin it",
    tastingNotes: "Tasting notes",
    language: "Language",
    footer: "© 2026 Grain'N'Grains · Inspired by the SCA",
    blockedTitle: "Access blocked",
    blockedMessage:
      "If you'd like to try the flavor wheel, buy a Grain & Grains coffee to dive into this adventure.",
    blockedCta: "Buy coffee",
    scoreExceptional: "Exceptional",
    scoreExcellent: "Excellent",
    scoreVeryGood: "Very Good",
    scoreGood: "Good",
    scoreFair: "Fair",
    scoreAverage: "Average",
    scoreDefective: "Defective",
  },
  pt: {
    tagline: "Roda de sabores",
    navSca: "Roda SCA",
    navPeru: "Roda Peru",
    exportLabel: "Exportar",
    exportTitle: "Exportar como PNG",
    promptExplore: "Toque num segmento para explorar",
    promptDrag: "Arraste a roda para girá-la",
    tastingNotes: "Notas de prova",
    language: "Idioma",
    footer: "© 2026 Grain'N'Grains · Inspirada na SCA",
    blockedTitle: "Acesso bloqueado",
    blockedMessage:
      "Se quiser experimentar a roda de sabores, compre um café da Grain & Grains para mergulhar nesta aventura.",
    blockedCta: "Comprar café",
    scoreExceptional: "Excepcional",
    scoreExcellent: "Excelente",
    scoreVeryGood: "Muito Bom",
    scoreGood: "Bom",
    scoreFair: "Aceitável",
    scoreAverage: "Regular",
    scoreDefective: "Com Defeitos",
  },
  fr: {
    tagline: "Roue des saveurs",
    navSca: "Roue SCA",
    navPeru: "Roue Pérou",
    exportLabel: "Exporter",
    exportTitle: "Exporter en PNG",
    promptExplore: "Touchez un segment pour explorer",
    promptDrag: "Faites glisser la roue pour la tourner",
    tastingNotes: "Notes de dégustation",
    language: "Langue",
    footer: "© 2026 Grain'N'Grains · Inspirée de la SCA",
    blockedTitle: "Accès bloqué",
    blockedMessage:
      "Si vous souhaitez essayer la roue des saveurs, achetez un café Grain & Grains pour plonger dans cette aventure.",
    blockedCta: "Acheter du café",
    scoreExceptional: "Exceptionnel",
    scoreExcellent: "Excellent",
    scoreVeryGood: "Très Bon",
    scoreGood: "Bon",
    scoreFair: "Acceptable",
    scoreAverage: "Moyen",
    scoreDefective: "Défectueux",
  },
  de: {
    tagline: "Aromenrad",
    navSca: "SCA-Rad",
    navPeru: "Peru-Rad",
    exportLabel: "Exportieren",
    exportTitle: "Als PNG exportieren",
    promptExplore: "Tippe auf ein Segment zum Erkunden",
    promptDrag: "Ziehe am Rad, um es zu drehen",
    tastingNotes: "Verkostungsnotizen",
    language: "Sprache",
    footer: "© 2026 Grain'N'Grains · Inspiriert von der SCA",
    blockedTitle: "Zugang gesperrt",
    blockedMessage:
      "Wenn du das Aromenrad ausprobieren möchtest, kaufe einen Kaffee von Grain & Grains, um in dieses Abenteuer einzutauchen.",
    blockedCta: "Kaffee kaufen",
    scoreExceptional: "Außergewöhnlich",
    scoreExcellent: "Hervorragend",
    scoreVeryGood: "Sehr Gut",
    scoreGood: "Gut",
    scoreFair: "Akzeptabel",
    scoreAverage: "Mittel",
    scoreDefective: "Fehlerhaft",
  },
  zh: {
    tagline: "风味轮",
    navSca: "SCA 风味轮",
    navPeru: "秘鲁风味轮",
    exportLabel: "导出",
    exportTitle: "导出为 PNG",
    promptExplore: "点击一个区块开始探索",
    promptDrag: "拖动风味轮以旋转",
    tastingNotes: "品鉴笔记",
    language: "语言",
    footer: "© 2026 Grain'N'Grains · 灵感源自 SCA",
    blockedTitle: "访问已锁定",
    blockedMessage:
      "如果你想体验风味轮，请购买一份 Grain & Grains 咖啡，投入这场冒险。",
    blockedCta: "购买咖啡",
    scoreExceptional: "卓越",
    scoreExcellent: "优秀",
    scoreVeryGood: "很好",
    scoreGood: "良好",
    scoreFair: "尚可",
    scoreAverage: "一般",
    scoreDefective: "有缺陷",
  },
  ja: {
    tagline: "フレーバーホイール",
    navSca: "SCA ホイール",
    navPeru: "ペルー ホイール",
    exportLabel: "エクスポート",
    exportTitle: "PNG でエクスポート",
    promptExplore: "セグメントをタップして探索",
    promptDrag: "ホイールをドラッグして回転",
    tastingNotes: "テイスティングノート",
    language: "言語",
    footer: "© 2026 Grain'N'Grains · SCA に着想を得て",
    blockedTitle: "アクセスがブロックされています",
    blockedMessage:
      "フレーバーホイールを試したい方は、Grain & Grains のコーヒーを購入して、この冒険に飛び込みましょう。",
    blockedCta: "コーヒーを購入",
    scoreExceptional: "卓越",
    scoreExcellent: "優秀",
    scoreVeryGood: "とても良い",
    scoreGood: "良い",
    scoreFair: "まずまず",
    scoreAverage: "普通",
    scoreDefective: "欠点あり",
  },
};
