# 家系ラーメン家系図

関東の家系ラーメン27店・6世代の修行系譜を、縦書き屋号の伝統的な系図様式で可視化するシングルページWebアプリ。

- 吉村家を頂点にした系図の拡大・縮小・ドラッグ
- ホバーで吉村家までの系譜をハイライト、クリックで店舗詳細（Google マップへのリンク付き）
- 系統・都県での絞り込み、屋号検索
- 年スライダーと「1974年から再生」による暖簾拡大アニメーション
- 資本系（町田商店など）は系譜外として別置き

## 開発

Next.js（App Router / TypeScript）+ D3.js。静的出力（`output: 'export'`）なので任意の静的ホスティングに置けます。

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # out/ に静的サイトを出力
npm run lint
```

### 構成

- `src/data/shops.ts` — 店舗データと型（`Shop`）、系統・関係・状態のラベル
- `src/lib/layout.ts` — d3.tree による座標計算と系線の生成（純粋関数）
- `src/lib/ancestry.ts` — 系譜の遡り、絞り込み判定
- `src/components/TreeCanvas.tsx` — D3 が SVG を専有する描画面。React は class の付け替えだけを伝える
- `src/components/Keizu.tsx` — 絞り込み・検索・年スライダー・選択の状態管理
- `src/components/DetailPanel.tsx` / `Legend.tsx`

## データの編集

`src/data/shops.ts` の `NODES` 配列に店舗を追加・修正してください。型が付いているので、値の誤りはビルド時に検出されます。

```ts
{ id: "example", name: "屋号", sub: "地名", pref: "神奈川", city: "横浜市", founded: 2020, approx: true,
  parent: "yoshimura", lineage: "direct", status: "open", edge: "direct", note: "解説" }
```

- `parent`: 師匠となる店の `id`（資本系は `null`）
- `lineage`: `direct` / `honmoku` / `rokkaku` / `ichi` / `oudou` / `musashi` / `indep` / `capital`
- `edge`: `direct`（直系認定）/ `former`（元直系）/ `trained`（修行・独立）/ `disputed`（諸説あり）
- `status`: `open` / `closed` / `main-closed`
- `map`（任意）: その店の Google マップ URL。登録すると詳細パネルに「Google マップで開く」リンクが出る（未登録なら非表示）。
  `https://www.google.com/maps/place/?q=place_id:<Place ID>` の形式なら店名検索に頼らず確実にその店を指せる

系譜は公開情報を編集したものであり、創業年は概算（`approx: true`）を含みます。
