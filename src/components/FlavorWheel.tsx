"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { flavorWheelData, FlavorNode } from "@/src/data/flavorWheel";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { GrainngrainsLogo } from "./GrainngrainsLogo";
import { WheelNav } from "./WheelNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FlavorSearch, type SearchItem } from "./FlavorSearch";
import { WheelSelect } from "./WheelSelect";
import { INK, LINE, ON_INK } from "@/src/lib/ui-colors";
import { useTranslations } from "next-intl";
import { buildDescription, findMainCat } from "@/src/i18n/describe";
import {
  MAX_SESSIONS,
  MAX_NAME_LENGTH,
  type Session,
  createSession,
  encodeSession,
  decodeSession,
  parseStored,
  storageKey,
} from "@/src/lib/sessions";

const SVG_SIZE = 900;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;

const CENTER_R = 62;

// Cream breathing room between the hub and each ring, so the wheel reads as
// separate bands of petals rather than one solid disc.
const RING_GAP = 11;

const RINGS = [
  { inner: 0, outer: CENTER_R },
  { inner: CENTER_R + RING_GAP, outer: 222 },
  { inner: 222 + RING_GAP, outer: 332 },
  { inner: 332 + RING_GAP, outer: 424 },
];

/** Cream gap between neighbouring wedges, as an arc length (not an angle, so
 *  it looks the same on the inner and outer rings). */
const WEDGE_GAP = 3.4;

// Round to 3 decimal places — eliminates SSR/client floating-point divergence
const n3 = (v: number) => Math.round(v * 1000) / 1000;

// ─── scoring weights per leaf node ───────────────────────────────────────────
const LEAF_SCORES: Record<string, number> = {
  "black-tea-flavor": 4,
  rose: 4,
  jasmine: 4.5,
  chamomile: 4.5,
  blackberry: 3,
  raspberry: 3,
  blueberry: 3.5,
  strawberry: 3,
  cherry: 3,
  pomegranate: 2.5,
  pineapple: 2.5,
  grape: 2,
  apple: 2,
  peach: 3,
  pear: 2,
  coconut: 1.5,
  raisin: 1.5,
  prune: 2,
  grapefruit: 3,
  orange: 3,
  lemon: 3,
  lime: 2.5,
  honey: 3.5,
  caramelized: 2.5,
  "maple-syrup": 2,
  molasses: 1.5,
  "vanilla-flavor": 3,
  vanillin: 2.5,
  chocolate: 2.5,
  "dark-chocolate": 3.5,
  hazelnut: 2,
  almond: 2,
  peanuts: 1,
  cinnamon: 2.5,
  nutmeg: 2,
  anise: 2,
  clove: 2,
  "pepper-flavor": 1,
  malt: 2,
  grain: 1,
  "brown-roast": 1,
  smoky: -0.5,
  ashy: -2,
  acrid: -3.5,
  "citric-acid": 2.5,
  "malic-acid": 2.5,
  "phosphoric-acid": 2.0,
  "lactic-acid": 2.0,
  "sour-aromatics": 1,
  "acetic-acid": -1.5,
  "butyric-acid": -4,
  "isovaleric-acid": -4,
  winey: 2.5,
  whiskey: 1,
  fermented: -0.5,
  overripe: -2,
  fresh: 1.5,
  "herb-like": 1,
  "under-ripe": -1,
  peapod: -0.5,
  vegetative: -1.5,
  "dark-green": -1.5,
  "hay-like": -2,
  "olive-oil-flavor": -0.5,
  stale: -3,
  cardboard: -3,
  papery: -3,
  woody: -1,
  "moldy-damp": -5,
  "musty-dusty": -3,
  "musty-earthy": -3,
  bitter: -1.5,
  salty: -1,
  medicinal: -5,
  petroleum: -5,
  skunky: -5,
  rubber: -5,
};

const FLAVOR_NAMES_ES: Record<string, string> = {
  "black-tea-flavor": "té negro",
  rose: "rosa",
  jasmine: "jazmín",
  chamomile: "manzanilla",
  blackberry: "mora",
  raspberry: "frambuesa",
  blueberry: "mora azul",
  strawberry: "fresa",
  cherry: "cereza",
  pomegranate: "granada",
  pineapple: "piña",
  grape: "uva",
  apple: "manzana",
  peach: "durazno",
  pear: "pera",
  coconut: "coco",
  raisin: "pasa de uva",
  prune: "ciruela pasa",
  grapefruit: "toronja",
  orange: "naranja",
  lemon: "limón",
  lime: "lima",
  honey: "miel",
  caramelized: "caramelo",
  "maple-syrup": "jarabe de arce",
  molasses: "melaza",
  "vanilla-flavor": "vainilla",
  vanillin: "vainillina",
  chocolate: "chocolate",
  "dark-chocolate": "chocolate amargo",
  hazelnut: "avellana",
  almond: "almendra",
  peanuts: "maní",
  cinnamon: "canela",
  nutmeg: "nuez moscada",
  anise: "anís",
  clove: "clavo",
  "pepper-flavor": "pimienta",
  malt: "malta",
  grain: "grano",
  "brown-roast": "tostado",
  smoky: "humo",
  ashy: "ceniza",
  acrid: "acre",
  "citric-acid": "acidez cítrica",
  "malic-acid": "acidez málica",
  "phosphoric-acid": "ácido fosfórico",
  "lactic-acid": "ácido láctico",
  "sour-aromatics": "acidez aromática",
  "acetic-acid": "ácido acético",
  "butyric-acid": "ácido butírico",
  "isovaleric-acid": "ácido isovalérico",
  winey: "notas de vino",
  whiskey: "whiskey",
  fermented: "fermentado",
  overripe: "sobremadurado",
  fresh: "fresco",
  "herb-like": "herbal",
  "under-ripe": "poco maduro",
  peapod: "guisante",
  vegetative: "vegetativo",
  "dark-green": "verde oscuro",
  "hay-like": "heno",
  "olive-oil-flavor": "aceite de oliva",
  stale: "animal",
  cardboard: "tierra",
  papery: "polvo",
  woody: "madera",
  "moldy-damp": "humedad",
  "musty-dusty": "papel",
  "musty-earthy": "cartón",
  bitter: "amargo",
  salty: "salado",
  medicinal: "medicinal",
  petroleum: "petróleo",
  skunky: "zorrillo",
  rubber: "goma",
};

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** The seam each wedge gives up on both sides, in degrees. */
function wedgePadDeg(innerR: number, span: number): number {
  // A fixed arc-length gap turned into an angle, so every seam looks equal
  // whether it sits on the inner or the outer ring.
  return Math.min(
    ((WEDGE_GAP / Math.max(innerR, 1)) * 180) / Math.PI,
    span * 0.34,
  );
}

