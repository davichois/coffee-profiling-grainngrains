"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LOCALES, LOCALE_NAMES, type Locale } from "../i18n/config";

interface Props {
  current: Locale;
  /** Path after the locale segment, e.g. "" for home or "/peru". */
  basePath: string;
}

const TEAL = "#116e78";
const TEAL_LIGHT = "#279ba8";
const CREAM = "#faf6f2";

export function LanguageSwitcher({ current, basePath }: Props) {
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
      className="relative"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={LOCALE_NAMES[current]}
        className="flex items-center gap-1.5 rounded-full text-sm font-semibold transition-all duration-200"
        style={{
          backgroundColor: open ? TEAL : "transparent",
          color: open ? CREAM : TEAL,
          border: `1.5px solid ${open ? TEAL : TEAL_LIGHT}`,
          padding: "8px 14px",
          cursor: "pointer",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => {
          if (open) return;
          e.currentTarget.style.backgroundColor = TEAL;
          e.currentTarget.style.color = CREAM;
          e.currentTarget.style.borderColor = TEAL;
        }}
        onMouseLeave={(e) => {
          if (open) return;
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = TEAL;
          e.currentTarget.style.borderColor = TEAL_LIGHT;
        }}
      >
        {/* globe icon */}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
        </svg>
        <span>{LOCALE_NAMES[current]}</span>
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
          className="absolute right-0 mt-2 z-50"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ead8c8",
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(26,10,0,0.10)",
            minWidth: 168,
            listStyle: "none",
            padding: 6,
            margin: 0,
          }}
        >
          {LOCALES.map((loc) => {
            const isActive = loc === current;
            return (
              <li key={loc}>
                <Link
                  href={`/${loc}${basePath}`}
                  onClick={() => setOpen(false)}
                  role="option"
                  aria-selected={isActive}
                  className="flex items-center justify-between text-sm font-medium transition-colors duration-150"
                  style={{
                    color: isActive ? TEAL : "#4a3728",
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? "#eef7f6" : "transparent",
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
                  <span>{LOCALE_NAMES[loc]}</span>
                  {isActive && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={TEAL}
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
