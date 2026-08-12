"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { gintamaArcs, gintamaCharacters, gintamaEpisodes, gintamaTagIndex } from "./data";
import styles from "../bleach/archive.module.css";

export default function GintamaArchive() {
  const [query,setQuery]=useState("");
  const [arc,setArc]=useState("すべて");
  const [character,setCharacter]=useState("すべて");
  const [showFilters,setShowFilters]=useState(false);
  useEffect(()=>{const initial=new URLSearchParams(window.location.search).get("q");if(initial)setQuery(initial)},[]);

  const filtered=useMemo(()=>{
    const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return gintamaEpisodes.filter(ep=>{
      const text=[ep.number,ep.title,ep.arc,...ep.characters,...ep.scenes,...ep.quotes,...ep.keywords].join(" ").toLowerCase();
      return terms.every(term=>text.includes(term))&&(arc==="すべて"||ep.arc===arc)&&(character==="すべて"||ep.characters.includes(character));
    });
  },[query,arc,character]);
  const reset=()=>{setQuery("");setArc("すべて");setCharacter("すべて")};

  return <main className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.brand}><span/>ScenePin</Link><Link href="/search">全作品から探す</Link></header>
    <section className={styles.hero}>
      <div><Link href="/" className={styles.back}>← 作品一覧へ</Link><p>GINTAMA EPISODE ARCHIVE</p><h1>銀魂<br/><span>第1〜201話から探す</span></h1><p className={styles.lead}>長いサブタイトルの一部、人物名、篇、ギャグのキーワードから検索できます。</p></div>
      <div className={styles.stats}><strong>201</strong><span>EPISODES</span><b>{gintamaArcs.length}分類</b><small>人物・篇タグ対応</small></div>
    </section>
    <section className={styles.controls}>
      <div className={styles.search}><span aria-hidden="true"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="例：将軍 床屋、土方 真選組、人気投票" aria-label="銀魂の話を検索"/>{query&&<button onClick={()=>setQuery("")}>×</button>}</div>
      <button className={styles.detailButton} onClick={()=>setShowFilters(v=>!v)}>詳細設定 {showFilters?"−":"＋"}</button>
      {showFilters&&<div className={styles.filters}>
        <label>篇・分類<select value={arc} onChange={e=>setArc(e.target.value)}><option>すべて</option>{gintamaArcs.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>登場人物<select value={character} onChange={e=>setCharacter(e.target.value)}><option>すべて</option>{gintamaCharacters.map(x=><option key={x}>{x}</option>)}</select></label>
        <button onClick={reset}>条件をリセット</button>
      </div>}
      <p className={styles.summary}><b>{filtered.length}</b>話が一致</p>
    </section>
    <section className={styles.tagBrowser} aria-label="銀魂のタグ一覧">
      <div><p>TAG INDEX</p><h2>人物・名シーン・決め台詞から探す</h2><small>タグを押すと、登録された話だけを一覧表示します。</small></div>
      <div className={styles.tagCloud}>{gintamaTagIndex.map(tag=><button key={tag.name} className={query===tag.name?styles.activeTag:""} onClick={()=>{setQuery(tag.name);setCharacter("すべて")}}><span>{tag.name}</span><b>{tag.count}</b></button>)}</div>
    </section>
    <section className={styles.list}>
      {filtered.map(ep=><article key={ep.number} className={styles.episode}><span className={styles.number}><small>EP</small>{ep.number}</span><div><p>{ep.arc}</p><h2>{ep.title}</h2>{ep.characters.length>0&&<div className={styles.tagGroup}><b>登場人物</b><div className={styles.tags}>{ep.characters.map(x=><button key={x} onClick={()=>setQuery(x)}>人物：{x}</button>)}</div></div>}{ep.scenes.length>0&&<div className={styles.tagGroup}><b>名シーン</b><div className={styles.tags}>{ep.scenes.map(x=><button key={x} onClick={()=>setQuery(x)}>場面：{x}</button>)}</div></div>}{ep.quotes.length>0&&<div className={styles.tagGroup}><b>決め台詞・セリフ</b><div className={styles.tags}>{ep.quotes.map(x=><button key={x} onClick={()=>setQuery(x)}>「{x}」</button>)}</div></div>}{ep.keywords.length>0&&<div className={styles.tags}>{ep.keywords.filter(x=>![...ep.scenes,...ep.quotes].includes(x)).map(x=><button key={x} onClick={()=>setQuery(x)}>#{x}</button>)}</div>}</div></article>)}
      {!filtered.length&&<div className={styles.empty}><h2>一致する話がありません</h2><p>言葉を短くするか、詳細条件をリセットしてみてください。</p><button onClick={reset}>すべて表示</button></div>}
    </section>
  </main>;
}
