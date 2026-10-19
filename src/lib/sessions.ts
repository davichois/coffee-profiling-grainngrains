// ─── Evaluation sessions ─────────────────────────────────────────────────────
// Up to two independent tasting records per wheel, plus one shared tasting —
// whichever code was used last. They live in the browser so they survive a
// reload, and they also encode into the URL so a link carries the whole
// evaluation — the site is static, so there is no server to store it.

export const MAX_SESSIONS = 2;
/** Only one shared tasting at a time: a new code replaces the previous one. */
export const MAX_SHARED = 1;
export const MAX_NAME_LENGTH = 40;
/** Guard against an enormous crafted link; no real tasting selects this many. */
const MAX_SELECTED = 300;

export interface Session {
  id: string;
  name: string;
  selected: string[];
  createdAt: string;
  /** Lot code, when the session came from a traceability code. */
  lotCode?: string;
  /** The cupping's own score. It must be shown verbatim — the wheel's own
   *  tally of the selected descriptors would not reproduce it. */
  officialScore?: number | null;
  grade?: string | null;
  /** Descriptors the cupping recorded that the wheel could not place. */
  unmatched?: string[];
}

export type WheelKey = "sca" | "peru";

export function storageKey(wheel: WheelKey, shelf: "own" | "shared" = "own") {
  return shelf === "own" ? `gg:sessions:${wheel}` : `gg:shared:${wheel}`;
}

export function newSessionId() {
  return Math.random().toString(36).slice(2, 9);
}

export function createSession(name: string, selected: string[] = []): Session {
  return {
    id: newSessionId(),
    name: name.slice(0, MAX_NAME_LENGTH),
    selected,
    createdAt: new Date().toISOString(),
  };
}

// ─── Session codes ───────────────────────────────────────────────────────────
// One session travels as one short code the taster can copy and paste
// anywhere. A compact delimited payload (not JSON) keeps it short; the unit
// separator can't be typed by hand, so it never clashes with a session name.

const SEP = "\u001f";
const CODE_VERSION = "1";

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): string {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeSession(session: Session): string {
  return toBase64Url(
    [CODE_VERSION, session.name, session.selected.join(",")].join(SEP),
  );
}

/**
 * Reads a code somebody pasted in. Everything here is untrusted, so the
 * version, the name length and every flavor id are checked — `validIds` is the
 * set of ids that actually exist on the wheel being viewed, which also stops a
 * code from the other wheel being imported wholesale.
 */
export function decodeSession(
  code: string,
  validIds: Set<string>,
): Session | null {
  let raw: string;
  try {
    raw = fromBase64Url(code.trim());
  } catch {
    return null;
  }
  const parts = raw.split(SEP);
  if (parts.length !== 3 || parts[0] !== CODE_VERSION) return null;

  const selected = parts[2]
    .split(",")
    .filter(Boolean)
    .filter((id) => validIds.has(id))
    .slice(0, MAX_SELECTED);
  if (selected.length === 0) return null;

  return {
    id: newSessionId(),
    name: parts[1].slice(0, MAX_NAME_LENGTH),
    selected,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Same validation for whatever we read back out of localStorage. `limit` is
 * the shelf's capacity: a shelf written before the cap changed is trimmed
 * here, so an old pair of shared tastings reads back as one.
 */
export function parseStored(
  text: string | null,
  validIds: Set<string>,
  limit: number = MAX_SESSIONS,
): Session[] | null {
  if (!text) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;
  const out: Session[] = [];
  for (const raw of parsed.slice(0, limit)) {
    if (typeof raw !== "object" || raw === null) continue;
    const rec = raw as Record<string, unknown>;
    out.push({
      id: typeof rec.id === "string" ? rec.id : newSessionId(),
      name:
        typeof rec.name === "string" ? rec.name.slice(0, MAX_NAME_LENGTH) : "",
      selected: Array.isArray(rec.selected)
        ? rec.selected
            .filter((id): id is string => typeof id === "string")
            .filter((id) => validIds.has(id))
            .slice(0, MAX_SELECTED)
        : [],
      createdAt:
        typeof rec.createdAt === "string"
          ? rec.createdAt
          : new Date().toISOString(),
      ...(typeof rec.lotCode === "string" ? { lotCode: rec.lotCode } : {}),
      ...(typeof rec.officialScore === "number"
        ? { officialScore: rec.officialScore }
        : {}),
      ...(typeof rec.grade === "string" ? { grade: rec.grade } : {}),
      ...(Array.isArray(rec.unmatched)
        ? {
            unmatched: rec.unmatched.filter(
              (u: unknown): u is string => typeof u === "string",
            ),
          }
        : {}),
    });
  }
  return out.length > 0 ? out : null;
}
