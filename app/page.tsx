"use client";

import { FormEvent, useMemo, useState } from "react";
import { currentEpisodes } from "./season/2026-summer/data";
import { currentPrograms } from "./current/data";

type Category = "すべて" | "アニメ" | "ドラマ" | "バラエティ";

type Scene = {
  id: number;
  work: string;
  category: Exclude<Category, "すべて">;
  episode: string;
  title: string;
  description: string;
  keywords: string[];
  tone: string;
  rank: number;
};

const scenes: Scene[] = [
  {
    id: 1,
    work: "銀魂",
    category: "アニメ",
    episode: "第83話",
    title: "「将軍かよォォォ!!」の初登場回",
    description:
      "スナックすまいるに現れた将軍を前に、銀時たちが一斉に取り乱す有名な場面。",
    keywords: ["将軍", "キャバクラ", "将ちゃん", "将軍かよ"],
    tone: "gintama",
    rank: 1,
  },
  {
    id: 2,
    work: "HUNTER×HUNTER",
    category: "アニメ",
    episode: "第131話",
    title: "ゴンの姿が大きく変化する場面",
    description:
      "怒りと覚悟が限界に達したゴンが、ネフェルピトーと対峙する強烈な一話。",
    keywords: ["ゴンさん", "ピトー", "怒り", "変身", "覚醒"],
    tone: "hunter",
    rank: 2,
  },
  {
    id: 3,
    work: "BLEACH",
    category: "アニメ",
    episode: "第58話",
    title: "黒崎一護が卍解を披露する場面",
    description:
      "朽木白哉との戦いで、一護が「天鎖斬月」を解放する人気シーン。",
    keywords: ["一護", "卍解", "天鎖斬月", "白哉"],
    tone: "bleach",
    rank: 3,
  },
  {
    id: 4,
    work: "水曜日のダウンタウン",
    category: "バラエティ",
    episode: "2018年12月26日放送",
    title: "MONSTER HOUSE 最終回",
    description:
      "クロちゃんの恋愛企画が完結し、スタジオと視聴者を大きくざわつかせた回。",
    keywords: ["クロちゃん", "モンスターハウス", "恋愛", "最終回"],
    tone: "wednesday",
    rank: 4,
  },
  {
    id: 5,
    work: "HUNTER×HUNTER",
    category: "アニメ",
    episode: "第135話",
    title: "メルエムとコムギ、最後の対局",
    description:
      "静かな会話と軍儀の音だけで描かれる、キメラアント編を象徴する場面。",
    keywords: ["メルエム", "コムギ", "軍儀", "最後", "キメラアント"],
    tone: "hunter-alt",
    rank: 5,
  },
  {
    id: 6,
    work: "銀魂",
    category: "アニメ",
    episode: "第151話",
    title: "将軍の髪を切ることになる床屋回",
    description:
      "銀時たちが床屋を任され、来店した将軍の髪形をめぐって大混乱する回。",
    keywords: ["将軍", "床屋", "髪", "散髪", "将ちゃん"],
    tone: "gintama-alt",
    rank: 6,
  },
  {
    id: 7,
    work: "BLEACH",
    category: "アニメ",
    episode: "第59話",
    title: "一護と白哉、死闘の決着",
    description:
      "互いの誇りを懸けた戦いが決着へ。白い仮面が現れる場面も印象的。",
    keywords: ["一護", "白哉", "仮面", "千本桜", "決着"],
    tone: "bleach-alt",
    rank: 7,
  },
  {
    id: 8,
    work: "HUNTER×HUNTER",
    category: "アニメ",
    episode: "第126話",
    title: "ネテロとメルエムの戦いが決着する回",
    description:
      "百式観音・零の掌、そしてネテロが残した最後の一手が描かれる。",
    keywords: ["ネテロ", "メルエム", "零の掌", "薔薇", "百式観音"],
    tone: "hunter",
    rank: 8,
  },
];

const categories: Category[] = ["すべて", "アニメ", "ドラマ", "バラエティ"];

const trending = [
  "将軍かよ",
  "ゴンさん",
  "一護 卍解",
  "クロちゃん 恋愛企画",
];

const currentWorks = (() => {
  const accents = ["sky", "mint", "yellow", "coral", "blue"];
  const seen = new Set<string>();
  const anime = [...currentEpisodes]
    .reverse()
    .filter((item) => {
      if (seen.has(item.work)) return false;
      seen.add(item.work);
      return true;
    })
    .slice(0, 8)
    .map((item, index) => ({
      name: item.work,
      category: "アニメ",
      schedule: item.airtime,
      episode: `${item.episode}「${item.title}」`,
      accent: accents[index % accents.length],
      href: `/season/2026-summer?work=${encodeURIComponent(item.work)}`,
    }));
  const programs = currentPrograms.slice(0, 4).map((item, index) => ({
    name: item.work,
    category: item.category,
    schedule: item.airtime,
    episode: `${item.episode}「${item.title}」`,
    accent: accents[(index + anime.length) % accents.length],
    href: `/current?q=${encodeURIComponent(item.work)}`,
  }));
  return [...anime, ...programs];
})();

