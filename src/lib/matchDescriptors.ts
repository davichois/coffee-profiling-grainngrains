// ─── Matching cupping descriptors onto the wheel ─────────────────────────────
// Lots store their descriptors as free Spanish text ("Panela", "Jazmín"), while
// the wheel is keyed by node id. Only some land on a label exactly, so the
// match runs in three passes and never drops a descriptor silently.

import type { FlavorNode } from "@/src/data/flavorWheel";

export type MatchKind = "exact" | "synonym" | "similar" | "family" | "none";

export interface DescriptorMatch {
  /** The descriptor as the cupping recorded it. */
  original: string;
  /** Wheel node id, when one was found. */
  id: string | null;
  /** True when the match is a family rather than a single descriptor: the
   *  wheel can reveal it, but there is no one leaf to tick. */
  isFamily?: boolean;
  /** The wheel's own label for that id. */
  label: string | null;
  kind: MatchKind;
}

/** Lowercase, strip accents and punctuation — "Jazmín" ≈ "jazmin". */
export function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cupping vocabulary that has no identical label on the wheel. Keys are folded
 * descriptors; values are the labels they stand for, best first — the Peru
 * wheel knows "Chancaca" while the SCA one only has "Azúcar Morena", so the
 * list is tried in order against whichever wheel is in use.
 */
const SYNONYMS: Record<string, string | string[]> = {
  panela: ["Chancaca", "Azúcar Morena", "Azúcar Andina"],
  chancaca: ["Chancaca", "Azúcar Morena"],
  pasas: "Pasa de Uva",
  "pasa de uva": "Pasa de Uva",
  "uvas pasas": "Pasa de Uva",
  "ciruela pasa": "Pasa de Ciruela",
  "azucar morena": ["Azúcar Morena", "Azúcar Andina"],
  "azucar rubia": ["Azúcar Morena", "Azúcar Andina"],
  cacao: "Chocolate",
  "cacao nativo": ["Cacao Chuncho", "Cacao"],
  citricos: "Cítricos",
  "frutos rojos": "Bayas",
  "frutos secos": "Nueces",
  "flor de naranjo": ["Azahar", "Floral"],
  "flor blanca": ["Azahar", "Floral"],
  bergamota: "Toronja",
  "te negro": "Té Negro",
  "miel de abeja": "Miel",
  "caramelo": "Caramelizado",
  "frutal": "Afrutado",
  "dulce": "Dulce",
};

/** Dice coefficient over character bigrams: 1 is identical, 0 shares nothing. */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const grams = (s: string) => {
    const out = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      out.set(g, (out.get(g) ?? 0) + 1);
    }
    return out;
  };
  const ga = grams(a);
  const gb = grams(b);
  let shared = 0;
  let total = 0;
  for (const n of ga.values()) total += n;
  for (const [g, n] of gb) {
    total += n;
    const have = ga.get(g);
    if (have) shared += Math.min(have, n);
  }
  return (2 * shared) / total;
}

/** Below this a "closest match" is too loose to be honest about. */
const SIMILARITY_FLOOR = 0.55;

/**
 * Character overlap alone is not enough: "panela" and "canela" share 0.8 of
 * their bigrams and mean entirely different things. A believable near-match
 * also has to start the same way, or have one name contain the other.
 */
function plausible(a: string, b: string): boolean {
  return a.slice(0, 3) === b.slice(0, 3) || a.includes(b) || b.includes(a);
}

interface Leaf {
  id: string;
  label: string;
  folded: string;
}

/** Only leaves are selectable, so only leaves can carry a descriptor. */
export function leavesOf(nodes: FlavorNode[], out: Leaf[] = []): Leaf[] {
  for (const n of nodes) {
    if (n.children?.length) leavesOf(n.children, out);
    else out.push({ id: n.id, label: n.label, folded: fold(n.label) });
  }
  return out;
}

/** Families, so a descriptor like "Cítricos" is recognised for what it is. */
function familiesOf(nodes: FlavorNode[], out: Leaf[] = []): Leaf[] {
  for (const n of nodes) {
    if (n.children?.length) {
      out.push({ id: n.id, label: n.label, folded: fold(n.label) });
      familiesOf(n.children, out);
    }
  }
  return out;
}

export function matchDescriptors(
  descriptors: string[],
  wheel: FlavorNode[],
): DescriptorMatch[] {
  const leaves = leavesOf(wheel);
  const byLabel = new Map(leaves.map((l) => [l.folded, l]));
  const byFamily = new Map(familiesOf(wheel).map((f) => [f.folded, f]));

  return descriptors.map((original) => {
    const q = fold(original);

    // 1 — the descriptor is already a label on the wheel.
    const exact = byLabel.get(q);
    if (exact) {
      return { original, id: exact.id, label: exact.label, kind: "exact" as const };
    }

    // 2 — known cupping vocabulary that the wheel words differently.
    const synonyms = SYNONYMS[q];
    const candidates = Array.isArray(synonyms)
      ? synonyms
      : synonyms
        ? [synonyms]
        : [];
    for (const candidate of candidates) {
      const hit = byLabel.get(fold(candidate));
      if (hit) {
        return {
          original,
          id: hit.id,
          label: hit.label,
          kind: "synonym" as const,
        };
      }
    }

    // 3 — the descriptor names a whole family ("Cítricos"). There is no single
    // leaf to tick, so it is reported as a family and only revealed.
    const family =
      byFamily.get(q) ??
      candidates.map((c) => byFamily.get(fold(c))).find(Boolean);
    if (family) {
      return {
        original,
        id: family.id,
        label: family.label,
        kind: "family" as const,
        isFamily: true,
      };
    }

    // 4 — closest label on the wheel, if it is close enough to stand behind.
    let best: Leaf | null = null;
    let bestScore = 0;
    for (const leaf of leaves) {
      // Plain overlap only. A containment bonus was tried and had to go: it
      // rewarded the shortest label, sending "Chocolate amargo" to
      // "Chocolate" instead of "Choco. Amargo".
      if (!plausible(q, leaf.folded)) continue;
      const score = similarity(q, leaf.folded);
      if (score > bestScore) {
        bestScore = score;
        best = leaf;
      }
    }
    if (best && bestScore >= SIMILARITY_FLOOR) {
      return { original, id: best.id, label: best.label, kind: "similar" as const };
    }

    return { original, id: null, label: null, kind: "none" as const };
  });
}