function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const span = endAngle - startAngle;
  const padDeg = wedgePadDeg(innerR, span);
  const a0 = toRad(startAngle + padDeg / 2);
  const a1 = toRad(endAngle - padDeg / 2);
  if (!(a1 > a0)) return "";

  const ri = innerR;
  const ro = outerR;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const P = (r: number, a: number) =>
    `${n3(cx + r * Math.cos(a))} ${n3(cy + r * Math.sin(a))}`;

  return [
    `M ${P(ri, a0)}`,
    `L ${P(ro, a0)}`,
    `A ${ro} ${ro} 0 ${large} 1 ${P(ro, a1)}`,
    `L ${P(ri, a1)}`,
    `A ${ri} ${ri} 0 ${large} 0 ${P(ri, a0)}`,
    "Z",
  ].join(" ");
}



function labelPos(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
) {
  const midAngle = (startAngle + endAngle) / 2;
  const midR = (innerR + outerR) / 2;
  return {
    x: n3(cx + midR * Math.cos(toRad(midAngle))),
    y: n3(cy + midR * Math.sin(toRad(midAngle))),
    angle: midAngle,
  };
}

interface Segment {
  node: FlavorNode;
  ring: number;
  /** Actual radii — a collapsed family spans the full disc, not just ring 1. */
  inner: number;
  outer: number;
  startAngle: number;
  endAngle: number;
  path: string;
  labelX: number;
  labelY: number;
  labelAngle: number;
  parentId: string | null;
}

function buildDynamicSegments(
  rootNodes: FlavorNode[],
  openIds: Set<string>,
): Segment[] {
  function measure(nodes: FlavorNode[]): number {
    return nodes.reduce((sum, n) => {
      if (n.children && openIds.has(n.id)) return sum + measure(n.children);
      return sum + 1;
    }, 0);
  }

  function pushSegment(
    segs: Segment[],
    node: FlavorNode,
    ring: number,
    startAngle: number,
    span: number,
    parentId: string | null,
  ) {
    const r = RINGS[ring];
    const lp = labelPos(CX, CY, r.inner, r.outer, startAngle, startAngle + span);
    segs.push({
      node,
      ring,
      inner: r.inner,
      outer: r.outer,
      startAngle,
      endAngle: startAngle + span,
      path: arcPath(CX, CY, r.inner, r.outer, startAngle, startAngle + span),
      labelX: lp.x,
      labelY: lp.y,
      labelAngle: lp.angle,
      parentId,
    });
  }

  // Rings 2+ subdivide the wedge handed down by their parent.
  function build(
    nodes: FlavorNode[],
    ring: number,
    startAngle: number,
    availableAngle: number,
    parentId: string | null,
    totalLeaves: number,
  ): Segment[] {
    if (ring >= RINGS.length) return [];
    const segs: Segment[] = [];
    nodes.forEach((node) => {
      const leaves =
        node.children && openIds.has(node.id) ? measure(node.children) : 1;
      const span = (leaves / totalLeaves) * availableAngle;
      pushSegment(segs, node, ring, startAngle, span, parentId);
      if (node.children && openIds.has(node.id)) {
        segs.push(
          ...build(node.children, ring + 1, startAngle, span, node.id, leaves),
        );
      }
      startAngle += span;
    });
    return segs;
  }

  // Each family's slice is proportional to what it holds, so expanding one
  // genuinely gives it more room — the look the wheel was designed around.
  const totalLeaves = measure(rootNodes);
  return build(rootNodes, 1, -90, 360, null, totalLeaves);
}

// ─── export capture helpers (stable — no component state dependency) ─────────

