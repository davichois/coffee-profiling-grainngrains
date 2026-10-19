"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import grainngrains from "@/public/grainngrains.svg";
import { useRouter } from "@/src/i18n/navigation";
import { LocaleBar } from "./LocaleBar";
import { productsUrl } from "@/src/lib/site";
import { fetchLot, normalizeCode, codeForUrl } from "@/src/lib/traceability";

/** Codes are GG + six characters; the prefix is shown, not typed. */
const CODE_LENGTH = 6;

export function CodeEntry() {
  const ui = useTranslations("ui");
  const locale = useLocale();
  const router = useRouter();
  // Only the six characters after the constant "GG" prefix.
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);
  const [focused, setFocused] = useState(false);

  const run = async (raw: string) => {
    const code = normalizeCode(raw);
    if (!code || checking) return;
    setChecking(true);
    setFailed(false);
    // Checked here so a wrong code is answered on the spot rather than by a
    // round trip that bounces straight back.
    const lot = await fetchLot(code);
    if (!lot) {
      setChecking(false);
      setFailed(true);
      return;
    }
    router.push(`/rueda/${codeForUrl(lot.code)}`, { locale });
  };

  const busy = checking;

  return (
    <div className="gate">
      <LocaleBar />

      <main className="gate-main">
      <form className="gate-card" onSubmit={(e) => { e.preventDefault(); void run(value); }}>
        <Image
          src={grainngrains}
          alt="Grain & Grains"
          width={132}
          height={132}
          priority
          style={{ height: "auto" }}
        />
        <h1 className="gate-title">{ui("gateTitle")}</h1>
        <p className="gate-intro">{ui("gateIntro")}</p>

        {/* Six slots after the fixed prefix, driven by one real input so
            paste, backspace and mobile keyboards all behave. */}
        <div
          className={`code-field${failed ? " is-failed" : ""}`}
          onClick={() => inputRef.current?.focus()}
        >
          <span className="code-prefix">GG</span>
          <div className="code-slots">
            {Array.from({ length: CODE_LENGTH }).map((_, i) => {
              const char = value[i];
              const active = focused && !busy && i === Math.min(value.length, CODE_LENGTH - 1);
              return (
                <span key={i} className={`code-slot${active ? " is-active" : ""}`}>
                  <span className="code-char">
                    {char ?? <span className="code-dot" />}
                  </span>
                  <span className="code-rule" />
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            className="code-input"
            value={value}
            disabled={busy}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              // Accept a pasted full code too, prefix and all.
              const next = e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .replace(/^GG/, "")
                .slice(0, CODE_LENGTH);
              setValue(next);
              setFailed(false);
              if (next.length === CODE_LENGTH) void run(next);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.length === CODE_LENGTH) {
                e.preventDefault();
                void run(value);
              }
            }}
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-label={ui("gatePlaceholder")}
            maxLength={CODE_LENGTH + 2}
          />
        </div>

        <p
          className="gate-status"
          style={{ color: failed ? "#c62828" : "#8a7360" }}
          role="status"
          aria-live="polite"
        >
          {busy ? ui("gateChecking") : failed ? ui("gateInvalid") : "\u00a0"}
        </p>
      </form>

        {/* The other half of the page: no code yet means buying the coffee. */}
        <div className="gate-or">
          <span>{ui("orSeparator")}</span>
        </div>

        <p className="gate-nocode">{ui("noCodeYet")}</p>

        <a
          className="gate-shop"
          href={productsUrl(locale)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          {ui("buyCoffee")}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="5" y1="12" x2="18" y2="12" />
            <polyline points="12 6 18 12 12 18" />
          </svg>
        </a>
      </main>

      <footer className="gate-footer">
        <p className="gate-claim">{ui("footerClaim")}</p>
      </footer>
    </div>
  );
}
