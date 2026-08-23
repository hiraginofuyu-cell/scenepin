export type ResearchRole = {
  id: "current" | "archive" | "verify" | "search";
  name: string;
  shortName: string;
  status: "稼働中" | "順次拡大";
  mission: string;
  inputs: string[];
  outputs: string[];
  costPolicy: string;
};

export const researchRoles: ResearchRole[] = [
  {
    id: "current",
    name: "今期放送リサーチAI",
    shortName: "NOW",
    status: "稼働中",
    mission: "東京の番組表を起点に、現在放送中のアニメ・ドラマ・主要バラエティを優先して追加します。",
    inputs: ["Gガイド東京番組表", "放送局の番組ページ", "作品・配信の公式ページ"],
    outputs: ["話数・放送日時", "公式あらすじ", "人物・場面キーワード"],
    costPolicy: "番組ごとの確認回数を抑え、同じ回の重複調査を避けます。",
  },
  {
    id: "archive",
    name: "過去作品アーカイブAI",
    shortName: "PAST",
    status: "順次拡大",
    mission: "過去作品の各話を、公式のエピソード一覧と照合しながら少しずつ埋めます。現在はBLEACHを優先しています。",
    inputs: ["公式エピソード一覧", "放送局の過去ページ", "公式配信の各話ページ"],
    outputs: ["正しい話数とタイトル", "各話あらすじ", "名場面・伏線候補"],
    costPolicy: "作品単位のまとめ処理で検索回数を減らし、確認済みの回を再調査しません。",
  },
  {
    id: "verify",
    name: "公式確認AI",
    shortName: "CHECK",
    status: "稼働中",
    mission: "今期・過去の両担当が集めた情報を公式出典と照合し、推測や話数ずれを公開前に止めます。",
    inputs: ["収集候補", "公式出典URL", "既存のScenePinデータ"],
    outputs: ["重複除外", "話数ずれの補正", "未解決項目の「確認中」化"],
    costPolicy: "文章生成より照合ルールを優先し、難しい候補だけを個別確認します。",
  },
  {
    id: "search",
    name: "意味検索AI",
    shortName: "FIND",
    status: "稼働中",
    mission: "人物名が分からない検索でも、見た目・場所・出来事から関連する話を並べます。",
    inputs: ["ユーザーの検索文", "登録済みの人物・場面", "作品・話数・あらすじ"],
    outputs: ["関連語の補助", "一致度ランキング", "見つかった手がかり"],
    costPolicy: "ブラウザ内で処理し、外部AI APIを使わないため追加課金はありません。",
  },
];

