import Image from "next/image";
import grainngrains from "@/public/grainngrains.svg";
import { UI } from "../i18n/ui";
import type { Locale } from "../i18n/config";
import { SHOP_URL } from "../config/access";
import { LanguageSwitcher } from "./LanguageSwitcher";

const DARK = "#1a0a00";
const MUTED = "#6b5744";
const CREAM = "#faf6f2";

export function AccessBlocked({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center"
      style={{ background: CREAM, fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Language switcher — mirrors the app header container so it lands in the
          same spot: centered max-w-7xl band with pt-5 px-4 sm:px-6, aligned right. */}
      <div className="fixed inset-x-0 top-5 z-50">
        <div className="w-full md:max-w-7xl md:mx-auto px-4 sm:px-6 flex justify-end">
          <LanguageSwitcher current={locale} basePath="" />
        </div>
      </div>

      <div className="flex flex-col items-center" style={{ maxWidth: 440 }}>
        <Image
          src={grainngrains}
          alt="Grain & Grains"
          width={150}
          height={150}
          priority
          style={{ height: "auto" }}
        />

        {/* lock badge */}
        <div
          className="flex items-center gap-2 mt-6 mb-5"
          style={{
            border: `1.5px solid #e0cdbb`,
            borderRadius: 999,
            padding: "6px 14px",
            color: MUTED,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>{ui.blockedTitle}</span>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.7,
            color: DARK,
            fontWeight: 500,
          }}
        >
          {ui.blockedMessage}
        </p>

        <a
          href={SHOP_URL}
          className="mt-8 inline-flex items-center gap-2 font-semibold transition-all duration-200"
          style={{
            backgroundColor: DARK,
            color: CREAM,
            borderRadius: 999,
            padding: "12px 26px",
            fontSize: 14,
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          <span>{ui.blockedCta}</span>
        </a>
      </div>
    </div>
  );
}
