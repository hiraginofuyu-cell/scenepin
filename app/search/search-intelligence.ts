export type SearchableItem = {
  id: string;
  work: string;
  label: string;
  title: string;
  people: string[];
  keywords: string[];
  group: string;
};

export type RankedSearchItem<T extends SearchableItem> = {
  item: T;
  score: number;
  reasons: string[];
};

type SearchConcept = {
  label: string;
  triggers: string[];
  related: string[];
};

const concepts: SearchConcept[] = [
  {
    label: "母の命日・母の仇",
    triggers: ["母", "母親", "お母さん", "ママ", "命日", "雨の日", "6月17日", "母の仇"],
    related: ["黒崎真咲", "グランドフィッシャー", "6月17日", "雨の記憶", "母の命日", "母の仇", "疑似餌"],
  },
  {
    label: "魚のようなホロウ",
    triggers: ["魚", "釣り針", "疑似餌", "魚みたい", "グランドフィッシャー"],
    related: ["グランドフィッシャー", "疑似餌", "母の仇", "ホロウ", "倒せない敵"],
  },
  {
    label: "深い穴・ホロウ化の試練",
    triggers: ["穴", "井戸", "縦穴", "落とされ", "落ちる", "鎖", "ホロウになり", "虚になり"],
    related: ["絶望の縦穴", "シャタードシャフト", "因果の鎖", "ホロウ化", "死神の力", "72時間"],
  },
  {
    label: "巨大なホロウ",
    triggers: ["巨大な虚", "巨大なホロウ", "でかい虚", "でかいホロウ", "大きな虚", "大きなホロウ", "大虚", "メノス"],
    related: ["大虚", "メノスグランデ", "巨大な虚", "虚閃", "背中合わせ", "共闘"],
  },
  {
    label: "弓を使う滅却師",
    triggers: ["弓", "弓矢", "眼鏡", "クインシー", "滅却師", "石田"],
    related: ["石田雨竜", "滅却師", "クインシー", "弓", "撒き餌", "死神との対立"],
  },
  {
    label: "呪われたインコ",
    triggers: ["インコ", "鳥", "鳥かご", "呪い", "シバタ", "シュリーカー"],
    related: ["呪いのインコ", "柴田勇一", "シュリーカー", "チャド", "地獄の門"],
  },
  {
    label: "ぬいぐるみの改造魂魄",
    triggers: ["ぬいぐるみ", "ライオン", "人形", "改造魂魄", "義魂丸", "コン"],
    related: ["コン", "ぬいぐるみ", "改造魂魄", "義魂丸", "浦原商店"],
  },
  {
    label: "心霊番組・霊媒師",
    triggers: ["心霊番組", "テレビ番組", "霊媒師", "観音寺", "ロケ", "心霊スポット"],
    related: ["ドン観音寺", "心霊番組", "霊媒師", "番組ロケ", "地縛霊", "空座町"],
  },
  {
    label: "救出・奪還",
    triggers: ["助けに行", "助ける", "救う", "救出", "奪還", "連れ戻す", "取り戻す"],
    related: ["救出", "奪還", "助ける", "護る", "守る", "連れ戻す", "取り戻す"],
  },
  {
    label: "処刑を止める",
    triggers: ["処刑", "処刑台", "処刑を止め", "殺されそう"],
    related: ["処刑", "処刑台", "双殛", "ルキア奪還", "救出"],
  },
  {
    label: "学校へ現れる転校生",
    triggers: ["転校", "学校に来", "学校へ来", "学校に潜入", "クラスに来"],
    related: ["転校生", "学校", "クラスメイト", "潜入", "再会"],
  },
  {
    label: "力の目覚め・覚醒",
    triggers: ["覚醒", "目覚め", "力を使", "特殊能力", "能力が出", "初めて力"],
    related: ["能力覚醒", "力が覚醒", "目覚め", "特殊な力", "初めて", "力を取り戻す"],
  },
  {
    label: "伏線・違和感",
    triggers: ["伏線", "違和感", "意味深", "あとで分かる", "正体", "秘密", "示唆"],
    related: ["伏線", "違和感", "正体", "秘密", "示唆", "過去", "真実"],
  },
];

