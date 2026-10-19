import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CodeEntry } from "@/src/components/CodeEntry";
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

/** The door. Nothing else lives at the root. */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CodeEntry />;
}
