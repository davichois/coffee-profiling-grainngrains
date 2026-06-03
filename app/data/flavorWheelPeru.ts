import type { FlavorNode } from "./flavorWheel";

// ─── Peru Flavor Wheel ───────────────────────────────────────────────────────
// Extends the SCA base with Amazonian, Andean and traditional Peruvian flavors.

export const flavorWheelPeruData: FlavorNode[] = [
  // ── 1. AFRUTADO SELVÁTICO ──────────────────────────────────────────────────
  {
    id: "afrutado-selvatico",
    label: "Afrutado",
    color: "#E53935",
    children: [
      {
        id: "frutas-amazonicas",
        label: "Amazonía",
        color: "#B71C1C",
        children: [
          { id: "camu-camu",    label: "Camu-Camu",    color: "#EF5350" },
          { id: "aguaje",       label: "Aguaje",        color: "#E64A19" },
          { id: "copoazu",      label: "Copoazú",       color: "#BF360C" },
          { id: "guanabana",    label: "Guanábana",     color: "#FF7043" },
          { id: "uvilla",       label: "Uvilla",        color: "#FF8A65" },
          { id: "tumbo",        label: "Tumbo",         color: "#FF5722" },
          { id: "tamarindo",    label: "Tamarindo",     color: "#6D4C41" },
        ],
      },
      {
        id: "frutas-andinas",
        label: "Frutas Andinas",
        color: "#FF6D00",
        children: [
          { id: "lucuma",       label: "Lúcuma",        color: "#F57F17" },
          { id: "chirimoya",    label: "Chirimoya",     color: "#FFF176" },
          { id: "granadilla",   label: "Granadilla",    color: "#FF8F00" },
          { id: "tuna",         label: "Tuna",          color: "#E91E63" },
          { id: "pepino-dulce", label: "Pepino Dulce",  color: "#A5D6A7" },
          { id: "sauco",        label: "Saúco",         color: "#7B1FA2" },
          { id: "pacay",        label: "Pacay",         color: "#C8E6C9" },
        ],
      },
      {
        id: "berry-peru",
        label: "Bayas",
        color: "#D81B60",
        children: [
          { id: "blackberry",  label: "Mora",       color: "#2C1A4D" },
          { id: "raspberry",   label: "Frambuesa",  color: "#E91E63" },
          { id: "blueberry",   label: "Mora Azul",  color: "#3949AB" },
          { id: "strawberry",  label: "Fresa",      color: "#F44336" },
        ],
      },
      {
        id: "dried-fruit-peru",
        label: "Frutos Secos",
        color: "#AD1457",
        children: [
          { id: "raisin", label: "Pasa de Uva",      color: "#6A1B9A" },
          { id: "prune",  label: "Pasa de Ciruela",  color: "#7B1FA2" },
        ],
      },
      {
        id: "otras-frutas-peru",
        label: "Otras Frutas",
        color: "#FF7043",
        children: [
          { id: "coconut",     label: "Coco",      color: "#EF6C00" },
          { id: "cherry",      label: "Cereza",    color: "#C2185B" },
          { id: "pomegranate", label: "Granada",   color: "#D81B60" },
          { id: "pineapple",   label: "Piña",      color: "#FB8C00" },
          { id: "grape",       label: "Uva",       color: "#8E24AA" },
          { id: "apple",       label: "Manzana",   color: "#43A047" },
          { id: "peach",       label: "Durazno",   color: "#F57C00" },
          { id: "pear",        label: "Pera",      color: "#7CB342" },
        ],
      },
      {
        id: "citricos-peru",
        label: "Cítricos",
        color: "#FFB300",
        children: [
          { id: "grapefruit", label: "Toronja",  color: "#F4511E" },
          { id: "orange",     label: "Naranja",  color: "#FB8C00" },
          { id: "lemon",      label: "Limón",    color: "#F9A825" },
          { id: "lime",       label: "Lima",     color: "#7CB342" },
        ],
      },
    ],
  },

  // ── 2. ÁCIDO / FERMENTADO PERUANO ─────────────────────────────────────────
  {
    id: "acido-fermentado-peru",
    label: "Ácido/Fermentado",
    color: "#C0B000",
    children: [
      {
        id: "acido-peru",
        label: "Ácido",
        color: "#9E9D24",
        children: [
          { id: "sour-aromatics",  label: "Ácidos Aromáticos",  color: "#7CB342" },
          { id: "acetic-acid",     label: "Ácido Acético",      color: "#689F38" },
          { id: "butyric-acid",    label: "Ácido Butírico",     color: "#558B2F" },
          { id: "isovaleric-acid", label: "Ácido Isovalérico",  color: "#43A047" },
          { id: "citric-acid",     label: "Ácido Cítrico",      color: "#F9A825" },
          { id: "malic-acid",      label: "Ácido Málico",       color: "#AFB42B" },
          { id: "phosphoric-acid", label: "Ácido Fosfórico",    color: "#C6CC44" },
          { id: "lactic-acid",     label: "Ácido Láctico",      color: "#A5D6A7" },
        ],
      },
      {
        id: "fermentados-peruanos",
        label: "Fermentados",
        color: "#827717",
        children: [
          { id: "winey",      label: "Vino",          color: "#AD1457" },
          { id: "whiskey",    label: "Whiskey",        color: "#8D6E63" },
          { id: "fermented",  label: "Fermentado",     color: "#827717" },
          { id: "overripe",   label: "Muy Maduro",     color: "#6D4C41" },
          { id: "chicha-jora",label: "Chicha de Jora", color: "#FFA000" },
          { id: "masato",     label: "Masato",         color: "#D7CCC8" },
        ],
      },
    ],
  },

  // ── 3. VEGETAL ────────────────────────────────────────────────────────────
  {
    id: "vegetal-peru",
    label: "Vegetal",
    color: "#008F4C",
    children: [
      {
        id: "aceite-oliva-peru",
        label: "Aceite de Oliva",
        color: "#558B2F",
        children: [
          { id: "olive-oil-flavor", label: "Aceite de Oliva", color: "#33691E" },
        ],
      },
      {
        id: "vegetal-crudo-peru",
        label: "Vegetal Crudo",
        color: "#00A651",
        children: [
          { id: "under-ripe",  label: "Poco Maduro",      color: "#7CB342" },
          { id: "peapod",      label: "Guisante",          color: "#43A047" },
          { id: "fresh",       label: "Fresco",            color: "#00C853" },
          { id: "dark-green",  label: "Verde Oscuro",      color: "#1B5E20" },
          { id: "vegetative",  label: "Vegetativo",        color: "#2E7D32" },
          { id: "hay-like",    label: "Parecido al Heno",  color: "#9E9D24" },
          { id: "herb-like",   label: "Herbal",            color: "#4CAF50" },
        ],
      },
    ],
  },

  // ── 4. OTROS / DEFECTOS ───────────────────────────────────────────────────
  {
    id: "otros-peru",
    label: "Otros",
    color: "#0288D1",
    children: [
      {
        id: "papery-musty-peru",
        label: "Húmedo/Papel",
        color: "#90A4AE",
        children: [
          { id: "stale",       label: "Animal",    color: "#C2185B" },
          { id: "cardboard",   label: "Tierra",    color: "#8BC34A" },
          { id: "papery",      label: "Polvo",     color: "#9E9D24" },
          { id: "woody",       label: "Madera",    color: "#6D4C41" },
          { id: "moldy-damp",  label: "Húmedo",    color: "#78909C" },
          { id: "musty-dusty", label: "Papel",     color: "#757575" },
          { id: "musty-earthy",label: "Cartón",    color: "#827717" },
        ],
      },
      {
        id: "quimico-peru",
        label: "Químico",
        color: "#039BE5",
        children: [
          { id: "bitter",    label: "Amargo",    color: "#00838F" },
          { id: "salty",     label: "Salado",    color: "#546E7A" },
          { id: "medicinal", label: "Medicinal", color: "#00ACC1" },
          { id: "petroleum", label: "Petróleo",  color: "#1565C0" },
          { id: "skunky",    label: "Zorrillo",  color: "#283593" },
          { id: "rubber",    label: "Goma",      color: "#212121" },
        ],
      },
    ],
  },

  // ── 5. TOSTADOS Y MAÍZ ────────────────────────────────────────────────────
  {
    id: "tostados-maiz",
    label: "Tostados y Maíz",
    color: "#8D6E63",
    children: [
      {
        id: "quemado-peru",
        label: "Quemado",
        color: "#6D4C41",
        children: [
          { id: "acrid",       label: "Acre",     color: "#5D4037" },
          { id: "ashy",        label: "Ceniza",   color: "#616161" },
          { id: "smoky",       label: "Humo",     color: "#424242" },
          { id: "brown-roast", label: "Tostado",  color: "#795548" },
        ],
      },
      {
        id: "cereal-maiz",
        label: "Cereal y Maíz",
        color: "#C68B3C",
        children: [
          { id: "grain",       label: "Grano",        color: "#BCAAA4" },
          { id: "malt",        label: "Malta",         color: "#A1887F" },
          { id: "cancha",      label: "Cancha",        color: "#FFD54F" },
          { id: "maiz-morado", label: "Maíz Morado",  color: "#6A1B9A" },
        ],
      },
    ],
  },

  // ── 6. ESPECIAS Y AJÍES PERUANOS ──────────────────────────────────────────
  {
    id: "especias-ajies",
    label: "Especias y Ajíes",
    color: "#B71C1C",
    children: [
      {
        id: "pimienta-peru",
        label: "Pimienta",
        color: "#AD1457",
        children: [
          { id: "pepper-flavor", label: "Pimienta", color: "#6A1B9A" },
        ],
      },
      {
        id: "especias-marrones-peru",
        label: "Especias Marrones",
        color: "#B26A3D",
        children: [
          { id: "anise",   label: "Anís",          color: "#D68910" },
          { id: "nutmeg",  label: "Nuez Moscada",  color: "#E67E22" },
          { id: "cinnamon",label: "Canela",         color: "#BF5B17" },
          { id: "clove",   label: "Clavo",          color: "#6D4C41" },
        ],
      },
      {
        id: "ajies-peruanos",
        label: "Ajíes Peruanos",
        color: "#C62828",
        children: [
          { id: "aji-amarillo", label: "Ají Amarillo", color: "#F9A825" },
          { id: "aji-panca",    label: "Ají Panca",    color: "#8D1515" },
          { id: "aji-rocoto",   label: "Ají Rocoto",   color: "#D32F2F" },
          { id: "aji-limo",     label: "Ají Limo",     color: "#F57F17" },
        ],
      },
      {
        id: "hierbas-aromaticas",
        label: "Hierbas Aromáticas",
        color: "#6D8B3A",
        children: [
          { id: "huacatay",    label: "Huacatay",     color: "#33691E" },
          { id: "muna",        label: "Muña",          color: "#1B5E20" },
          { id: "hierba-luisa",label: "Hierba Luisa",  color: "#9E9D24" },
          { id: "culantro",    label: "Culantro",      color: "#558B2F" },
        ],
      },
    ],
  },

  // ── 7. NUECES Y CACAO NATIVO ──────────────────────────────────────────────
  {
    id: "nueces-cacao-nativo",
    label: "Nueces/Cacao Nativo",
    color: "#A0522D",
    children: [
      {
        id: "nueces-peru",
        label: "Nueces",
        color: "#C68B59",
        children: [
          { id: "peanuts",     label: "Maní",         color: "#D4A017" },
          { id: "hazelnut",    label: "Avellana",     color: "#A47551" },
          { id: "almond",      label: "Almendra",     color: "#BC8F6F" },
          { id: "sacha-inchi", label: "Sacha Inchi",  color: "#8BC34A" },
        ],
      },
      {
        id: "cacao-nativo-peru",
        label: "Cacao Nativo",
        color: "#4E342E",
        children: [
          { id: "chocolate",        label: "Chocolate",       color: "#5D4037" },
          { id: "dark-chocolate",   label: "Choco. Amargo",   color: "#3E2723" },
          { id: "cacao-chuncho",    label: "Cacao Chuncho",   color: "#6D3B2E" },
          { id: "cacao-porcelana",  label: "Cacao Porcelana", color: "#BF8A6A" },
        ],
      },
    ],
  },

  // ── 8. DULCE PERUANO ──────────────────────────────────────────────────────
  {
    id: "dulce-peruano",
    label: "Dulce Peruano",
    color: "#E65100",
    children: [
      {
        id: "azucar-andina",
        label: "Azúcar Andina",
        color: "#BF360C",
        children: [
          { id: "molasses",    label: "Melaza",           color: "#5D4037" },
          { id: "maple-syrup", label: "Jarabe de Arce",   color: "#8D6E63" },
          { id: "caramelized", label: "Caramelizado",     color: "#EF6C00" },
          { id: "honey",       label: "Miel",             color: "#FF8F00" },
          { id: "chancaca",    label: "Chancaca",         color: "#A0522D" },
          { id: "algarrobina", label: "Algarrobina",      color: "#3E2723" },
        ],
      },
      {
        id: "vainilla-peru",
        label: "Vainilla",
        color: "#C68B59",
        children: [
          { id: "vanilla-flavor", label: "Vainilla",    color: "#BCAAA4" },
          { id: "vanillin",       label: "Vainillina",  color: "#E8D5B0" },
        ],
      },
      {
        id: "dulces-tradicionales",
        label: "Dulces Tradicionales",
        color: "#FF8F00",
        children: [
          { id: "manjar-blanco",label: "Manjar Blanco", color: "#FFCCBC" },
          { id: "lucuma-dulce", label: "Lúcuma Dulce",  color: "#F9A825" },
        ],
      },
    ],
  },

  // ── 9. FLORAL NATIVO ──────────────────────────────────────────────────────
  {
    id: "floral-nativo",
    label: "Floral Nativo",
    color: "#EC407A",
    children: [
      {
        id: "te-negro-peru",
        label: "Té Negro",
        color: "#D81B60",
        children: [
          { id: "black-tea-flavor", label: "Té Negro", color: "#F9A825" },
        ],
      },
      {
        id: "florales-nativos",
        label: "Florales Nativos",
        color: "#F06292",
        children: [
          { id: "rose",       label: "Rosa",           color: "#E91E63" },
          { id: "jasmine",    label: "Jazmín",         color: "#CE93D8" },
          { id: "chamomile",  label: "Manzanilla",     color: "#FFF176" },
          { id: "flor-cacao", label: "Flor de Cacao",  color: "#6D4C41" },
          { id: "azahar",     label: "Azahar",         color: "#FFFDE7" },
          { id: "tilo",       label: "Tilo",           color: "#F0F4C3" },
        ],
      },
    ],
  },
];

