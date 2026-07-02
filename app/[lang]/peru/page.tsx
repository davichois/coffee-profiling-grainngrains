import type { Metadata } from "next";
import FlavorWheel from "../../components/FlavorWheel";
import { isLocale, DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import {
  SEO,
  buildAlternates,
  withBrandKeywords,
  OG_LOCALE,
} from "../../i18n/seo";
import {
  flavorWheelPeruData,
  PERU_LEAF_SCORES,
  PERU_FLAVOR_NAMES_ES,
  PERU_INITIAL_OPEN_IDS,
} from "../../data/flavorWheelPeru";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/peru">): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const seo = SEO[locale];
  return {
    title: { absolute: seo.peru.title },
    description: seo.peru.description,
    keywords: withBrandKeywords([...seo.keywords, ...seo.peruKeywords]),
    alternates: buildAlternates(locale, "/peru"),
    openGraph: {
      title: seo.peru.title,
      description: seo.peru.description,
      url: `/${locale}/peru`,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      title: seo.peru.title,
      description: seo.peru.description,
    },
  };
}

export default async function PeruPage({ params }: PageProps<"/[lang]/peru">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

  const peruConfig = {
    data: flavorWheelPeruData,
    leafScores: PERU_LEAF_SCORES,
    flavorNamesEs: PERU_FLAVOR_NAMES_ES,
    initialOpenIds: PERU_INITIAL_OPEN_IDS,
    exportFilename: "perfil-cafe-peru.png",
    active: "peru" as const,
    locale,
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "#faf6f2" }}
    >
      <FlavorWheel config={peruConfig} />
    </main>
  );
}
