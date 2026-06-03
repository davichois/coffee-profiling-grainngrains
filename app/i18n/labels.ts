import type { Locale } from "./config";

// Locales that get explicit flavor translations. `es` is the source of truth
// (it lives in the wheel data itself), so anything missing here falls back to
// the Spanish label — which is also the correct behaviour for Peruvian proper
// nouns that don't translate (lúcuma, huacatay, ají amarillo, …).
type TranslatedLocale = Exclude<Locale, "es">;

// id → { per-locale label }. Several Peru category ids mirror an SCA concept
// (e.g. `berry-peru`), so they share the same translation.
const T: Record<string, Record<TranslatedLocale, string>> = {
  // ── Fruity ──
  fruity: { en: "Fruity", pt: "Frutado", fr: "Fruité", de: "Fruchtig", zh: "果香", ja: "フルーティー" },
  "afrutado-selvatico": { en: "Fruity", pt: "Frutado", fr: "Fruité", de: "Fruchtig", zh: "果香", ja: "フルーティー" },
  berry: { en: "Berry", pt: "Frutos Vermelhos", fr: "Baies", de: "Beeren", zh: "莓果", ja: "ベリー" },
  "berry-peru": { en: "Berry", pt: "Frutos Vermelhos", fr: "Baies", de: "Beeren", zh: "莓果", ja: "ベリー" },
  blackberry: { en: "Blackberry", pt: "Amora", fr: "Mûre", de: "Brombeere", zh: "黑莓", ja: "ブラックベリー" },
  raspberry: { en: "Raspberry", pt: "Framboesa", fr: "Framboise", de: "Himbeere", zh: "覆盆子", ja: "ラズベリー" },
  blueberry: { en: "Blueberry", pt: "Mirtilo", fr: "Myrtille", de: "Heidelbeere", zh: "蓝莓", ja: "ブルーベリー" },
  strawberry: { en: "Strawberry", pt: "Morango", fr: "Fraise", de: "Erdbeere", zh: "草莓", ja: "ストロベリー" },
  "dried-fruit": { en: "Dried Fruit", pt: "Frutas Secas", fr: "Fruits Secs", de: "Trockenfrüchte", zh: "干果", ja: "ドライフルーツ" },
  "dried-fruit-peru": { en: "Dried Fruit", pt: "Frutas Secas", fr: "Fruits Secs", de: "Trockenfrüchte", zh: "干果", ja: "ドライフルーツ" },
  raisin: { en: "Raisin", pt: "Uva-passa", fr: "Raisin Sec", de: "Rosine", zh: "葡萄干", ja: "レーズン" },
  prune: { en: "Prune", pt: "Ameixa Seca", fr: "Pruneau", de: "Backpflaume", zh: "西梅", ja: "プルーン" },
  "other-fruit": { en: "Other Fruit", pt: "Outras Frutas", fr: "Autres Fruits", de: "Andere Früchte", zh: "其他水果", ja: "その他の果実" },
  "otras-frutas-peru": { en: "Other Fruit", pt: "Outras Frutas", fr: "Autres Fruits", de: "Andere Früchte", zh: "其他水果", ja: "その他の果実" },
  coconut: { en: "Coconut", pt: "Coco", fr: "Noix de Coco", de: "Kokosnuss", zh: "椰子", ja: "ココナッツ" },
  cherry: { en: "Cherry", pt: "Cereja", fr: "Cerise", de: "Kirsche", zh: "樱桃", ja: "チェリー" },
  pomegranate: { en: "Pomegranate", pt: "Romã", fr: "Grenade", de: "Granatapfel", zh: "石榴", ja: "ザクロ" },
  pineapple: { en: "Pineapple", pt: "Abacaxi", fr: "Ananas", de: "Ananas", zh: "菠萝", ja: "パイナップル" },
  grape: { en: "Grape", pt: "Uva", fr: "Raisin", de: "Traube", zh: "葡萄", ja: "グレープ" },
  apple: { en: "Apple", pt: "Maçã", fr: "Pomme", de: "Apfel", zh: "苹果", ja: "りんご" },
  peach: { en: "Peach", pt: "Pêssego", fr: "Pêche", de: "Pfirsich", zh: "桃子", ja: "ピーチ" },
  pear: { en: "Pear", pt: "Pera", fr: "Poire", de: "Birne", zh: "梨", ja: "洋ナシ" },
  "citrus-fruit": { en: "Citrus", pt: "Cítricos", fr: "Agrumes", de: "Zitrus", zh: "柑橘", ja: "柑橘類" },
  "citricos-peru": { en: "Citrus", pt: "Cítricos", fr: "Agrumes", de: "Zitrus", zh: "柑橘", ja: "柑橘類" },
  grapefruit: { en: "Grapefruit", pt: "Toranja", fr: "Pamplemousse", de: "Grapefruit", zh: "西柚", ja: "グレープフルーツ" },
  orange: { en: "Orange", pt: "Laranja", fr: "Orange", de: "Orange", zh: "橙子", ja: "オレンジ" },
  lemon: { en: "Lemon", pt: "Limão", fr: "Citron", de: "Zitrone", zh: "柠檬", ja: "レモン" },
  lime: { en: "Lime", pt: "Lima", fr: "Citron Vert", de: "Limette", zh: "青柠", ja: "ライム" },

  // ── Sour / Fermented ──
  "sour-fermented": { en: "Sour/Fermented", pt: "Ácido/Fermentado", fr: "Acide/Fermenté", de: "Sauer/Fermentiert", zh: "酸味/发酵", ja: "酸味/発酵" },
  sour: { en: "Sour", pt: "Ácido", fr: "Acide", de: "Sauer", zh: "酸味", ja: "酸味" },
  "acido-peru": { en: "Sour", pt: "Ácido", fr: "Acide", de: "Sauer", zh: "酸味", ja: "酸味" },
  "acido-fermentado-peru": { en: "Sour/Fermented", pt: "Ácido/Fermentado", fr: "Acide/Fermenté", de: "Sauer/Fermentiert", zh: "酸味/发酵", ja: "酸味/発酵" },
  "sour-aromatics": { en: "Sour Aromatics", pt: "Aromas Ácidos", fr: "Arômes Acides", de: "Säurearomen", zh: "酸香气", ja: "酸の香り" },
  "acetic-acid": { en: "Acetic Acid", pt: "Ácido Acético", fr: "Acide Acétique", de: "Essigsäure", zh: "乙酸", ja: "酢酸" },
  "butyric-acid": { en: "Butyric Acid", pt: "Ácido Butírico", fr: "Acide Butyrique", de: "Buttersäure", zh: "丁酸", ja: "酪酸" },
  "isovaleric-acid": { en: "Isovaleric Acid", pt: "Ácido Isovalérico", fr: "Acide Isovalérique", de: "Isovaleriansäure", zh: "异戊酸", ja: "イソ吉草酸" },
  "citric-acid": { en: "Citric Acid", pt: "Ácido Cítrico", fr: "Acide Citrique", de: "Zitronensäure", zh: "柠檬酸", ja: "クエン酸" },
  "malic-acid": { en: "Malic Acid", pt: "Ácido Málico", fr: "Acide Malique", de: "Apfelsäure", zh: "苹果酸", ja: "リンゴ酸" },
  "phosphoric-acid": { en: "Phosphoric Acid", pt: "Ácido Fosfórico", fr: "Acide Phosphorique", de: "Phosphorsäure", zh: "磷酸", ja: "リン酸" },
  "lactic-acid": { en: "Lactic Acid", pt: "Ácido Láctico", fr: "Acide Lactique", de: "Milchsäure", zh: "乳酸", ja: "乳酸" },
  "alcohol-fermented": { en: "Fermented", pt: "Fermentado", fr: "Fermenté", de: "Fermentiert", zh: "发酵", ja: "発酵" },
  "fermentados-peruanos": { en: "Fermented", pt: "Fermentados", fr: "Fermentés", de: "Fermentiert", zh: "发酵类", ja: "発酵系" },
  winey: { en: "Winey", pt: "Vinho", fr: "Vineux", de: "Weinig", zh: "酒香", ja: "ワイン様" },
  whiskey: { en: "Whiskey", pt: "Whisky", fr: "Whisky", de: "Whiskey", zh: "威士忌", ja: "ウイスキー" },
  fermented: { en: "Fermented", pt: "Fermentado", fr: "Fermenté", de: "Fermentiert", zh: "发酵", ja: "発酵" },
  overripe: { en: "Overripe", pt: "Muito Maduro", fr: "Trop Mûr", de: "Überreif", zh: "过熟", ja: "熟しすぎ" },

  // ── Green / Vegetative ──
  "green-vegetative": { en: "Green/Vegetative", pt: "Vegetal", fr: "Végétal", de: "Pflanzlich", zh: "植物味", ja: "植物様" },
  "vegetal-peru": { en: "Green/Vegetative", pt: "Vegetal", fr: "Végétal", de: "Pflanzlich", zh: "植物味", ja: "植物様" },
  "olive-oil": { en: "Olive Oil", pt: "Azeite de Oliva", fr: "Huile d'Olive", de: "Olivenöl", zh: "橄榄油", ja: "オリーブオイル" },
  "olive-oil-flavor": { en: "Olive Oil", pt: "Azeite de Oliva", fr: "Huile d'Olive", de: "Olivenöl", zh: "橄榄油", ja: "オリーブオイル" },
  "aceite-oliva-peru": { en: "Olive Oil", pt: "Azeite de Oliva", fr: "Huile d'Olive", de: "Olivenöl", zh: "橄榄油", ja: "オリーブオイル" },
  raw: { en: "Raw Vegetal", pt: "Vegetal Cru", fr: "Végétal Cru", de: "Roh Pflanzlich", zh: "生青味", ja: "生の植物" },
  "vegetal-crudo-peru": { en: "Raw Vegetal", pt: "Vegetal Cru", fr: "Végétal Cru", de: "Roh Pflanzlich", zh: "生青味", ja: "生の植物" },
  "under-ripe": { en: "Under-ripe", pt: "Pouco Maduro", fr: "Pas Mûr", de: "Unreif", zh: "未熟", ja: "未熟" },
  peapod: { en: "Peapod", pt: "Vagem de Ervilha", fr: "Cosse de Pois", de: "Erbsenschote", zh: "豌豆荚", ja: "さやえんどう" },
  fresh: { en: "Fresh", pt: "Fresco", fr: "Frais", de: "Frisch", zh: "清新", ja: "フレッシュ" },
  "dark-green": { en: "Dark Green", pt: "Verde Escuro", fr: "Vert Foncé", de: "Dunkelgrün", zh: "深绿", ja: "濃い緑" },
  vegetative: { en: "Vegetative", pt: "Vegetativo", fr: "Végétatif", de: "Vegetativ", zh: "草本", ja: "青草様" },
  "hay-like": { en: "Hay-like", pt: "Tipo Feno", fr: "Type Foin", de: "Heuartig", zh: "干草味", ja: "干し草様" },
  "herb-like": { en: "Herb-like", pt: "Herbáceo", fr: "Herbacé", de: "Kräuterartig", zh: "草药味", ja: "ハーブ様" },

  // ── Other / Musty-Papery (data uses remapped Spanish concepts) ──
  other: { en: "Other", pt: "Outros", fr: "Autres", de: "Andere", zh: "其他", ja: "その他" },
  "otros-peru": { en: "Other", pt: "Outros", fr: "Autres", de: "Andere", zh: "其他", ja: "その他" },
  "papery-musty": { en: "Damp/Papery", pt: "Húmido/Papel", fr: "Humide/Papier", de: "Feucht/Papierartig", zh: "潮湿/纸味", ja: "湿気/紙様" },
  "papery-musty-peru": { en: "Damp/Papery", pt: "Húmido/Papel", fr: "Humide/Papier", de: "Feucht/Papierartig", zh: "潮湿/纸味", ja: "湿気/紙様" },
  stale: { en: "Animal", pt: "Animal", fr: "Animal", de: "Animalisch", zh: "动物味", ja: "動物臭" },
  cardboard: { en: "Earthy", pt: "Terroso", fr: "Terreux", de: "Erdig", zh: "泥土味", ja: "土っぽい" },
  papery: { en: "Dusty", pt: "Poeira", fr: "Poussière", de: "Staubig", zh: "灰尘味", ja: "ほこり臭" },
  woody: { en: "Woody", pt: "Amadeirado", fr: "Boisé", de: "Holzig", zh: "木质味", ja: "木質" },
  "moldy-damp": { en: "Damp", pt: "Húmido", fr: "Humide", de: "Feucht", zh: "潮湿", ja: "湿気" },
  "musty-dusty": { en: "Papery", pt: "Papel", fr: "Papier", de: "Papierartig", zh: "纸味", ja: "紙様" },
  "musty-earthy": { en: "Cardboard", pt: "Papelão", fr: "Carton", de: "Pappe", zh: "纸板味", ja: "段ボール" },

  // ── Chemical ──
  chemical: { en: "Chemical", pt: "Químico", fr: "Chimique", de: "Chemisch", zh: "化学味", ja: "化学的" },
  "quimico-peru": { en: "Chemical", pt: "Químico", fr: "Chimique", de: "Chemisch", zh: "化学味", ja: "化学的" },
  bitter: { en: "Bitter", pt: "Amargo", fr: "Amer", de: "Bitter", zh: "苦味", ja: "苦味" },
  salty: { en: "Salty", pt: "Salgado", fr: "Salé", de: "Salzig", zh: "咸味", ja: "塩味" },
  medicinal: { en: "Medicinal", pt: "Medicinal", fr: "Médicinal", de: "Medizinisch", zh: "药味", ja: "薬品臭" },
  petroleum: { en: "Petroleum", pt: "Petróleo", fr: "Pétrole", de: "Petroleum", zh: "石油味", ja: "石油臭" },
  skunky: { en: "Skunky", pt: "Skunk", fr: "Putois", de: "Stinktier", zh: "臭鼬味", ja: "スカンク臭" },
  rubber: { en: "Rubber", pt: "Borracha", fr: "Caoutchouc", de: "Gummi", zh: "橡胶味", ja: "ゴム臭" },

  // ── Roasted ──
  roasted: { en: "Roasted", pt: "Torrado", fr: "Torréfié", de: "Geröstet", zh: "烘焙", ja: "ロースト" },
  "tostados-maiz": { en: "Roasted & Corn", pt: "Torrado e Milho", fr: "Torréfié & Maïs", de: "Geröstet & Mais", zh: "烘焙与玉米", ja: "ロースト＆トウモロコシ" },
  burnt: { en: "Burnt", pt: "Queimado", fr: "Brûlé", de: "Verbrannt", zh: "焦味", ja: "焦げ" },
  "quemado-peru": { en: "Burnt", pt: "Queimado", fr: "Brûlé", de: "Verbrannt", zh: "焦味", ja: "焦げ" },
  acrid: { en: "Acrid", pt: "Acre", fr: "Âcre", de: "Beißend", zh: "刺激味", ja: "刺激臭" },
  acre: { en: "Acrid", pt: "Acre", fr: "Âcre", de: "Beißend", zh: "刺激味", ja: "刺激臭" },
  ashy: { en: "Ashy", pt: "Cinza", fr: "Cendré", de: "Aschig", zh: "灰烬味", ja: "灰っぽい" },
  smoky: { en: "Smoky", pt: "Fumaça", fr: "Fumé", de: "Rauchig", zh: "烟熏味", ja: "スモーキー" },
  "brown-roast": { en: "Brown Roast", pt: "Torra Média", fr: "Torréfaction Brune", de: "Mittlere Röstung", zh: "中度烘焙", ja: "ブラウンロースト" },
  cereal: { en: "Cereal", pt: "Cereal", fr: "Céréale", de: "Getreide", zh: "谷物", ja: "シリアル" },
  "cereal-maiz": { en: "Cereal & Corn", pt: "Cereal e Milho", fr: "Céréale & Maïs", de: "Getreide & Mais", zh: "谷物与玉米", ja: "シリアル＆トウモロコシ" },
  grain: { en: "Grain", pt: "Grão", fr: "Grain", de: "Korn", zh: "谷粒", ja: "穀物" },
  malt: { en: "Malt", pt: "Malte", fr: "Malt", de: "Malz", zh: "麦芽", ja: "モルト" },

  // ── Spices ──
  spices: { en: "Spices", pt: "Especiarias", fr: "Épices", de: "Gewürze", zh: "香料", ja: "スパイス" },
  "especias-ajies": { en: "Spices & Chilies", pt: "Especiarias e Pimentas", fr: "Épices & Piments", de: "Gewürze & Chilis", zh: "香料与辣椒", ja: "スパイス＆唐辛子" },
  pepper: { en: "Pepper", pt: "Pimenta", fr: "Poivre", de: "Pfeffer", zh: "胡椒", ja: "胡椒" },
  "pepper-flavor": { en: "Pepper", pt: "Pimenta", fr: "Poivre", de: "Pfeffer", zh: "胡椒", ja: "胡椒" },
  "pimienta-peru": { en: "Pepper", pt: "Pimenta", fr: "Poivre", de: "Pfeffer", zh: "胡椒", ja: "胡椒" },
  "brown-spice": { en: "Brown Spice", pt: "Especiarias Escuras", fr: "Épices Brunes", de: "Braune Gewürze", zh: "棕色香料", ja: "ブラウンスパイス" },
  "especias-marrones-peru": { en: "Brown Spice", pt: "Especiarias Escuras", fr: "Épices Brunes", de: "Braune Gewürze", zh: "棕色香料", ja: "ブラウンスパイス" },
  anise: { en: "Anise", pt: "Anis", fr: "Anis", de: "Anis", zh: "茴香", ja: "アニス" },
  nutmeg: { en: "Nutmeg", pt: "Noz-moscada", fr: "Muscade", de: "Muskatnuss", zh: "肉豆蔻", ja: "ナツメグ" },
  cinnamon: { en: "Cinnamon", pt: "Canela", fr: "Cannelle", de: "Zimt", zh: "肉桂", ja: "シナモン" },
  clove: { en: "Clove", pt: "Cravo", fr: "Clou de Girofle", de: "Nelke", zh: "丁香", ja: "クローブ" },

  // ── Nutty / Cocoa ──
  "nutty-cocoa": { en: "Nutty/Cocoa", pt: "Nozes/Cacau", fr: "Noix/Cacao", de: "Nüsse/Kakao", zh: "坚果/可可", ja: "ナッツ/カカオ" },
  "nueces-cacao-nativo": { en: "Nutty/Native Cocoa", pt: "Nozes/Cacau Nativo", fr: "Noix/Cacao Natif", de: "Nüsse/Nativer Kakao", zh: "坚果/原生可可", ja: "ナッツ/在来カカオ" },
  nutty: { en: "Nutty", pt: "Nozes", fr: "Noix", de: "Nüsse", zh: "坚果", ja: "ナッツ" },
  "nueces-peru": { en: "Nutty", pt: "Nozes", fr: "Noix", de: "Nüsse", zh: "坚果", ja: "ナッツ" },
  peanuts: { en: "Peanut", pt: "Amendoim", fr: "Cacahuète", de: "Erdnuss", zh: "花生", ja: "ピーナッツ" },
  hazelnut: { en: "Hazelnut", pt: "Avelã", fr: "Noisette", de: "Haselnuss", zh: "榛子", ja: "ヘーゼルナッツ" },
  almond: { en: "Almond", pt: "Amêndoa", fr: "Amande", de: "Mandel", zh: "杏仁", ja: "アーモンド" },
  cocoa: { en: "Cocoa", pt: "Cacau", fr: "Cacao", de: "Kakao", zh: "可可", ja: "カカオ" },
  "cacao-nativo-peru": { en: "Native Cocoa", pt: "Cacau Nativo", fr: "Cacao Natif", de: "Nativer Kakao", zh: "原生可可", ja: "在来カカオ" },
  chocolate: { en: "Chocolate", pt: "Chocolate", fr: "Chocolat", de: "Schokolade", zh: "巧克力", ja: "チョコレート" },
  "dark-chocolate": { en: "Dark Chocolate", pt: "Chocolate Amargo", fr: "Chocolat Noir", de: "Zartbitterschokolade", zh: "黑巧克力", ja: "ダークチョコレート" },

  // ── Sweet ──
  sweet: { en: "Sweet", pt: "Doce", fr: "Sucré", de: "Süß", zh: "甜味", ja: "甘味" },
  "dulce-peruano": { en: "Sweet", pt: "Doce", fr: "Sucré", de: "Süß", zh: "甜味", ja: "甘味" },
  "brown-sugar": { en: "Brown Sugar", pt: "Açúcar Mascavo", fr: "Sucre Roux", de: "Brauner Zucker", zh: "红糖", ja: "黒糖" },
  "azucar-andina": { en: "Andean Sugar", pt: "Açúcar Andino", fr: "Sucre Andin", de: "Andenzucker", zh: "安第斯糖", ja: "アンデス糖" },
  molasses: { en: "Molasses", pt: "Melaço", fr: "Mélasse", de: "Melasse", zh: "糖蜜", ja: "糖蜜" },
  "maple-syrup": { en: "Maple Syrup", pt: "Xarope de Bordo", fr: "Sirop d'Érable", de: "Ahornsirup", zh: "枫糖浆", ja: "メープルシロップ" },
  caramelized: { en: "Caramelized", pt: "Caramelizado", fr: "Caramélisé", de: "Karamellisiert", zh: "焦糖化", ja: "カラメル" },
  honey: { en: "Honey", pt: "Mel", fr: "Miel", de: "Honig", zh: "蜂蜜", ja: "ハチミツ" },
  vanilla: { en: "Vanilla", pt: "Baunilha", fr: "Vanille", de: "Vanille", zh: "香草", ja: "バニラ" },
  "vainilla-peru": { en: "Vanilla", pt: "Baunilha", fr: "Vanille", de: "Vanille", zh: "香草", ja: "バニラ" },
  "vanilla-flavor": { en: "Vanilla", pt: "Baunilha", fr: "Vanille", de: "Vanille", zh: "香草", ja: "バニラ" },
  vanillin: { en: "Vanillin", pt: "Vanilina", fr: "Vanilline", de: "Vanillin", zh: "香兰素", ja: "バニリン" },
  "dulces-tradicionales": { en: "Traditional Sweets", pt: "Doces Tradicionais", fr: "Sucreries Traditionnelles", de: "Traditionelle Süßspeisen", zh: "传统甜点", ja: "伝統菓子" },

  // ── Floral ──
  floral: { en: "Floral", pt: "Floral", fr: "Floral", de: "Blumig", zh: "花香", ja: "フローラル" },
  "floral-nativo": { en: "Native Floral", pt: "Floral Nativo", fr: "Floral Natif", de: "Native Blüten", zh: "原生花香", ja: "在来フローラル" },
  "floral-aromatics": { en: "Floral", pt: "Floral", fr: "Floral", de: "Blumig", zh: "花香", ja: "フローラル" },
  "florales-nativos": { en: "Native Florals", pt: "Florais Nativos", fr: "Floraux Natifs", de: "Native Blüten", zh: "原生花卉", ja: "在来の花" },
  "black-tea": { en: "Black Tea", pt: "Chá Preto", fr: "Thé Noir", de: "Schwarzer Tee", zh: "红茶", ja: "紅茶" },
  "black-tea-flavor": { en: "Black Tea", pt: "Chá Preto", fr: "Thé Noir", de: "Schwarzer Tee", zh: "红茶", ja: "紅茶" },
  "te-negro-peru": { en: "Black Tea", pt: "Chá Preto", fr: "Thé Noir", de: "Schwarzer Tee", zh: "红茶", ja: "紅茶" },
  rose: { en: "Rose", pt: "Rosa", fr: "Rose", de: "Rose", zh: "玫瑰", ja: "ローズ" },
  jasmine: { en: "Jasmine", pt: "Jasmim", fr: "Jasmin", de: "Jasmin", zh: "茉莉", ja: "ジャスミン" },
  chamomile: { en: "Chamomile", pt: "Camomila", fr: "Camomille", de: "Kamille", zh: "洋甘菊", ja: "カモミール" },

  // ── Peru — translatable categories & well-known botanicals ──
  "frutas-amazonicas": { en: "Amazonia", pt: "Amazônia", fr: "Amazonie", de: "Amazonien", zh: "亚马逊", ja: "アマゾン" },
  "frutas-andinas": { en: "Andean Fruits", pt: "Frutas Andinas", fr: "Fruits Andins", de: "Anden-Früchte", zh: "安第斯水果", ja: "アンデスの果実" },
  "ajies-peruanos": { en: "Peruvian Chilies", pt: "Pimentas Peruanas", fr: "Piments Péruviens", de: "Peruanische Chilis", zh: "秘鲁辣椒", ja: "ペルーの唐辛子" },
  "hierbas-aromaticas": { en: "Aromatic Herbs", pt: "Ervas Aromáticas", fr: "Herbes Aromatiques", de: "Aromatische Kräuter", zh: "芳香草本", ja: "香草" },
  guanabana: { en: "Soursop", pt: "Graviola", fr: "Corossol", de: "Stachelannone", zh: "刺果番荔枝", ja: "サワーソップ" },
  chirimoya: { en: "Cherimoya", pt: "Cherimólia", fr: "Chérimole", de: "Cherimoya", zh: "番荔枝", ja: "チェリモヤ" },
  tamarindo: { en: "Tamarind", pt: "Tamarindo", fr: "Tamarin", de: "Tamarinde", zh: "罗望子", ja: "タマリンド" },
  tuna: { en: "Prickly Pear", pt: "Figo-da-índia", fr: "Figue de Barbarie", de: "Kaktusfeige", zh: "仙人掌果", ja: "ウチワサボテンの実" },
  sauco: { en: "Elderberry", pt: "Sabugueiro", fr: "Sureau", de: "Holunder", zh: "接骨木莓", ja: "エルダーベリー" },
  culantro: { en: "Cilantro", pt: "Coentro", fr: "Coriandre", de: "Koriander", zh: "香菜", ja: "コリアンダー" },
  "hierba-luisa": { en: "Lemon Verbena", pt: "Erva-cidreira", fr: "Verveine Citronnelle", de: "Zitronenverbene", zh: "柠檬马鞭草", ja: "レモンバーベナ" },
  azahar: { en: "Orange Blossom", pt: "Flor de Laranjeira", fr: "Fleur d'Oranger", de: "Orangenblüte", zh: "橙花", ja: "オレンジの花" },
  tilo: { en: "Linden", pt: "Tília", fr: "Tilleul", de: "Linde", zh: "椴花", ja: "リンデン" },
  "flor-cacao": { en: "Cacao Flower", pt: "Flor de Cacau", fr: "Fleur de Cacao", de: "Kakaoblüte", zh: "可可花", ja: "カカオの花" },
};

// Pre-transpose into per-locale maps once at module load.
const LABELS: Record<string, Record<string, string>> = {};
for (const [id, perLocale] of Object.entries(T)) {
  for (const [loc, label] of Object.entries(perLocale)) {
    (LABELS[loc] ??= {})[id] = label;
  }
}

/**
 * Localized label for a flavor node. Falls back to the Spanish label that
 * lives in the wheel data (correct for Peruvian proper nouns that don't
 * translate, and a safe default for anything not yet covered).
 */
export function labelFor(id: string, esLabel: string, locale: Locale): string {
  if (locale === "es") return esLabel;
  return LABELS[locale]?.[id] ?? esLabel;
}
