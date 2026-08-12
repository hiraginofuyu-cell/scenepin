"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { broadcasts, totalTheories } from "./data";
import styles from "./archive.module.css";

const months = [
  ["すべて", 0],
  ["1月", 1],
  ["2月", 2],
  ["3月", 3],
  ["4月", 4],
  ["5月", 5],
  ["6月", 6],
  ["7月", 7],
  ["8月", 8],
  ["9月", 9],
  ["10月", 10],
  ["11月", 11],
  ["12月", 12],
] as const;

const formatDate = (date: string) => {
  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日(水)`;
};

export default function WednesdayDowntown2025() {
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState(0);
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      broadcasts
        .filter((broadcast) => {
          const broadcastMonth = Number(broadcast.date.slice(5, 7));
          return month === 0 || broadcastMonth === month;
        })
        .map((broadcast) => ({
          ...broadcast,
          theories: broadcast.theories.filter((theory) =>
            [
              theory.title,
              theory.presenter,
              theory.result,
              theory.comment,
              ...theory.keywords,
              broadcast.label,
              broadcast.date,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(normalized),
          ),
        }))
        .filter(
          (broadcast) =>
            broadcast.theories.length > 0 ||
            (!normalized && (month === 0 || Number(broadcast.date.slice(5, 7)) === month)),
        ),
    [month, normalized],
  );

  const visibleTheoryCount = filtered.reduce(
    (sum, broadcast) => sum + broadcast.theories.length,
    0,
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span className={styles.pin} aria-hidden="true" />
          ScenePin
        </Link>
        <nav aria-label="ページ内ナビゲーション">
          <Link href="/">シーン検索</Link>
          <a href="#archive">放送回一覧</a>
          <a href="#sources">情報について</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Link className={styles.back} href="/">
            ← 作品一覧へ戻る
          </Link>
          <p className={styles.kicker}>WEDNESDAY DOWNTOWN ARCHIVE</p>
          <h1>
            <span className={styles.workTitle}>
              水曜日の
              <br />
              ダウンタウン
            </span>
            <span>2025年 説一覧</span>
          </h1>
          <p className={styles.intro}>
            「あの説、いつの放送だっけ？」をすぐ解決。
            放送日、説の名前、プレゼンター、検証結果からまとめて探せます。
          </p>
          <div className={styles.stats}>
            <div>
              <strong>{broadcasts.length}</strong>
              <span>放送回</span>
            </div>
            <div>
              <strong>{totalTheories}</strong>
              <span>企画・説</span>
            </div>
            <div>
              <strong>2025</strong>
              <span>YEAR</span>
            </div>
          </div>
        </div>
        <div className={styles.heroMap} aria-hidden="true">
          <span className={styles.routeA} />
          <span className={styles.routeB} />
          <div className={styles.tvCard}>
            <span>WED</span>
            <b>説</b>
            <i />
          </div>
          <div className={styles.dateCard}>
            <small>2025</small>
            <strong>12.24</strong>
            <span>名探偵津田 第4話</span>
          </div>
          <span className={styles.bigPin} />
        </div>
      </section>

      <section className={styles.controls} id="archive">
        <div className={styles.searchWrap}>
          <span aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="説や出演者を検索"
            placeholder="例：クロちゃん、電気イス、バカリズム"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}>
              クリア
            </button>
          )}
        </div>
        <div className={styles.months} aria-label="月で絞り込む">
          {months.map(([label, value]) => (
            <button
              type="button"
              className={month === value ? styles.activeMonth : ""}
              onClick={() => setMonth(value)}
              key={label}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.resultSummary} aria-live="polite">
          <span>
            {filtered.length}放送回・{visibleTheoryCount}件
          </span>
          {normalized && <b>「{query}」の検索結果</b>}
        </div>
      </section>

      <section className={styles.archive}>
        {filtered.length ? (
          filtered.map((broadcast, broadcastIndex) => (
            <details
              className={styles.episode}
              key={broadcast.date}
              open={Boolean(normalized) || (month !== 0 && broadcastIndex === 0)}
            >
              <summary>
                <span className={styles.dateBadge}>
                  <b>{broadcast.date.slice(5, 7)}</b>
                  <i>{broadcast.date.slice(8, 10)}</i>
                </span>
                <span className={styles.episodeTitle}>
                  <small>{formatDate(broadcast.date)}</small>
                  <strong>
                    {broadcast.label || broadcast.theories[0]?.title || "放送回"}
                  </strong>
                </span>
                <span className={styles.episodeCount}>
                  {broadcast.theories.length}件
                </span>
                <span className={styles.chevron}>＋</span>
              </summary>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>説・企画</th>
                      <th>プレゼンター</th>
                      <th>検証結果・コメント</th>
                    </tr>
                  </thead>
                  <tbody>
                    {broadcast.theories.map((theory, index) => (
                      <tr key={`${broadcast.date}-${index}`}>
                        <td data-label="ID">{index + 1}</td>
                        <td data-label="説・企画">
                          <strong>{theory.title}</strong>
                          {theory.keywords.length > 0 && (
                            <span className={styles.keywords}>
                              {theory.keywords.map((keyword) => (
                                <button
                                  type="button"
                                  key={keyword}
                                  onClick={() => setQuery(keyword)}
                                >
                                  #{keyword}
                                </button>
                              ))}
                            </span>
                          )}
                        </td>
                        <td data-label="プレゼンター">
                          {theory.presenter || <span className={styles.unknown}>—</span>}
                        </td>
                        <td data-label="検証結果・コメント">
                          {theory.result && (
                            <span className={styles.result}>{theory.result}</span>
                          )}
                          {theory.comment && (
                            <span className={styles.comment}>{theory.comment}</span>
                          )}
                          {!theory.result && !theory.comment && (
                            <span className={styles.unknown}>情報を追加予定</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))
        ) : (
          <div className={styles.empty}>
            <span className={styles.bigPin} />
            <h2>一致する説が見つかりませんでした</h2>
            <p>言葉を短くするか、月を「すべて」に戻してみてください。</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setMonth(0);
              }}
            >
              絞り込みをリセット
            </button>
          </div>
        )}
      </section>

      <section className={styles.sources} id="sources">
        <div>
          <p className={styles.kicker}>ABOUT THIS ARCHIVE</p>
          <h2>情報を、育てていく。</h2>
        </div>
        <div>
          <p>
            まずは2025年の放送日・企画名・プレゼンター・判明している検証結果を整理しました。
            空欄の結果やコメント、企画内の名場面は今後順次追加します。
          </p>
          <div className={styles.sourceLinks}>
            <a
              href="https://www.tbs.co.jp/suiyobinodowntown/"
              target="_blank"
              rel="noreferrer"
            >
              TBS公式サイト ↗
            </a>
            <a
              href="https://tver.jp/series/srf5mcrw4o"
              target="_blank"
              rel="noreferrer"
            >
              TVer番組ページ ↗
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link className={styles.brand} href="/">
          <span className={styles.pin} aria-hidden="true" />
          ScenePin
        </Link>
        <p>あの場面への、いちばん短い道。</p>
        <span>© 2026 ScenePin</span>
      </footer>
    </main>
  );
}
