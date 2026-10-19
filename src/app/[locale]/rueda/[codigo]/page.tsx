import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FlavorWheel from "@/src/components/FlavorWheel";
import { routing } from "@/src/i18n/routing";
import { fetchLot } from "@/src/lib/traceability";
import {
  flavorWheelPeruData,
  PERU_LEAF_SCORES,
  PERU_FLAVOR_NAMES_ES,
} from "@/src/data/flavorWheelPeru";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/rueda/[codigo]">): Promise<Metadata> {
  const { locale } = await params;
  const active = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const seo = await getTranslations({ locale: active, namespace: "seo" });
  return {
    title: { absolute: seo("peruTitle") },
    description: seo("peruDescription"),
    // A lot's page is private to whoever holds the code.
    robots: { index: false, follow: false },
  };
}

/**
 * The wheel, reachable only with a valid code. The lot is resolved here on the
 * server: an unknown or unpublished code never gets the wheel at all, it is
 * sent back to the door.
 */
export default async function LotWheel({
  params,
}: PageProps<"/[locale]/rueda/[codigo]">) {
  const { locale, codigo } = await params;
  setRequestLocale(locale);

  const lot = await fetchLot(codigo);
  if (!lot) redirect(`/${locale}`);

  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "#faf6f2" }}
    >
      <FlavorWheel
        config={{
          data: flavorWheelPeruData,
          leafScores: PERU_LEAF_SCORES,
          flavorNamesEs: PERU_FLAVOR_NAMES_ES,
          exportFilename: `cata-${lot.code}.png`,
          active: "peru",
          lot,
        }}
      />
    </main>
  );
}
