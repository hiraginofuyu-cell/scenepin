"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { bleachEpisodes } from "../works/bleach/data";
import { gintamaEpisodes } from "../works/gintama/data";
import { currentEpisodes, currentWorks } from "../season/2026-summer/data";
import { springEpisodes, springWorks } from "../season/2026-spring/data";
import styles from "./archive.module.css";

type ArchiveEpisode = {
  id: string;
  work: string;
  label: string;
  title: string;
  period: string;
  people: string[];
  keywords: string[];
  href: string;
};

const archiveEpisodes: ArchiveEpisode[] = [
  ...currentEpisodes.map((episode, index) => ({
    id: `summer-2026-${index}`,
    work: episode.work,
    label: episode.episode,
    title: episode.title,
    period: "2026年夏",
    people: episode.characters,
    keywords: [
      episode.summary,
      ...(episode.keywords || []),
      episode.reaction.overview || "",
      episode.reaction.divided || "",
      ...(episode.reaction.themes || []),
    ].filter(Boolean),
    href: `/season/2026-summer?q=${encodeURIComponent(episode.title)}`,
  })),
  ...springEpisodes.map((episode, index) => ({
    id: `spring-2026-${index}`,
    work: episode.work,
    label: episode.label,
    title: episode.title,
    period: "2026年春",
    people: episode.characters,
    keywords: [episode.summary, ...episode.keywords, episode.airtime],
    href: `/season/2026-spring?work=${encodeURIComponent(episode.work)}&q=${encodeURIComponent(episode.title)}`,
  })),
  ...gintamaEpisodes.map((episode) => ({
    id: `gintama-${episode.number}`,
    work: "銀魂",
    label: `第${episode.number}話`,
    title: episode.title,
    period: episode.arc,
    people: episode.characters,
    keywords: [...episode.keywords, ...episode.scenes, ...episode.quotes],
    href: `/works/gintama?q=${episode.number}`,
  })),
  ...bleachEpisodes.map((episode) => ({
    id: `bleach-${episode.number}`,
    work: "BLEACH",
    label: `第${episode.number}話`,
    title: episode.title,
    period: episode.arc,
    people: episode.characters,
    keywords: [
      ...(episode.keywords || []),
      episode.summary || "",
      ...(episode.scenes || []),
    ].filter(Boolean),
    href: `/works/bleach?q=${episode.number}`,
  })),
];

const archivedWorks = new Set(archiveEpisodes.map((episode) => episode.work));

const collections = [
  {
    kicker: "PAST SEASON · FIRST COLLECTION",
    title: "2026年春アニメ",
    description: "公式各話紹介をもとに、タイトル・あらすじ・明記された人物を収録。確認できた作品を順次拡張中です。",
    count: `${springEpisodes.length}話・${springWorks.length}作品`,
    href: "/season/2026-spring",
    accent: "spring",
    tags: springWorks,
  },
  {
    kicker: "CURRENT SEASON",
    title: "2026年夏アニメ",
    description: "東京の番組表を基準に、各話の放送日時・あらすじ・明記された登場人物を掲載。",
    count: `${currentEpisodes.length}話・${currentWorks.length}作品`,
    href: "/season/2026-summer",
    accent: "summer",
    tags: currentWorks.slice(0, 4),
  },
  {
    kicker: "COMPLETE ARCHIVE",
    title: "銀魂",
    description: "話数、サブタイトル、長編、人物、名場面の手掛かりから横断して探せます。",
    count: `${gintamaEpisodes.length}話`,
    href: "/works/gintama",
    accent: "gintama",
    tags: ["万事屋", "長編", "人物", "セリフ"],
  },
  {
    kicker: "COMPLETE ARCHIVE",
    title: "BLEACH",
    description: "各話タイトルと篇、人物、技や戦いのキーワードをまとめた作品別アーカイブ。",
    count: `${bleachEpisodes.length}話`,
    href: "/works/bleach",
    accent: "bleach",
    tags: ["死神代行篇", "尸魂界篇", "人物", "技"],
  },
];

