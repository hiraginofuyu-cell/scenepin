import Link from "next/link";
import { currentPrograms } from "../current/data";
import { currentEpisodes } from "../season/2026-summer/data";
import { bleachEpisodes } from "../works/bleach/data";
import { researchRoles } from "./data";
import styles from "./studio.module.css";

const verifiedBleach = bleachEpisodes.filter((episode) => (episode.sourceUrls?.length ?? 0) > 0).length;
const unresolvedCurrent = [
  ...currentPrograms.flatMap((program) => [program.title, program.summary, ...program.keywords]),
  ...currentEpisodes.flatMap((episode) => [episode.title, episode.summary, ...(episode.keywords ?? [])]),
].filter((value) => value.includes("確認中")).length;

const progress = [
  {
    label: "今期アニメ",
    value: currentEpisodes.length,
    unit: "話",
    note: "2026年夏の各話データ",
  },
  {
    label: "放送中番組",
    value: currentPrograms.length,
    unit: "回",
    note: "ドラマ・主要バラエティ",
  },
  {
    label: "BLEACH公式確認",
    value: verifiedBleach,
    unit: ` / ${bleachEpisodes.length}話`,
    note: "出典付きの詳細を登録済み",
  },
  {
    label: "確認待ち",
    value: unresolvedCurrent,
    unit: "項目",
    note: "推測せず「確認中」で保持",
  },
];

export default function AiStudioPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/">← ScenePin</Link>
        <b>AI編集部</b>
        <Link href="/search">意味検索</Link>
      </header>

      <section className={styles.hero}>
        <p>SCENEPIN RESEARCH DESK</p>
        <h1>担当を分けて、<br /><span>速く・正確に集める。</span></h1>
        <p className={styles.lead}>
          現在放送中の作品と過去作品を別々に調査し、公式確認担当が公開前に照合します。
          このページで、役割と登録状況をいつでも確認できます。
        </p>
        <div className={styles.actions}>
          <Link href="/season/2026-summer">今期アニメを見る</Link>
          <Link href="/works/bleach">BLEACHの進捗を見る</Link>
        </div>
      </section>

      <section className={styles.progress} aria-label="現在の登録状況">
        {progress.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}<small>{item.unit}</small></strong>
            <p>{item.note}</p>
          </article>
        ))}
      </section>

      <section className={styles.roles}>
        <div className={styles.heading}>
          <p>RESEARCH ROLES</p>
          <h2>4つの担当</h2>
          <span>収集・照合・検索を一つのAIに詰め込まず、仕事ごとに分けています。</span>
        </div>
        <div className={styles.grid}>
          {researchRoles.map((role) => (
            <article className={`${styles.card} ${styles[role.id]}`} key={role.id}>
              <div className={styles.cardTop}>
                <span>{role.shortName}</span>
                <b>{role.status}</b>
              </div>
              <h3>{role.name}</h3>
              <p>{role.mission}</p>
              <dl>
                <div><dt>確認元</dt><dd>{role.inputs.join("・")}</dd></div>
                <div><dt>作るもの</dt><dd>{role.outputs.join("・")}</dd></div>
              </dl>
              <small>{role.costPolicy}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.flow}>
        <div><b>1</b><span>今期・過去を別々に収集</span></div>
        <i>→</i>
        <div><b>2</b><span>公式確認AIが照合</span></div>
        <i>→</i>
        <div><b>3</b><span>ScenePinへ重複なく追加</span></div>
        <i>→</i>
        <div><b>4</b><span>意味検索AIで見つける</span></div>
      </section>

      <aside className={styles.policy}>
        <b>公開ルール</b>
        <p>公式情報で確認できない話数・人物・場面は推測しません。解決するまでは「確認中」と表示し、出典を残します。</p>
      </aside>
    </main>
  );
}