// ─── Leaf scores — SCA base + Peru-specific ───────────────────────────────────
export const PERU_LEAF_SCORES: Record<string, number> = {
  // ── Floral ──
  "black-tea-flavor": 4,
  rose: 4,
  jasmine: 4.5,
  chamomile: 4.5,
  "flor-cacao": 4.5,
  azahar: 3.5,
  tilo: 3.0,
  // ── Berry / Dried fruit ──
  blackberry: 3,
  raspberry: 3,
  blueberry: 3.5,
  strawberry: 3,
  cherry: 3,
  pomegranate: 2.5,
  raisin: 1.5,
  prune: 2,
  // ── Other fruit ──
  coconut: 1.5,
  pineapple: 2.5,
  grape: 2,
  apple: 2,
  peach: 3,
  pear: 2,
  // ── Citrus ──
  grapefruit: 3,
  orange: 3,
  lemon: 3,
  lime: 2.5,
  // ── Amazon fruits ──
  "camu-camu": 4.5,
  aguaje: 2.5,
  copoazu: 3.5,
  guanabana: 3.5,
  uvilla: 3.0,
  tumbo: 3.0,
  tamarindo: 1.5,
  sauco: 2.5,
  pacay: 2.0,
  // ── Andean fruits ──
  lucuma: 4.5,
  chirimoya: 4.0,
  granadilla: 3.5,
  tuna: 2.5,
  "pepino-dulce": 2.5,
  // ── Sweet ──
  honey: 3.5,
  caramelized: 2.5,
  "maple-syrup": 2,
  molasses: 1.5,
  "vanilla-flavor": 3,
  vanillin: 2.5,
  chocolate: 2.5,
  "dark-chocolate": 3.5,
  chancaca: 3.0,
  algarrobina: 3.5,
  "manjar-blanco": 3.0,
  "lucuma-dulce": 4.0,
  // ── Nutty ──
  hazelnut: 2,
  almond: 2,
  peanuts: 1,
  "sacha-inchi": 2.5,
  // ── Native cacao ──
  "cacao-chuncho": 5.0,
  "cacao-porcelana": 5.0,
  // ── Spices / Herbs ──
  cinnamon: 2.5,
  nutmeg: 2,
  anise: 2,
  clove: 2,
  "pepper-flavor": 1,
  "aji-amarillo": 2.0,
  "aji-panca": 1.5,
  "aji-rocoto": 1.0,
  "aji-limo": 1.5,
  huacatay: 2.0,
  muna: 2.5,
  "hierba-luisa": 2.0,
  culantro: 1.5,
  // ── Roasted / Cereal ──
  malt: 2,
  grain: 1,
  "brown-roast": 1,
  cancha: 1.5,
  "maiz-morado": 2.0,
  smoky: -0.5,
  ashy: -2,
  acrid: -3.5,
  // ── Acids ──
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
  "chicha-jora": 0.5,
  masato: 0,
  // ── Vegetative ──
  fresh: 1.5,
  "herb-like": 1,
  "under-ripe": -1,
  peapod: -0.5,
  vegetative: -1.5,
  "dark-green": -1.5,
  "hay-like": -2,
  "olive-oil-flavor": -0.5,
  // ── Defects ──
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

// ─── Spanish display names ─────────────────────────────────────────────────────
export const PERU_FLAVOR_NAMES_ES: Record<string, string> = {
  // Floral
  "black-tea-flavor": "té negro",
  rose: "rosa",
  jasmine: "jazmín",
  chamomile: "manzanilla",
  "flor-cacao": "flor de cacao",
  azahar: "azahar",
  tilo: "tilo",
  // Berry
  blackberry: "mora",
  raspberry: "frambuesa",
  blueberry: "mora azul",
  strawberry: "fresa",
  cherry: "cereza",
  pomegranate: "granada",
  raisin: "pasa de uva",
  prune: "ciruela pasa",
  // Other fruit
  coconut: "coco",
  pineapple: "piña",
  grape: "uva",
  apple: "manzana",
  peach: "durazno",
  pear: "pera",
  // Citrus
  grapefruit: "toronja",
  orange: "naranja",
  lemon: "limón",
  lime: "lima",
  // Amazon
  "camu-camu": "camu-camu",
  aguaje: "aguaje",
  copoazu: "copoazú",
  guanabana: "guanábana",
  uvilla: "uvilla",
  tumbo: "tumbo",
  tamarindo: "tamarindo",
  sauco: "saúco",
  pacay: "pacay",
  // Andean
  lucuma: "lúcuma",
  chirimoya: "chirimoya",
  granadilla: "granadilla",
  tuna: "tuna",
  "pepino-dulce": "pepino dulce",
  // Sweet
  honey: "miel",
  caramelized: "caramelo",
  "maple-syrup": "jarabe de arce",
  molasses: "melaza",
  "vanilla-flavor": "vainilla",
  vanillin: "vainillina",
  chocolate: "chocolate",
  "dark-chocolate": "chocolate amargo",
  chancaca: "chancaca",
  algarrobina: "algarrobina",
  "manjar-blanco": "manjar blanco",
  "lucuma-dulce": "lúcuma",
  // Nutty / cacao
  hazelnut: "avellana",
  almond: "almendra",
  peanuts: "maní",
  "sacha-inchi": "sacha inchi",
  "cacao-chuncho": "cacao chuncho",
  "cacao-porcelana": "cacao porcelana",
  // Spices / herbs
  cinnamon: "canela",
  nutmeg: "nuez moscada",
  anise: "anís",
  clove: "clavo",
  "pepper-flavor": "pimienta",
  "aji-amarillo": "ají amarillo",
  "aji-panca": "ají panca",
  "aji-rocoto": "ají rocoto",
  "aji-limo": "ají limo",
  huacatay: "huacatay",
  muna: "muña",
  "hierba-luisa": "hierba luisa",
  culantro: "culantro",
  // Roasted / cereal
  malt: "malta",
  grain: "grano",
  "brown-roast": "tostado",
  cancha: "cancha",
  "maiz-morado": "maíz morado",
  smoky: "humo",
  ashy: "ceniza",
  acrid: "acre",
  // Acids
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
  "chicha-jora": "chicha de jora",
  masato: "masato",
  // Vegetative
  fresh: "fresco",
  "herb-like": "herbal",
  "under-ripe": "poco maduro",
  peapod: "guisante",
  vegetative: "vegetativo",
  "dark-green": "verde oscuro",
  "hay-like": "heno",
  "olive-oil-flavor": "aceite de oliva",
  // Defects
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

export const PERU_INITIAL_OPEN_IDS = new Set([
  "afrutado-selvatico",
  "frutas-amazonicas",
  "nueces-cacao-nativo",
  "cacao-nativo-peru",
]);
