"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export interface SearchItem {
  id: string;
  /** Localized descriptor name. */
  label: string;
  /** Localized family › subfamily trail, for context. */
  trail: string;
}

interface Props {
  onClose: () => void;
  items: SearchItem[];
  onPick: (id: string) => void;
  /** Ids already in the tasting, shown as a check. */
  picked: Set<string>;
}

/** Strips accents and case so "cítrico" matches "citrico". */
function fold(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const MAX_RESULTS = 8;

/** Mounted only while open, so each visit starts with a clean field. */
export function FlavorSearch({ onClose, items, onPick, picked }: Props) {
  const ui = useTranslations("ui");
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return items.slice(0, MAX_RESULTS);
    // Rank: name starts with the query, then name contains it, then the trail.
    const scored = [];
    for (const it of items) {
      const name = fold(it.label);
      const trail = fold(it.trail);
      const rank = name.startsWith(q)
        ? 0
        : name.includes(q)
          ? 1
          : trail.includes(q)
            ? 2
            : -1;
      if (rank >= 0) scored.push({ it, rank });
    }
    scored.sort((a, b) => a.rank - b.rank || a.it.label.localeCompare(b.it.label));
    return scored.slice(0, MAX_RESULTS).map((s) => s.it);
  }, [items, query]);

  // Focusing is a DOM effect, not state — safe to do here.
  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, []);

  // Keep the highlighted row in view.
  useEffect(() => {
    listRef.current?.children[cursor]?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const choose = (id: string) => {
    onPick(id);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) =>
        results.length ? (c - 1 + results.length) % results.length : 0,
      );
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      choose(results[cursor].id);
    }
  };

  return (
    <div
      className="flavor-search-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flavor-search"
        role="dialog"
        aria-modal="true"
        aria-label={ui("search")}
        onKeyDown={onKeyDown}
      >
        <div className="flavor-search-field">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0); // a new query starts at the first hit
            }}
            placeholder={ui("searchPlaceholder")}
            aria-label={ui("searchPlaceholder")}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {results.length === 0 ? (
          <p className="flavor-search-empty">{ui("searchEmpty")}</p>
        ) : (
          <ul className="flavor-search-list" ref={listRef} role="listbox">
            {results.map((r, i) => (
              <li key={r.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === cursor}
                  className={`flavor-search-row${i === cursor ? " is-active" : ""}`}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => choose(r.id)}
                >
                  <span className="flavor-search-name">{r.label}</span>
                  <span className="flavor-search-trail">{r.trail}</span>
                  {picked.has(r.id) && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="flavor-search-hint">{ui("searchHint")}</p>
      </div>
    </div>
  );
}
