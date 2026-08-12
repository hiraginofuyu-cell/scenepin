"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { springEpisodes, springWorks } from "./data";
import styles from "../../works/bleach/archive.module.css";

export default function SpringSeason() {
  const [query, setQuery] = useState("");
  const [work, setWork] = useState("すべて");
  const [character, setCharacter] = useState("すべて");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q");
    if (initial) setQuery(initial);
    const initialWork = params.get("work");
    if (initialWork && springWorks.includes(initialWork)) setWork(initialWork);
  }, []);

  const workCards = useMemo(() => springWorks.map((item) => {
    const episodes = springEpisodes.filter((episode) => episode.work === item);
    return {
      work: item,
      count: episodes.length,
      latest: episodes.at(-1),
      characters: [...new Set(episodes.flatMap((episode) => episode.characters))].slice(0, 3),
    };
  }), []);

  const characters = useMemo(
    () => [...new Set(springEpisodes
      .filter((episode) => work === "すべて" || episode.work === work)
      .flatMap((episode) => episode.characters))].sort(),
    [work],
  );

  const rows = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return springEpisodes.filter((episode) => {
      const text = [
        episode.work,
        episode.label,
        `第${episode.number}話`,
        episode.title,
        episode.airtime,
        episode.summary,
        ...episode.characters,
        ...episode.keywords,
      ].join(" ").toLowerCase();
      return terms.every((term) => text.includes(term))
        && (work === "すべて" || episode.work === work)
        && (character === "すべて" || episode.characters.includes(character));
    });
  }, [query, work, character]);

  const reset = () => {
    setQuery("");
    setWork("すべて");
    setCharacter("すべて");
  };

  const chooseWork = (nextWork: string) => {
    setWork(nextWork);
    setQuery("");
    setCharacter("すべて");
    const url = new URL(window.location.href);
    if (nextWork === "すべて") url.searchParams.delete("work");
    else url.searchParams.set("work", nextWork);
    url.searchParams.delete("q");
    window.history.replaceState({}, "", url);
    window.setTimeout(() => document.getElementById("episode-list")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
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
          <b>{springWorks.length}作品・第2弾</b><small>公式各話紹介を確認して追加</small>
        </div>
      </section>

      <section className={styles.workBrowser} aria-labelledby="spring-title">
        <div className={styles.workBrowserHeading}>
          <div><p>SELECT A TITLE</p><h2 id="spring-title">アニメタイトルから探す</h2></div>
          {work !== "すべて" && <button type="button" onClick={() => chooseWork("すべて")}>← 全作品へ戻る</button>}
        </div>
        <div className={styles.workGrid}>
          {workCards.map((item) => (
            <button type="button" key={item.work} className={work === item.work ? styles.selectedWork : ""} onClick={() => chooseWork(item.work)} aria-pressed={work === item.work}>
              <span>{item.count}<small>話</small></span>
              <strong>{item.work}</strong>
              <small>{item.latest ? `${item.latest.label}「${item.latest.title}」` : "各話を見る"}</small>
              {!!item.characters.length && <em>{item.characters.join(" · ")}</em>}
              <b>各話のシーンを見る →</b>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.controls}>
        <div className={styles.search}>
          <span aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="話数・タイトル・人物・あらすじで検索" />
          {query && <button onClick={() => setQuery("")}>×</button>}
        </div>
        <div className={styles.filters}>
          <label>作品<select value={work} onChange={(event) => chooseWork(event.target.value)}><option>すべて</option>{springWorks.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>登場人物<select value={character} onChange={(event) => setCharacter(event.target.value)}><option>すべて</option>{characters.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button onClick={reset}>条件をリセット</button>
        </div>
        <p className={styles.summary}><b>{rows.length}</b>話を表示</p>
      </section>

      <section className={styles.list} id="episode-list">
        {work !== "すべて" && (
          <div className={styles.selectedWorkHeading}>
            <div><small>SELECTED TITLE</small><h2>{work}</h2><p>{rows.length}話のシーンを表示</p></div>
            <button type="button" onClick={() => chooseWork("すべて")}>作品一覧へ</button>
          </div>
        )}
        {rows.map((episode) => (
          <article className={styles.episode} key={`${episode.work}-${episode.number}`}>
            <span className={styles.number}><small>EP</small>{episode.number}</span>
            <div>
              <p>{episode.airtime} · TOKYO MX</p>
              <button type="button" className={styles.workTitleButton} onClick={() => chooseWork(episode.work)}>{episode.work}<span>作品だけを見る →</span></button>
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
                {episode.characters.length ? (
                  <div className={styles.tags}>{episode.characters.map((item) => <button key={item} onClick={() => setCharacter(item)}>人物：{item}</button>)}</div>
                ) : <small>公式各話紹介に人物名の記載なし</small>}
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
        <p>確認元：<a href="https://4seasons-anime.com/episode/" target="_blank" rel="noreferrer">『春夏秋冬代行者』公式 各話紹介</a> · <a href="https://4seasons-anime.com/onair/" target="_blank" rel="noreferrer">同 放送情報</a> · <a href="https://you-zitsu.com/story.html" target="_blank" rel="noreferrer">『よう実』公式 STORY</a> · <a href="https://you-zitsu.com/onair.html" target="_blank" rel="noreferrer">同 ON AIR</a></p>
        <small>あらすじは公式の各話紹介を短く言い換えています。登場人物は各話紹介に名前が明記された人物だけを登録し、推測で補っていません。</small>
      </section>
    </main>
  );
}
