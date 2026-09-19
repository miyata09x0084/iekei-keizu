export type LineageKey =
  | "root" | "direct" | "honmoku" | "rokkaku" | "ichi" | "oudou" | "musashi" | "indep" | "capital";
export type EdgeKind = "direct" | "former" | "trained" | "disputed";
export type ShopStatus = "open" | "closed" | "main-closed";
export type Pref = "神奈川" | "東京" | "千葉" | "茨城";

export interface Shop {
  id: string;
  name: string;
  sub: string;
  pref: Pref;
  city: string;
  founded: number;
  approx?: boolean;
  parent: string | null;
  lineage: LineageKey;
  status: ShopStatus;
  edge: EdgeKind | null;
  note: string;
  map?: string; // Google マップの URL。未登録なら詳細パネルにリンクを出さない
}

export const LINEAGES: Record<LineageKey, { label: string; color: string }> = {
  root:    { label: "総本山",   color: "#F1E7D2" },
  direct:  { label: "直系",     color: "#D0402F" },
  honmoku: { label: "本牧家系", color: "#5B8BC0" },
  rokkaku: { label: "六角家系", color: "#86AE55" },
  ichi:    { label: "壱系",     color: "#E3B95A" },
  oudou:   { label: "王道家系", color: "#B58AD1" },
  musashi: { label: "武蔵家系", color: "#D39A66" },
  indep:   { label: "独立系",   color: "#E09A8E" },
  capital: { label: "資本系",   color: "#8E8577" },
};

export const EDGE_LABEL: Record<EdgeKind, string> = {
  direct: "直系（吉村家認定）",
  former: "元直系（認定を離脱）",
  trained: "修行・独立",
  disputed: "修行・独立（諸説あり）",
};

export const STATUS_LABEL: Record<ShopStatus, string> = {
  open: "営業中",
  closed: "閉店",
  "main-closed": "本店閉店・支店が継承",
};

export const PREFS: Pref[] = ["神奈川", "東京", "千葉", "茨城"];
export const YEAR_MIN = 1974;
export const YEAR_MAX = 2026;

