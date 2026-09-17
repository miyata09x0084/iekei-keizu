import * as d3 from "d3";
import type { Shop } from "@/data/shops";

/** 縦書きラベルの寸法。CSS の font-size と対応させる */
export const CH = 17;        // 屋号 1文字あたりの高さ
export const SUBCH = 12;     // 補足 1文字あたりの高さ
export const MARK = 6;       // 丸印の半径
export const PAD_TOP = 10;   // 丸印と屋号の間
export const LEVEL = 215;    // 世代間の縦距離
export const SIB = 44;       // 兄弟間の横距離
export const BUS_OFFSET = 42; // 子の丸印から横棒までの距離

export interface PlacedShop extends Shop {
  x: number;
  y: number;
  gen: number | null; // 資本系は null
}

export interface BusLink {
  kind: "bus";
  id: string;
  parent: PlacedShop;
  children: PlacedShop[];
  d: string;
}
export interface DropLink {
  kind: "drop";
  id: string;
  parent: PlacedShop;
  child: PlacedShop;
  d: string;
}
export type Link = BusLink | DropLink;

export interface Layout {
  nodes: PlacedShop[];
  links: Link[];
  root: PlacedShop;
  capitals: PlacedShop[];
  generations: number;
}

export function labelHeight(d: Shop): number {
  return MARK + PAD_TOP + d.name.length * CH + (d.sub ? d.sub.length * SUBCH + 6 : 0);
}

/** 系図の座標と系線を計算する。資本系は木に含めず右外へ並べる */
export function computeLayout(shops: Shop[]): Layout {
  const treeData = shops.filter((n) => n.lineage !== "capital");
  const stratified = d3.stratify<Shop>().id((d) => d.id).parentId((d) => d.parent)(treeData);
  stratified.sort((a, b) => a.data.founded - b.data.founded);
  const root = d3.tree<Shop>().nodeSize([SIB, LEVEL]).separation((a, b) => (a.parent === b.parent ? 1 : 1.4))(stratified);

  const placed = new Map<string, PlacedShop>();
  const hierarchyNodes = root.descendants();
  hierarchyNodes.forEach((h) => placed.set(h.id!, { ...h.data, x: h.x, y: h.y, gen: h.depth }));

  const maxX = d3.max(hierarchyNodes, (h) => h.x) ?? 0;
  const capitals = shops
    .filter((n) => n.lineage === "capital")
    .map((n, i) => ({ ...n, x: maxX + 150 + i * SIB, y: LEVEL, gen: null }));
  capitals.forEach((c) => placed.set(c.id, c));

  // 系線：親ごとに「幹＋横棒」、子ごとに「縦の降り線」
  const links: Link[] = [];
  hierarchyNodes.filter((h) => h.children).forEach((h) => {
    const p = placed.get(h.id!)!;
    const children = h.children!.map((c) => placed.get(c.id!)!);
    const busY = children[0].y - BUS_OFFSET;
    const xs = children.map((c) => c.x);
    links.push({
      kind: "bus", id: `${p.id}:bus`, parent: p, children,
      d: `M${p.x},${p.y + labelHeight(p)} V${busY} M${Math.min(...xs, p.x)},${busY} H${Math.max(...xs, p.x)}`,
    });
    children.forEach((c) =>
      links.push({ kind: "drop", id: c.id, parent: p, child: c, d: `M${c.x},${busY} V${c.y - MARK - 1}` }),
    );
  });

  return {
    nodes: shops.map((s) => placed.get(s.id)!),
    links,
    root: placed.get(root.id!)!,
    capitals,
    generations: (d3.max(hierarchyNodes, (h) => h.depth) ?? 0) + 1,
  };
}
