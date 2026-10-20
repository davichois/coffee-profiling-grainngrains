// ─── Traceability lookup ─────────────────────────────────────────────────────
// Reads the lot behind a traceability code. Everything here already exists in
// the database: `fls_trazabilidad` is callable with the public key and only
// answers for published lots, which is what gates the app.
//
// A cupping is recorded in two forms and both have to be read. `fls_trazabilidad`
// carries only the affective (CVA) descriptors the cupper typed — "Pasas",
// "Fresa" — while the descriptive form lives in `fls_catacion_detalle` as ticks
// on the SCA families: "Bayas", "Ácido / Fermentado", "Frutas deshidratadas".
// Reading the first alone left whole descriptors off the wheel.

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

/** One POST to a Postgres function with the public key. */
async function rpc(name: string, code: string): Promise<unknown> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ p_codigo: code }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * The descriptive form stores a tick per descriptor id, the same catalogue the
 * cupping app writes. The ids are stable; their Spanish labels are what the
 * wheel is matched against.
 */
const DESCRIPTIVE_LABELS: Record<string, string> = {
  floral: "Floral",
  afrutado: "Afrutado",
  bayas: "Bayas",
  frutas_des: "Frutas deshidratadas",
  citricos: "Cítricos",
  acido_ferm: "Ácido / Fermentado",
  acido: "Ácido",
  fermentado: "Fermentado",
  verde: "Verde / Vegetal",
  tostado: "Tostado",
  cereal: "Cereal",
  quemado: "Quemado",
  tabaco: "Tabaco",
  nueces_cacao: "Nueces / Cacao",
  nueces: "Nueces",
  cacao: "Cacao",
  especias: "Especias",
  otra: "Otra",
  quimico: "Químico",
  humedad: "Humedad / Tierra",
  madera: "Madera",
  dulce: "Dulce",
  vainilla: "Vainilla",
  azucar: "Azúcar morena",
};

/**
 * Every descriptor the cupping sheet marks, in the order a reader meets them:
 * the descriptive ticks first, then the affective labels. Several cuppers may
 * have filled the same sheet, so ids repeat and are collapsed.
 */
function parseCuppingSheet(payload: unknown): string[] {
  const rows = Array.isArray(payload) ? payload : [];
  const descriptive: string[] = [];
  const affective: string[] = [];

  for (const row of rows) {
    const kind = str(dig(row, "tipo"));
    const data = dig(row, "datos");

    if (kind === "descriptivo") {
      const attributes = (dig(data, "attributes") ?? {}) as Bag;
      for (const attribute of Object.values(attributes)) {
        const ticks = (dig(attribute, "descriptors") ?? {}) as Bag;
        for (const [id, on] of Object.entries(ticks)) {
          const label = on === true ? DESCRIPTIVE_LABELS[id] : null;
          if (label) descriptive.push(label);
        }
      }
    }

    if (kind === "afectivo") {
      // Grouped by where it was perceived ("olfato", "sabor"); the group only
      // says where, so the labels are taken flat.
      const groups = (dig(data, "descriptors") ?? {}) as Bag;
      for (const list of Object.values(groups)) {
        if (!Array.isArray(list)) continue;
        for (const item of list) {
          const label = str(dig(item, "label"));
          if (label) affective.push(label);
        }
      }
    }
  }

  return [...new Set([...descriptive, ...affective])];
}

/**
 * Looks a code up. Returns null for anything the database declines to answer —
 * an unknown code, or a lot that is not published yet. Both look identical from
 * here, which is the point.
 */
export async function fetchLot(input: string): Promise<Lot | null> {
  const code = normalizeCode(input);
  if (!code || !URL_BASE || !ANON_KEY) return null;

  // The sheet is asked for alongside the lot: it is a separate function, and a
  // lot with no sheet still opens the wheel on whatever the lot itself carries.
  const [payload, sheet] = await Promise.all([
    rpc("fls_trazabilidad", code),
    rpc("fls_catacion_detalle", code),
  ]);

  // The function may answer with the object itself or a single-row array.
  const row = Array.isArray(payload) ? payload[0] : payload;
  const lot = parseLot(row);
  if (!lot) return null;

  const fromSheet = parseCuppingSheet(sheet);
  if (fromSheet.length === 0) return lot;

  // The sheet is the fuller record, so it leads; anything the lot named that
  // the sheet does not repeat is kept after it.
  const seen = new Set(fromSheet.map((d) => d.toLowerCase()));
  return {
    ...lot,
    descriptors: [
      ...fromSheet,
      ...lot.descriptors.filter((d) => !seen.has(d.toLowerCase())),
    ],
  };
}
