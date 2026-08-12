"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { currentEpisodes, currentWorks } from "./data";
import styles from "../../works/bleach/archive.module.css";

export default function CurrentSeason() {
  const [query, setQuery] = useState("");
  const [work, setWork] = useState("すべて");
  const [character, setCharacter] = useState("すべて");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q");
    if (initial) setQuery(initial);
    const initialWork = params.get("work");
    if (initialWork && currentWorks.includes(initialWork)) setWork(initialWork);
  }, []);

  const workCards = useMemo(() => currentWorks.map((item) => {
    const episodes = currentEpisodes.filter((episode) => episode.work === item);
    return {
      work: item,
      count: episodes.length,
      latest: episodes.at(-1),
      characters: [...new Set(episodes.flatMap((episode) => episode.characters))].slice(0, 3),
    };
  }), []);

  const characters = useMemo(
    () => [...new Set(currentEpisodes.flatMap((episode) => episode.characters))].sort(),
    [],
  );

  const rows = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return currentEpisodes.filter((episode) => {
      const text = [
        episode.work,
        episode.episode,
        episode.title,
        episode.summary,
        episode.reaction.overview || "",
        episode.reaction.divided || "",
        ...(episode.reaction.themes || []),
        ...episode.reaction.history.flatMap((snapshot) => [snapshot.overview, snapshot.divided || "", ...snapshot.themes]),
        ...episode.characters,
        ...(episode.keywords || []),
      ]
        .join(" ")
        .toLowerCase();
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
        <Link href="/search">全作品から探す</Link>
      </header>
      <section className={styles.hero}>
        <div>
          <Link href="/" className={styles.back}>← ホームへ</Link>
          <p>ON AIR ANIME · 2026 SUMMER</p>
          <h1>今期アニメ<br /><span>各話・人物・あらすじ</span></h1>
          <p className={styles.lead}>番組表の詳細欄から、各話のあらすじと明記された登場人物を取得しています。</p>
        </div>
        <div className={styles.stats}>
          <strong>{currentEpisodes.length}</strong><span>EPISODES</span>
          <b>{currentWorks.length}作品</b><small>2026年8月12日取得</small>
        </div>
      </section>

      <section className={styles.workBrowser} aria-labelledby="work-browser-title">
        <div className={styles.workBrowserHeading}>
          <div>
            <p>SELECT A TITLE</p>
            <h2 id="work-browser-title">アニメタイトルから探す</h2>
          </div>
          {work !== "すべて" && <button type="button" onClick={() => chooseWork("すべて")}>← 全作品へ戻る</button>}
        </div>
        <div className={styles.workGrid}>
          {workCards.map((item) => (
            <button type="button" key={item.work} className={work === item.work ? styles.selectedWork : ""} onClick={() => chooseWork(item.work)} aria-pressed={work === item.work}>
              <span>{item.count}<small>話</small></span>
              <strong>{item.work}</strong>
              <small>{item.latest ? `${item.latest.episode}「${item.latest.title}」` : "各話を見る"}</small>
              {!!item.characters.length && <em>{item.characters.join(" · ")}</em>}
              <b>各話のシーンを見る →</b>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.controls}>
        <div className={styles.search}>
          <span aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="作品・話数・人物・あらすじで検索" />
          {query && <button onClick={() => setQuery("")}>×</button>}
        </div>
        <div className={styles.filters}>
          <label>作品<select value={work} onChange={(event) => chooseWork(event.target.value)}><option>すべて</option>{currentWorks.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>登場人物<select value={character} onChange={(event) => setCharacter(event.target.value)}><option>すべて</option>{characters.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button onClick={reset}>条件をリセット</button>
        </div>
        <p className={styles.summary}><b>{rows.length}</b>話を表示</p>
      </section>

      <section className={styles.trialNotice}>
        <div><span>FREE BETA</span><b>Xでのみんなの反応まとめ</b></div>
        <p>東京の放送時刻に合わせて公開投稿を確認し、1件から各話へ記録します。5件未満は「少数の感想」、5件以上は「参考傾向」として区別します。X全体ではなく、公開検索で確認できた範囲です。</p>
      </section>

      <section className={styles.list} id="episode-list">
        {work !== "すべて" && (
          <div className={styles.selectedWorkHeading}>
            <div><small>SELECTED TITLE</small><h2>{work}</h2><p>{rows.length}話のシーンを表示</p></div>
            <button type="button" onClick={() => chooseWork("すべて")}>作品一覧へ</button>
          </div>
        )}
        {rows.map((episode, index) => (
          <article className={styles.episode} key={`${episode.work}-${episode.episode}-${index}`}>
            <span className={styles.number}><small>ON AIR</small>{episode.episode.replace(/\D/g, "")}</span>
            <div>
              <p>{episode.airtime}{episode.status ? ` · ${episode.status}` : ""}</p>
              <button type="button" className={styles.workTitleButton} onClick={() => chooseWork(episode.work)}>{episode.work}<span>作品だけを見る →</span></button>
              <h3>{episode.episode}「{episode.title}」</h3>
              <div className={styles.sceneBlock}>
                <b>シーン・見どころ</b>
                {(episode.keywords?.length || episode.reaction.themes?.length) ? (
                  <div>{[...new Set([...(episode.keywords || []), ...(episode.reaction.themes || [])])].map((item) => <button key={item} onClick={() => setQuery(item)}>#{item}</button>)}</div>
                ) : <span>番組説明から確認できる場面を、下のあらすじにまとめています。</span>}
              </div>
              <div className={styles.tagGroup}>
                <b>話のあらすじ</b>
                <div>{episode.summary}</div>
              </div>
              <div className={styles.tagGroup}>
                <b>登場人物</b>
                {episode.characters.length ? (
                  <div className={styles.tags}>{episode.characters.map((item) => <button key={item} onClick={() => setCharacter(item)}>人物：{item}</button>)}</div>
                ) : <small>番組表に人物名の記載なし</small>}
              </div>
              <details className={styles.reaction}>
                <summary>
                  <span><i>X</i> みんなの反応 <em>試験版</em></span>
                  <b>{episode.reaction.history.length ? `${episode.reaction.history.length}回更新 · ${episode.reaction.sampleSize || episode.reaction.history.at(-1)?.sampleSize || 0}件` : episode.reaction.status === "insufficient" ? "公開感想を確認できず" : "放送時刻から確認"}</b>
                </summary>
                {episode.reaction.history.length ? (
                  <div className={styles.reactionBody}>
                    <div className={episode.reaction.status === "limited" ? styles.reactionLimited : styles.reactionConfidence}>
                      <b>{episode.reaction.status === "limited" ? "少数の公開感想" : "複数投稿の参考傾向"}</b>
                      <span>{episode.reaction.status === "limited" ? "投稿数が少ないため、全体の傾向とは断定せず個別に確認できた反応として掲載します。" : "異なる利用者の投稿で共通して見られた点を短くまとめています。"}</span>
                    </div>
                    {episode.reaction.overview && <p>{episode.reaction.overview}</p>}
                    {!!episode.reaction.themes?.length && <div className={styles.reactionThemes}>{episode.reaction.themes.map((theme) => <span key={theme}>#{theme}</span>)}</div>}
                    {episode.reaction.divided && <small><b>意見が分かれた点：</b>{episode.reaction.divided}</small>}
                    <ol className={styles.reactionTimeline}>
                      {episode.reaction.history.map((snapshot) => (
                        <li key={`${snapshot.stage}-${snapshot.collectedAt}`}>
                          <div><b>{snapshot.stage}</b><time>{snapshot.collectedAt}</time><em>{snapshot.sampleSize}件を確認 · {snapshot.sampleSize < 5 ? "少数の感想" : "参考傾向"}</em></div>
                          <p>{snapshot.overview}</p>
                          <div className={styles.reactionThemes}>{snapshot.themes.map((theme) => <span key={theme}>#{theme}</span>)}</div>
                          {snapshot.divided && <small><b>意見が分かれた点：</b>{snapshot.divided}</small>}
                          {!!snapshot.sourceUrls?.length && <div className={styles.reactionSources}>{snapshot.sourceUrls.slice(0, 3).map((url, sourceIndex) => <a href={url} target="_blank" rel="noreferrer" key={url}>確認した投稿 {sourceIndex + 1}</a>)}</div>}
                        </li>
                      ))}
                    </ol>
                    <footer>{episode.reaction.window} · {episode.reaction.collectedAt || "集計継続中"} · X全体ではなく公開検索で確認できた範囲</footer>
                  </div>
                ) : episode.reaction.status === "insufficient" ? (
                  <div className={styles.reactionEmpty}><b>対象回と確認できる公開感想が見つかりませんでした</b><span>反応を作り足さず、0件だったことをそのまま表示しています。</span></div>
                ) : (
                  <div className={styles.reactionEmpty}><b>放送後の公開感想を確認します</b><span>1件でも対象回と確認できれば掲載し、5件未満は少数の感想として明記します。</span></div>
                )}
              </details>
              <div className={styles.tags}>
                <button onClick={() => setWork(episode.work)}>作品：{episode.work}</button>
                <button onClick={() => setQuery(episode.title)}>#{episode.title}</button>
                {(episode.keywords || []).map((item) => <button key={item} onClick={() => setQuery(item)}>#{item}</button>)}
              </div>
              {!!episode.sourceUrls?.length && <p>{episode.sourceUrls.map((url, sourceIndex) => <span key={url}><a href={url} target="_blank" rel="noreferrer">公式・番組情報 {sourceIndex + 1}</a>{sourceIndex < episode.sourceUrls!.length - 1 ? " · " : ""}</span>)}</p>}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.tagBrowser}>
        <p>取得元：<a href="https://bangumi.org/epg/td?ggm_group_id=42" target="_blank" rel="noreferrer">Gガイド テレビ番組表（東京地上波）</a></p>
        <small>人物名は番組詳細に明記された場合だけ登録します。X反応は公開検索で確認できた範囲を掲載し、5件未満は少数の感想として区別します。個人の投稿本文やアカウント名は転載しません。</small>
      </section>
    </main>
  );
}
