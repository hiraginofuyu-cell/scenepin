"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { currentPrograms } from "./data";
import styles from "../works/bleach/archive.module.css";

export default function CurrentProgramsPage(){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("すべて");
  useEffect(()=>{const initial=new URLSearchParams(window.location.search).get("q");if(initial)setQuery(initial);},[]);
  const rows=useMemo(()=>{
    const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return currentPrograms.filter(item=>{
      const text=[item.work,item.episode,item.title,item.summary,...item.people,...item.keywords].join(" ").toLowerCase();
      return terms.every(term=>text.includes(term))&&(category==="すべて"||item.category===category);
    });
  },[query,category]);
  return <main className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.brand}><span/>ScenePin</Link><Link href="/search">全作品から探す</Link></header>
    <section className={styles.hero}><div><Link href="/" className={styles.back}>← ホームへ</Link><p>ON AIR · TOKYO</p><h1>放送中の番組<br/><span>ドラマ・バラエティ</span></h1><p className={styles.lead}>公式番組表と各局の公式ページで確認できた情報を掲載します。不明な項目は「確認中」のまま残します。</p></div><div className={styles.stats}><strong>{currentPrograms.length}</strong><span>PROGRAMS</span><b>2026年8月6日</b><small>東京地上波</small></div></section>
    <section className={styles.controls}><div className={styles.search}><span/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="番組・人物・場面・キーワードで検索"/>{query&&<button onClick={()=>setQuery("")}>×</button>}</div><div className={styles.filters}><label>種別<select value={category} onChange={e=>setCategory(e.target.value)}><option>すべて</option><option>ドラマ</option><option>バラエティ</option></select></label></div><p className={styles.summary}><b>{rows.length}</b>件を表示</p></section>
    <section className={styles.list}>{rows.map(item=><article className={styles.episode} key={`${item.work}-${item.episode}`}><span className={styles.number}><small>{item.category}</small>{item.airtime.split(" ")[1]}</span><div><p>{item.airtime} · {item.episode}</p><h2>{item.work}</h2><h3>{item.title}</h3><p>{item.summary}</p><div className={styles.tags}>{item.people.map(person=><button key={person} onClick={()=>setQuery(person)}>人物：{person}</button>)}{item.keywords.map(word=><button key={word} onClick={()=>setQuery(word)}>#{word}</button>)}</div><p>{item.sourceUrls.map((url,index)=><span key={url}><a href={url} target="_blank" rel="noreferrer">公式・番組情報 {index+1}</a>{index<item.sourceUrls.length-1?" · ":""}</span>)}</p></div></article>)}</section>
  </main>;
}