function captureFilter(node: Node): boolean {
  // Drop any <link> pointing to a cross-origin URL (browser extension stylesheets, etc.)
  if (
    node instanceof HTMLLinkElement &&
    node.href &&
    !node.href.startsWith(window.location.origin) &&
    !node.href.startsWith("data:")
  ) {
    return false;
  }
  // Drop <style> elements that contain external @import urls (Google Translate injection)
  if (
    node instanceof HTMLStyleElement &&
    /\@import\s+url\(['"]?https?:\/\//i.test(node.textContent ?? "")
  ) {
    return false;
  }
  return true;
}

/** The export sheet is 1000×1000 CSS px; at 2× that is a 2000×2000 PNG.
 *  Width and height are passed explicitly so the canvas never drifts with
 *  sub-pixel layout rounding. */
const EXPORT_SIZE = 1000;

/** The exported score is neutral so it sits with the cream and the wheel's own
 *  colours; on screen the number stays colour-coded by rating. */
const EXPORT_SCORE_COLOR = "#38332e";

const CAPTURE_OPTIONS = {
  pixelRatio: 2,
  width: EXPORT_SIZE,
  height: EXPORT_SIZE,
  backgroundColor: "#faf6f2",
  filter: captureFilter,
} as const;

// ─── drag / inertia state (outside component to avoid closure issues) ────────

interface DragState {
  active: boolean;
  lastAngle: number;
  velocity: number; // deg/ms
  lastTime: number;
  hasMoved: boolean;
}

function angleBetween(svgX: number, svgY: number): number {
  return Math.atan2(svgY - CY, svgX - CX) * (180 / Math.PI);
}

function shortestDelta(a: number, b: number): number {
  let d = a - b;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

// ─── label fitting ───────────────────────────────────────────────────────────
// Average glyph advance as a fraction of the font size, and line height.
const CHAR_W = 0.62;
const LINE_H = 1.12;

/** Split words into exactly `n` lines, balancing their length. */
function splitIntoLines(words: string[], n: number): string[] {
  if (n <= 1 || words.length === 1) return [words.join(" ")];
  const target = words.join(" ").length / n;
  const lines: string[] = [];
  let cur: string[] = [];
  for (const w of words) {
    const grown = [...cur, w].join(" ");
    if (cur.length > 0 && grown.length > target && lines.length < n - 1) {
      lines.push(cur.join(" "));
      cur = [w];
    } else {
      cur.push(w);
    }
  }
  lines.push(cur.join(" "));
  return lines;
}

interface LabelFit {
  lines: string[];
  fontSize: number;
  radial: boolean;
  /** Exact width the text is pinned to, in user units. */
  widthBudget: number;
}

// Keep text clear of the white dividers and the ring edges.
const PAD = 0.86;

/**
 * Picks the orientation and line count that render a label as large as it can
 * be *while staying inside its wedge*.
 *
 * The text is drawn straight, not curved, so the binding constraint is the
 * inner corners of the text box: at radius `r` a wedge of half-angle `a` is
 * only `2·r·tan(a)` wide, and the box's inner edge sits closest to the centre
 * where the wedge is narrowest. Sizing against the arc length instead (as a
 * naive fit does) lets wide wedges push text out past the radial edges.
 */
function fitLabel(
  label: string,
  midR: number,
  depth: number,
  halfAngle: number,
  maxFont: number,
  allowRadial: boolean,
): LabelFit {
  const words = label.split(/(?<=\/)|\s+/).filter(Boolean);
  const maxLines = Math.min(3, words.length);
  const tanHalf = Math.tan(Math.min(halfAngle, toRad(80)));

  let best: LabelFit | null = null;
  const consider = (lines: string[], radial: boolean) => {
    const longest = Math.max(...lines.map((l) => l.length));
    const runW = longest * CHAR_W; // text width per unit font size
    const stackH = lines.length * LINE_H; // text height per unit font size

    // Radial text reads outward (so it spends `runW` on depth and `stackH`
    // across the wedge); tangential text is the other way round.
    const onDepth = radial ? runW : stackH;
    const onWedge = radial ? stackH : runW;

    // Half-extents per unit of font size: `a` along the radius, `b` across it.
    const a = onDepth / 2;
    const b = onWedge / 2;

    // Limit 1: whatever lies along the radius must fit the ring depth.
    const byDepth = (depth * PAD) / onDepth;

    // Limit 2: the inner corners must stay inside the two radial edges.
    const byWedge = (midR * tanHalf * PAD) / (b + a * tanHalf * PAD);

    // Limit 3: the far corners must stay inside the ring's outer arc. Text is
    // drawn straight, so its ends sit further from the centre than its middle
    // — on a wide wedge a long label escapes over the top even though it has
    // angle to spare. Solving (midR + a·f)² + (b·f)² ≤ R² for f:
    const R = midR + depth / 2 - 0.5;
    const A = a * a + b * b;
    const disc = midR * midR * a * a - A * (midR * midR - R * R);
    const byOuter =
      A > 0 && disc > 0 ? (-midR * a + Math.sqrt(disc)) / A : Infinity;

    const fontSize = Math.min(maxFont, byDepth, byWedge, byOuter);
    if (!best || fontSize > best.fontSize) {
      const inset = (radial ? runW : stackH) * fontSize * 0.5;
      const w = radial
        ? depth * PAD
        : 2 * (midR - inset) * tanHalf * PAD;
      best = { lines, fontSize, radial, widthBudget: Math.max(w, 1) };
    }
  };

  for (let n = 1; n <= maxLines; n++) {
    const lines = splitIntoLines(words, n);
    if (lines.length !== n) continue;
    consider(lines, false);
    if (allowRadial) consider(lines, true);
  }

  // No minimum size: a floor would, by definition, push text past the wedge
  // that just said it does not fit. Labels shrink instead of breaking out, and
  // none is ever hidden.
  return best!;
}

// ─── session row ─────────────────────────────────────────────────────────────

/** One tasting in the sidebar. The descriptor count sits behind a divider so
 *  it can never be misread as part of the tasting's name. */
function SessionRow({
  label,
  count,
  active,
  shared = false,
  onOpen,
  onRename,
  onCopy,
  onDelete,
  copyTitle,
  renameTitle,
  deleteTitle,
}: {
  label: string;
  count: number;
  active: boolean;
  shared?: boolean;
  onOpen: () => void;
  onRename?: () => void;
  onCopy?: () => void;
  onDelete: () => void;
  copyTitle?: string;
  renameTitle?: string;
  deleteTitle: string;
}) {
  const iconBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "inherit",
    opacity: 0.55,
    padding: "3px 4px",
    lineHeight: 0,
  };
  return (
    <div
      className="flex items-center transition-all duration-150"
      style={{
        backgroundColor: active ? "#1a0a00" : "transparent",
        color: active ? "#faf6f2" : "#6b5744",
        border: `1.5px solid ${active ? "#1a0a00" : "#ead8c8"}`,
        borderRadius: 9,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <button
        onClick={onOpen}
        onDoubleClick={onRename}
        title={renameTitle}
        className="flex items-center gap-1.5 min-w-0 flex-1"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "inherit",
          padding: "5px 4px 5px 10px",
          textAlign: "left",
        }}
      >
        <span
          className="truncate"
          style={{ fontSize: 12, fontWeight: 600, flex: 1, minWidth: 0 }}
        >
          {label}
        </span>
        <span aria-hidden style={{ opacity: 0.35, fontSize: 11 }}>
          |
        </span>
        <span style={{ fontSize: 11.5, opacity: 0.7, fontVariantNumeric: "tabular-nums" }}>
          {count}
        </span>
      </button>
      {!shared && onCopy && (
        <button onClick={onCopy} title={copyTitle} aria-label={copyTitle} style={iconBtn}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        </button>
      )}
      <button
        onClick={onDelete}
        title={deleteTitle}
        aria-label={deleteTitle}
        style={{ ...iconBtn, padding: "3px 9px 3px 4px", fontSize: 10 }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── component config ────────────────────────────────────────────────────────

export interface WheelConfig {
  data?: typeof flavorWheelData;
  leafScores?: Record<string, number>;
  flavorNamesEs?: Record<string, string>;
  exportFilename?: string;
  active?: "sca" | "peru";
}

// ─── component ───────────────────────────────────────────────────────────────

export default function FlavorWheel({ config }: { config?: WheelConfig } = {}) {
  const wheelData = config?.data ?? flavorWheelData;
  const scores = config?.leafScores ?? LEAF_SCORES;
  const namesEs = config?.flavorNamesEs ?? FLAVOR_NAMES_ES;
  const exportFilename = config?.exportFilename ?? "perfil-cafe.png";
  const activeWheel = config?.active ?? "sca";
  const ui = useTranslations("ui");
  const tFlavors = useTranslations("flavors");
  const tFlavorNames = useTranslations("flavorNames");
  const tDescribe = useTranslations("describe");

  // Wheel segment label; falls back to the Spanish label in the wheel data
  // (correct for Peruvian proper nouns that don't translate).
  const labelFor = (id: string, fallback: string) =>
    tFlavors.has(id) ? tFlavors(id) : fallback;

  // Prose name used in tasting tags and the description. Spanish keeps a
  // separate lowercase form; other locales reuse the wheel label.
  const nameFor = (id: string) => {
    if (tFlavorNames.has(id)) return tFlavorNames(id);
    return labelFor(id, namesEs[id] ?? findLabel(wheelData, id));
  };

  // The whole wheel is expanded on load; tapping a branch collapses it.
  const [openIds, setOpenIds] = useState<Set<string>>(() =>
    collectParentIds(wheelData),
  );
  // ── Evaluation sessions ──
  // Two shelves: the taster's own records, and read-only ones imported from
  // somebody else's code. Two each, kept apart so they're never confused.
  const [own, setOwn] = useState<Session[]>([]);
  const [shared, setShared] = useState<Session[]>([]);
  const [active, setActive] = useState<{ shelf: "own" | "shared"; id: string } | null>(
    null,
  );
  const [renamingId, setRenamingId] = useState<string | null>(null);
  // The export sheet is a second copy of the wheel, so it is mounted only for
  // the snapshot — otherwise every hover would re-render it too.
  const [exporting, setExporting] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Below lg the header would be crowded, so everything but the search folds
  // into this menu.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [codeInput, setCodeInput] = useState("");
  const [notice, setNotice] = useState<"copied" | "invalid" | null>(null);
  const activeRef = useRef<{ shelf: "own" | "shared"; id: string } | null>(null);
  const hydrated = useRef(false);

  const shelfOf = (k: "own" | "shared") => (k === "own" ? own : shared);
  const activeSession =
    (active && shelfOf(active.shelf).find((s) => s.id === active.id)) ??
    own[0] ??
    null;
  const activeIsShared = active?.shelf === "shared" && activeSession !== null;

  const selected = useMemo(
    () => new Set(activeSession?.selected ?? []),
    [activeSession],
  );

  // Every id a tasting may legitimately contain — used to vet pasted codes.
  const validIds = useMemo(() => {
    const ids = new Set<string>();
    const walk = (nodes: FlavorNode[]) => {
      for (const n of nodes) {
        if (n.children?.length) walk(n.children);
        else ids.add(n.id);
      }
    };
    walk(wheelData);
    return ids;
  }, [wheelData]);

  // Once a tasting has picks, the wheel shows them: the chosen descriptors and
  // the families leading to them stay lit while the rest recedes — the same
  // idea as the hover focus, held in place. It reads the tasting at a glance,
  // on screen and in the exported picture alike.
  const litPath = useMemo(() => {
    if (selected.size === 0) return null;
    const keep = new Set<string>();
    const walk = (nodes: FlavorNode[]): boolean => {
      let any = false;
      for (const n of nodes) {
        const hit = n.children?.length ? walk(n.children) : selected.has(n.id);
        if (hit) {
          keep.add(n.id);
          any = true;
        }
      }
      return any;
    };
    walk(wheelData);
    return keep;
  }, [selected, wheelData]);

  // Flat index of every selectable descriptor, with the trail that leads to it.
  const searchItems = useMemo<SearchItem[]>(() => {
    const out: SearchItem[] = [];
    const walk = (nodes: FlavorNode[], trail: string[]) => {
      for (const n of nodes) {
        const name = tFlavors.has(n.id) ? tFlavors(n.id) : n.label;
        if (n.children?.length) walk(n.children, [...trail, name]);
        else out.push({ id: n.id, label: name, trail: trail.join(" › ") });
      }
    };
    walk(wheelData, []);
    return out;
  }, [wheelData, tFlavors]);

  // Imported tastings belong to whoever made them, so they never change here.
  const setSelected = useCallback(
    (update: (prev: Set<string>) => Set<string>) => {
      const ref = activeRef.current;
      if (ref?.shelf === "shared") return;
      setOwn((prev) => {
        const id = ref?.id ?? prev[0]?.id;
        if (!id) return prev;
        return prev.map((s) =>
          s.id === id
            ? { ...s, selected: Array.from(update(new Set(s.selected))) }
            : s,
        );
      });
    },
    [],
  );

  const [hovered, setHovered] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const drag = useRef<DragState | null>(null);
  // Pointers currently down — a second finger means the user is pinch-zooming,
  // so rotation must stand down and let the browser handle the gesture.
  const activePointers = useRef<Set<number>>(new Set());
  const animFrame = useRef<number | null>(null);
  const nodeMap = useRef<Map<string, FlavorNode>>(new Map());
  const captureRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  // Load both shelves once on the client (localStorage has no server half).
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const read = (shelf: "own" | "shared") => {
      try {
        return parseStored(
          localStorage.getItem(storageKey(activeWheel, shelf)),
          validIds,
        );
      } catch {
        return null;
      }
    };

    const mine = read("own") ?? [createSession("")];
    setOwn(mine.slice(0, MAX_SESSIONS));
    setShared((read("shared") ?? []).slice(0, MAX_SESSIONS));
    setActive({ shelf: "own", id: mine[0].id });
  }, [validIds, activeWheel]);

  // Keep the browser copy in step with what's on screen.
  useEffect(() => {
    if (!hydrated.current) return;
    const save = (shelf: "own" | "shared", list: Session[]) => {
      try {
        localStorage.setItem(storageKey(activeWheel, shelf), JSON.stringify(list));
      } catch {
        // private mode / storage disabled — the wheel still works
      }
    };
    if (own.length > 0) save("own", own);
    save("shared", shared);
  }, [own, shared, activeWheel]);

  /** Opens the branch holding a descriptor and adds it to the tasting. */
  const pickFromSearch = (id: string) => {
    const path: string[] = [];
    const find = (nodes: FlavorNode[], trail: string[]): boolean => {
      for (const n of nodes) {
        if (n.id === id) {
          path.push(...trail);
          return true;
        }
        if (n.children && find(n.children, [...trail, n.id])) return true;
      }
      return false;
    };
    find(wheelData, []);
    // Reveal it on the wheel, then select it.
    setOpenIds((prev) => new Set([...prev, ...path]));
    setSelected((prev) => new Set(prev).add(id));
  };

  const flash = (kind: "copied" | "invalid") => {
    setNotice(kind);
    window.setTimeout(() => setNotice(null), 2200);
  };

  useEffect(() => {
    if (!menuOpen) return;
    // The sheet covers the screen, so there is no outside to click: Escape and
    // the close button are the ways out.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // ⌘K / Ctrl+K opens the search, the way a launcher does.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addSession = () => {
    if (own.length >= MAX_SESSIONS) return;
    const next = createSession("");
    setOwn((prev) => [...prev, next]);
    setActive({ shelf: "own", id: next.id });
  };

  const removeSession = (shelf: "own" | "shared", id: string) => {
    // Computed outside the updater: setState inside a reducer would fire twice
    // under StrictMode's double invocation.
    if (shelf === "own") {
      const rest = own.filter((s) => s.id !== id);
      const list = rest.length > 0 ? rest : [createSession("")];
      setOwn(list);
      if (active?.id === id) setActive({ shelf: "own", id: list[0].id });
    } else {
      const rest = shared.filter((s) => s.id !== id);
      setShared(rest);
      if (active?.id === id) {
        setActive(
          rest.length > 0
            ? { shelf: "shared", id: rest[0].id }
            : own[0]
              ? { shelf: "own", id: own[0].id }
              : null,
        );
      }
    }
  };

  const renameSession = (id: string, name: string) => {
    setOwn((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, name: name.slice(0, MAX_NAME_LENGTH) } : s,
      ),
    );
  };

  const copyCode = async (session: Session) => {
    const code = encodeSession(session);
    try {
      await navigator.clipboard.writeText(code);
      flash("copied");
    } catch {
      // Clipboard needs a secure context; drop it in the box so it can be
      // selected and copied by hand.
      setCodeInput(code);
      flash("copied");
    }
  };

  const importCode = () => {
    if (shared.length >= MAX_SESSIONS) return;
    const parsed = decodeSession(codeInput, validIds);
    if (!parsed) {
      flash("invalid");
      return;
    }
    setShared((prev) => [...prev, parsed].slice(0, MAX_SESSIONS));
    setActive({ shelf: "shared", id: parsed.id });
    setCodeInput("");
  };

  /** Mounts the export sheet, waits for it to lay out, then runs `shoot`. */
  const withExportSheet = async (shoot: (node: HTMLDivElement) => Promise<void>) => {
    setExporting(true);
    // Two frames: one for React to commit, one for the browser to lay out.
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r(null))),
    );
    try {
      if (captureRef.current) await shoot(captureRef.current);
    } finally {
      setExporting(false);
    }
  };

  const exportPng = () =>
    withExportSheet(async (node) => {
      const dataUrl = await toPng(node, CAPTURE_OPTIONS);
      const link = document.createElement("a");
      link.download = exportFilename;
      link.href = dataUrl;
      link.click();
    });

  const exportPdf = () =>
    withExportSheet(async (node) => {
    const dataUrl = await toPng(node, CAPTURE_OPTIONS);
    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });
    const pdf = new jsPDF({
      orientation: img.width > img.height ? "landscape" : "portrait",
      unit: "px",
      format: [img.width, img.height],
    });
    pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
    pdf.save(exportFilename.replace(".png", ".pdf"));
    });

  function getSvgCoords(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      svgX: (e.clientX - rect.left) * (SVG_SIZE / rect.width),
      svgY: (e.clientY - rect.top) * (SVG_SIZE / rect.height),
    };
  }

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    activePointers.current.add(e.pointerId);
    if (activePointers.current.size > 1) {
      // Pinch-to-zoom in progress — abandon any rotation drag.
      drag.current = null;
      setIsDragging(false);
      return;
    }
    const { svgX, svgY } = getSvgCoords(e);
    const dist = Math.hypot(svgX - CX, svgY - CY);
    if (dist < RINGS[0].outer) return; // center: ignore

    if (animFrame.current !== null) {
      cancelAnimationFrame(animFrame.current);
      animFrame.current = null;
    }
    const angle = angleBetween(svgX, svgY);
    drag.current = {
      active: true,
      lastAngle: angle,
      velocity: 0,
      lastTime: performance.now(),
      hasMoved: false,
    };
    setIsDragging(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (activePointers.current.size > 1) return; // pinch-zooming
    const d = drag.current;
    if (!d?.active) return;
    const { svgX, svgY } = getSvgCoords(e);
    const angle = angleBetween(svgX, svgY);
    const now = performance.now();
    const dt = now - d.lastTime;
    const delta = shortestDelta(angle, d.lastAngle);
    if (Math.abs(delta) > 1) d.hasMoved = true;
    if (dt > 0) d.velocity = delta / dt;
    d.lastAngle = angle;
    d.lastTime = now;
    setRotation((prev) => prev + delta);
  }, []);

  const toggleNode = useCallback(
    (node: FlavorNode) => {
      if (!node.children) {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(node.id)) next.delete(node.id);
          else next.add(node.id);
          return next;
        });
        return;
      }
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          collectIds(node).forEach((id) => next.delete(id));
          return next;
        }
        next.add(node.id);
        return next;
      });
    },
    [setSelected],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      activePointers.current.delete(e.pointerId);
      const d = drag.current;
      if (!d) return;
      d.active = false;
      drag.current = null;
      setIsDragging(false);

      if (!d.hasMoved) {
        // Treat as a tap: resolve the segment from the pointer target
        const target = e.target as SVGElement;
        const nodeId = target.dataset?.nodeId;
        if (nodeId) {
          const node = nodeMap.current.get(nodeId);
          if (node) toggleNode(node);
        }
        return;
      }

      // Inertia: exponential decay
      let vel = d.velocity;
      const tick = () => {
        vel *= 0.9;
        if (Math.abs(vel) < 0.002) {
          animFrame.current = null;
          return;
        }
        setRotation((prev) => prev + vel * 16);
        animFrame.current = requestAnimationFrame(tick);
      };
      animFrame.current = requestAnimationFrame(tick);
    },
    [toggleNode],
  );

  const segments = buildDynamicSegments(wheelData, openIds);
  const score = computeScore(selected, wheelData, scores);
  const description =
    score !== null
      ? buildDescription(
          selected,
          score,
          wheelData,
          scores,
          tDescribe,
          (id) => `[[${nameFor(id)}]]`,
        )
      : "";

  // eslint-disable-next-line react-hooks/refs
  activeRef.current = activeSession
    ? { shelf: activeIsShared ? "shared" : "own", id: activeSession.id }
    : null;
  // Keep nodeMap in sync so onPointerUp can resolve taps
  // eslint-disable-next-line react-hooks/refs
  nodeMap.current.clear();
  // eslint-disable-next-line react-hooks/refs
  segments.forEach((seg) => nodeMap.current.set(seg.node.id, seg.node));

  // Same fill the path uses, so labels can pick a contrasting colour.
  const fillFor = (node: FlavorNode) => {
    if (selected.has(node.id)) return "#E8914A";
    if (hovered === node.id) return lighten(node.color);
    if (openIds.has(node.id)) return darken(node.color);
    return node.color;
  };

  const renderWheel = (uid: string) => (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      // sizing lives in globals.css so the mobile window can scale it up
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "pinch-zoom",
        userSelect: "none",
      }}
    >
      <defs>
        <clipPath id={`${uid}-hub-clip`}>
          <circle cx={CX} cy={CY} r={CENTER_R - 2} />
        </clipPath>
        {/* A light sheen from the top-left gives the disc some volume. */}
        <radialGradient id={`${uid}-sheen`} cx="34%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#1a0a00" stopOpacity="0.10" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#1a0a00" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#1a0a00" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={`rotate(${rotation}, ${CX}, ${CY})`}>
        {segments.map((seg, i) => {
          const fillColor = fillFor(seg.node);
          const isHovered = hovered === seg.node.id;
          const unpicked = litPath !== null && !litPath.has(seg.node.id);
          const isSelected = selected.has(seg.node.id);
          // Hovered wedges ease outward along their own bisector.
          const mid = toRad((seg.startAngle + seg.endAngle) / 2);
          const lift = isHovered ? 10 : 0;
          return (
            <path
              key={seg.node.id}
              className="wedge"
              d={seg.path}
              fill={fillColor}
              stroke={isSelected ? "#fffdfb" : "rgba(255,255,255,0.85)"}
              strokeWidth={isSelected ? 2.5 : 1}
              strokeLinejoin="miter"
              data-node-id={seg.node.id}
              style={{
                cursor: isDragging ? "grabbing" : "pointer",
                // Everything but the focused wedge recedes a little.
                opacity: isHovered
                  ? 1
                  : unpicked
                    ? 0.45
                    : hovered
                      ? 0.62
                      : 1,
                transform: `translate(${n3(lift * Math.cos(mid))}px, ${n3(
                  lift * Math.sin(mid),
                )}px)`,
                // Stagger the bloom by ring, then by position around the disc.
                animationDelay: `${Math.min(seg.ring * 60 + i * 9, 520)}ms`,
              }}
              onMouseEnter={() => !isDragging && setHovered(seg.node.id)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </g>

      {segments.map((seg, i) => {
        const arcSpan = seg.endAngle - seg.startAngle;
        const midR = (seg.inner + seg.outer) / 2;
        const ringDepth = seg.outer - seg.inner;
        const maxFontSize = seg.ring === 1 ? 26 : seg.ring === 2 ? 16 : 13;

        const label = labelFor(seg.node.id, seg.node.label);
        // Light segments (yellows, pale greens) need near-black text.
        const textColor = readableOn(fillFor(seg.node));

        // An open second-ring option keeps its label tangential ("echado"),
        // never radial ("parado"), so it reads along the widened arc.
        const isOpenSecondScale = seg.ring === 2 && openIds.has(seg.node.id);
        const allowRadial = seg.ring >= 2 && !isOpenSecondScale;

        const {
          lines,
          fontSize,
          radial: useRadial,
          widthBudget,
        } = fitLabel(
          label,
          midR,
          ringDepth,
          // The painted wedge is narrower than the raw slice by the seam on
          // each side; fitting to the raw angle let labels overhang the colour.
          toRad(Math.max(arcSpan - wedgePadDeg(seg.inner, arcSpan), 0.01) / 2),
          maxFontSize,
          allowRadial,
        );

        // ── World-space position ──────────────────────────────────────────
        const θ = toRad(rotation);
        const dx = seg.labelX - CX;
        const dy = seg.labelY - CY;
        const wx = n3(CX + dx * Math.cos(θ) - dy * Math.sin(θ));
        const wy = n3(CY + dx * Math.sin(θ) + dy * Math.cos(θ));

        // ── Text rotation ─────────────────────────────────────────────────
        const labelAngleInWorld = seg.labelAngle + rotation;
        let textAngle: number;
        if (useRadial) {
          // Radial: text runs from center outward along the radius.
          // Normalize to [0, 360) then flip left-half labels so they stay readable.
          const norm = ((labelAngleInWorld % 360) + 360) % 360;
          textAngle = norm > 90 && norm < 270 ? norm + 180 : norm;
        } else {
          // Tangential: the baseline is perpendicular to the radius, so the
          // text lies along the arc. (θ + 180 — the previous value — is still
          // the radial direction, which silently drew every "tangential" label
          // radially and let long ones run out through the ring.)
          const norm = (((labelAngleInWorld + 90) % 360) + 360) % 360;
          textAngle = norm > 90 && norm < 270 ? norm + 180 : norm;
        }

        // Ride the same outward lift as the wedge beneath.
        const liftLabel = hovered === seg.node.id ? 10 : 0;
        const lRad = toRad(labelAngleInWorld);

        return (
          <g
            key={`lbl-${seg.node.id}`}
            className="wedge-label"
            pointerEvents="none"
            style={{
              opacity:
                hovered === seg.node.id
                  ? 1
                  : litPath !== null && !litPath.has(seg.node.id)
                    ? 0.4
                    : hovered
                      ? 0.55
                      : 1,
              transform: `translate(${n3(liftLabel * Math.cos(lRad))}px, ${n3(
                liftLabel * Math.sin(lRad),
              )}px)`,
              animationDelay: `${Math.min(seg.ring * 60 + i * 9 + 120, 640)}ms`,
            }}
          >
          <text
            x={wx}
            y={wy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={n3(fontSize)}
            fontFamily="Montserrat, sans-serif"
            fontWeight="700"
            fill={textColor}
            stroke={
              textColor === LABEL_LIGHT
                ? "rgba(0,0,0,0.28)"
                : "rgba(255,255,255,0.45)"
            }
            strokeWidth={Math.max(0.6, fontSize * 0.07)}
            paintOrder="stroke"
            pointerEvents="none"
            transform={`rotate(${n3(textAngle)}, ${wx}, ${wy})`}
            style={{ userSelect: "none" }}
          >
            {lines.map((line, li) => {
              // The width is always pinned, so what lands on screen is the
              // width the wedge maths proved fits — never whatever the real
              // glyph advances happen to add up to.
              const width = Math.min(
                line.length * CHAR_W * fontSize,
                widthBudget,
              );
              return (
                <tspan
                  key={li}
                  x={wx}
                  dy={n3(
                    li === 0
                      ? -((lines.length - 1) / 2) * fontSize * LINE_H
                      : fontSize * LINE_H,
                  )}
                  textLength={n3(width)}
                  lengthAdjust="spacingAndGlyphs"
                >
                  {line}
                </tspan>
              );
            })}
          </text>
          </g>
        );
      })}

      {/* Sheen over the disc for a little volume — never intercepts taps. */}
      <circle
        cx={CX}
        cy={CY}
        r={RINGS[RINGS.length - 1].outer}
        fill={`url(#${uid}-sheen)`}
        pointerEvents="none"
      />

      {/* Centre hub, drawn last so its soft shadow falls on the wedges. */}
      <g className="center-logo-group" pointerEvents="none">
        <circle cx={CX} cy={CY} r={CENTER_R + 14} fill={`url(#${uid}-glow)`} />
        <circle cx={CX} cy={CY} r={CENTER_R} fill="#fffdfb" />
        <circle
          cx={CX}
          cy={CY}
          r={CENTER_R - 1}
          fill="none"
          stroke="#ead8c8"
          strokeWidth={1.5}
        />
        <image
          href="/grainngrains.svg"
          x={CX - (CENTER_R - 16)}
          y={CY - (CENTER_R - 16)}
          width={(CENTER_R - 16) * 2}
          height={(CENTER_R - 16) * 2}
          preserveAspectRatio="xMidYMid meet"
          clipPath={`url(#${uid}-hub-clip)`}
        />
      </g>
    </svg>
  );

  const exportButton = (
    <button
              onClick={exportPng}
              title={ui("exportTitle")}
              className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: "transparent",
                color: INK,
                border: `1.5px solid ${LINE}`,
                borderRadius: 999,
                padding: "8px 18px",
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = INK;
                e.currentTarget.style.color = ON_INK;
                e.currentTarget.style.borderColor = INK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = INK;
                e.currentTarget.style.borderColor = LINE;
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{ui("exportLabel")}</span>
            </button>
  );

  return (
    <div
      ref={outerRef}
      className="flex flex-col w-full md:max-w-7xl md:mx-auto"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* ── Header — excluded from export ── */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 pt-5 pb-4">
        <GrainngrainsLogo tagline={ui("tagline")} href="/" />

        {/* Wheel tabs sit in the header on large screens; below lg they move
            into the menu so the bar stays uncluttered. */}
        <div className="hidden lg:flex lg:justify-center">
          <WheelNav active={activeWheel} />
        </div>

        <div className="flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          title={ui("search")}
          aria-label={ui("search")}
          className="flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: "transparent",
            color: INK,
            border: `1.5px solid ${LINE}`,
            borderRadius: 999,
            width: 38,
            height: 38,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = INK;
            e.currentTarget.style.color = ON_INK;
            e.currentTarget.style.borderColor = INK;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = INK;
            e.currentTarget.style.borderColor = LINE;
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        </button>

        {/* Large screens: everything laid out. */}
        <div className="hidden lg:flex items-center gap-2">
          {exportButton}
          <LanguageSwitcher />
        </div>

        {/* Below lg: one button that opens a full-height side drawer. */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            title={ui("menu")}
            aria-label={ui("menu")}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: menuOpen ? INK : "transparent",
              color: menuOpen ? ON_INK : INK,
              border: `1.5px solid ${menuOpen ? INK : LINE}`,
              borderRadius: 999,
              width: 38,
              height: 38,
              cursor: "pointer",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <line x1="3.5" y1="7" x2="20.5" y2="7" />
              <line x1="3.5" y1="12" x2="20.5" y2="12" />
              <line x1="3.5" y1="17" x2="20.5" y2="17" />
            </svg>
          </button>
        </div>
        </div>
      </div>

      <div className="flex flex-col w-full" style={{ background: "#faf6f2" }}>
        {/* Two-column row: wheel left / results right on md+, stacked on mobile */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-6 w-full">
          {/* ── Wheel — full and centred at every breakpoint ── */}
          <div className="md:flex-1 md:min-w-0">
            <div className="flavor-wheel">
              <div className="flavor-wheel-stage">{renderWheel("live")}</div>
            </div>
          </div>

          {/* ── Results — below wheel on mobile, right on desktop ── */}
          <div className="md:w-72 xl:w-80 flex flex-col gap-3 px-3 sm:px-4 md:px-0 md:pr-6 pt-4 md:pt-6 pb-2 md:pb-6">
            {own.length > 0 && (
              <>
                {/* Only the name survives into the exported PNG */}
                <p
                  className="session-export-title"
                  style={{ fontSize: 15, fontWeight: 700, color: "#1a0a00", margin: 0 }}
                >
                  {activeSession?.name?.trim() ||
                    ui("sessionDefault", {
                      n: String(
                        Math.max(
                          own.findIndex((x) => x.id === activeSession?.id),
                          shared.findIndex((x) => x.id === activeSession?.id),
                        ) + 1,
                      ),
                    })}
                </p>

                <div className="session-bar flex flex-col gap-2.5">
                  {/* ── The taster's own records ── */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className="uppercase tracking-widest"
                        style={{ fontSize: 9.5, fontWeight: 700, color: "#b0a090" }}
                      >
                        {ui("mySessions")}
                      </span>
                      {own.length < MAX_SESSIONS && (
                        <button
                          onClick={addSession}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#8a7360",
                            fontFamily: "Montserrat, sans-serif",
                            whiteSpace: "nowrap",
                          }}
                        >
                          + {ui("newSession")}
                        </button>
                      )}
                    </div>
                    {own.map((s, idx) =>
                      renamingId === s.id ? (
                        <input
                          key={s.id}
                          autoFocus
                          defaultValue={s.name}
                          maxLength={MAX_NAME_LENGTH}
                          placeholder={ui("sessionDefault", { n: String(idx + 1) })}
                          onBlur={(e) => {
                            renameSession(s.id, e.target.value);
                            setRenamingId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          style={{
                            border: "1.5px solid #1a0a00",
                            borderRadius: 9,
                            padding: "5px 10px",
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: "Montserrat, sans-serif",
                            outline: "none",
                          }}
                        />
                      ) : (
                        <SessionRow
                          key={s.id}
                          label={
                            s.name.trim() ||
                            ui("sessionDefault", { n: String(idx + 1) })
                          }
                          count={s.selected.length}
                          active={activeSession?.id === s.id}
                          onOpen={() => setActive({ shelf: "own", id: s.id })}
                          onRename={() => setRenamingId(s.id)}
                          onCopy={() => copyCode(s)}
                          onDelete={() => removeSession("own", s.id)}
                          copyTitle={ui("copyCode")}
                          renameTitle={ui("renameSession")}
                          deleteTitle={ui("deleteSession")}
                        />
                      ),
                    )}
                  </div>

                  {/* ── Tastings imported from someone else's code ── */}
                  <div
                    className="flex flex-col gap-1"
                    style={{ borderTop: "1px solid #ead8c8", paddingTop: 9 }}
                  >
                    <span
                      className="uppercase tracking-widest"
                      style={{ fontSize: 9.5, fontWeight: 700, color: "#b0a090" }}
                    >
                      {ui("sharedSessions")}
                      <span style={{ textTransform: "none", opacity: 0.7 }}>
                        &nbsp;·&nbsp;{ui("readOnly")}
                      </span>
                    </span>

                    {shared.map((s, idx) => (
                      <SessionRow
                        key={s.id}
                        label={
                          s.name.trim() ||
                          ui("sessionDefault", { n: String(idx + 1) })
                        }
                        count={s.selected.length}
                        active={activeSession?.id === s.id}
                        shared
                        onOpen={() => setActive({ shelf: "shared", id: s.id })}
                        onDelete={() => removeSession("shared", s.id)}
                        deleteTitle={ui("deleteSession")}
                      />
                    ))}

                    {shared.length < MAX_SESSIONS && (
                      <div className="flex gap-1">
                        <input
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") importCode();
                          }}
                          placeholder={ui("pasteCode")}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            border: `1.5px solid ${notice === "invalid" ? "#C62828" : "#e0cdbb"}`,
                            borderRadius: 9,
                            padding: "5px 10px",
                            fontSize: 11.5,
                            fontFamily: "Montserrat, sans-serif",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={importCode}
                          disabled={codeInput.trim() === ""}
                          style={{
                            backgroundColor: codeInput.trim() ? "#1a0a00" : "transparent",
                            color: codeInput.trim() ? "#faf6f2" : "#c4b4a4",
                            border: `1.5px solid ${codeInput.trim() ? "#1a0a00" : "#e0cdbb"}`,
                            borderRadius: 9,
                            padding: "5px 11px",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: codeInput.trim() ? "pointer" : "default",
                            fontFamily: "Montserrat, sans-serif",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ui("importCode")}
                        </button>
                      </div>
                    )}

                    {notice && (
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: notice === "copied" ? "#2E7D32" : "#C62828",
                        }}
                      >
                        {notice === "copied" ? ui("codeCopied") : ui("invalidCode")}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {selected.size === 0 ? (
              <p
                className="text-center md:text-left mt-1"
                style={{ fontSize: 13, color: "#b0a090", lineHeight: 1.7 }}
              >
                {ui("promptExplore")}
                <br />
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  {ui("promptDrag")}
                </span>
              </p>
            ) : (
              <>
                {/* Tags */}
                <div>
                  <p
                    className="uppercase tracking-widest mb-2"
                    style={{ fontSize: 10, fontWeight: 700, color: "#b0a090" }}
                  >
                    {ui("tastingNotes")} &nbsp;·&nbsp; {selected.size}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(selected).map((id) => {
                      const displayName = nameFor(id);
                      return (
                        <button
                          key={id}
                          onClick={() =>
                            setSelected((prev) => {
                              const next = new Set(prev);
                              next.delete(id);
                              return next;
                            })
                          }
                          disabled={activeIsShared}
                          className="flex items-center gap-1.5 transition-all duration-150"
                          style={{
                            backgroundColor: "#1a0a00",
                            color: "#faf6f2",
                            border: "none",
                            borderRadius: 999,
                            padding: "5px 12px 5px 14px",
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: "Montserrat, sans-serif",
                            cursor: activeIsShared ? "default" : "pointer",
                            letterSpacing: "0.01em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#3d1f0d")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1a0a00")
                          }
                        >
                          {displayName}
                          {!activeIsShared && (
                            <span
                              style={{
                                fontSize: 9,
                                opacity: 0.45,
                                lineHeight: 1,
                                marginLeft: 2,
                              }}
                            >
                              ✕
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Score panel */}
                {score !== null && (
                  <div className="w-full  overflow-hidden">
                    <div />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline gap-1">
                          <span
                            style={{
                              fontSize: 52,
                              fontWeight: 800,
                              lineHeight: 1,
                              color: scoreColor(score),
                              letterSpacing: "-0.03em",
                            }}
                          >
                            {score}
                          </span>
                          <span style={{ fontSize: 13, color: "#b0a090" }}>
                            /100
                          </span>
                        </div>
                        <span
                          style={{
                            backgroundColor: scoreColor(score) + "1a",
                            color: scoreColor(score),
                            border: `1.5px solid ${scoreColor(score)}40`,
                            borderRadius: 999,
                            padding: "4px 12px",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          {scoreLabel(score, ui)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 1,
                          background: "#ead8c8",
                          marginBottom: 12,
                        }}
                      />
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          lineHeight: 1.8,
                          color: "#4a3728",
                        }}
                      >
                        {renderDescription(description)}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* end two-column row */}

        {/* Footer — full width below both columns */}
        <p
          className="text-center w-full py-4 px-4"
          style={{ fontSize: 11, color: "#c4b4a4", letterSpacing: "0.04em" }}
        >
          {ui("footer")}
        </p>
      </div>

      {/* ── Export sheet ───────────────────────────────────────────────────
          A fixed-width layout of its own, kept off-screen. The picture must
          not depend on the viewport, so phones and desktops export the very
          same sheet — never a snapshot of the responsive page. */}
      {menuOpen && (
        <div className="drawer-backdrop lg:hidden">
          <aside className="drawer" role="menu" aria-label={ui("menu")} ref={menuRef}>
            <div className="drawer-head">
              <span className="drawer-title">{ui("menu")}</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label={ui("menu")}
                className="drawer-close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-field">
                <span className="drawer-label">{ui("wheel")}</span>
                <WheelSelect active={activeWheel} inline />
              </div>

              <div className="drawer-field">
                <span className="drawer-label">{ui("language")}</span>
                <LanguageSwitcher inline />
              </div>

              <div className="drawer-field">{exportButton}</div>
            </div>
          </aside>
        </div>
      )}

      {searchOpen && (
      <FlavorSearch
        onClose={() => setSearchOpen(false)}
        items={searchItems}
        onPick={pickFromSearch}
        picked={selected}
      />
      )}

      {exporting && (
      <div aria-hidden="true" className="export-sheet-holder">
        <div ref={captureRef} className="export-sheet">
          {/* Brand centred, score pinned to the top-right corner. */}
          <div className="export-brand">
            <GrainngrainsLogo tagline={ui("exportTagline")} href="/" />
          </div>

          {score !== null && (
            <div className="export-score">
              <div className="export-score-value">
                <span style={{ color: EXPORT_SCORE_COLOR }}>{score}</span>
                <span className="export-score-max">/100</span>
              </div>
              <span
                className="export-score-tag"
                style={{
                  backgroundColor: scoreColor(score) + "1a",
                  color: scoreColor(score),
                  border: `1.5px solid ${scoreColor(score)}40`,
                }}
              >
                {scoreLabel(score, ui)}
              </span>
            </div>
          )}

          <div className="export-wheel">{renderWheel("export")}</div>

          {selected.size > 0 && (
            <div className="export-panel">
              <div className="export-notes">
                  <p className="export-session">
                    {activeSession?.name?.trim() ||
                      ui("sessionDefault", { n: "1" })}
                  </p>
                  <p className="export-kicker">
                    {ui("tastingNotes")} &nbsp;·&nbsp; {selected.size}
                  </p>
                  <div className="export-tags">
                    {Array.from(selected).map((id) => (
                      <span key={id} className="export-tag">
                        {nameFor(id)}
                      </span>
                    ))}
                  </div>
              </div>

              {description && (
                <p className="export-description">
                  {renderDescription(description)}
                </p>
              )}
            </div>
          )}

          <p className="export-footer">{ui("footer")}</p>
        </div>
      </div>
      )}
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Ids of every node that can be expanded (i.e. has children). */
function collectParentIds(nodes: FlavorNode[], acc: Set<string> = new Set()) {
  for (const n of nodes) {
    if (n.children?.length) {
      acc.add(n.id);
      collectParentIds(n.children, acc);
    }
  }
  return acc;
}

function collectIds(node: FlavorNode): string[] {
  const ids = [node.id];
  if (node.children) node.children.forEach((c) => ids.push(...collectIds(c)));
  return ids;
}

function findLabel(nodes: FlavorNode[], id: string): string {
  for (const n of nodes) {
    if (n.id === id) return n.label;
    if (n.children) {
      const found = findLabel(n.children, id);
      if (found) return found;
    }
  }
  return id;
}

function lighten(hex: string): string {
  return blendHex(hex, "#ffffff", 0.25);
}

function darken(hex: string): string {
  return blendHex(hex, "#000000", 0.15);
}

// WCAG relative luminance, used to decide whether a label reads better in
// cream or near-black against its segment colour.
function luminance(hex: string): number {
  const ch = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(1) + 0.7152 * ch(3) + 0.0722 * ch(5);
}

const LABEL_LIGHT = "#ffffff";
const LABEL_DARK = "#1a0a00";

/**
 * Label colour for a segment. Cream is kept on saturated mid-tones (the reds
 * and greens, where it reads fine and matches the brand), and swapped for
 * near-black once contrast drops — the pale yellows and greens where white
 * all but disappears.
 */
function readableOn(bg: string): string {
  const ratio = (a: number, b: number) =>
    (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const l = luminance(bg);
  const onLight = ratio(l, luminance(LABEL_LIGHT));
  return onLight >= 4 || onLight >= ratio(l, luminance(LABEL_DARK))
    ? LABEL_LIGHT
    : LABEL_DARK;
}

function blendHex(hex: string, blendWith: string, amount: number): string {
  const parse = (h: string) => ({
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  });
  const a = parse(hex);
  const b = parse(blendWith);
  const r = Math.round(a.r + (b.r - a.r) * amount);
  const g = Math.round(a.g + (b.g - a.g) * amount);
  const bl = Math.round(a.b + (b.b - a.b) * amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

// ─── scoring helpers ──────────────────────────────────────────────────────────

function computeScore(
  selected: Set<string>,
  data: FlavorNode[],
  leafScores: Record<string, number>,
): number | null {
  if (selected.size === 0) return null;
  let raw = 72;
  const cats = new Set<string>();
  for (const id of selected) {
    raw += leafScores[id] ?? 0;
    const cat = findMainCat(id, data);
    if (cat) cats.add(cat);
  }
  raw += cats.size * 2;
  return Math.min(100, Math.max(55, Math.round(raw * 2) / 2));
}

function scoreLabel(s: number, ui: (key: string) => string): string {
  if (s >= 90) return ui("scoreExceptional");
  if (s >= 85) return ui("scoreExcellent");
  if (s >= 80) return ui("scoreVeryGood");
  if (s >= 75) return ui("scoreGood");
  if (s >= 70) return ui("scoreFair");
  if (s >= 60) return ui("scoreAverage");
  return ui("scoreDefective");
}

function scoreColor(s: number): string {
  if (s >= 90) return "#2E7D32";
  if (s >= 85) return "#388E3C";
  if (s >= 80) return "#558B2F";
  if (s >= 75) return "#F57F17";
  if (s >= 70) return "#E65100";
  return "#C62828";
}

function renderDescription(text: string) {
  if (!text) return null;
  const parts = text.split(/\[\[(.+?)\]\]/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong
        key={i}
        style={{ color: "#7B3F00", fontWeight: 700, fontStyle: "normal" }}
      >
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
