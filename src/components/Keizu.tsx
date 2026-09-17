"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { LINEAGES, NODES, PREFS, YEAR_MAX, YEAR_MIN, type LineageKey } from "@/data/shops";
import { computeLayout } from "@/lib/layout";
import { matches, type FilterState } from "@/lib/ancestry";
import { TreeCanvas, type TreeHandle } from "./TreeCanvas";
import { DetailPanel } from "./DetailPanel";
import { Legend } from "./Legend";

const LINEAGE_CHIPS = (Object.keys(LINEAGES) as LineageKey[]).filter((k) => k !== "root");

export function Keizu() {
  const layout = useMemo(() => computeLayout(NODES), []);
  const tree = useRef<TreeHandle>(null);

  const [lineages, setLineages] = useState<string[]>([]);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(YEAR_MAX);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filter = useMemo<FilterState>(
    () => ({ lineages: new Set(lineages), prefs: new Set(prefs), year, query: query.trim().replace(/\s+/g, "") }),
    [lineages, prefs, year, query],
  );
  const selected = selectedId ? layout.nodes.find((n) => n.id === selectedId) ?? null : null;

  // 1974年から現在へ暖簾が広がる再生。ページ読込時に1度だけ自動再生
  const timer = useRef<d3.Timer | null>(null);
  function replay() {
    timer.current?.stop();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setYear(YEAR_MAX); return; }
    const dur = 2800;
    timer.current = d3.timer((el) => {
      const t = Math.min(1, el / dur);
      setYear(Math.round(YEAR_MIN + d3.easeCubicOut(t) * (YEAR_MAX - YEAR_MIN)));
      if (t >= 1) { timer.current?.stop(); timer.current = null; }
    });
  }
  useEffect(() => {
    replay();
    return () => timer.current?.stop();
  }, []);

  function select(id: string | null) {
    setSelectedId(id);
    if (id) tree.current?.focus(id, true);
  }
  function toggle(list: string[], set: (v: string[]) => void, key: string) {
    set(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  }
  function onQuery(v: string) {
    setQuery(v);
    const q = v.trim().replace(/\s+/g, "");
    const exact = NODES.find((n) => n.name + n.sub === q);
    if (exact) select(exact.id);
  }
  function onQueryEnter() {
    const hit = NODES.find((n) => matches(n, filter));
    if (hit) select(hit.id);
  }

  const stats: [string | number, string][] = [
    [NODES.length, "店舗"], [layout.generations, "世代"], [LINEAGE_CHIPS.length - 1, "系統"], [YEAR_MIN, "創業年"],
  ];

  return (
    <div className="app">
      <header className="bar">
        <div className="brand">
          <h1>家系図<small>関東・家系ラーメンの系譜</small></h1>
        </div>
        <div className="stats">
          {stats.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
        </div>
        <div className="controls">
          <div className="group search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input id="q" type="search" placeholder="屋号で探す" list="names" autoComplete="off" aria-label="屋号で探す"
              value={query} onChange={(e) => onQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") onQueryEnter(); }} />
            <datalist id="names">
              {NODES.map((n) => <option key={n.id} value={n.name + (n.sub ? ` ${n.sub}` : "")} />)}
            </datalist>
          </div>
          <div className="group"><span>系統</span>
            <div className="chips">
              {LINEAGE_CHIPS.map((k) => (
                <button key={k} type="button" className="chip" aria-pressed={lineages.includes(k)}
                  style={{ "--c": LINEAGES[k].color } as React.CSSProperties} onClick={() => toggle(lineages, setLineages, k)}>
                  <span className="dot" />{LINEAGES[k].label}
                </button>
              ))}
            </div>
          </div>
          <div className="group"><span>都県</span>
            <div className="chips">
              {PREFS.map((p) => (
                <button key={p} type="button" className="chip" aria-pressed={prefs.includes(p)} onClick={() => toggle(prefs, setPrefs, p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="group year">
            <span>年</span>
            <input type="range" id="year" min={YEAR_MIN} max={YEAR_MAX} value={year} aria-label="表示する年"
              onChange={(e) => { timer.current?.stop(); setYear(+e.target.value); }} />
            <output id="year-out" htmlFor="year">{year}</output>
            <button className="btn" id="replay" type="button" onClick={replay}>1974年から再生</button>
          </div>
        </div>
      </header>

      <div className="stage-wrap">
        <TreeCanvas ref={tree} layout={layout} filter={filter} selectedId={selectedId} onSelect={select} />
        <Legend />
        <div className="zoombar">
          <button className="btn" type="button" aria-label="拡大" onClick={() => tree.current?.zoomBy(1.3)}>＋</button>
          <button className="btn" type="button" aria-label="縮小" onClick={() => tree.current?.zoomBy(1 / 1.3)}>－</button>
          <button className="btn" type="button" aria-label="全体表示" onClick={() => tree.current?.fit(true)}>⊡</button>
        </div>
        <DetailPanel shop={selected} nodes={layout.nodes} onSelect={select} onClose={() => setSelectedId(null)} />
      </div>
    </div>
  );
}