const normalizeSearchText = (value: string) => value
  .normalize("NFKC")
  .toLowerCase()
  .replace(/[、。！？!?・,./:：;；（）()「」『』【】\[\]]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const noiseWords = [
  "みたいな",
  "のような",
  "だった",
  "でした",
  "している",
  "していた",
  "されている",
  "された",
  "される",
  "して",
  "した",
  "する",
  "出てくる",
  "出てきた",
  "戦った",
  "戦う",
  "ところ",
  "シーン",
  "場面",
  "エピソード",
  "何話",
  "第",
  "回",
  "話",
];

const stopWords = new Set(["これ", "それ", "あれ", "どれ", "どこ", "何", "なん", "やつ", "もの", "こと", "たぶん", "確か", "覚えて", "思い出せない"]);

const tokenizeQuery = (query: string) => {
  let value = normalizeSearchText(query);
  for (const noise of noiseWords) value = value.replaceAll(noise, " ");
  value = value.replace(/(?:から|まで|より|の|が|を|に|へ|で|と|は)/g, " ");
  const tokens = value.split(/\s+/).filter((token) => token && !stopWords.has(token));
  return [...new Set(tokens.length ? tokens : [normalizeSearchText(query)].filter(Boolean))];
};

const findActiveConcepts = (query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  return concepts.filter((concept) => concept.triggers.some((trigger) => normalizedQuery.includes(normalizeSearchText(trigger))));
};

const getDocumentFields = (item: SearchableItem) => [
  { label: "作品", weight: 24, value: item.work },
  { label: "話数", weight: 22, value: item.label },
  { label: "タイトル", weight: 20, value: item.title },
  { label: "人物", weight: 18, value: item.people.join(" ") },
  { label: "場面・キーワード", weight: 12, value: item.keywords.join(" ") },
  { label: "シリーズ", weight: 8, value: item.group },
].map((field) => ({ ...field, normalized: normalizeSearchText(field.value) }));

export const interpretSearchQuery = (query: string) => {
  const activeConcepts = findActiveConcepts(query);
  return {
    tokens: tokenizeQuery(query),
    concepts: activeConcepts,
    relatedTerms: [...new Set(activeConcepts.flatMap((concept) => concept.related))],
  };
};

export const rankSearchItems = <T extends SearchableItem>(items: T[], query: string) => {
  const interpretation = interpretSearchQuery(query);
  if (!query.trim()) {
    return {
      matches: items.map((item) => ({ item, score: 0, reasons: [] })),
      relatedTerms: [],
    };
  }

  const matches = items.map((item, originalIndex) => {
    const fields = getDocumentFields(item);
    const haystack = fields.map((field) => field.normalized).join(" ");
    const reasons: string[] = [];
    const coveredTokens = new Set<string>();
    let score = 0;

    for (const token of interpretation.tokens) {
      const field = fields.find((candidate) => candidate.normalized.includes(token));
      if (field) {
        coveredTokens.add(token);
        score += field.weight + Math.min(token.length, 8);
        reasons.push(`${field.label}「${token}」`);
      }
    }

    for (const concept of interpretation.concepts) {
      const matchedTerms = concept.related.filter((term) => haystack.includes(normalizeSearchText(term)));
      if (!matchedTerms.length) continue;

      score += 15 + Math.min(matchedTerms.length * 3, 12);
      reasons.push(`意味「${concept.label}」`);

      for (const token of interpretation.tokens) {
        if (concept.triggers.some((trigger) => normalizeSearchText(trigger).includes(token) || token.includes(normalizeSearchText(trigger)))) {
          coveredTokens.add(token);
        }
      }
    }

    const requiredCoverage = interpretation.tokens.length <= 2
      ? interpretation.tokens.length
      : Math.ceil(interpretation.tokens.length * 0.6);

    return {
      item,
      score,
      reasons: [...new Set(reasons)].slice(0, 3),
      covered: coveredTokens.size >= Math.max(1, requiredCoverage),
      originalIndex,
    };
  })
    .filter((match) => match.score > 0 && match.covered)
    .sort((left, right) => right.score - left.score || left.originalIndex - right.originalIndex)
    .map(({ item, score, reasons }) => ({ item, score, reasons }));

  return { matches, relatedTerms: interpretation.relatedTerms };
};
