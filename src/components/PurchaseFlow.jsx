import { useState } from "react";
import { money } from "../loan-calculator";
import { SEOUL_DISTRICTS } from "../data/districts";

const initialForm = { purpose: "first", cash: "", proceeds: "", loan: "", reserve: "", min: "", max: "", district: "전체", area: "0", built: "0" };
const steps = ["구매 방식", "예산", "희망 조건"];

export default function PurchaseFlow({ onApply }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const update = key => event => setForm(current => ({ ...current, [key]: event.target.value }));
  const availableFunds = Math.max(0, Number(form.cash) + Number(form.loan) + (form.purpose === "move" ? Number(form.proceeds) : 0) - Number(form.reserve));
  const districts = ["전체", ...SEOUL_DISTRICTS];
  const maxBudget = Number(form.max) * 10000;
  const criteria = { district: form.district, min: form.min, budget: maxBudget, area: form.area, built: form.built };
  const field = (key, label, hint) => <label className="purchase-field" key={key}><span>{label}</span><div><input aria-label={label} type="number" min="0" value={form[key]} onChange={update(key)} placeholder="0" /><em>만원</em></div>{hint && <small>{hint}</small>}</label>;
  const ready = step === 1 ? availableFunds > 0 && Number(form.max) > 0 && Number(form.min || 0) <= Number(form.max) : true;
  const apply = path => onApply(criteria, path);

  return <section className="purchase-page purchase-page-simple" aria-label="나의 구매조건">
    <header className="purchase-page-head"><div><span>BUYING CONDITIONS</span><h1>나의 구매조건</h1><p>세 가지만 정하면 바로 실제 거래 단지를 찾아볼 수 있어요.</p></div><div className="purchase-page-count"><strong>{step + 1}</strong><span>/ {steps.length}</span></div></header>
    <ol className="purchase-progress">{steps.map((label, index) => <li className={index === step ? "active" : index < step ? "done" : ""} key={label}><i>{index + 1}</i><span>{label}</span></li>)}</ol>
    <div className="purchase-stage">
      {step === 0 && <><h2>어떤 구매를 준비하고 있나요?</h2><p>갈아타기를 고르면 기존 주택 매각 후 자금도 예산에 더합니다.</p><div className="purchase-choice-grid">{[["first", "첫 집 마련", "보유 주택 없이 시작"], ["move", "갈아타기", "기존 주택 매각 후 이동"], ["additional", "추가 매수", "보유 주택 외 추가 구매"]].map(([value, title, description]) => <label className={form.purpose === value ? "selected" : ""} key={value}><input type="radio" name="purchase-purpose" value={value} checked={form.purpose === value} onChange={update("purpose")} /><strong>{title}</strong><span>{description}</span></label>)}</div></>}
      {step === 1 && <><h2>얼마까지 살 수 있나요?</h2><p>보유 현금과 확인한 대출 가능액으로 구매 예산을 잡습니다.</p><div className="purchase-field-grid purchase-finance-grid">{field("cash", "보유 현금")}{field("loan", "대출 가능액")}{form.purpose === "move" && field("proceeds", "매각 후 순자금", "기존 대출을 정리하고 남는 금액")}{field("reserve", "부대비용", "취득세·이사비 등, 없으면 비워두세요")}</div><div className="purchase-funds"><span>구매에 쓸 수 있는 자금</span><strong>{money(availableFunds)}</strong><small>현금 + 대출 {form.purpose === "move" ? "+ 매각 후 순자금 " : ""}− 부대비용</small></div><div className="purchase-field-grid budget-fields"><label className="purchase-field"><span>최소 예산</span><div><input aria-label="최소 예산" type="number" min="0" step="0.1" value={form.min} onChange={update("min")} placeholder="0" /><em>억</em></div></label><label className="purchase-field"><span>최대 예산</span><div><input aria-label="최대 예산" type="number" min="0" step="0.1" value={form.max} onChange={update("max")} placeholder={availableFunds ? String(Math.floor(availableFunds / 10000)) : "0"} /><em>억</em></div></label></div>{maxBudget > availableFunds && <p className="purchase-budget-note over">최대 예산이 준비 자금을 초과합니다.</p>}</>}
      {step === 2 && <><h2>어떤 집을 볼까요?</h2><p>조건을 비워두면 해당 항목은 넓게 검색합니다.</p><div className="purchase-field-grid purchase-home-grid"><label className="purchase-field"><span>희망 자치구</span><select value={form.district} onChange={update("district")}>{districts.map(value => <option key={value}>{value}</option>)}</select></label><label className="purchase-field"><span>최소 전용면적</span><select value={form.area} onChange={update("area")}>{[["0", "전체"], ["59", "59㎡ 이상"], ["84", "84㎡ 이상"], ["114", "114㎡ 이상"]].map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label className="purchase-field"><span>준공연도</span><select value={form.built} onChange={update("built")}>{[["0", "전체"], ["2010", "2010년 이후"], ["2015", "2015년 이후"], ["2020", "2020년 이후"]].map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div><div className="purchase-ready"><span>검색 조건</span><strong>{form.district} · {form.min || "0"}억~{form.max || "-"}억 · {form.area === "0" ? "면적 전체" : `${form.area}㎡ 이상`}</strong></div></>}
    </div>
    <footer className="purchase-page-footer"><button type="button" className="purchase-back" onClick={() => setStep(current => Math.max(0, current - 1))} disabled={step === 0}>이전</button>{step < steps.length - 1 ? <button type="button" className="purchase-next" onClick={() => setStep(current => current + 1)} disabled={!ready}>다음</button> : <div className="purchase-actions"><button type="button" className="purchase-next" onClick={() => apply("/search")}>아파트 검색</button><button type="button" className="purchase-secondary" onClick={() => apply("/watchlist")}>후보 보기</button></div>}</footer>
  </section>;
}
