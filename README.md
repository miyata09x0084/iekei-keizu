# 家系ラーメン家系図

関東の家系ラーメン27店・6世代の修行系譜を、縦書き屋号の伝統的な系図様式で可視化するシングルページWebアプリ。

- 吉村家を頂点にした系図の拡大・縮小・ドラッグ
- ホバーで吉村家までの系譜をハイライト、クリックで店舗詳細
- 系統・都県での絞り込み、屋号検索
- 年スライダーと「1974年から再生」による暖簾拡大アニメーション
- 資本系（町田商店など）は系譜外として別置き

## 使い方

`index.html` をブラウザで開くだけで動作します（D3.js と Google Fonts を CDN から読み込みます）。

## データの編集

`index.html` 内の `NODES` 配列に店舗を追加・修正してください。

```js
{ id:'example', name:'屋号', sub:'地名', pref:'神奈川', city:'横浜市', founded:2020, approx:true,
  parent:'yoshimura', lineage:'direct', status:'open', edge:'direct', note:'解説' }
```

- `parent`: 師匠となる店の `id`（資本系は `null`）
- `lineage`: `direct` / `honmoku` / `rokkaku` / `ichi` / `oudou` / `musashi` / `indep` / `capital`
- `edge`: `direct`（直系認定）/ `former`（元直系）/ `trained`（修行・独立）/ `disputed`（諸説あり）
- `status`: `open` / `closed` / `main-closed`

系譜は公開情報を編集したものであり、創業年は概算（`approx: true`）を含みます。
