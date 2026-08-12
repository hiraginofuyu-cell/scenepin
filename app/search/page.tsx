"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { bleachEpisodes } from "../works/bleach/data";
import { gintamaEpisodes } from "../works/gintama/data";
import { broadcasts } from "../works/wednesday-downtown/2025/data";
import { currentEpisodes } from "../season/2026-summer/data";
import { currentPrograms } from "../current/data";
import styles from "./search.module.css";

type SearchItem = {
  id: string;
  work: string;
  category: string;
  label: string;
  title: string;
  people: string[];
  keywords: string[];
  group: string;
  href: string;
};

const items: SearchItem[] = [
  ...currentPrograms.map((program,index)=>({
    id:`program-${index}`,
    work:program.work,
    category:program.category,
    label:program.episode,
    title:program.title,
    people:program.people,
    keywords:[program.summary,...program.keywords,"放送中","2026年夏"],
    group:`${program.category} · ${program.airtime}`,
    href:`/current?q=${encodeURIComponent(program.title)}`,
  })),
  ...currentEpisodes.map((episode,index)=>({
    id:`current-${index}`,
    work:episode.work,
    category:"アニメ",
    label:episode.episode,
    title:episode.title,
    people:episode.characters,
    keywords:[episode.summary,...(episode.keywords || []),episode.reaction.overview || "",episode.reaction.divided || "",...(episode.reaction.themes || []),...episode.reaction.history.flatMap((snapshot) => [snapshot.overview,snapshot.divided || "",...snapshot.themes]),"今期アニメ","2026年夏"].filter(Boolean),
    group:"2026年夏アニメ",
    href:`/season/2026-summer?q=${encodeURIComponent(episode.title)}`,
  })),
  ...gintamaEpisodes.map((episode) => ({
    id: `gintama-${episode.number}`,
    work: "銀魂",
    category: "アニメ",
    label: `第${episode.number}話`,
    title: episode.title,
    people: episode.characters,
    keywords: [...episode.keywords,...episode.scenes,...episode.quotes],
    group: episode.arc,
    href: `/works/gintama?q=${encodeURIComponent(String(episode.number))}`,
  })),
  ...bleachEpisodes.map((episode) => ({
    id: `bleach-${episode.number}`,
    work: "BLEACH",
    category: "アニメ",
    label: `第${episode.number}話`,
    title: episode.title,
    people: episode.characters,
    keywords: [...episode.keywords, episode.summary || "", ...(episode.scenes || [])].filter(Boolean),
    group: episode.arc,
    href: `/works/bleach?q=${encodeURIComponent(String(episode.number))}`,
  })),
  ...broadcasts.flatMap((broadcast) =>
    broadcast.theories.map((theory, index) => ({
      id: `wed-${broadcast.date}-${index}`,
      work: "水曜日のダウンタウン",
      category: "バラエティ",
      label: broadcast.date.replaceAll("-", "."),
      title: theory.title,
      people: theory.presenter ? [theory.presenter] : [],
      keywords: theory.keywords,
      group: broadcast.label || "2025年",
      href: `/works/wednesday-downtown/2025?q=${encodeURIComponent(theory.title)}`,
    })),
  ),
];

const works = ["すべて",...new Set(items.map(item=>item.work))];
const people = [...new Set(items.flatMap((item) => item.people))].sort();

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [work, setWork] = useState("すべて");
  const [person, setPerson] = useState("すべて");
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const haystack = [item.work, item.label, item.title, item.group, ...item.people, ...item.keywords]
        .join(" ").toLowerCase();
      return terms.every((term) => haystack.includes(term))
        && (work === "すべて" || item.work === work)
        && (person === "すべて" || item.people.includes(person));
    });
  }, [query, work, person]);

  return (
    <main className={styles.page}>
      <header><Link href="/">← ScenePin</Link><b>全作品キーワード検索</b></header>
      <section className={styles.hero}>
        <p>SEARCH EVERY SCENE</p>
        <h1>覚えている言葉から、<br /><span>何話か見つける。</span></h1>
        <div className={styles.search}>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="作品名・人物・セリフ・技・企画名など"
          />
          <b>{results.length}件</b>
        </div>
        <button className={styles.detail} onClick={() => setDetails((value) => !value)}>
          詳細検索 {details ? "−" : "＋"}
        </button>
        {details && (
          <div className={styles.filters}>
            <label>検索する作品
              <select value={work} onChange={(event) => setWork(event.target.value)}>
                {works.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>登場人物・出演者
              <select value={person} onChange={(event) => setPerson(event.target.value)}>
                <option>すべて</option>
                {people.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button onClick={() => { setWork("すべて"); setPerson("すべて"); }}>解除</button>
          </div>
        )}
      </section>
      <section className={styles.results}>
        {results.slice(0, 150).map((item) => (
          <Link href={item.href} key={item.id} className={styles.card}>
            <span className={item.work === "水曜日のダウンタウン" ? styles.pink : styles.blue}>{item.work}</span>
            <div>
              <p>{item.label} · {item.group}</p>
              <h2>{item.title}</h2>
              <small>{[...item.people, ...item.keywords].map((term) => `#${term}`).join(" ")}</small>
            </div>
            <b>→</b>
          </Link>
        ))}
        {results.length > 150 && <p className={styles.limit}>先頭150件を表示中。キーワードや詳細設定で絞り込めます。</p>}
      </section>
    </main>
  );
}
