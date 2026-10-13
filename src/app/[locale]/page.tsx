import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FlavorWheel from "@/src/components/FlavorWheel";
import { routing } from "@/src/i18n/routing";
import { OG_LOCALE } from "@/src/i18n/locales";
import { buildAlternates, withBrandKeywords } from "@/src/i18n/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const active = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const seo = await getTranslations({ locale: active, namespace: "seo" });
  const title = seo("homeTitle");
  const description = seo("homeDescription");

  return {
    title: { absolute: title },
    description,
    keywords: withBrandKeywords(seo.raw("keywords") as string[]),
    alternates: buildAlternates(active, ""),
    openGraph: {
      title,
      description,
      url: `/${active}`,
      locale: OG_LOCALE[active],
    },
    twitter: { title, description },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "#faf6f2" }}
    >
      <FlavorWheel config={{ active: "sca" }} />
    </main>
  );
}
