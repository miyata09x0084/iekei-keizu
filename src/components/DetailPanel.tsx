"use client";

import { EDGE_LABEL, LINEAGES, STATUS_LABEL, type Shop } from "@/data/shops";
import type { PlacedShop } from "@/lib/layout";

interface Props {
  shop: PlacedShop | null;
  nodes: PlacedShop[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

function RelChip({ shop, onSelect }: { shop: Shop; onSelect: (id: string) => void }) {
  return (
    <button type="button" className="chip" style={{ "--c": LINEAGES[shop.lineage].color } as React.CSSProperties} onClick={() => onSelect(shop.id)}>
      <span className="dot" />
      {shop.name}{shop.sub ? `（${shop.sub}）` : ""}
    </button>
  );
}

export function DetailPanel({ shop, nodes, onSelect, onClose }: Props) {
  const master = shop?.parent ? nodes.find((n) => n.id === shop.parent) ?? null : null;
  const kids = shop ? nodes.filter((n) => n.parent === shop.id).sort((a, b) => a.founded - b.founded) : [];
  const gen = shop
    ? shop.gen === null ? "系譜外" : shop.gen === 0 ? "初代（総本山）" : `第${shop.gen + 1}世代`
    : "";
  const edge = shop
    ? shop.edge ? EDGE_LABEL[shop.edge] : shop.lineage === "capital" ? "企業経営（修行系譜なし）" : "—"
    : "";

  return (
    <aside className={`panel${shop ? " open" : ""}`} id="panel" aria-live="polite" aria-hidden={!shop}>
      <button className="btn close" type="button" onClick={onClose}>閉じる</button>
      {shop && (
        <>
          <p className="p-lineage">
            <span className="dot" style={{ "--c": LINEAGES[shop.lineage].color } as React.CSSProperties} />
            <span>{LINEAGES[shop.lineage].label}</span>
          </p>
          <h2><span>{shop.name}</span><span>{shop.sub}</span></h2>
          <dl className="facts">
            <dt>所在地</dt><dd>{shop.pref}・{shop.city}</dd>
            <dt>創業</dt><dd>{shop.founded}年{shop.approx ? "頃" : ""}</dd>
            <dt>世代</dt><dd>{gen}</dd>
            <dt>関係</dt><dd>{edge}</dd>
            <dt>状態</dt><dd><span className={`badge ${shop.status === "open" ? "open" : "closed"}`}>{STATUS_LABEL[shop.status]}</span></dd>
          </dl>
          <p className="note">{shop.note}</p>
          <h3>師匠</h3>
          <div className="rel">{master ? <RelChip shop={master} onSelect={onSelect} /> : <span className="none">なし</span>}</div>
          <h3>弟子・暖簾分け</h3>
          <div className="rel">{kids.length ? kids.map((k) => <RelChip key={k.id} shop={k} onSelect={onSelect} />) : <span className="none">なし</span>}</div>
        </>
      )}
    </aside>
  );
}
