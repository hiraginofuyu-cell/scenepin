"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { bleachArcs, bleachCharacters, bleachEpisodes } from "./data";
import styles from "./archive.module.css";

export default function BleachArchive() {
  const [query, setQuery] = useState("");
  const [arc, setArc] = useState("すべて");
  const [character, setCharacter] = useState("すべて");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return bleachEpisodes.filter((episode) => {
      const text = [
        episode.number,
        episode.title,
        episode.arc,
        episode.summary || "",
        ...(episode.scenes || []),
        ...episode.characters,
        ...episode.keywords,
      ].join(" ").toLowerCase();
      return (!term || text.includes(term))
        && (arc === "すべて" || episode.arc === arc)
        && (character === "すべて" || episode.characters.includes(character));
    });
  }, [query, arc, character]);

  const reset = () => {
    setQuery("");
    setArc("すべて");
    setCharacter("すべて");
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><span />ScenePin</Link>
        <Link href="/search">全作品から探す</Link>
      </header>

      <section className={styles.hero}>
        <div>
          <Link href="/" className={styles.back}>← 作品一覧へ</Link>
          <p>BLEACH EPISODE ARCHIVE</p>
          <h1>BLEACH<br /><span>全366話から探す</span></h1>
          <p className={styles.lead}>
            覚えている人物名、技、場所、篇、話数のどれかを入力してください。
          </p>
        </div>
        <div className={styles.stats}>
          <strong>366</strong><span>EPISODES</span>
          <b>13篇</b><small>タイトル登録済み</small>
        </div>
      </section>

      <section className={styles.controls}>
        <div className={styles.search}>
          <span aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例：一護 卍解、ウルキオラ、千本桜"
            aria-label="BLEACHの話を検索"
          />
          {query && <button onClick={() => setQuery("")}>×</button>}
        </div>
        <button
          className={styles.detailButton}
          type="button"
          onClick={() => setShowFilters((value) => !value)}
        >
          詳細設定 {showFilters ? "−" : "＋"}
        </button>
        {showFilters && (
          <div className={styles.filters}>
            <label>篇
              <select value={arc} onChange={(event) => setArc(event.target.value)}>
                <option>すべて</option>
                {bleachArcs.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>登場人物
              <select value={character} onChange={(event) => setCharacter(event.target.value)}>
                <option>すべて</option>
                {bleachCharacters.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button type="button" onClick={reset}>条件をリセット</button>
          </div>
        )}
        <p className={styles.summary}><b>{filtered.length}</b>話が一致</p>
      </section>

      <section className={styles.list}>
        {filtered.map((episode) => (
          <article key={episode.number} className={styles.episode}>
            <span className={styles.number}><small>EP</small>{episode.number}</span>
            <div>
              <p>{episode.arc}</p>
              <h2>{episode.title}</h2>
              {episode.summary && <p>{episode.summary}</p>}
              {!!episode.scenes?.length && (
                <div className={styles.tags}>{episode.scenes.map((item) => <button key={item} onClick={() => setQuery(item)}>場面：{item}</button>)}</div>
              )}
              {(episode.characters.length > 0 || episode.keywords.length > 0) && (
                <div className={styles.tags}>
                  {episode.characters.map((item) => (
                    <button key={item} onClick={() => setCharacter(item)}>人物：{item}</button>
                  ))}
                  {episode.keywords.map((item) => (
                    <button key={item} onClick={() => setQuery(item)}>#{item}</button>
                  ))}
                </div>
              )}
              {!!episode.sourceUrls?.length && <p>{episode.sourceUrls.map((url, index) => <span key={url}><a href={url} target="_blank" rel="noreferrer">配信・番組情報 {index + 1}</a>{index < episode.sourceUrls!.length - 1 ? " · " : ""}</span>)}</p>}
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className={styles.empty}>
            <h2>一致する話がありません</h2>
            <p>表記を短くするか、詳細条件をリセットしてみてください。</p>
            <button onClick={reset}>すべて表示</button>
          </div>
        )}
      </section>
    </main>
  );
}