function Pin({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? "pin pin-small" : "pin"} aria-hidden="true">
      <span />
    </span>
  );
}

function AdSlot({ format = "horizontal" }: { format?: "horizontal" | "card" }) {
  return (
    <aside
      className={`ad-slot ad-${format}`}
      aria-label="広告"
      data-ad-status="ready"
    >
      <span>AD</span>
      <div>
        <b>広告掲載スペース</b>
        <small>広告サービス接続後に自動配信されます</small>
      </div>
    </aside>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [category, setCategory] = useState<Category>("すべて");
  const [showAll, setShowAll] = useState(false);

  const filteredScenes = useMemo(() => {
    const normalized = activeQuery.trim().toLowerCase();

    return scenes.filter((scene) => {
      const matchesCategory =
        category === "すべて" || scene.category === category;
      const haystack = [
        scene.work,
        scene.episode,
        scene.title,
        scene.description,
        ...scene.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [activeQuery, category]);

  const visibleScenes = showAll ? filteredScenes : filteredScenes.slice(0, 4);

  const search = (event?: FormEvent) => {
    event?.preventDefault();
    window.location.assign(`/search?q=${encodeURIComponent(query)}`);
  };

  const openSearch = (term: string) => {
    window.location.assign(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ScenePin ホーム">
          <Pin />
          <span>ScenePin</span>
        </a>
        <nav aria-label="メインナビゲーション">
          <a href="/anime">
            <span className="nav-icon blue">▦</span>作品一覧
          </a>
          <a href="#results">
            <span className="nav-icon mint">▶</span>名場面
          </a>
          <a href="#results">
            <span className="nav-icon yellow">●</span>伏線
          </a>
          <a href="#ranking">
            <span className="nav-icon coral">★</span>ランキング
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="route route-one" />
        <div className="route route-two" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span>SCENE</span> を、すぐ見つける。
          </p>
          <h1>
            その場面、
            <br />
            <span>何話だっけ？</span>
          </h1>
          <p className="lead">
            ショートで見た場面も、ふと思い出した伏線も。
            <br />
            キーワードひとつですぐ見つかる。
          </p>

          <form className="search-box" onSubmit={search}>
            <span className="search-icon" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例：銀魂 将軍 キャバクラ"
              aria-label="作品名や場面のキーワード"
            />
            <button type="submit">
              シーンを探す
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="category-row" aria-label="カテゴリで絞り込む">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "category active" : "category"}
                onClick={() => {
                  setCategory(item);
                  setShowAll(item !== "すべて");
                }}
                type="button"
              >
                <span aria-hidden="true">
                  {item === "すべて"
                    ? "⌘"
                    : item === "アニメ"
                      ? "▣"
                      : item === "ドラマ"
                        ? "▶"
                        : "●"}
                </span>
                {item}
              </button>
            ))}
          </div>

          <div className="trending">
            <span>よく探される場面</span>
            {trending.map((term) => (
              <button key={term} type="button" onClick={() => openSearch(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="map-visual" aria-hidden="true">
          <div className="map-glow" />
          <div className="trail trail-a" />
          <div className="trail trail-b" />
          <div className="mini-card mini-one">
            <div className="mini-art moon">
              <i />
            </div>
            <div className="mini-progress">
              <b />
              <b />
              <b />
              <b />
            </div>
          </div>
          <div className="mini-card mini-two">
            <div className="mini-art forest">
              <i />
            </div>
            <div className="mini-progress mint-progress">
              <b />
              <b />
              <b />
              <b />
            </div>
          </div>
          <div className="mini-card mini-three">
            <div className="mini-art city">
              <i />
            </div>
            <div className="mini-progress yellow-progress">
              <b />
              <b />
              <b />
              <b />
            </div>
          </div>
          <Pin />
          <span className="map-dot dot-a" />
          <span className="map-dot dot-b" />
          <span className="map-dot dot-c" />
        </div>
      </section>

      <div className="ad-band">
        <AdSlot />
      </div>

      <section className="works-section" id="works">
        <div className="section-heading">
          <div>
            <p className="section-kicker">STARTING LINEUP</p>
            <h2>まずは、この4作品から。</h2>
          </div>
          <p>
            名場面と検索キーワードを少しずつ追加中です。
            <br />
            作品はこれから順次増やしていきます。
          </p>
        </div>
        <div className="work-tabs">
          {[
            [
              "水曜日のダウンタウン",
              "2025 ARCHIVE",
              "wednesday-tab",
              "/works/wednesday-downtown/2025",
            ],
            ["銀魂", "201 EPISODES", "gintama-tab", "/works/gintama"],
            ["HUNTER×HUNTER", "3 SCENES", "hunter-tab", ""],
            ["BLEACH", "366 EPISODES", "bleach-tab", "/works/bleach"],
          ].map(([name, label, className, href]) => (
            <button
              type="button"
              key={name}
              className={`work-tab ${className}`}
              onClick={() => {
                if (href) {
                  window.location.href = href;
                  return;
                }
                setQuery(name);
                setActiveQuery(name);
                setShowAll(true);
              }}
            >
              <span className="work-symbol" />
              <span>
                <b>{name}</b>
                <small>{label}</small>
              </span>
              <i>→</i>
            </button>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:28}}>
          <a href="/anime" style={{display:"inline-block",padding:"14px 22px",borderRadius:999,background:"#17324d",color:"white",fontWeight:900,textDecoration:"none"}}>アニメアーカイブを開く →</a>
        </div>
      </section>

      <section className="on-air-section" id="on-air">
        <div className="section-heading">
          <div>
            <p className="section-kicker">ON AIR NOW</p>
            <h2>現在放送中の作品</h2>
          </div>
          <p>
            東京の番組表と2026年夏クールの放送情報から初回取得。
            <br />
            話タイトルと名場面は順次自動で追加します。
          </p>
        </div>
        <div className="on-air-grid">
          {currentWorks.map((work) => (
            <a className="on-air-card" key={work.name} href={work.href} aria-label={`${work.name}の各話とシーンを見る`}>
              <span className={`on-air-mark ${work.accent}`} aria-hidden="true" />
              <div>
                <small>{work.category}</small>
                <h3>{work.name}</h3>
                <p>
                  <b>{work.schedule}</b>
                  <span>{work.episode}</span>
                </p>
              </div>
              <i>各話を見る →</i>
            </a>
          ))}
        </div>
        <div className="source-note">
          <span>取得元</span>
          番組表.Gガイド、各局番組表、2026年夏クール放送情報
          <b>2026年7月31日更新</b>
        </div>
        <div style={{textAlign:"center",marginTop:24,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}><a href="/season/2026-summer" style={{display:"inline-block",padding:"14px 22px",borderRadius:999,background:"#172738",color:"white",fontWeight:900,textDecoration:"none"}}>今期アニメを話ごとに見る →</a><a href="/current" style={{display:"inline-block",padding:"14px 22px",borderRadius:999,background:"#c85f65",color:"white",fontWeight:900,textDecoration:"none"}}>放送中のドラマ・バラエティを見る →</a></div>
      </section>

      <section className="results-section" id="results">
        <div className="section-heading result-heading">
          <div>
            <p className="section-kicker">SCENE LIBRARY</p>
            <h2>
              {activeQuery ? `「${activeQuery}」の検索結果` : "いま見つかる名場面"}
            </h2>
          </div>
          <span className="result-count">{filteredScenes.length}件</span>
        </div>

        {visibleScenes.length ? (
          <div className="scene-grid">
            {visibleScenes.map((scene) => (
              <article className="scene-card" key={scene.id}>
                <div className={`scene-art ${scene.tone}`}>
                  <span className="art-orbit" />
                  <span className="art-flare" />
                  <span className="art-mark">{scene.rank}</span>
                  <Pin small />
                </div>
                <div className="scene-body">
                  <div className="scene-meta">
                    <span>{scene.category}</span>
                    <b>{scene.episode}</b>
                  </div>
                  <p className="work-name">{scene.work}</p>
                  <h3>{scene.title}</h3>
                  <p className="scene-description">{scene.description}</p>
                  <div className="keyword-row">
                    {scene.keywords.slice(0, 3).map((keyword) => (
                      <button
                        type="button"
                        key={keyword}
                        onClick={() => openSearch(keyword)}
                      >
                        #{keyword}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Pin />
            <h3>まだ、その場面は登録されていません。</h3>
            <p>
              別のキーワードで試すか、作品名だけで検索してみてください。
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveQuery("");
                setCategory("すべて");
              }}
            >
              検索をリセット
            </button>
          </div>
        )}

        {!showAll && filteredScenes.length > 4 && (
          <button
            className="more-button"
            type="button"
            onClick={() => setShowAll(true)}
          >
            名場面をもっと見る <span>↓</span>
          </button>
        )}
      </section>

      <div className="ad-band ad-band-soft">
        <AdSlot />
      </div>

      <section className="ranking-section" id="ranking">
        <div className="ranking-card">
          <div>
            <p className="section-kicker">HOW TO FIND</p>
            <h2>うろ覚えでも、大丈夫。</h2>
            <p>
              セリフ、人物、場所、起きたこと。覚えている言葉を
              そのまま入れれば、近い場面を探せます。
            </p>
          </div>
          <ol>
            <li>
              <b>1</b>
              <span>
                <strong>思い出せる言葉を入力</strong>
                「将軍」「卍解」だけでもOK
              </span>
            </li>
            <li>
              <b>2</b>
              <span>
                <strong>候補の場面を確認</strong>
                説明とキーワードで見比べる
              </span>
            </li>
            <li>
              <b>3</b>
              <span>
                <strong>話数・放送日が分かる</strong>
                もう長い検索は必要なし
              </span>
            </li>
          </ol>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <Pin />
          <span>ScenePin</span>
        </a>
        <p>
          あの場面への、いちばん短い道。
          <br />
          掲載情報は公式情報を優先して確認し、順次追加しています。
        </p>
        <span>© 2026 ScenePin</span>
      </footer>
    </main>
  );
}
