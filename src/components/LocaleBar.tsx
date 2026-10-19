"use client";

import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { routing, type Locale } from "@/src/i18n/routing";

/**
 * Language codes across the top of the door, in the same neutral ink the rest
 * of the app uses for its controls.
 */
export function LocaleBar() {
  const current = useLocale() as Locale;

  return (
    <nav className="locale-bar" aria-label="Idioma">
      <svg
        className="locale-icon"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
      </svg>

      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href="/"
          locale={loc}
          className={`locale-code${loc === current ? " is-active" : ""}`}
          aria-current={loc === current ? "true" : undefined}
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
