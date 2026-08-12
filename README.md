# ScenePin

アニメ・ドラマ・バラエティの名場面や伏線が何話に登場するかを、作品名・話数・人物名・キーワードから探せるサイトです。

このリポジトリは Cloudflare Workers で単独運用できます。サイトの閲覧に ChatGPT や OpenAI の契約は必要ありません。

## 構成

- Next.js App Router
- vinext / Vite
- Cloudflare Workers
- 現在の番組・反応データは TypeScript ファイルで管理
- 将来の自動更新用に Cloudflare D1 / Cron Triggers を追加可能

## ローカルで動かす

Node.js 22.13 以上が必要です。

```bash
npm ci
npm run dev
```

## 確認

```bash
npm run lint
npm test
```

## Cloudflareへ公開

初回は Cloudflare Dashboard の「Workers & Pages」からこの GitHub リポジトリを接続する方法が簡単です。

- ビルドコマンド: `npm run build`
- デプロイコマンド: `npx wrangler deploy`
- Node.js: 22.13 以上

手元から公開する場合は、Cloudflareへログイン後に次を実行します。

```bash
npm run deploy
```

`main` ブランチへ変更が入るたびに自動公開する設定も利用できます。

## データ

今期アニメは `app/season/2026-summer/data.ts`、作品別アーカイブは `app/works/` 以下にあります。公開X投稿の反応は、公開検索で確認できた範囲だけを要約して保存します。

## 独立運用について

サイト本体は Cloudflare と GitHub で維持できます。番組表・公開反応の自動更新は別工程で、Cloudflare Cron Triggers と D1、または GitHub Actionsを使ってChatGPT外へ移行します。
