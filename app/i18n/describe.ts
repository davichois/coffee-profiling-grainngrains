import type { Locale } from "./config";
import type { FlavorNode } from "../data/flavorWheel";

// ─── Sentence templates for the auto-generated cupping description ───────────
// Flavor names arrive already wrapped in [[…]] so the UI can highlight them.
export interface DescribeStrings {
  listSep: string; // separator between list items
  listLast: string; // connective before the final item (" y ", " and ", …)
  fragranceBoth: (aromatic: string, fruity: string) => string;
  fragranceAromatic: (aromatic: string) => string;
  fragranceFruity: (fruity: string) => string;
  palateStart: (items: string) => string;
  palateSweetRoasty: (sweet: string, roasty: string, spice: string) => string;
  palateSweet: (sweet: string, spice: string) => string;
  palateRoasty: (roasty: string, spice: string) => string;
  palateOther: (items: string) => string;
  acidityHigh: (acidic: string) => string;
  acidityMid: (acidic: string) => string;
  acidityLow: (acidic: string) => string;
  neutral: (items: string) => string;
  finishLong: string;
  finishMid: string;
  finishShort: string;
  defectOne: (defect: string) => string;
  defectMany: (defects: string) => string;
  empty: string;
  sca90: (s: string) => string;
  sca85: (s: string) => string;
  sca80: (s: string) => string;
  sca75: (s: string) => string;
  scaLow: (s: string) => string;
}

