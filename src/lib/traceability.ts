// ─── Traceability lookup ─────────────────────────────────────────────────────
// Reads the lot behind a traceability code. Everything here already exists in
// the database: `fls_trazabilidad` is callable with the public key and only
// answers for published lots, which is what gates the app.

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Codes are issued as GG + 6 characters; the prefix is constant. */
const PREFIX = "GG";

/** Accepts "ggk7m4pd", "K7M4PD" or "GG K7M4PD" and returns "GGK7M4PD". */
export function normalizeCode(input: string): string {
  const bare = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!bare) return "";
  return bare.startsWith(PREFIX) ? bare : PREFIX + bare;
}

/** The URL carries the code without the constant prefix. */
export function codeForUrl(code: string): string {
  const full = normalizeCode(code);
  return full.startsWith(PREFIX) ? full.slice(PREFIX.length) : full;
}

export interface Lot {
  code: string;
  score: number | null;
  grade: string | null;
  cuppedOn: string | null;
  descriptors: string[];
  producer: string | null;
  farm: string | null;
  region: string | null;
  altitude: string | null;
  variety: string | null;
  process: string | null;
  isBlend: boolean;
}

const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;

const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

/** Values in `extrinseco` may be a scalar or a one-item array. */
function flat(v: unknown): string | null {
  if (Array.isArray(v)) return str(v[0]);
  if (typeof v === "number") return String(v);
  return str(v);
}

type Bag = Record<string, unknown>;

/** Reads a nested key without trusting any level to exist. */
function dig(source: unknown, ...path: string[]): unknown {
  let node: unknown = source;
  for (const key of path) {
    if (!node || typeof node !== "object") return undefined;
    node = (node as Bag)[key];
  }
  return node;
}

function parseLot(raw: unknown): Lot | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Bag;
  const code = str(r.codigo);
  if (!code) return null;

  const cat = (r.catacion ?? {}) as Bag;
  const origenes = Array.isArray(r.origenes) ? r.origenes : [];
  const origin: unknown = origenes[0];
  const values = (dig(r, "extrinseco", "values") ?? {}) as Bag;

  return {
    code,
    score: num(cat.puntaje),
    grade: str(cat.grado_fisico),
    cuppedOn: str(cat.catado_en),
    descriptors: Array.isArray(cat.descriptores)
      ? cat.descriptores.filter((d: unknown): d is string => typeof d === "string")
      : [],
    producer:
      str(dig(origin, "productor", "nombre")) ??
      flat(values["cultivo.productor"]),
    farm: str(dig(origin, "finca", "nombre")) ?? flat(values["cultivo.finca"]),
    region: flat(values["cultivo.region"]),
    altitude: flat(values["cultivo.altitud"]),
    variety: flat(values["cultivo.variedad"]),
    process: flat(values["procesamiento.proceso"]),
    isBlend: r.es_blend === true,
  };
}

/**
 * Looks a code up. Returns null for anything the database declines to answer —
 * an unknown code, or a lot that is not published yet. Both look identical from
 * here, which is the point.
 */
export async function fetchLot(input: string): Promise<Lot | null> {
  const code = normalizeCode(input);
  if (!code || !URL_BASE || !ANON_KEY) return null;

  let payload: unknown;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/fls_trazabilidad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ p_codigo: code }),
    });
    if (!res.ok) return null;
    payload = await res.json();
  } catch {
    return null;
  }

  // The function may answer with the object itself or a single-row array.
  const row = Array.isArray(payload) ? payload[0] : payload;
  return parseLot(row);
}
