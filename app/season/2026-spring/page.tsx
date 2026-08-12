"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { springCatalog, springEpisodes, springWorks } from "./data";
import styles from "../../works/bleach/archive.module.css";
import catalogStyles from "./spring.module.css";

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

  const filteredCatalog = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return springCatalog.filter((item) => terms.every((term) => [
      item.title,
      item.period,
      "春アニメ",
      "新作",
      "新シリーズ",
    ].join(" ").toLowerCase().includes(term)));
  }, [query]);

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
          <h1>2026年春アニメ<br /><span>全作品カタログ</span></h1>
          <p className={styles.lead}>春クールの新作・新シリーズを一覧化。公式の各話紹介を確認できた作品は、タイトル・あらすじ・登場人物まで収録しています。</p>
        </div>
        <div className={styles.stats}>
          <strong>{springCatalog.length}</strong><span>TITLES</span>
          <b>{springEpisodes.length}話・{springWorks.length}作品は各話収録済み</b><small>再放送・リマスター・単発特番を除外</small>
        </div>
      </section>

      <section className={catalogStyles.catalog} aria-labelledby="catalog-title">
        <div className={catalogStyles.heading}>
          <div><p>COMPLETE SEASON INDEX</p><h2 id="catalog-title">2026年春の新作・新シリーズ 全{springCatalog.length}作品</h2></div>
          <span>{filteredCatalog.length}作品を表示</span>
        </div>
        <div className={catalogStyles.grid}>
          {filteredCatalog.map((item) => {
            const archived = springWorks.includes(item.title);
            return (
              <article key={item.title} className={archived ? catalogStyles.archived : ""}>
                <small>{archived ? "EPISODES READY" : "SEASON CATALOG"}</small>
                <h3>{item.title}</h3>
                <p>{archived ? "各話タイトル・あらすじ・人物を収録済み" : "2026年春の放送・配信作品として掲載"}</p>
                {archived ? (
                  <button type="button" onClick={() => chooseWork(item.title)}>各話を見る →</button>
                ) : (
                  <a href={item.sourceUrl} target="_blank" rel="noreferrer">掲載元を確認 ↗</a>
                )}
              </article>
            );
          })}
        </div>
        {!filteredCatalog.length && <div className={catalogStyles.noResults}>一致する春アニメがありません。短い作品名で試してください。</div>}
      </section>

      <section className={styles.workBrowser} aria-labelledby="spring-title">
        <div className={styles.workBrowserHeading}>
          <div><p>EPISODE ARCHIVE</p><h2 id="spring-title">各話まで収録済みの作品</h2></div>
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
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="作品名・話数・人物・あらすじで春アニメを検索" />
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
            <h2>{query && filteredCatalog.length ? "この作品の各話データは準備中です" : "一致する話がありません"}</h2>
            <p>{query && filteredCatalog.length ? "作品は春アニメ一覧へ掲載済みです。公式の各話情報を確認できたものから追加します。" : "短い言葉にするか、条件をリセットしてみてください。"}</p>
            <button onClick={reset}>すべて表示</button>
          </div>
        )}
      </section>

      <section className={styles.tagBrowser}>
        <p>作品一覧の確認元：<a href="https://www.animatetimes.com/tag/details.php?id=5228" target="_blank" rel="noreferrer">アニメイトタイムズ 2026春アニメ一覧</a> · <a href="https://anime.eiga.com/program/season/2026-spring/" target="_blank" rel="noreferrer">アニメハック 2026年春アニメ</a></p>
        <p>各話の確認元：<a href="https://4seasons-anime.com/episode/" target="_blank" rel="noreferrer">『春夏秋冬代行者』公式 各話紹介</a> · <a href="https://you-zitsu.com/story.html" target="_blank" rel="noreferrer">『よう実』公式 STORY</a></p>
        <small>シーズン一覧は新作・新シリーズを対象とし、再放送・リマスター・単発特番を除外しています。あらすじは公式の各話紹介を短く言い換え、人物名は明記された場合だけ登録しています。</small>
      </section>
    </main>
  );
}
