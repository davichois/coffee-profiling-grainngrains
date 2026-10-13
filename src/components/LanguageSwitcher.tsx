"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/navigation";
import { routing, type Locale } from "@/src/i18n/routing";
import { LOCALE_FLAGS } from "@/src/i18n/locales";
import { INK, LINE, ON_INK, PICKED } from "@/src/lib/ui-colors";

/** `inline` lays the list out in normal flow — needed inside the side drawer,
 *  where an absolutely positioned popup would be clipped by the scroll area. */
export function LanguageSwitcher({ inline = false }: { inline?: boolean }) {
  const current = useLocale() as Locale;
  // Names are translated into the language in use, so a Spanish reader sees
  // "Alemán" rather than "Deutsch".
  const t = useTranslations("languages");
  // Locale-free pathname, so switching language keeps you on the same page.
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className={inline ? "w-full" : "relative"}
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={t(current)}
        className={`flex items-center gap-1.5 rounded-full text-sm font-semibold transition-all duration-200${
          inline ? " w-full justify-between" : ""
        }`}
        style={{
          backgroundColor: open ? INK : "transparent",
          color: open ? ON_INK : INK,
          border: `1.5px solid ${open ? INK : LINE}`,
          padding: "8px 14px",
          cursor: "pointer",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => {
          if (open) return;
          e.currentTarget.style.backgroundColor = INK;
          e.currentTarget.style.color = ON_INK;
          e.currentTarget.style.borderColor = INK;
        }}
        onMouseLeave={(e) => {
          if (open) return;
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = INK;
          e.currentTarget.style.borderColor = LINE;
        }}
      >
        <span aria-hidden style={{ fontSize: 15, lineHeight: 1 }}>
          {LOCALE_FLAGS[current]}
        </span>
        <span>{t(current)}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            opacity: 0.7,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className={inline ? "mt-1.5 w-full" : "absolute right-0 mt-2 z-50"}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ead8c8",
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(26,10,0,0.10)",
            minWidth: inline ? 0 : 168,
            listStyle: "none",
            padding: 6,
            margin: 0,
          }}
        >
          {routing.locales.map((loc) => {
            const isActive = loc === current;
            return (
              <li key={loc}>
                <Link
                  href={pathname}
                  locale={loc}
                  onClick={() => setOpen(false)}
                  role="option"
                  aria-selected={isActive}
                  className="flex items-center justify-between text-sm font-medium transition-colors duration-150"
                  style={{
                    color: isActive ? INK : "#4a3728",
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? PICKED : "transparent",
                    borderRadius: 9,
                    padding: "9px 12px",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "#f6efe8";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden style={{ fontSize: 15, lineHeight: 1 }}>
                      {LOCALE_FLAGS[loc]}
                    </span>
                    {t(loc)}
                  </span>
                  {isActive && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={INK}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