export default function AnimeArchive() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const results = useMemo(() => {
    const terms = activeQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];

    return archiveEpisodes.filter((episode) => {
      const text = [
        episode.work,
        episode.label,
        episode.title,
        episode.period,
        ...episode.people,
        ...episode.keywords,
      ].join(" ").toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [activeQuery]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setActiveQuery(query.trim());
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><span />ScenePin</Link>
        <nav aria-label="アニメアーカイブのナビゲーション">
          <Link href="/season/2026-summer">今期アニメ</Link>
          <Link href="/search">全作品検索</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Link href="/" className={styles.back}>← ホームへ</Link>
          <p>ANIME ARCHIVE</p>
          <h1>アニメを、<br /><span>年代と作品からさかのぼる。</span></h1>
          <p className={styles.lead}>今期の放送回も、昔見たあの場面も。作品名・人物・セリフ・出来事など、覚えている言葉から何話か探せます。</p>

          <form className={styles.search} onSubmit={submit}>
            <span aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例：銀魂 将軍／BLEACH 卍解"
              aria-label="アニメの作品名や場面を検索"
            />
            <button type="submit">アニメから探す</button>
          </form>
        </div>

        <div className={styles.overview} aria-label="現在の収録状況">
          <div><strong>{archiveEpisodes.length}</strong><span>EPISODES</span></div>
          <div><strong>{archivedWorks.size}</strong><span>TITLES</span></div>
          <p>確認できた情報から順次追加中</p>
        </div>
      </section>

      {activeQuery && (
        <section className={styles.results} aria-live="polite">
          <div className={styles.sectionHeading}>
            <div><p>SEARCH RESULTS</p><h2>「{activeQuery}」で見つかった各話</h2></div>
            <b>{results.length}件</b>
          </div>
          {results.length ? (
            <div className={styles.resultGrid}>
              {results.slice(0, 60).map((episode) => (
                <Link href={episode.href} className={styles.resultCard} key={episode.id}>
                  <div><span>{episode.work}</span><small>{episode.period}</small></div>
                  <p>{episode.label}</p>
                  <h3>{episode.title}</h3>
                  {!!episode.people.length && <small>{episode.people.slice(0, 4).join(" · ")}</small>}
                  <b>各話を見る →</b>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <b>一致する各話が見つかりませんでした。</b>
              <span>短い言葉や、作品名だけでも試してみてください。</span>
            </div>
          )}
          {results.length > 60 && <p className={styles.limit}>先頭60件を表示しています。言葉を追加すると絞り込めます。</p>}
        </section>
      )}

      <section className={styles.collections}>
        <div className={styles.sectionHeading}>
          <div><p>EXPLORE COLLECTIONS</p><h2>収録中のアニメ</h2></div>
          <span>新しいシーズンから過去へ、確認できた各話を順番に増やします。</span>
        </div>
        <div className={styles.collectionGrid}>
          {collections.map((collection) => (
            <Link href={collection.href} className={`${styles.collectionCard} ${styles[collection.accent]}`} key={collection.title}>
              <small>{collection.kicker}</small>
              <div><b>{collection.count}</b><span aria-hidden="true">↗</span></div>
              <h2>{collection.title}</h2>
              <p>{collection.description}</p>
              <ul>{collection.tags.map((tag) => <li key={tag}>#{tag}</li>)}</ul>
              <strong>アーカイブを見る →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.policy}>
        <div><small>NEXT COLLECTION</small><h2>次は2026年冬アニメへ。</h2></div>
        <p>2026年春アニメは公式の各話情報を確認できた作品から追加を開始しました。春の作品を増やしながら、冬アニメへさかのぼります。情報が確認できない項目は推測で埋めません。</p>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.brand}><span />ScenePin</Link>
        <p>あの場面への、いちばん短い道。</p>
        <span>© 2026 ScenePin</span>
      </footer>
    </main>
  );
}
