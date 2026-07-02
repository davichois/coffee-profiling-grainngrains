import type { Metadata } from "next";
import FlavorWheel from "../components/FlavorWheel";
import { isLocale, DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { SEO, buildAlternates, withBrandKeywords, OG_LOCALE } from "../i18n/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const seo = SEO[locale];
  return {
    title: { absolute: seo.home.title },
    description: seo.home.description,
    keywords: withBrandKeywords(seo.keywords),
    alternates: buildAlternates(locale, ""),
    openGraph: {
      title: seo.home.title,
      description: seo.home.description,
      url: `/${locale}`,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      title: seo.home.title,
      description: seo.home.description,
    },
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "#faf6f2" }}
    >
      <FlavorWheel config={{ active: "sca", locale }} />
    </main>
  );
}
