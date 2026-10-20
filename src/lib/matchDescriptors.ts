// ─── Matching cupping descriptors onto the wheel ─────────────────────────────
// Lots store their descriptors as free Spanish text ("Panela", "Jazmín"), while
// the wheel is keyed by node id. Only some land on a label exactly, so the
// match runs in several passes and never drops a descriptor silently.

import type { FlavorNode } from "@/src/data/flavorWheel";

export type MatchKind =
  | "exact"
  | "synonym"
  | "variant"
  | "similar"
  | "family"
  | "none";

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
  "azucar morena": ["Azúcar Morena", "Chancaca", "Azúcar Andina"],
  "azucar rubia": ["Azúcar Morena", "Chancaca", "Azúcar Andina"],
  cacao: "Chocolate",
  "cacao nativo": ["Cacao Chuncho", "Cacao"],
  // The Peru wheel abbreviates the label to fit its wedge, so the full name
  // reaches it only by way of this list.
  "chocolate amargo": ["Choco. Amargo", "Chocolate Amargo"],
  "chocolate negro": ["Choco. Amargo", "Chocolate Amargo"],
  "chocolate oscuro": ["Choco. Amargo", "Chocolate Amargo"],
  "cacao amargo": ["Choco. Amargo", "Chocolate Amargo"],
  "chocolate con leche": ["Chocolate con Leche", "Chocolate"],
  // The descriptive cupping form words its ticks as whole SCA families. Most
  // are families on the wheel too and only open a branch, but "Ácido /
  // Fermentado" has one plain leaf that says exactly that, so it is ticked.
  "acido fermentado": ["Fermentado", "Ácido/Fermentado"],
  "frutas deshidratadas": ["Frutos Secos", "Pasa de Uva"],
  "frutas secas": ["Frutos Secos", "Pasa de Uva"],
  "verde vegetal": ["Vegetal", "Vegetal Crudo"],
  "nueces cacao": ["Nueces/Cacao Nativo", "Nueces/Cacao", "Nueces"],
  "humedad tierra": ["Tierra", "Húmedo/Papel"],
  otra: ["Otros"],
  citricos: "Cítricos",
  "frutos rojos": "Bayas",
  // This wheel has a "Frutos Secos" branch of its own (dried fruit); on a
  // wheel without one the cupping sense of the phrase, nuts, applies.
  "frutos secos": ["Frutos Secos", "Nueces"],
  "flor de naranjo": ["Azahar", "Floral"],
  "flor blanca": ["Azahar", "Floral"],
  bergamota: "Toronja",
  "te negro": "Té Negro",
  "miel de abeja": "Miel",
  "caramelo": "Caramelizado",
  "frutal": "Afrutado",
  "dulce": "Dulce",
};

/**
 * Singular/plural forms of a word. Spanish marks number on the word itself, so
 * this is enough to bridge a sheet that writes "Fermentados" and a wheel that
 * labels the leaf "Fermentado".
 */
function numberForms(word: string): string[] {
  const out = [word];
  if (word.endsWith("ces")) out.push(word.slice(0, -3) + "z");
  if (word.endsWith("es") && word.length > 4) out.push(word.slice(0, -2));
  if (word.endsWith("s") && word.length > 3) out.push(word.slice(0, -1));
  if (!word.endsWith("s")) out.push(word + "s", word + "es");
  return out;
}

/**
 * The descriptor written with the other number. The last word carries it
 * ("Ácido Cítrico" / "Ácidos Cítricos" both read naturally), but a descriptor
 * can also be plural throughout ("Frutos Rojos"), so both are offered.
 */
