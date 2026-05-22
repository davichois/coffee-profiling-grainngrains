export interface FlavorNode {
  id: string;
  label: string;
  color: string;
  children?: FlavorNode[];
}

export const flavorWheelData: FlavorNode[] = [
  {
    id: "fruity",
    label: "Afrutado",
    color: "#E53935",
    children: [
      {
        id: "berry",
        label: "Bayas",
        color: "#D81B60",
        children: [
          { id: "blackberry", label: "Mora", color: "#2C1A4D" },
          { id: "raspberry", label: "Frambuesa", color: "#E91E63" },
          { id: "blueberry", label: "Mora Azul", color: "#3949AB" },
          { id: "strawberry", label: "Fresa", color: "#F44336" },
        ],
      },
      {
        id: "dried-fruit",
        label: "Frutos Secos",
        color: "#AD1457",
        children: [
          { id: "raisin", label: "Pasa de Uva", color: "#6A1B9A" },
          { id: "prune", label: "Pasa de Ciruela", color: "#7B1FA2" },
        ],
      },
      {
        id: "other-fruit",
        label: "Otras Frutas",
        color: "#FF7043",
        children: [
          { id: "coconut", label: "Coco", color: "#EF6C00" },
          { id: "cherry", label: "Cereza", color: "#C2185B" },
          { id: "pomegranate", label: "Granada", color: "#D81B60" },
          { id: "pineapple", label: "Piña", color: "#FB8C00" },
          { id: "grape", label: "Uva", color: "#8E24AA" },
          { id: "apple", label: "Manzana", color: "#43A047" },
          { id: "peach", label: "Durazno", color: "#F57C00" },
          { id: "pear", label: "Pera", color: "#7CB342" },
        ],
      },
      {
        id: "citrus-fruit",
        label: "Cítricos",
        color: "#FFB300",
        children: [
          { id: "grapefruit", label: "Toronja", color: "#F4511E" },
          { id: "orange", label: "Naranja", color: "#FB8C00" },
          { id: "lemon", label: "Limón", color: "#F9A825" },
          { id: "lime", label: "Lima", color: "#7CB342" },
        ],
      },
    ],
  },

  {
    id: "sour-fermented",
    label: "Ácido/Fermentado",
    color: "#C0B000",
    children: [
      {
        id: "sour",
        label: "Ácido",
        color: "#9E9D24",
        children: [
          {
            id: "sour-aromatics",
            label: "Ácidos Aromáticos",
            color: "#7CB342",
          },
          {
            id: "acetic-acid",
            label: "Ácido Acético",
            color: "#689F38",
          },
          {
            id: "butyric-acid",
            label: "Ácido Butírico",
            color: "#558B2F",
          },
          {
            id: "isovaleric-acid",
            label: "Ácido Isovalérico",
            color: "#43A047",
          },
          {
            id: "citric-acid",
            label: "Ácido Cítrico",
            color: "#F9A825",
          },
          {
            id: "malic-acid",
            label: "Ácido Málico",
            color: "#AFB42B",
          },
        ],
      },
      {
        id: "alcohol-fermented",
        label: "Fermentado",
        color: "#9E9D24",
        children: [
          { id: "winey", label: "Vino", color: "#AD1457" },
          { id: "whiskey", label: "Whiskey", color: "#8D6E63" },
          { id: "fermented", label: "Fermentado", color: "#827717" },
          { id: "overripe", label: "Muy Maduro", color: "#6D4C41" },
        ],
      },
    ],
  },

  {
    id: "green-vegetative",
    label: "Vegetal",
    color: "#008F4C",
    children: [
      {
        id: "olive-oil",
        label: "Aceite de Oliva",
        color: "#558B2F",
        children: [
          {
            id: "olive-oil-flavor",
            label: "Aceite de Oliva",
            color: "#33691E",
          },
        ],
      },
      {
        id: "raw",
        label: "Vegetal",
        color: "#00A651",
        children: [
          { id: "under-ripe", label: "Poco Maduro", color: "#7CB342" },
          { id: "peapod", label: "Guisante", color: "#43A047" },
          { id: "fresh", label: "Fresco", color: "#00C853" },
          { id: "dark-green", label: "Verde Oscuro", color: "#1B5E20" },
          { id: "vegetative", label: "Vegetativo", color: "#2E7D32" },
          { id: "hay-like", label: "Parecido al Heno", color: "#9E9D24" },
          { id: "herb-like", label: "Herbal", color: "#4CAF50" },
        ],
      },
    ],
  },

  {
    id: "other",
    label: "Otros",
    color: "#0288D1",
    children: [
      {
        id: "papery-musty",
        label: "Húmedo",
        color: "#90A4AE",
        children: [
          { id: "stale", label: "Animal", color: "#C2185B" },
          { id: "cardboard", label: "Tierra", color: "#8BC34A" },
          { id: "papery", label: "Polvo", color: "#9E9D24" },
          { id: "woody", label: "Madera", color: "#6D4C41" },
          { id: "moldy-damp", label: "Húmedo", color: "#78909C" },
          { id: "musty-dusty", label: "Papel", color: "#757575" },
          { id: "musty-earthy", label: "Cartón", color: "#827717" },
        ],
      },
      {
        id: "chemical",
        label: "Químico",
        color: "#039BE5",
        children: [
          { id: "bitter", label: "Amargo", color: "#00838F" },
          { id: "salty", label: "Salado", color: "#546E7A" },
          { id: "medicinal", label: "Medicinal", color: "#00ACC1" },
          { id: "petroleum", label: "Petróleo", color: "#1565C0" },
          { id: "skunky", label: "Zorrillo", color: "#283593" },
          { id: "rubber", label: "Goma", color: "#212121" },
        ],
      },
    ],
  },

  {
    id: "roasted",
    label: "Tostados",
    color: "#D2691E",
    children: [
      {
        id: "burnt",
        label: "Quemado",
        color: "#8D6E63",
        children: [
          { id: "acrid", label: "Acre", color: "#6D4C41" },
          { id: "ashy", label: "Ceniza", color: "#616161" },
          { id: "smoky", label: "Humo", color: "#424242" },
          { id: "brown-roast", label: "Tostado", color: "#795548" },
        ],
      },
      {
        id: "cereal",
        label: "Cereal",
        color: "#C68B3C",
        children: [
          { id: "grain", label: "Grano", color: "#BCAAA4" },
          { id: "malt", label: "Malta", color: "#A1887F" },
        ],
      },
    ],
  },

  {
    id: "spices",
    label: "Especias",
    color: "#C62828",
    children: [
      {
        id: "pepper",
        label: "Pimienta",
        color: "#AD1457",
        children: [
          { id: "pepper-flavor", label: "Pimienta", color: "#6A1B9A" },
        ],
      },
      {
        id: "brown-spice",
        label: "Especias Marrones",
        color: "#B26A3D",
        children: [
          { id: "anise", label: "Anís", color: "#D68910" },
          { id: "nutmeg", label: "Nuez Moscada", color: "#E67E22" },
          { id: "cinnamon", label: "Canela", color: "#BF5B17" },
          { id: "clove", label: "Clavo", color: "#6D4C41" },
        ],
      },
    ],
  },

  {
    id: "nutty-cocoa",
    label: "Nueces/Cacao",
    color: "#B87333",
    children: [
      {
        id: "nutty",
        label: "Nueces",
        color: "#C68B59",
        children: [
          { id: "peanuts", label: "Maní", color: "#D4A017" },
          { id: "hazelnut", label: "Avellana", color: "#A47551" },
          { id: "almond", label: "Almendra", color: "#BC8F6F" },
        ],
      },
      {
        id: "cocoa",
        label: "Cacao",
        color: "#6D4C41",
        children: [
          { id: "chocolate", label: "Chocolate", color: "#5D4037" },
          {
            id: "dark-chocolate",
            label: "Chocolate Amargo",
            color: "#3E2723",
          },
        ],
      },
    ],
  },

  {
    id: "sweet",
    label: "Dulce",
    color: "#F57C00",
    children: [
      {
        id: "brown-sugar",
        label: "Azúcar Morena",
        color: "#E57373",
        children: [
          { id: "molasses", label: "Melaza", color: "#5D4037" },
          { id: "maple-syrup", label: "Jarabe de Arce", color: "#8D6E63" },
          { id: "caramelized", label: "Caramelizado", color: "#EF6C00" },
          { id: "honey", label: "Miel", color: "#FF8F00" },
        ],
      },
      {
        id: "vanilla",
        label: "Vainilla",
        color: "#C68B59",
        children: [
          { id: "vanilla-flavor", label: "Vainilla", color: "#BCAAA4" },
        ],
      },
    ],
  },

  {
    id: "floral",
    label: "Floral",
    color: "#EC407A",
    children: [
      {
        id: "black-tea",
        label: "Floral",
        color: "#D81B60",
        children: [
          { id: "black-tea-flavor", label: "Manzanilla", color: "#F9A825" },
          { id: "rose", label: "Rosa", color: "#E91E63" },
          { id: "jasmine", label: "Jazmín", color: "#8D6E63" },
        ],
      },
    ],
  },
];
