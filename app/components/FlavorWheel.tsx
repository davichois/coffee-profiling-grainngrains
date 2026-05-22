"use client";

import { useState, useCallback, useRef } from "react";
import { flavorWheelData, FlavorNode } from "../data/flavorWheel";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { GrainngrainsLogo } from "./GrainngrainsLogo";

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
  "black-tea-flavor": 4.5,
  rose: 4,
  jasmine: 4.5,
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
  "black-tea-flavor": "manzanilla",
  rose: "rosa",
  jasmine: "jazmín",
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
  if (
    node instanceof HTMLLinkElement &&
    node.rel === "stylesheet" &&
    node.href &&
    !node.href.startsWith(window.location.origin) &&
    !node.href.startsWith("data:")
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

// ─── component ───────────────────────────────────────────────────────────────

export default function FlavorWheel() {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(["fruity", "berry", "roasted", "sweet"]),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const drag = useRef<DragState | null>(null);
  const animFrame = useRef<number | null>(null);
  const nodeMap = useRef<Map<string, FlavorNode>>(new Map());
  const captureRef = useRef<HTMLDivElement>(null);

  const exportPng = useCallback(async () => {
    if (!captureRef.current) return;
    const dataUrl = await toPng(captureRef.current, CAPTURE_OPTIONS);
    const link = document.createElement("a");
    link.download = "perfil-cafe.png";
    link.href = dataUrl;
    link.click();
  }, []);

  const exportPdf = useCallback(async () => {
    if (!captureRef.current) return;
    const dataUrl = await toPng(captureRef.current, CAPTURE_OPTIONS);
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
    pdf.save("perfil-cafe.pdf");
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

  const segments = buildDynamicSegments(flavorWheelData, openIds);
  const score = computeScore(selected, flavorWheelData);
  const description =
    score !== null ? buildDescription(selected, score, flavorWheelData) : "";

  // Keep nodeMap in sync so onPointerUp can resolve taps
  // eslint-disable-next-line react-hooks/refs
  nodeMap.current.clear();
  // eslint-disable-next-line react-hooks/refs
  segments.forEach((seg) => nodeMap.current.set(seg.node.id, seg.node));

  return (
    <div className="flex items-center justify-center gap-6 flex-col">
      {/* Export buttons — excluded from captured image */}
      <div className="shrink-0 pt-2 md:pt-10 self-center">
        <GrainngrainsLogo tagline="Rueda de sabores" />
      </div>

      <div className="flex gap-3">
        <button
          onClick={exportPng}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "#1a0a00",
            color: "#faf6f2",
            fontFamily: "Montserrat, sans-serif",
            cursor: "pointer",
            border: "none",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#000000")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#000000")
          }
        >
          <svg
            width="14"
            height="14"
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
          Exportar PNG
        </button>
        <button
          onClick={exportPdf}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "#faf6f2",
            color: "#1a0a00",
            fontFamily: "Montserrat, sans-serif",
            cursor: "pointer",
            border: "1.5px solid #000000",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0e8df")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#ffffff")
          }
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Exportar PDF
        </button>
      </div>

      {/* Capture area */}
      <div
        ref={captureRef}
        className="flex items-center justify-center gap-6 flex-col"
        style={{ background: "#faf6f2", padding: "16px" }}
      >
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            maxWidth: "100%",
            height: "auto",
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          {/* Static center — does not rotate */}
          <circle cx={CX} cy={CY} r={CENTER_R} fill="#ffffff" />
          {/* Font sizes computed to fit the circle diameter (2 × CENTER_R) */}
          <text
            x={CX}
            y={CY - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1a0a00"
            fontSize={Math.floor(
              (CENTER_R * 2 * 0.82) / ("Coffee".length * 0.58),
            )}
            fontWeight="700"
            fontFamily="Montserrat, sans-serif"
          >
            G&G
          </text>
          <text
            x={CX}
            y={CY + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#6b6b6b"
            fontSize={Math.floor(
              (CENTER_R * 2 * 0.85) / ("Rueda de Sabores".length * 0.58),
            )}
            fontWeight="400"
            fontFamily="Montserrat, sans-serif"
          >
            Rueda de Sabores
          </text>

          {/* Rotating group */}
          <g transform={`rotate(${rotation}, ${CX}, ${CY})`}>
            {segments.map((seg) => {
              const isOpen = openIds.has(seg.node.id);
              const isSelected = selected.has(seg.node.id);
              const isHovered = hovered === seg.node.id;
              const arcSpan = seg.endAngle - seg.startAngle;

              const baseColor = seg.node.color;
              const fillColor = isSelected
                ? "#f4c6a0"
                : isHovered
                  ? lighten(baseColor)
                  : isOpen
                    ? darken(baseColor)
                    : baseColor;

              // Tangent label rotation — stays readable regardless of wheel spin
              const labelAngleInWorld = seg.labelAngle + rotation;
              const rawRot = labelAngleInWorld + 180;
              const rotate =
                rawRot > 90 && rawRot < 270 ? rawRot + 180 : rawRot;

              // Dynamic font size: fit label inside arc length
              const midR = (RINGS[seg.ring].inner + RINGS[seg.ring].outer) / 2;
              const arcLength = midR * ((arcSpan * Math.PI) / 180);
              const maxFontSize =
                seg.ring === 1 ? 13 : seg.ring === 2 ? 11 : 9.5;
              // Montserrat avg char width ≈ 0.58× fontSize; add padding factor 0.85
              const fitFontSize =
                (arcLength * 0.85) / (seg.node.label.length * 0.58);
              const fontSize = Math.min(maxFontSize, fitFontSize);
              const showLabel = fontSize >= 5;

              return (
                <g key={seg.node.id}>
                  <path
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
                  {showLabel && (
                    <text
                      x={seg.labelX}
                      y={seg.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={fontSize}
                      fontFamily="Montserrat, sans-serif"
                      fontWeight={seg.ring <= 2 ? "600" : "400"}
                      fill="#ffffff"
                      pointerEvents="none"
                      transform={`rotate(${rotate - rotation}, ${seg.labelX}, ${seg.labelY})`}
                      style={{ userSelect: "none" }}
                    >
                      {seg.node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {selected.size > 0 && (
          <div className="flex flex-col items-center gap-4 w-full max-w-lg px-4">
            {/* Selected flavor tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from(selected).map((id) => {
                const label = findLabel(flavorWheelData, id);
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
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "#f0e8df",
                      color: "#1a0a00",
                      border: "1px solid #d4b896",
                      fontFamily: "Montserrat, sans-serif",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e8d4c0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0e8df")
                    }
                  >
                    {label}
                    <span style={{ fontSize: 12, opacity: 0.5, lineHeight: 1 }}>
                      ✕
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Score + description panel */}
            {score !== null && (
              <div
                className="w-full rounded-2xl p-5"
                style={{ background: "#faf6f2", border: "1px solid #e8d8c8" }}
              >
                <div className="flex items-baseline gap-2 mb-3">
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: scoreColor(score),
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {score}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#b09070",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    /100
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: scoreColor(score),
                      fontFamily: "Montserrat, sans-serif",
                      marginLeft: 6,
                    }}
                  >
                    {scoreLabel(score)}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "#4a3728",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {renderDescription(description)}
                </p>
              </div>
            )}
          </div>
        )}

        <span
          className="text-center"
          style={{ fontSize: 12, color: "#6b6b6b" }}
        >
          (c) 2026 Grain & Grains. Todos los derechos reservados. Inspirada en
          la SCA.
        </span>
      </div>
      {/* end captureRef */}
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

function computeScore(
  selected: Set<string>,
  data: FlavorNode[],
): number | null {
  if (selected.size === 0) return null;
  let raw = 72;
  const cats = new Set<string>();
  for (const id of selected) {
    raw += LEAF_SCORES[id] ?? 0;
    const cat = findMainCat(id, data);
    if (cat) cats.add(cat);
  }
  raw += cats.size * 2;
  return Math.min(100, Math.max(55, Math.round(raw * 2) / 2));
}

function scoreLabel(s: number): string {
  if (s >= 90) return "Excepcional";
  if (s >= 85) return "Excelente";
  if (s >= 80) return "Muy Bueno";
  if (s >= 75) return "Bueno";
  if (s >= 70) return "Aceptable";
  if (s >= 60) return "Regular";
  return "Con Defectos";
}

function scoreColor(s: number): string {
  if (s >= 90) return "#2E7D32";
  if (s >= 85) return "#388E3C";
  if (s >= 80) return "#558B2F";
  if (s >= 75) return "#F57F17";
  if (s >= 70) return "#E65100";
  return "#C62828";
}

// Flavor names wrapped in [[…]] so renderDescription can highlight them.
function buildDescription(
  selected: Set<string>,
  score: number,
  data: FlavorNode[],
): string {
  const tag = (name: string) => `[[${name}]]`;

  const sorted = Array.from(selected)
    .map((id) => ({ id, s: LEAF_SCORES[id] ?? 0 }))
    .sort((a, b) => b.s - a.s);

  const top3 = sorted
    .slice(0, 3)
    .filter((f) => f.s > 0)
    .map((f) => tag(FLAVOR_NAMES_ES[f.id] ?? f.id));
  const negatives = sorted
    .filter((f) => f.s < -1.5)
    .map((f) => tag(FLAVOR_NAMES_ES[f.id] ?? f.id));

  const cats = new Set<string>();
  for (const id of selected) {
    const cat = findMainCat(id, data);
    if (cat) cats.add(cat);
  }

  let intro: string;
  if (score >= 90)
    intro = "Una experiencia sensorial excepcional que se graba en la memoria";
  else if (score >= 85)
    intro =
      "Un café de perfil extraordinario que cautiva desde el primer sorbo";
  else if (score >= 80)
    intro = "Una taza armoniosa y elegante, equilibrada en cada dimensión";
  else if (score >= 75)
    intro =
      "Un café con personalidad bien definida que invita a explorarlo con calma";
  else if (score >= 70)
    intro = "Un café honesto y directo, fiel a su naturaleza";
  else
    intro =
      "Un café que, pese a su potencial, carga con notas que opacan su expresión";

  let verb: string;
  if (score >= 85) verb = "despliega en taza un bouquet de";
  else if (score >= 75) verb = "donde el paladar descubre notas de";
  else verb = "en el que se perciben";

  let desc = intro;

  if (top3.length > 0) {
    const list =
      top3.length === 1
        ? top3[0]
        : top3.slice(0, -1).join(", ") + " y " + top3[top3.length - 1];
    desc += ` — ${verb} ${list}`;
  }
  desc += ".";

  if (negatives.length > 0) {
    const negList = negatives.slice(0, 2).join(" y ");
    desc += ` Sin embargo, se perciben rastros de ${negList} que merecen atención.`;
  }

  if (cats.size >= 4 && score >= 80) {
    desc +=
      " Su arquitectura aromática de gran complejidad revela nuevas capas a medida que la taza enfría.";
  } else if (cats.size >= 3 && score >= 75) {
    desc +=
      " La diversidad de sus notas hace de cada sorbo un viaje sensorial distinto.";
  } else if (cats.size === 1 && selected.size >= 2) {
    desc +=
      " Su perfil enfocado lo hace inmediatamente reconocible: limpio, directo y honesto.";
  } else if (selected.size === 1) {
    desc += " Una expresión concentrada que no necesita adornos.";
  }

  return desc;
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