// 系譜は公開情報を編集したもの。approx=true の創業年は概算。
export const NODES: Shop[] = [
  { id: "yoshimura", name: "吉村家", sub: "横浜駅西口", pref: "神奈川", city: "横浜市西区", founded: 1974, parent: null, lineage: "root", status: "open", edge: null,
    note: "1974年、吉村実氏が新杉田に創業。豚骨醤油のスープに酒井製麺の太麺、ほうれん草と海苔、チャーシュー。屋号の「家」がそのまま「家系」の名の由来になった。1999年に横浜駅西口へ移転し、今も総本山として行列が絶えない。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJL9MHQwxcGGARctbSzWCKzsk" },

  { id: "honmoku", name: "本牧家", sub: "本牧", pref: "神奈川", city: "横浜市中区", founded: 1985, parent: "yoshimura", lineage: "honmoku", status: "main-closed", edge: "trained",
    note: "吉村家の2号店として本牧に開店。店長だった神藤隆氏が独立して六角家を開き、本牧家自身も後に吉村家から独立した。本牧家系・六角家系という二大分流の源。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJd3DULXFAGGARqISz6apcCxg" },
  { id: "suzuki", name: "寿々喜家", sub: "上星川", pref: "神奈川", city: "横浜市保土ケ谷区", founded: 1995, approx: true, parent: "honmoku", lineage: "honmoku", status: "open", edge: "trained",
    note: "本牧家出身。上星川の住宅街で長く愛される本牧家系の代表格。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJU0VpY3pZGGARApqOqRIJrBA" },

  { id: "rokkaku", name: "六角家", sub: "六角橋", pref: "神奈川", city: "横浜市神奈川区", founded: 1988, parent: "honmoku", lineage: "rokkaku", status: "main-closed", edge: "trained",
    note: "本牧家の店長だった神藤隆氏が六角橋に開店。新横浜ラーメン博物館への出店で「家系」を全国区に押し上げた。本店は2017年に閉店、戸塚店が暖簾を守る。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ-8xabQBbGGARzqnH2mzQNjU" },
  { id: "kaiichi", name: "介一家", sub: "", pref: "神奈川", city: "横浜市", founded: 1992, approx: true, parent: "rokkaku", lineage: "rokkaku", status: "open", edge: "trained",
    note: "六角家出身。まろやかなスープで六角家系の味を継ぐ。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJtaZjmtlcGGARoZ9_Pf6LL08" },
  { id: "takasago", name: "たかさご家", sub: "", pref: "神奈川", city: "横浜市中区", founded: 1998, approx: true, parent: "rokkaku", lineage: "rokkaku", status: "open", edge: "trained",
    note: "六角家出身。横浜中心部で六角家系の味を伝える一軒。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJF7rNjopcGGARvxwdATzQKR0" },
  { id: "samurai", name: "侍", sub: "渋谷", pref: "東京", city: "渋谷区", founded: 2002, approx: true, parent: "rokkaku", lineage: "rokkaku", status: "open", edge: "disputed",
    note: "東京の家系を代表する一軒。系譜上は六角家の流れとされることが多いが、位置づけには諸説ある。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJnwlYk1uLGGARQDWRzmbWCgg" },

  { id: "ichiroku", name: "壱六家", sub: "磯子", pref: "神奈川", city: "横浜市磯子区", founded: 1994, parent: "rokkaku", lineage: "ichi", status: "open", edge: "trained",
    note: "六角家出身。うずらの卵を載せる独自のスタイルで「壱系」と呼ばれる一派の源流となった。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJYcwsW1FDGGAR4CQqP8D5Ywg" },
  { id: "ichihachi", name: "壱八家", sub: "", pref: "神奈川", city: "横浜市", founded: 2001, approx: true, parent: "ichiroku", lineage: "ichi", status: "open", edge: "trained",
    note: "壱六家からの暖簾分け。うずら卵と甘めのスープが壱系の証。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJhYqWR0VaGGARNgy9-SuuCow" },
  { id: "ichinana", name: "壱七家", sub: "", pref: "神奈川", city: "横浜市", founded: 2003, approx: true, parent: "ichiroku", lineage: "ichi", status: "open", edge: "trained",
    note: "壱六家からの暖簾分け。壱系の番号付き屋号のひとつ。" },

  { id: "musashi", name: "武蔵家", sub: "千葉", pref: "千葉", city: "千葉市", founded: 1997, approx: true, parent: "rokkaku", lineage: "musashi", status: "open", edge: "disputed",
    note: "千葉発、東京に多店舗を広げた武蔵家系の源流。ライス無料の文化を東京に根付かせた。系譜上の位置づけには諸説ある。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJdQcjnraEImARkmllA9zTjGQ" },
  { id: "musashi-nakano", name: "武蔵家", sub: "新中野", pref: "東京", city: "中野区", founded: 2001, approx: true, parent: "musashi", lineage: "musashi", status: "open", edge: "trained",
    note: "武蔵家の東京進出の拠点。濃厚なスープと無料ライスで学生に支持される。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ9wcnJOryGGARjkwJPuzVVOM" },
  { id: "budoka", name: "武道家", sub: "早稲田", pref: "東京", city: "新宿区", founded: 2005, approx: true, parent: "musashi", lineage: "musashi", status: "open", edge: "trained",
    note: "武蔵家出身。早稲田の学生街で圧倒的な支持を集め、「濃さ」で語られる東京家系の代名詞。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJlXygBkjuGGARyGwtI_EqH3k" },
  { id: "budoka2", name: "武道家", sub: "二代目・吉祥寺", pref: "東京", city: "武蔵野市", founded: 2013, approx: true, parent: "budoka", lineage: "musashi", status: "open", edge: "trained",
    note: "武道家の二代目を名乗る吉祥寺の店。武蔵家系で唯一、五世代目に当たる。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJAQDLBkjuGGARrqwCAa7guz8" },

  { id: "kondo", name: "近藤家", sub: "川崎", pref: "神奈川", city: "川崎市川崎区", founded: 1988, approx: true, parent: "yoshimura", lineage: "indep", status: "open", edge: "trained",
    note: "吉村家出身。川崎で独自の道を歩む古参の一軒。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJlfyskyxhGGAREo2jyFfUd_w" },

  { id: "sugita", name: "杉田家", sub: "新杉田", pref: "神奈川", city: "横浜市磯子区", founded: 1999, parent: "yoshimura", lineage: "direct", status: "open", edge: "direct",
    note: "吉村家が横浜駅西口へ移転した跡地に、一番弟子の津村氏が開店。直系一号店とされ、創業の地で当時の味を守り続ける。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJuRdCZl1DGGARt-1h8wAHp1A" },
  { id: "sugita-chiba", name: "杉田家", sub: "千葉店", pref: "千葉", city: "千葉市中央区", founded: 2016, approx: true, parent: "sugita", lineage: "direct", status: "open", edge: "direct",
    note: "杉田家の暖簾分け。千葉における吉村家直系の拠点。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJBZ6q5s-EImARMsKXTGoEw8w" },
  { id: "kan2", name: "環２家", sub: "環状2号線", pref: "神奈川", city: "横浜市港南区", founded: 1998, approx: true, parent: "yoshimura", lineage: "direct", status: "open", edge: "direct",
    note: "環状2号線沿いの直系店。ロードサイドで長く支持され、直系の中でも古参。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJB3EL7eNaGGAR_4FCTYJcwyY" },
  { id: "atsugi", name: "厚木家", sub: "本厚木", pref: "神奈川", city: "厚木市", founded: 2000, approx: true, parent: "yoshimura", lineage: "direct", status: "open", edge: "direct",
    note: "県央・厚木に構える直系店。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJA_d0TRsAGWARLDQ5zwRx34E" },
  { id: "suehiro", name: "末廣家", sub: "白楽", pref: "神奈川", city: "横浜市神奈川区", founded: 2012, parent: "yoshimura", lineage: "direct", status: "open", edge: "direct",
    note: "六角橋商店街の近く、白楽に開店した直系店。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ56uyCqReGGARZoQlNV_Dm6Y" },

  { id: "oudou", name: "王道家", sub: "柏", pref: "千葉", city: "柏市", founded: 2003, parent: "yoshimura", lineage: "oudou", status: "open", edge: "former",
    note: "清水裕正氏が吉村家で修行後、2003年に取手で創業。直系として認定されるも2019年に離脱し、柏へ移転。自家製麺を武器に独自の系譜を築いている。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJUW3O2uecGGART8x7KUGjCjM" },
  { id: "torakichi", name: "とらきち家", sub: "取手", pref: "茨城", city: "取手市", founded: 2011, approx: true, parent: "oudou", lineage: "oudou", status: "open", edge: "trained",
    note: "王道家出身。茨城における王道家系の看板店。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJFaAcX6BeGGAR3pcC-DJgTqY" },
  { id: "oudou-shirushi", name: "王道之印", sub: "柏", pref: "千葉", city: "柏市", founded: 2019, approx: true, parent: "oudou", lineage: "oudou", status: "open", edge: "trained",
    note: "王道家の姉妹店。柏に王道家系の一角を形づくる。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJQUm6QfWdGGARUbR3YBf0rgw" },
  { id: "oudou-ishii", name: "王道いしい", sub: "柏", pref: "千葉", city: "柏市", founded: 2020, approx: true, parent: "oudou", lineage: "oudou", status: "open", edge: "trained",
    note: "王道家出身の店主による柏の店。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJBVKNvMGbImARrX8LhXM-qoc" },

  // 系図に載らない資本系（修行系譜に属さない）
  { id: "machida", name: "町田商店", sub: "町田", pref: "東京", city: "町田市", founded: 2008, parent: null, lineage: "capital", status: "open", edge: null,
    note: "ギフトホールディングスが展開するチェーン。修行の系譜には属さない「資本系」の代表格で、家系を全国に広めた。",
    map: "https://www.google.com/maps/place/?q=place_id:ChIJ4SGOkrL-GGAR449DaVxOaoc" },
  { id: "konshin", name: "魂心家", sub: "", pref: "神奈川", city: "横浜市ほか", founded: 2010, approx: true, parent: null, lineage: "capital", status: "open", edge: null,
    note: "企業が展開する資本系。関東を中心に多店舗化。" },
  { id: "ichikaku", name: "壱角家", sub: "", pref: "東京", city: "東京都ほか", founded: 2013, approx: true, parent: null, lineage: "capital", status: "open", edge: null,
    note: "企業が展開する資本系。都内の駅前に多い。" },
];

export const SHOP_BY_ID = new Map(NODES.map((n) => [n.id, n]));
