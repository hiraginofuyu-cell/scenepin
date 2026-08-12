"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { springEpisodes, springWorks } from "./data";
import styles from "../../works/bleach/archive.module.css";

export default function SpringSeason() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState("すべて");

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);

  const characters = useMemo(
    () => [...new Set(springEpisodes.flatMap((episode) => episode.characters))].sort(),
    [],
  );

  const rows = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return springEpisodes.filter((episode) => {
      const text = [
        springWorks[0],
        episode.label,
        `第${episode.number}話`,
        episode.title,
        episode.airtime,
        episode.summary,
        ...episode.characters,
        ...episode.keywords,
      ].join(" ").toLowerCase();
      return terms.every((term) => text.includes(term))
        && (character === "すべて" || episode.characters.includes(character));
    });
  }, [query, character]);

  const reset = () => {
    setQuery("");
    setCharacter("すべて");
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><span />ScenePin</Link>
        <Link href="/anime">アニメ一覧へ</Link>
      </header>

      <section className={styles.hero}>
        <div>
          <Link href="/anime" className={styles.back}>← アニメアーカイブへ</Link>
          <p>PAST ANIME · 2026 SPRING</p>
          <h1>2026年春アニメ<br /><span>各話アーカイブ</span></h1>
          <p className={styles.lead}>公式の各話紹介で確認できたタイトル・あらすじ・登場人物を、作品ごとに追加しています。</p>
        </div>
        <div className={styles.stats}>
          <strong>{springEpisodes.length}</strong><span>EPISODES</span>
          <b>{springWorks.length}作品・第1弾</b><small>確認できた作品から順次追加</small>
        </div>
      </section>

      <section className={styles.workBrowser} aria-labelledby="spring-title">
        <div className={styles.workBrowserHeading}>
          <div><p>FIRST COLLECTION</p><h2 id="spring-title">{springWorks[0]}</h2></div>
        </div>
        <div className={styles.selectedWorkHeading}>
          <div><small>COMPLETE EPISODE LIST</small><h2>{springWorks[0]}</h2><p>全14話のタイトル・あらすじ・人物を収録</p></div>
          <button type="button" onClick={() => document.getElementById("episode-list")?.scrollIntoView({ behavior: "smooth" })}>各話を見る</button>
        </div>
      </section>

      <section className={styles.controls}>
        <div className={styles.search}>
          <span aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="話数・タイトル・人物・あらすじで検索" />
          {query && <button onClick={() => setQuery("")}>×</button>}
        </div>
        <div className={styles.filters}>
          <label>作品<select value={springWorks[0]} disabled><option>{springWorks[0]}</option></select></label>
          <label>登場人物<select value={character} onChange={(event) => setCharacter(event.target.value)}><option>すべて</option>{characters.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button onClick={reset}>条件をリセット</button>
        </div>
        <p className={styles.summary}><b>{rows.length}</b>話を表示</p>
      </section>

      <section className={styles.list} id="episode-list">
        {rows.map((episode) => (
          <article className={styles.episode} key={episode.number}>
            <span className={styles.number}><small>EP</small>{episode.number}</span>
            <div>
              <p>{episode.airtime} · TOKYO MX</p>
              <button type="button" className={styles.workTitleButton} onClick={() => reset()}>{springWorks[0]}<span>全話を見る →</span></button>
              <h3>{episode.label}「{episode.title}」</h3>
              <div className={styles.sceneBlock}>
                <b>シーン・見どころ</b>
                <div>{episode.keywords.map((item) => <button key={item} onClick={() => setQuery(item)}>#{item}</button>)}</div>
              </div>
              <div className={styles.tagGroup}>
                <b>話のあらすじ</b>
                <div>{episode.summary}</div>
              </div>
              <div className={styles.tagGroup}>
                <b>登場人物</b>
                <div className={styles.tags}>{episode.characters.map((item) => <button key={item} onClick={() => setCharacter(item)}>人物：{item}</button>)}</div>
              </div>
              <p><a href={episode.sourceUrl} target="_blank" rel="noreferrer">公式の各話紹介を確認</a></p>
            </div>
          </article>
        ))}
        {!rows.length && (
          <div className={styles.empty}>
            <h2>一致する話がありません</h2>
            <p>短い言葉にするか、条件をリセットしてみてください。</p>
            <button onClick={reset}>すべて表示</button>
          </div>
        )}
      </section>

      <section className={styles.tagBrowser}>
        <p>確認元：<a href="https://4seasons-anime.com/episode/" target="_blank" rel="noreferrer">TVアニメ『春夏秋冬代行者』公式 各話紹介</a> · <a href="https://4seasons-anime.com/onair/" target="_blank" rel="noreferrer">公式 放送・配信情報</a></p>
        <small>あらすじは公式の各話紹介を短く言い換えています。登場人物は各話紹介に名前が明記された人物だけを登録し、推測で補っていません。</small>
      </section>
    </main>
  );
}
