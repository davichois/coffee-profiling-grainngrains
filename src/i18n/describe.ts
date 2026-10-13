import type { FlavorNode } from "@/src/data/flavorWheel";

// Translator for the `describe` namespace (next-intl).
export type DescribeT = {
  (key: string, values?: Record<string, string>): string;
};

// ─── flavor family groupings (shared across locales) ───────────────────────
const AROMATIC_IDS = new Set([
  "jasmine",
  "black-tea-flavor",
  "rose",
  "chamomile",
]);
const FRUITY_IDS = new Set([
  "blackberry",
  "raspberry",
  "blueberry",
  "strawberry",
  "grape",
  "raisin",
  "prune",
  "coconut",
  "cherry",
  "pomegranate",
  "pineapple",
  "mango",
  "papaya",
  "passion-fruit",
  "peach",
  "pear",
  "apple",
  "apricot",
  "grapefruit",
  "orange",
  "lemon",
  "lime",
]);
const ACID_IDS = new Set([
  "sour",
  "fermented",
  "winey",
  "malic",
  "citric",
  "phosphoric",
  "lactic",
]);
const SWEET_IDS = new Set([
  "vanilla",
  "vanillin",
  "brown-sugar",
  "molasses",
  "maple-syrup",
  "caramelized",
  "honey",
  "dark-chocolate",
  "milk-chocolate",
  "chocolate",
]);
const ROAST_IDS = new Set([
  "cereal",
  "malt",
  "grain",
  "burnt",
  "smoky",
  "ashy",
  "brown-roast",
  "dark-roast",
]);
const SPICE_NUT_IDS = new Set([
  "walnut",
  "hazelnut",
  "almond",
  "peanut",
  "anise",
  "pepper",
  "clove",
  "cinnamon",
  "nutmeg",
]);

function hasDescendant(node: FlavorNode, id: string): boolean {
  if (node.id === id) return true;
  return node.children?.some((c) => hasDescendant(c, id)) ?? false;
}

function findMainCat(leafId: string, nodes: FlavorNode[]): string | null {
  for (const top of nodes) {
    if (hasDescendant(top, leafId)) return top.id;
  }
  return null;
}

/**
 * Builds the localized cupping description from the `describe` messages.
 * `nameFor` returns the localized, already-bracket-wrapped flavor name.
 */
export function buildDescription(
  selected: Set<string>,
  score: number,
  data: FlavorNode[],
  leafScores: Record<string, number>,
  t: DescribeT,
  nameFor: (id: string) => string,
): string {
  const listSep = t("listSep");
  const listLast = t("listLast");

  const joinList = (items: string[]): string => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    return items.slice(0, -1).join(listSep) + listLast + items[items.length - 1];
  };

  const sorted = Array.from(selected)
    .map((id) => ({ id, s: leafScores[id] ?? 0 }))
    .sort((a, b) => b.s - a.s);

  const positives = sorted.filter((f) => f.s > 0);
  const neutrals = sorted.filter((f) => f.s === 0);
  const negatives = sorted.filter((f) => f.s < 0);

  const pick = (set: Set<string>) =>
    positives.filter((f) => set.has(f.id)).map((f) => nameFor(f.id));

  const aromatic = pick(AROMATIC_IDS);
  const fruity = pick(FRUITY_IDS);
  const acidic = pick(ACID_IDS);
  const sweet = pick(SWEET_IDS);
  const roasty = pick(ROAST_IDS);
  const spiceNut = pick(SPICE_NUT_IDS);
  const other = positives
    .filter(
      (f) =>
        !AROMATIC_IDS.has(f.id) &&
        !FRUITY_IDS.has(f.id) &&
        !ACID_IDS.has(f.id) &&
        !SWEET_IDS.has(f.id) &&
        !ROAST_IDS.has(f.id) &&
        !SPICE_NUT_IDS.has(f.id),
    )
    .map((f) => nameFor(f.id));
  const neutralLabels = neutrals.map((f) => nameFor(f.id));
  const negLabels = negatives.map((f) => nameFor(f.id));

  const parts: string[] = [];

  // ── Fragrance / aroma stage ──
  if (aromatic.length > 0 && fruity.length > 0) {
    parts.push(
      t("fragranceBoth", {
        aromatic: joinList(aromatic),
        fruity: joinList(fruity),
      }),
    );
  } else if (aromatic.length > 0) {
    parts.push(t("fragranceAromatic", { aromatic: joinList(aromatic) }));
  } else if (fruity.length > 0) {
    parts.push(t("fragranceFruity", { fruity: joinList(fruity) }));
  }

  // ── Palate / flavor stage ──
  const palateItems = [...sweet, ...roasty, ...spiceNut, ...other].filter(
    Boolean,
  );
  const palateAllItems = [
    ...(aromatic.length === 0 ? fruity : []),
    ...sweet,
    ...roasty,
    ...spiceNut,
    ...other,
  ].filter(Boolean);

  if (parts.length === 0 && palateAllItems.length > 0) {
    parts.push(t("palateStart", { items: joinList(palateAllItems) }));
  } else if (palateItems.length > 0) {
    const spice = joinList(spiceNut);
    if (sweet.length > 0 && roasty.length > 0) {
      parts.push(
        spice
          ? t("palateSweetRoastySpice", {
              sweet: joinList(sweet),
              roasty: joinList(roasty),
              spice,
            })
          : t("palateSweetRoasty", {
              sweet: joinList(sweet),
              roasty: joinList(roasty),
            }),
      );
    } else if (sweet.length > 0) {
      parts.push(
        spice
          ? t("palateSweetSpice", { sweet: joinList(sweet), spice })
          : t("palateSweet", { sweet: joinList(sweet) }),
      );
    } else if (roasty.length > 0) {
      parts.push(
        spice
          ? t("palateRoastySpice", { roasty: joinList(roasty), spice })
          : t("palateRoasty", { roasty: joinList(roasty) }),
      );
    } else if (spiceNut.length > 0 || other.length > 0) {
      parts.push(t("palateOther", { items: joinList([...spiceNut, ...other]) }));
    }
  }

  // ── Acidity stage ──
  if (acidic.length > 0) {
    const key =
      score >= 85 ? "acidityHigh" : score >= 75 ? "acidityMid" : "acidityLow";
    parts.push(t(key, { acidic: joinList(acidic) }));
  }

  // ── Neutral / textural notes ──
  if (neutralLabels.length > 0) {
    parts.push(t("neutral", { items: joinList(neutralLabels) }));
  }

  // ── Finish / aftertaste ──
  if (score >= 88) parts.push(t("finishLong"));
  else if (score >= 80) parts.push(t("finishMid"));
  else if (score >= 72) parts.push(t("finishShort"));

  // ── Defects ──
  if (negLabels.length === 1) parts.push(t("defectOne", { defect: negLabels[0] }));
  else if (negLabels.length > 1)
    parts.push(t("defectMany", { defects: joinList(negLabels) }));

  // ── Overall / SCA score ──
  if (parts.length === 0) {
    parts.push(t("empty"));
  } else {
    const s = score.toFixed(1);
    if (score >= 90) parts.push(t("sca90", { score: s }));
    else if (score >= 85) parts.push(t("sca85", { score: s }));
    else if (score >= 80) parts.push(t("sca80", { score: s }));
    else if (score >= 75) parts.push(t("sca75", { score: s }));
    else parts.push(t("scaLow", { score: s }));
  }

  return parts.join(" ");
}

export { findMainCat };
