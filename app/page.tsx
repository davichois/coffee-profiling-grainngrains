import type { Metadata } from "next";
import FlavorWheel from "./components/FlavorWheel";

export const metadata: Metadata = {
  title: "Coffee Flavor Wheel",
  description:
    "Explore the interactive SCA coffee flavor wheel. Click any segment to drill down from main categories — Fruity, Floral, Roasted, Sweet and more — to specific flavor descriptors used in specialty coffee cupping.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Coffee Flavor Wheel | Grain'N'Grains",
    description:
      "Interactive SCA coffee flavor wheel for specialty coffee tasting. Explore fruity, floral, roasted, sweet and more flavor families.",
    url: "/",
    type: "website",
  },
  twitter: {
    title: "Coffee Flavor Wheel | Grain'N'Grains",
    description:
      "Interactive SCA coffee flavor wheel for specialty coffee tasting.",
  },
};

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center pb-32"
      style={{ background: "#faf6f2" }}
    >
      <FlavorWheel />
    </main>
  );
}
