"use client";

import { useState, useCallback, useRef } from "react";
import { flavorWheelData, FlavorNode } from "../data/flavorWheel";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { GrainngrainsLogo } from "./GrainngrainsLogo";
import { WheelNav } from "./WheelNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "../i18n/config";
import { UI } from "../i18n/ui";
import { labelFor } from "../i18n/labels";
import { buildDescription, findMainCat } from "../i18n/describe";

const SVG_SIZE = 900;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;

const CENTER_R = 62;

const RINGS = [
  { inner: 0, outer: CENTER_R },
  { inner: CENTER_R, outer: 220 },
  { inner: 220, outer: 330 },
  { inner: 330, outer: 415 },
];

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

function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const gap = 0.8;
  const s = startAngle + gap / 2;
  const e = endAngle - gap / 2;
  const x1 = n3(cx + innerR * Math.cos(toRad(s)));
  const y1 = n3(cy + innerR * Math.sin(toRad(s)));
  const x2 = n3(cx + outerR * Math.cos(toRad(s)));
  const y2 = n3(cy + outerR * Math.sin(toRad(s)));
  const x3 = n3(cx + outerR * Math.cos(toRad(e)));
  const y3 = n3(cy + outerR * Math.sin(toRad(e)));
  const x4 = n3(cx + innerR * Math.cos(toRad(e)));
  const y4 = n3(cy + innerR * Math.sin(toRad(e)));
  const largeArc = e - s > 180 ? 1 : 0;
  return [
    `M ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3}`,
    `L ${x4} ${y4}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1}`,
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
      const r = RINGS[ring];
      const path = arcPath(
        CX,
        CY,
        r.inner,
        r.outer,
        startAngle,
        startAngle + span,
      );
      const lp = labelPos(
        CX,
        CY,
        r.inner,
        r.outer,
        startAngle,
        startAngle + span,
      );
      segs.push({
        node,
        ring,
        startAngle,
        endAngle: startAngle + span,
        path,
        labelX: lp.x,
        labelY: lp.y,
        labelAngle: lp.angle,
        parentId,
      });
      if (node.children && openIds.has(node.id)) {
        segs.push(
          ...build(node.children, ring + 1, startAngle, span, node.id, leaves),
        );
      }
      startAngle += span;
    });
    return segs;
  }

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