const STRINGS: Record<Locale, DescribeStrings> = {
  es: {
    listSep: ", ",
    listLast: " y ",
    fragranceBoth: (a, f) =>
      `En fragancia, la muestra abre con una expresión aromática de ${a}, entrelazada con notas frutales de ${f}.`,
    fragranceAromatic: (a) =>
      `En fragancia, predomina una nota floral de ${a} que perfuma el primer contacto con la taza.`,
    fragranceFruity: (f) =>
      `En fragancia, la muestra expresa notas frutales de ${f} con buena intensidad.`,
    palateStart: (items) => `En taza, el perfil de sabor despliega ${items}.`,
    palateSweetRoasty: (sweet, roasty, spice) =>
      `En el paladar, la dulzura de ${sweet} dialoga con un fondo tostado de ${roasty}${spice ? `, con matices especiados de ${spice}` : ""}.`,
    palateSweet: (sweet, spice) =>
      `En boca, el cuerpo medio se apoya en una base de ${sweet}${spice ? ` y especias de ${spice}` : ""}.`,
    palateRoasty: (roasty, spice) =>
      `En taza, el perfil tostado de ${roasty} domina el paladar${spice ? `, acompañado de ${spice}` : ""}.`,
    palateOther: (items) => `En boca se perciben notas de ${items}.`,
    acidityHigh: (a) =>
      `La acidez es viva y bien estructurada, con notas de ${a} que elevan la complejidad de la taza.`,
    acidityMid: (a) =>
      `La acidez, de carácter ${a}, aporta frescura y equilibrio sin resultar invasiva.`,
    acidityLow: (a) =>
      `Se detecta acidez de tipo ${a}, aunque requiere mayor integración con el resto del perfil.`,
    neutral: (items) =>
      `El cuerpo exhibe notas de ${items} que redondean la textura en la boca.`,
    finishLong:
      "El retrogusto es largo y persistente, con un final limpio que invita al siguiente sorbo.",
    finishMid: "El final deja una sensación agradable y bien definida en el paladar.",
    finishShort: "El retrogusto es corto pero reconocible.",
    defectOne: (d) =>
      `Se detecta un defecto de ${d} que compromete la limpieza de la taza y debe tenerse en cuenta en la evaluación final.`,
    defectMany: (d) =>
      `Se registran defectos de ${d}, los cuales reducen la puntuación de limpieza e impactan la experiencia global.`,
    empty:
      "Perfil en construcción — selecciona atributos para generar la descripción de cata.",
    sca90: (s) =>
      `Puntuación SCA estimada: ${s} — taza de specialty de clase superior, expresión limpia y complejidad que supera las expectativas de protocolo.`,
    sca85: (s) =>
      `Puntuación SCA estimada: ${s} — café specialty de alta calidad, con atributos que exceden los estándares mínimos de protocolo.`,
    sca80: (s) =>
      `Puntuación SCA estimada: ${s} — califica como specialty según el protocolo SCA, con balance y uniformidad satisfactorios.`,
    sca75: (s) =>
      `Puntuación SCA estimada: ${s} — por debajo del umbral specialty (80 pts), con potencial identificable que requiere trabajo en el proceso.`,
    scaLow: (s) =>
      `Puntuación SCA estimada: ${s} — perfil con defectos o desequilibrios que no alcanzan el corte de specialty.`,
  },
  en: {
    listSep: ", ",
    listLast: " and ",
    fragranceBoth: (a, f) =>
      `On the fragrance, the sample opens with an aromatic expression of ${a}, interwoven with fruity notes of ${f}.`,
    fragranceAromatic: (a) =>
      `On the fragrance, a floral note of ${a} dominates, perfuming the first contact with the cup.`,
    fragranceFruity: (f) =>
      `On the fragrance, the sample shows fruity notes of ${f} with good intensity.`,
    palateStart: (items) => `In the cup, the flavor profile unfolds with ${items}.`,
    palateSweetRoasty: (sweet, roasty, spice) =>
      `On the palate, the sweetness of ${sweet} converses with a roasted base of ${roasty}${spice ? `, with spiced hints of ${spice}` : ""}.`,
    palateSweet: (sweet, spice) =>
      `In the mouth, a medium body rests on a base of ${sweet}${spice ? ` and spices of ${spice}` : ""}.`,
    palateRoasty: (roasty, spice) =>
      `In the cup, the roasted profile of ${roasty} dominates the palate${spice ? `, accompanied by ${spice}` : ""}.`,
    palateOther: (items) => `In the mouth, notes of ${items} are perceived.`,
    acidityHigh: (a) =>
      `The acidity is lively and well-structured, with notes of ${a} that lift the complexity of the cup.`,
    acidityMid: (a) =>
      `The acidity, of a ${a} character, brings freshness and balance without being intrusive.`,
    acidityLow: (a) =>
      `Acidity of the ${a} type is detected, though it needs better integration with the rest of the profile.`,
    neutral: (items) =>
      `The body shows notes of ${items} that round out the texture in the mouth.`,
    finishLong:
      "The aftertaste is long and persistent, with a clean finish that invites the next sip.",
    finishMid: "The finish leaves a pleasant, well-defined sensation on the palate.",
    finishShort: "The aftertaste is short but recognizable.",
    defectOne: (d) =>
      `A defect of ${d} is detected, compromising the cleanliness of the cup and to be considered in the final evaluation.`,
    defectMany: (d) =>
      `Defects of ${d} are recorded, reducing the cleanliness score and impacting the overall experience.`,
    empty:
      "Profile in progress — select attributes to generate the cupping description.",
    sca90: (s) =>
      `Estimated SCA score: ${s} — a top-class specialty cup, clean expression and complexity that exceeds protocol expectations.`,
    sca85: (s) =>
      `Estimated SCA score: ${s} — high-quality specialty coffee, with attributes exceeding the minimum protocol standards.`,
    sca80: (s) =>
      `Estimated SCA score: ${s} — qualifies as specialty under the SCA protocol, with satisfactory balance and uniformity.`,
    sca75: (s) =>
      `Estimated SCA score: ${s} — below the specialty threshold (80 pts), with identifiable potential that needs work in processing.`,
    scaLow: (s) =>
      `Estimated SCA score: ${s} — a profile with defects or imbalances that fall short of the specialty cut.`,
  },
  pt: {
    listSep: ", ",
    listLast: " e ",
    fragranceBoth: (a, f) =>
      `Na fragrância, a amostra abre com uma expressão aromática de ${a}, entrelaçada com notas frutadas de ${f}.`,
    fragranceAromatic: (a) =>
      `Na fragrância, predomina uma nota floral de ${a} que perfuma o primeiro contato com a xícara.`,
    fragranceFruity: (f) =>
      `Na fragrância, a amostra expressa notas frutadas de ${f} com boa intensidade.`,
    palateStart: (items) => `Na xícara, o perfil de sabor revela ${items}.`,
    palateSweetRoasty: (sweet, roasty, spice) =>
      `No paladar, a doçura de ${sweet} dialoga com um fundo torrado de ${roasty}${spice ? `, com matizes de especiarias de ${spice}` : ""}.`,
    palateSweet: (sweet, spice) =>
      `Na boca, o corpo médio apoia-se numa base de ${sweet}${spice ? ` e especiarias de ${spice}` : ""}.`,
    palateRoasty: (roasty, spice) =>
      `Na xícara, o perfil torrado de ${roasty} domina o paladar${spice ? `, acompanhado de ${spice}` : ""}.`,
    palateOther: (items) => `Na boca percebem-se notas de ${items}.`,
    acidityHigh: (a) =>
      `A acidez é viva e bem estruturada, com notas de ${a} que elevam a complexidade da xícara.`,
    acidityMid: (a) =>
      `A acidez, de caráter ${a}, traz frescor e equilíbrio sem ser invasiva.`,
    acidityLow: (a) =>
      `Detecta-se acidez do tipo ${a}, embora precise de maior integração com o resto do perfil.`,
    neutral: (items) =>
      `O corpo exibe notas de ${items} que arredondam a textura na boca.`,
    finishLong:
      "O retrogosto é longo e persistente, com um final limpo que convida ao próximo gole.",
    finishMid: "O final deixa uma sensação agradável e bem definida no paladar.",
    finishShort: "O retrogosto é curto, mas reconhecível.",
    defectOne: (d) =>
      `Detecta-se um defeito de ${d} que compromete a limpeza da xícara e deve ser considerado na avaliação final.`,
    defectMany: (d) =>
      `Registram-se defeitos de ${d}, que reduzem a pontuação de limpeza e impactam a experiência geral.`,
    empty:
      "Perfil em construção — selecione atributos para gerar a descrição de prova.",
    sca90: (s) =>
      `Pontuação SCA estimada: ${s} — xícara specialty de classe superior, expressão limpa e complexidade que supera as expectativas do protocolo.`,
    sca85: (s) =>
      `Pontuação SCA estimada: ${s} — café specialty de alta qualidade, com atributos que excedem os padrões mínimos do protocolo.`,
    sca80: (s) =>
      `Pontuação SCA estimada: ${s} — qualifica como specialty segundo o protocolo SCA, com equilíbrio e uniformidade satisfatórios.`,
    sca75: (s) =>
      `Pontuação SCA estimada: ${s} — abaixo do limiar specialty (80 pts), com potencial identificável que requer trabalho no processo.`,
    scaLow: (s) =>
      `Pontuação SCA estimada: ${s} — perfil com defeitos ou desequilíbrios que não atingem o corte de specialty.`,
  },
  fr: {
    listSep: ", ",
    listLast: " et ",
    fragranceBoth: (a, f) =>
      `Au parfum, l'échantillon s'ouvre sur une expression aromatique de ${a}, entrelacée de notes fruitées de ${f}.`,
    fragranceAromatic: (a) =>
      `Au parfum, une note florale de ${a} domine et parfume le premier contact avec la tasse.`,
    fragranceFruity: (f) =>
      `Au parfum, l'échantillon exprime des notes fruitées de ${f} avec une belle intensité.`,
    palateStart: (items) => `En tasse, le profil aromatique déploie ${items}.`,
    palateSweetRoasty: (sweet, roasty, spice) =>
      `En bouche, la douceur de ${sweet} dialogue avec un fond torréfié de ${roasty}${spice ? `, avec des nuances épicées de ${spice}` : ""}.`,
    palateSweet: (sweet, spice) =>
      `En bouche, le corps moyen repose sur une base de ${sweet}${spice ? ` et des épices de ${spice}` : ""}.`,
    palateRoasty: (roasty, spice) =>
      `En tasse, le profil torréfié de ${roasty} domine le palais${spice ? `, accompagné de ${spice}` : ""}.`,
    palateOther: (items) => `En bouche, on perçoit des notes de ${items}.`,
    acidityHigh: (a) =>
      `L'acidité est vive et bien structurée, avec des notes de ${a} qui rehaussent la complexité de la tasse.`,
    acidityMid: (a) =>
      `L'acidité, de caractère ${a}, apporte fraîcheur et équilibre sans être envahissante.`,
    acidityLow: (a) =>
      `Une acidité de type ${a} est détectée, bien qu'elle nécessite une meilleure intégration au reste du profil.`,
    neutral: (items) =>
      `Le corps présente des notes de ${items} qui arrondissent la texture en bouche.`,
    finishLong:
      "L'arrière-goût est long et persistant, avec une finale nette qui invite à la gorgée suivante.",
    finishMid: "La finale laisse une sensation agréable et bien définie sur le palais.",
    finishShort: "L'arrière-goût est court mais reconnaissable.",
    defectOne: (d) =>
      `Un défaut de ${d} est détecté, compromettant la propreté de la tasse et à prendre en compte dans l'évaluation finale.`,
    defectMany: (d) =>
      `Des défauts de ${d} sont relevés, réduisant la note de propreté et affectant l'expérience globale.`,
    empty:
      "Profil en construction — sélectionnez des attributs pour générer la description de dégustation.",
    sca90: (s) =>
      `Note SCA estimée : ${s} — tasse specialty de classe supérieure, expression nette et complexité dépassant les attentes du protocole.`,
    sca85: (s) =>
      `Note SCA estimée : ${s} — café specialty de haute qualité, avec des attributs dépassant les standards minimaux du protocole.`,
    sca80: (s) =>
      `Note SCA estimée : ${s} — se qualifie comme specialty selon le protocole SCA, avec un équilibre et une uniformité satisfaisants.`,
    sca75: (s) =>
      `Note SCA estimée : ${s} — sous le seuil specialty (80 pts), avec un potentiel identifiable nécessitant un travail sur le process.`,
    scaLow: (s) =>
      `Note SCA estimée : ${s} — profil présentant des défauts ou déséquilibres n'atteignant pas le seuil specialty.`,
  },
  de: {
    listSep: ", ",
    listLast: " und ",
    fragranceBoth: (a, f) =>
      `Im Duft öffnet sich die Probe mit einer aromatischen Ausprägung von ${a}, verwoben mit fruchtigen Noten von ${f}.`,
    fragranceAromatic: (a) =>
      `Im Duft dominiert eine blumige Note von ${a}, die den ersten Kontakt mit der Tasse parfümiert.`,
    fragranceFruity: (f) =>
      `Im Duft zeigt die Probe fruchtige Noten von ${f} mit guter Intensität.`,
    palateStart: (items) => `In der Tasse entfaltet das Aromaprofil ${items}.`,
    palateSweetRoasty: (sweet, roasty, spice) =>
      `Am Gaumen tritt die Süße von ${sweet} in einen Dialog mit einer gerösteten Basis von ${roasty}${spice ? `, mit würzigen Anklängen von ${spice}` : ""}.`,
    palateSweet: (sweet, spice) =>
      `Im Mund stützt sich der mittlere Körper auf eine Basis von ${sweet}${spice ? ` und Gewürzen von ${spice}` : ""}.`,
    palateRoasty: (roasty, spice) =>
      `In der Tasse dominiert das geröstete Profil von ${roasty} den Gaumen${spice ? `, begleitet von ${spice}` : ""}.`,
    palateOther: (items) => `Im Mund nimmt man Noten von ${items} wahr.`,
    acidityHigh: (a) =>
      `Die Säure ist lebendig und gut strukturiert, mit Noten von ${a}, die die Komplexität der Tasse heben.`,
    acidityMid: (a) =>
      `Die Säure von ${a}-Charakter bringt Frische und Balance, ohne aufdringlich zu sein.`,
    acidityLow: (a) =>
      `Eine Säure vom Typ ${a} wird wahrgenommen, benötigt aber eine bessere Integration in das übrige Profil.`,
    neutral: (items) =>
      `Der Körper zeigt Noten von ${items}, die die Textur im Mund abrunden.`,
    finishLong:
      "Der Nachgeschmack ist lang und anhaltend, mit einem sauberen Abgang, der zum nächsten Schluck einlädt.",
    finishMid: "Der Abgang hinterlässt ein angenehmes, gut definiertes Gefühl am Gaumen.",
    finishShort: "Der Nachgeschmack ist kurz, aber erkennbar.",
    defectOne: (d) =>
      `Ein Fehler von ${d} wird festgestellt, der die Sauberkeit der Tasse beeinträchtigt und in der Endbewertung zu berücksichtigen ist.`,
    defectMany: (d) =>
      `Fehler von ${d} werden erfasst, die die Sauberkeitsbewertung mindern und das Gesamterlebnis beeinträchtigen.`,
    empty:
      "Profil in Arbeit — wähle Attribute aus, um die Verkostungsbeschreibung zu erzeugen.",
    sca90: (s) =>
      `Geschätzte SCA-Bewertung: ${s} — Specialty-Tasse der Spitzenklasse, saubere Ausprägung und Komplexität über den Protokollerwartungen.`,
    sca85: (s) =>
      `Geschätzte SCA-Bewertung: ${s} — hochwertiger Specialty-Kaffee, mit Attributen über den Mindeststandards des Protokolls.`,
    sca80: (s) =>
      `Geschätzte SCA-Bewertung: ${s} — qualifiziert sich als Specialty nach SCA-Protokoll, mit zufriedenstellender Balance und Gleichmäßigkeit.`,
    sca75: (s) =>
      `Geschätzte SCA-Bewertung: ${s} — unter der Specialty-Schwelle (80 Pkt.), mit erkennbarem Potenzial, das Arbeit im Prozess erfordert.`,
    scaLow: (s) =>
      `Geschätzte SCA-Bewertung: ${s} — Profil mit Fehlern oder Ungleichgewichten, das den Specialty-Schnitt nicht erreicht.`,
  },
  zh: {
    listSep: "、",
    listLast: "和",
    fragranceBoth: (a, f) =>
      `在干香中，样品以${a}的芳香表现开场，并交织着${f}的果香。`,
    fragranceAromatic: (a) => `在干香中，${a}的花香占主导，为入杯的第一印象增添芬芳。`,
    fragranceFruity: (f) => `在干香中，样品以良好的强度展现出${f}的果香。`,
    palateStart: (items) => `在杯中，风味轮廓展现出${items}。`,
    palateSweetRoasty: (sweet, roasty, spice) =>
      `在口感上，${sweet}的甜感与${roasty}的烘焙底蕴相互呼应${spice ? `，并带有${spice}的香料气息` : ""}。`,
    palateSweet: (sweet, spice) =>
      `在口中，中等酒体建立在${sweet}的基础之上${spice ? `，并伴有${spice}的香料` : ""}。`,
    palateRoasty: (roasty, spice) =>
      `在杯中，${roasty}的烘焙风味主导口感${spice ? `，并伴随${spice}` : ""}。`,
    palateOther: (items) => `口中可感受到${items}的气息。`,
    acidityHigh: (a) => `酸度活泼且结构良好，${a}的气息提升了整杯的复杂度。`,
    acidityMid: (a) => `${a}特征的酸度带来清新与平衡，而不显突兀。`,
    acidityLow: (a) => `可察觉到${a}类型的酸度，但仍需与其余风味更好地融合。`,
    neutral: (items) => `酒体展现出${items}的气息，使口中的质地更为圆润。`,
    finishLong: "余味悠长持久，收尾干净，令人想再啜一口。",
    finishMid: "尾韵在味蕾上留下愉悦而清晰的感受。",
    finishShort: "余味虽短，但可被识别。",
    defectOne: (d) => `检测到${d}的瑕疵，影响了杯中的洁净度，应在最终评估中予以考量。`,
    defectMany: (d) => `记录到${d}的瑕疵，这些瑕疵降低了洁净度评分并影响整体体验。`,
    empty: "档案构建中——请选择属性以生成品鉴描述。",
    sca90: (s) => `SCA 预估评分：${s} — 顶级精品杯，表现干净，复杂度超出协议预期。`,
    sca85: (s) => `SCA 预估评分：${s} — 高品质精品咖啡，属性超出协议的最低标准。`,
    sca80: (s) => `SCA 预估评分：${s} — 依据 SCA 协议达到精品级，平衡度与一致性令人满意。`,
    sca75: (s) => `SCA 预估评分：${s} — 低于精品门槛（80 分），具可识别的潜力，但加工环节仍需努力。`,
    scaLow: (s) => `SCA 预估评分：${s} — 存在瑕疵或失衡，未达精品标准的档案。`,
  },
  ja: {
    listSep: "、",
    listLast: "と",
    fragranceBoth: (a, f) =>
      `フレグランスでは、サンプルは${a}の芳香で立ち上がり、${f}のフルーティーな香りが絡み合います。`,
    fragranceAromatic: (a) => `フレグランスでは、${a}のフローラルな香りが際立ち、最初の一杯を香らせます。`,
    fragranceFruity: (f) => `フレグランスでは、サンプルが${f}のフルーティーな香りを良好な強度で表現します。`,
    palateStart: (items) => `カップでは、フレーバーのプロファイルが${items}を展開します。`,
    palateSweetRoasty: (sweet, roasty, spice) =>
      `味わいでは、${sweet}の甘さが${roasty}のローストした土台と調和します${spice ? `。${spice}のスパイシーなニュアンスも感じられます` : ""}。`,
    palateSweet: (sweet, spice) =>
      `口中では、ミディアムなボディが${sweet}のベースに支えられています${spice ? `。${spice}のスパイスも伴います` : ""}。`,
    palateRoasty: (roasty, spice) =>
      `カップでは、${roasty}のローストプロファイルが味わいを支配します${spice ? `。${spice}を伴います` : ""}。`,
    palateOther: (items) => `口中では${items}の香りが感じられます。`,
    acidityHigh: (a) => `酸は生き生きとして構成が良く、${a}の香りがカップの複雑さを高めます。`,
    acidityMid: (a) => `${a}の性格を持つ酸が、押し付けがましくなく爽やかさとバランスをもたらします。`,
    acidityLow: (a) => `${a}タイプの酸が感じられますが、profileの残りとの統合が課題です。`,
    neutral: (items) => `ボディは${items}の香りを示し、口中の質感を丸くまとめます。`,
    finishLong: "後味は長く持続し、クリーンなフィニッシュが次の一口を誘います。",
    finishMid: "フィニッシュは心地よく、明確な感覚を味わいに残します。",
    finishShort: "後味は短いものの、識別できます。",
    defectOne: (d) => `${d}の欠点が検出され、カップのクリーンさを損なうため、最終評価で考慮すべきです。`,
    defectMany: (d) => `${d}の欠点が記録され、クリーンさのスコアを下げ、全体の体験に影響します。`,
    empty: "プロファイル作成中 — 属性を選択してテイスティング説明を生成してください。",
    sca90: (s) => `推定SCAスコア：${s} — 最上級のスペシャルティ。クリーンな表現とプロトコルの期待を超える複雑さ。`,
    sca85: (s) => `推定SCAスコア：${s} — 高品質なスペシャルティ。プロトコルの最低基準を上回る特性。`,
    sca80: (s) => `推定SCAスコア：${s} — SCAプロトコルでスペシャルティに該当。バランスと均一性は良好。`,
    sca75: (s) => `推定SCAスコア：${s} — スペシャルティの閾値（80点）未満。明確な可能性はあるが、プロセスに改善が必要。`,
    scaLow: (s) => `推定SCAスコア：${s} — 欠点や不均衡があり、スペシャルティの基準に届かないプロファイル。`,
  },
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
 * Builds the localized cupping description. `nameFor` returns the localized,
 * already-bracket-wrapped flavor name for a given leaf id.
 */
export function buildDescription(
  selected: Set<string>,
  score: number,
  data: FlavorNode[],
  leafScores: Record<string, number>,
  locale: Locale,
  nameFor: (id: string) => string,
): string {
  const t = STRINGS[locale];

  const joinList = (items: string[]): string => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    return items.slice(0, -1).join(t.listSep) + t.listLast + items[items.length - 1];
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
    parts.push(t.fragranceBoth(joinList(aromatic), joinList(fruity)));
  } else if (aromatic.length > 0) {
    parts.push(t.fragranceAromatic(joinList(aromatic)));
  } else if (fruity.length > 0) {
    parts.push(t.fragranceFruity(joinList(fruity)));
  }

  // ── Palate / flavor stage ──
  const palateItems = [...sweet, ...roasty, ...spiceNut, ...other].filter(Boolean);
  const palateAllItems = [
    ...(aromatic.length === 0 ? fruity : []),
    ...sweet,
    ...roasty,
    ...spiceNut,
    ...other,
  ].filter(Boolean);

  if (parts.length === 0 && palateAllItems.length > 0) {
    parts.push(t.palateStart(joinList(palateAllItems)));
  } else if (palateItems.length > 0) {
    if (sweet.length > 0 && roasty.length > 0) {
      parts.push(
        t.palateSweetRoasty(joinList(sweet), joinList(roasty), joinList(spiceNut)),
      );
    } else if (sweet.length > 0) {
      parts.push(t.palateSweet(joinList(sweet), joinList(spiceNut)));
    } else if (roasty.length > 0) {
      parts.push(t.palateRoasty(joinList(roasty), joinList(spiceNut)));
    } else if (spiceNut.length > 0 || other.length > 0) {
      parts.push(t.palateOther(joinList([...spiceNut, ...other])));
    }
  }

  // ── Acidity stage ──
  if (acidic.length > 0) {
    if (score >= 85) parts.push(t.acidityHigh(joinList(acidic)));
    else if (score >= 75) parts.push(t.acidityMid(joinList(acidic)));
    else parts.push(t.acidityLow(joinList(acidic)));
  }

  // ── Neutral / textural notes ──
  if (neutralLabels.length > 0) parts.push(t.neutral(joinList(neutralLabels)));

  // ── Finish / aftertaste ──
  if (score >= 88) parts.push(t.finishLong);
  else if (score >= 80) parts.push(t.finishMid);
  else if (score >= 72) parts.push(t.finishShort);

  // ── Defects ──
  if (negLabels.length === 1) parts.push(t.defectOne(negLabels[0]));
  else if (negLabels.length > 1) parts.push(t.defectMany(joinList(negLabels)));

  // ── Overall / SCA score ──
  if (parts.length === 0) {
    parts.push(t.empty);
  } else {
    const s = score.toFixed(1);
    if (score >= 90) parts.push(t.sca90(s));
    else if (score >= 85) parts.push(t.sca85(s));
    else if (score >= 80) parts.push(t.sca80(s));
    else if (score >= 75) parts.push(t.sca75(s));
    else parts.push(t.scaLow(s));
  }

  return parts.join(" ");
}

export { findMainCat };
