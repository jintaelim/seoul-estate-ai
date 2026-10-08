import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatHousingArea, formatPrice } from "../utils";

const STORAGE_KEY = "seoul-estate-move-up-candidates";
const candidateKey = item => `${item.district}|${item.dong}|${item.complex}`;

export default function CandidateWatchlist({ onSelect }) {
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } });
  const [selectedKeys, setSelectedKeys] = useState([]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }, [saved]);
  const selected = useMemo(() => saved.filter(item => selectedKeys.includes(candidateKey(item))), [saved, selectedKeys]);
  const remove = item => { const key = candidateKey(item); setSaved(current => current.filter(entry => candidateKey(entry) !== key)); setSelectedKeys(current => current.filter(value => value !== key)); };
  const toggleCompare = item => { const key = candidateKey(item); setSelectedKeys(current => current.includes(key) ? current.filter(value => value !== key) : current.length < 3 ? [...current, key] : current); };

  if (!saved.length) return <section className="card saved-empty-state"><span>☆</span><h2>저장한 후보가 없습니다</h2><p>아파트 찾기에서 관심 단지를 저장하면 최근 거래를 한곳에서 비교할 수 있습니다.</p><Link to="/search">아파트 찾기</Link></section>;

  return <div className="saved-workspace">
    <section className="card saved-overview"><header><div><span>SAVED APARTMENTS</span><h2>저장한 후보 {saved.length}개</h2><p>비교할 단지를 최대 3개까지 선택하세요.</p></div><Link to="/search">후보 더 찾기</Link></header><div className="saved-list">{saved.map(item => { const key = candidateKey(item); const checked = selectedKeys.includes(key); return <article className={checked ? "selected" : ""} key={key}><label><input type="checkbox" checked={checked} onChange={() => toggleCompare(item)} disabled={!checked && selectedKeys.length >= 3} /><span>비교</span></label><button type="button" className="saved-open" onClick={() => onSelect?.(item)}><small>{item.district} {item.dong}</small><strong>{item.complex}</strong><span>{formatPrice(item.price)} · {formatHousingArea(item)}</span><em>{item.dealDate} 계약</em></button><button type="button" className="saved-delete" onClick={() => remove(item)}>삭제</button></article>; })}</div></section>
    <section className="card candidate-compare"><header><div><span>COMPARE</span><h2>후보 비교</h2></div><small>{selected.length}/3 선택</small></header>{selected.length ? <div className="compare-grid">{selected.map(item => <article key={candidateKey(item)}><span>{item.district} {item.dong}</span><h3>{item.complex}</h3><dl><div><dt>최근 매매</dt><dd>{formatPrice(item.price)}</dd></div><div><dt>최근 전세</dt><dd>{item.latestJeonse ? formatPrice(item.latestJeonse) : "확인 없음"}</dd></div><div><dt>전세가율</dt><dd>{item.latestJeonse ? `${Math.round(item.latestJeonse / item.price * 100)}%` : "-"}</dd></div><div><dt>면적</dt><dd>{formatHousingArea(item)}</dd></div><div><dt>준공</dt><dd>{item.builtYear ? `${item.builtYear}년` : "-"}</dd></div><div><dt>최근 거래</dt><dd>{item.recentCount || 1}건</dd></div><div><dt>매매 계약일</dt><dd>{item.dealDate}</dd></div></dl><button type="button" onClick={() => onSelect?.(item)}>단지 상세 보기</button></article>)}</div> : <div className="compare-empty">위 목록에서 비교할 후보를 선택하세요.</div>}</section>
  </div>;
}
