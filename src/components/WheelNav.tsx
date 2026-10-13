"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

interface WheelNavProps {
  active: "sca" | "peru";
}

// ── Grain'N'Grains brand palette (from the logo) ──
const TEAL = "#444444"; // primary teal
const TEAL_LIGHT = "#4a4a4a"; // lighter teal accent
const CREAM = "#faf6f2";

function tabStyle(isActive: boolean): React.CSSProperties {
  return {
    backgroundColor: isActive ? TEAL : "transparent",
    color: isActive ? CREAM : TEAL,
    border: `1.5px solid ${isActive ? TEAL : TEAL_LIGHT}`,
    fontFamily: "Montserrat, sans-serif",
    letterSpacing: "0.02em",
    textDecoration: "none",
  };
}

export function WheelNav({ active }: WheelNavProps) {
  const t = useTranslations("ui");
  return (
    <nav className="flex justify-center gap-2">
      <Link
        href="/"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
        style={tabStyle(active === "sca")}
      >
        {t("navSca")}
      </Link>

      <Link
        href="/peru"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
        style={tabStyle(active === "peru")}
      >
        {t("navPeru")}
      </Link>
    </nav>
  );
}
