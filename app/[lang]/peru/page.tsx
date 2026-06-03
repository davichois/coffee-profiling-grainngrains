import type { Metadata } from "next";
import FlavorWheel from "../../components/FlavorWheel";
import { isLocale, DEFAULT_LOCALE } from "../../i18n/config";
import {
  flavorWheelPeruData,
  PERU_LEAF_SCORES,
  PERU_FLAVOR_NAMES_ES,
  PERU_INITIAL_OPEN_IDS,
} from "../../data/flavorWheelPeru";

export const metadata: Metadata = {
  title: "Flower Wheels Perú",
  description:
    "Rueda de sabores del café peruano. Incluye la taxonomía SCA completa extendida con frutas amazónicas, frutas andinas, ajíes peruanos, cacao nativo chuncho y porcelana, y los sabores únicos de la gastronomía del Perú.",
  openGraph: {
    title: "Rueda de Sabores Perú | Grain & Grains",
    description:
      "Rueda de sabores interactiva del café peruano. Frutas amazónicas, cacao chuncho, ajíes, lúcuma y mucho más.",
    type: "website",
  },
};

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