const CAPTURE_OPTIONS = {
  pixelRatio: 2,
  backgroundColor: "#ffffff",
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

// ─── component config ────────────────────────────────────────────────────────

export interface WheelConfig {
  data?: typeof flavorWheelData;
  leafScores?: Record<string, number>;
  flavorNamesEs?: Record<string, string>;
  initialOpenIds?: Set<string>;
  exportFilename?: string;
  active?: "sca" | "peru";
  locale?: Locale;
}

const SCA_DEFAULT_OPEN = new Set(["fruity", "berry", "roasted", "sweet"]);

// ─── component ───────────────────────────────────────────────────────────────

export default function FlavorWheel({ config }: { config?: WheelConfig } = {}) {
  const wheelData = config?.data ?? flavorWheelData;
  const scores = config?.leafScores ?? LEAF_SCORES;
  const namesEs = config?.flavorNamesEs ?? FLAVOR_NAMES_ES;
  const initialOpen = config?.initialOpenIds ?? SCA_DEFAULT_OPEN;
  const exportFilename = config?.exportFilename ?? "perfil-cafe.png";
  const activeWheel = config?.active ?? "sca";
  const locale = config?.locale ?? "es";
  const ui = UI[locale];

  // Localized flavor name for a leaf id (falls back to Spanish / proper noun).
  const nameFor = (id: string) =>
    labelFor(id, namesEs[id] ?? findLabel(wheelData, id), locale);

  const [openIds, setOpenIds] = useState<Set<string>>(initialOpen);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const drag = useRef<DragState | null>(null);
  const animFrame = useRef<number | null>(null);
  const nodeMap = useRef<Map<string, FlavorNode>>(new Map());
  const captureRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const exportPng = useCallback(async () => {
    if (!captureRef.current) return;
    outerRef.current?.classList.add("exporting-outer");
    captureRef.current.classList.add("exporting");
    const dataUrl = await toPng(captureRef.current, CAPTURE_OPTIONS);
    captureRef.current.classList.remove("exporting");
    outerRef.current?.classList.remove("exporting-outer");
    const link = document.createElement("a");
    link.download = exportFilename;
    link.href = dataUrl;
    link.click();
  }, []);

  const exportPdf = useCallback(async () => {
    if (!captureRef.current) return;
    outerRef.current?.classList.add("exporting-outer");
    captureRef.current.classList.add("exporting");
    const dataUrl = await toPng(captureRef.current, CAPTURE_OPTIONS);
    captureRef.current.classList.remove("exporting");
    outerRef.current?.classList.remove("exporting-outer");
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
  }, []);

  function getSvgCoords(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      svgX: (e.clientX - rect.left) * (SVG_SIZE / rect.width),
      svgY: (e.clientY - rect.top) * (SVG_SIZE / rect.height),
    };
  }

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
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

  const toggleNode = useCallback((node: FlavorNode) => {
    if (!node.children) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    } else {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          collectIds(node).forEach((id) => next.delete(id));
        } else {
          next.add(node.id);
        }
        return next;
      });
    }
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
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
          locale,
          (id) => `[[${nameFor(id)}]]`,
        )
      : "";

  // Keep nodeMap in sync so onPointerUp can resolve taps
  // eslint-disable-next-line react-hooks/refs
  nodeMap.current.clear();
  // eslint-disable-next-line react-hooks/refs
  segments.forEach((seg) => nodeMap.current.set(seg.node.id, seg.node));

  const svgEl = (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        display: "block",
        maxWidth: "100%",
        height: "auto",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <defs>
        <clipPath id="center-logo-clip">
          <circle cx={CX} cy={CY} r={CENTER_R - 2} />
        </clipPath>
      </defs>
      <g className="center-logo-group">
        <circle cx={CX} cy={CY} r={CENTER_R} fill="#faf6f2" />
        <image
          href="/grainngrains.svg"
          x={CX - (CENTER_R - 14)}
          y={CY - (CENTER_R - 14)}
          width={(CENTER_R - 14) * 2}
          height={(CENTER_R - 14) * 2}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#center-logo-clip)"
        />
      </g>

      <g transform={`rotate(${rotation}, ${CX}, ${CY})`}>
        {segments.map((seg) => {
          const isOpen = openIds.has(seg.node.id);
          const isSelected = selected.has(seg.node.id);
          const isHovered = hovered === seg.node.id;
          const baseColor = seg.node.color;
          const fillColor = isSelected
            ? "#E8914A"
            : isHovered
              ? lighten(baseColor)
              : isOpen
                ? darken(baseColor)
                : baseColor;
          return (
            <path
              key={seg.node.id}
              d={seg.path}
              fill={fillColor}
              stroke="#ffffff"
              strokeWidth={1}
              data-node-id={seg.node.id}
              style={{
                cursor: isDragging ? "grabbing" : "pointer",
                transition: "fill 0.15s",
              }}
              onMouseEnter={() => !isDragging && setHovered(seg.node.id)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </g>

      {segments.map((seg) => {
        const arcSpan = seg.endAngle - seg.startAngle;
        const midR = (RINGS[seg.ring].inner + RINGS[seg.ring].outer) / 2;
        const arcLength = midR * ((arcSpan * Math.PI) / 180);
        const ringDepth = RINGS[seg.ring].outer - RINGS[seg.ring].inner;
        const maxFontSize = seg.ring === 1 ? 13 : seg.ring === 2 ? 11 : 9;

        const label = labelFor(seg.node.id, seg.node.label, locale);

        // ── Tangential fit (text runs along the arc) ──────────────────────
        // 0.58 leaves padding on both sides so the label sits centered in the
        // wedge instead of running up against the white dividers.
        const safeTangential = arcLength * 0.58;
        const fitTangential = safeTangential / (label.length * 0.6);
        const fsTangential = Math.min(maxFontSize, fitTangential);

        // ── Radial fit (text runs along the radius) ───────────────────────
        // Only considered for rings 2 and 3 when tangential is too small.
        const safeRadial = ringDepth * 0.58;
        const fitRadial = safeRadial / (label.length * 0.6);
        const fsRadial = Math.min(maxFontSize, fitRadial);

        // When a second-ring option is open (expanded), keep its label
        // tangential ("echado") instead of radial ("parado") so it fits.
        const isOpenSecondScale = seg.ring === 2 && openIds.has(seg.node.id);
        const useRadial =
          seg.ring >= 2 &&
          fsTangential < 7 &&
          fsRadial >= fsTangential &&
          !isOpenSecondScale;

        const fontSize = useRadial ? fsRadial : fsTangential;
        if (fontSize < 5) return null;

        const safeWidth = useRadial ? safeRadial : safeTangential;
        const estimatedWidth = label.length * 0.6 * fontSize;
        const textLen = n3(Math.min(estimatedWidth, safeWidth));

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
          // Tangential: text runs parallel to the arc circumference.
          const rawRot = labelAngleInWorld + 180;
          textAngle = rawRot > 90 && rawRot < 270 ? rawRot + 180 : rawRot;
        }

        return (
          <text
            key={`lbl-${seg.node.id}`}
            x={wx}
            y={wy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={n3(fontSize)}
            fontFamily="Montserrat, sans-serif"
            fontWeight="700"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth={0.6}
            paintOrder="stroke"
            pointerEvents="none"
            textLength={textLen}
            lengthAdjust="spacingAndGlyphs"
            transform={`rotate(${n3(textAngle)}, ${wx}, ${wy})`}
            style={{ userSelect: "none" }}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );

  return (
    <div
      ref={outerRef}
      className="flex flex-col w-full md:max-w-7xl md:mx-auto"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* ── Header — excluded from export ── */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 pt-5 pb-4">
        <GrainngrainsLogo tagline={ui.tagline} href={`/${locale}`} />

        {/* Wheel options — full width below on mobile, inline on desktop */}
        <div className="order-last w-full flex justify-center sm:order-0 sm:w-auto">
          <WheelNav active={activeWheel} locale={locale} />
        </div>

        <div className="flex items-center gap-2">
        <button
          onClick={exportPng}
          title={ui.exportTitle}
          className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: "transparent",
            color: "#116e78",
            border: "1.5px solid #279ba8",
            borderRadius: 999,
            padding: "8px 18px",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#116e78";
            e.currentTarget.style.color = "#faf6f2";
            e.currentTarget.style.borderColor = "#116e78";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#116e78";
            e.currentTarget.style.borderColor = "#279ba8";
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
          <span>{ui.exportLabel}</span>
        </button>

        <LanguageSwitcher
          current={locale}
          basePath={activeWheel === "peru" ? "/peru" : ""}
        />
        </div>
      </div>

      {/* ── Capture area ── */}
      <div
        ref={captureRef}
        className="flex flex-col w-full"
        style={{ background: "#faf6f2" }}
      >
        {/* Hidden logo — only visible in exported PNG */}
        <div style={{ display: "none" }} aria-hidden="true">
          <GrainngrainsLogo tagline={ui.tagline} />
        </div>

        {/* Two-column row: wheel left / results right on md+, stacked on mobile */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-6 w-full">
          {/* ── Wheel — top (clip) on mobile, left on desktop ── */}
          <div className="md:flex-1 md:min-w-0">
            <div className="flavor-wheel-clip md:contents w-full">{svgEl}</div>
          </div>

          {/* ── Results — below wheel on mobile, right on desktop ── */}
          <div className="md:w-72 xl:w-80 flex flex-col gap-3 px-3 sm:px-4 md:px-0 md:pr-6 pt-4 md:pt-6 pb-2 md:pb-6">
            {selected.size === 0 ? (
              <p
                className="text-center md:text-left mt-1"
                style={{ fontSize: 13, color: "#b0a090", lineHeight: 1.7 }}
              >
                {ui.promptExplore}
                <br />
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  {ui.promptDrag}
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
                    {ui.tastingNotes} &nbsp;·&nbsp; {selected.size}
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
                            cursor: "pointer",
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
          {ui.footer}
        </p>
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

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

function scoreLabel(s: number, ui: (typeof UI)[Locale]): string {
  if (s >= 90) return ui.scoreExceptional;
  if (s >= 85) return ui.scoreExcellent;
  if (s >= 80) return ui.scoreVeryGood;
  if (s >= 75) return ui.scoreGood;
  if (s >= 70) return ui.scoreFair;
  if (s >= 60) return ui.scoreAverage;
  return ui.scoreDefective;
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
