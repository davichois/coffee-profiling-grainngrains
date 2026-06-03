import Link from "next/link";
import type { Locale } from "../i18n/config";
import { UI } from "../i18n/ui";

interface WheelNavProps {
  active: "sca" | "peru";
  locale: Locale;
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

export function WheelNav({ active, locale }: WheelNavProps) {
  const ui = UI[locale];
  return (
    <nav className="flex justify-center gap-2">
      <Link
        href={`/${locale}`}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
        style={tabStyle(active === "sca")}
      >
        {ui.navSca}
      </Link>

      <Link
        href={`/${locale}/peru`}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
        style={tabStyle(active === "peru")}
      >
        {ui.navPeru}
      </Link>
    </nav>
  );
}