function variants(q: string): string[] {
  const words = q.split(" ");
  const last = words.length - 1;
  const out = new Set<string>();
  for (const form of numberForms(words[last])) {
    out.add([...words.slice(0, last), form].join(" "));
  }
  if (words.length > 1) {
    for (const head of numberForms(words[0])) {
      for (const tail of numberForms(words[last])) {
        out.add([head, ...words.slice(1, last), tail].join(" "));
      }
    }
  }
  out.delete(q);
  return [...out];
}

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
 * And a guess only stands when it clearly beats the runner-up. Bare "Maduro"
 * sits between "Poco Maduro" and "Muy Maduro" — opposite readings of the cup —
 * so it is left unmatched rather than resolved by a coin flip.
 */
const MIN_LEAD = 0.08;

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
  const families = familiesOf(wheel);
  const byLabel = new Map(leaves.map((l) => [l.folded, l]));
  const byFamily = new Map(families.map((f) => [f.folded, f]));

  return descriptors.map((original) => {
    const q = fold(original);

    // 1 — the descriptor is already a label on the wheel.
    const exact = byLabel.get(q);
    if (exact) {
      return { original, id: exact.id, label: exact.label, kind: "exact" as const };
    }

    // 2 — the same descriptor written with the other number. A leaf under
    // another number beats every branch below: the wheel holds the branch
    // "Fermentados" and, inside it, the leaf "Fermentado", and a sheet
    // recording the plural means the leaf — matching the branch first opened
    // it and ticked nothing.
    const forms = variants(q);
    for (const form of forms) {
      const hit = byLabel.get(form);
      if (hit) {
        return {
          original,
          id: hit.id,
          label: hit.label,
          kind: "variant" as const,
        };
      }
    }

    // 3 — known cupping vocabulary that the wheel words differently. The list
    // is in order of preference and a preference can be a branch: "Frutas
    // deshidratadas" means the whole dried-fruit branch, not the raisin in it,
    // so each candidate is tried as a leaf and then as a branch before moving
    // on to the next.
    const synonyms = SYNONYMS[q];
    const candidates = Array.isArray(synonyms)
      ? synonyms
      : synonyms
        ? [synonyms]
        : [];
    for (const candidate of candidates) {
      const folded = fold(candidate);
      const leaf = byLabel.get(folded);
      if (leaf) {
        return {
          original,
          id: leaf.id,
          label: leaf.label,
          kind: "synonym" as const,
        };
      }
      const branch = byFamily.get(folded);
      if (branch) {
        return {
          original,
          id: branch.id,
          label: branch.label,
          kind: "synonym" as const,
          isFamily: true,
        };
      }
    }

    // 4 — the descriptor names a branch outright, under another number, or by
    // its head word ("Floral" for "Floral Nativo"). There is no single leaf to
    // tick, so it is reported as a family and only revealed.
    const family =
      byFamily.get(q) ??
      forms.map((f) => byFamily.get(f)).find(Boolean) ??
      families.find((f) =>
        [q, ...forms].some((v) => f.folded.startsWith(v + " ")),
      );
    if (family) {
      return {
        original,
        id: family.id,
        label: family.label,
        kind: "family" as const,
        isFamily: true,
      };
    }

    // 5 — closest label on the wheel, if it is close enough to stand behind
    // and far enough ahead of the next one to be the only honest reading.
    let best: Leaf | null = null;
    let bestScore = 0;
    let runnerUp = 0;
    for (const leaf of leaves) {
      // Plain overlap only. A containment bonus was tried and had to go: it
      // rewarded the shortest label, sending "Chocolate amargo" to
      // "Chocolate" instead of "Choco. Amargo".
      if (!plausible(q, leaf.folded)) continue;
      const score = similarity(q, leaf.folded);
      if (score > bestScore) {
        runnerUp = bestScore;
        bestScore = score;
        best = leaf;
      } else if (score > runnerUp) {
        runnerUp = score;
      }
    }
    if (best && bestScore >= SIMILARITY_FLOOR && bestScore - runnerUp >= MIN_LEAD) {
      return { original, id: best.id, label: best.label, kind: "similar" as const };
    }

    return { original, id: null, label: null, kind: "none" as const };
  });
}
