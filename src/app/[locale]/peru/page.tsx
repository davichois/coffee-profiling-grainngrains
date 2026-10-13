import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FlavorWheel from "@/src/components/FlavorWheel";
import { routing } from "@/src/i18n/routing";
import { OG_LOCALE } from "@/src/i18n/locales";
import { buildAlternates, withBrandKeywords } from "@/src/i18n/seo";
import {
  flavorWheelPeruData,
  PERU_LEAF_SCORES,
  PERU_FLAVOR_NAMES_ES,
} from "@/src/data/flavorWheelPeru";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/peru">): Promise<Metadata> {
  const { locale } = await params;
  const active = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const seo = await getTranslations({ locale: active, namespace: "seo" });
  const title = seo("peruTitle");
  const description = seo("peruDescription");

  return {
    title: { absolute: title },
    description,
    keywords: withBrandKeywords([
      ...(seo.raw("keywords") as string[]),
      ...(seo.raw("peruKeywords") as string[]),
    ]),
    alternates: buildAlternates(active, "/peru"),
    openGraph: {
      title,
      description,
      url: `/${active}/peru`,
      locale: OG_LOCALE[active],
    },
    twitter: { title, description },
  };
}

export default async function PeruPage({
  params,
}: PageProps<"/[locale]/peru">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const peruConfig = {
    data: flavorWheelPeruData,
    leafScores: PERU_LEAF_SCORES,
    flavorNamesEs: PERU_FLAVOR_NAMES_ES,
    exportFilename: "perfil-cafe-peru.png",
    active: "peru" as const,
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
