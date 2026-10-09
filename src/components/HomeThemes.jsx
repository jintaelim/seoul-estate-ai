import { Link } from "react-router-dom";
import { ActionButton, Badge, Box, Grid, Skeleton, Text } from "@seed-design/react";
import { formatHousingArea, formatPrice } from "../utils";

const signedPrice = value => `${value > 0 ? "+" : ""}${formatPrice(value)}`;

function SectionHeading({ code, eyebrow, title, description, meta }) {
  return <Box as="header" className="signal-section-head">
    <Badge className="signal-section-code" size="medium" variant="outline" tone="neutral">{code}</Badge>
    <Box><Text className="signal-eyebrow">{eyebrow}</Text><Text as="h3">{title}</Text><Text as="p">{description}</Text></Box>
    <Badge className="signal-section-meta" size="medium" variant="weak" tone="neutral">{meta}</Badge>
  </Box>;
}

function LiquidityCard({ item, index, maxCount, onSelect }) {
  const band = item.priceBandLow === item.priceBandHigh ? formatPrice(item.priceBandLow) : `${formatPrice(item.priceBandLow)}–${formatPrice(item.priceBandHigh)}`;
  return <Box as="button" className="execution-card" type="button" onClick={() => onSelect?.(item)}>
    <span className="execution-rank">{String(index + 1).padStart(2, "0")}</span>
    <span className="execution-place"><Badge size="medium" variant="weak" tone="informative">{item.district}</Badge><small>{item.dong}</small></span>
    <strong>{item.complex}</strong>
    <small>{formatHousingArea(item)}</small>
    <Badge className="execution-level" size="medium" variant="weak" tone={item.executionLevel === "높음" ? "positive" : "warning"}>체결력 {item.executionLevel}</Badge>
    <span className="execution-bar"><i style={{ width: `${Math.max(10, item.tradeCount90 / Math.max(maxCount, 1) * 100)}%` }} /></span>
    <dl><div><dt>90일 계약</dt><dd>{item.tradeCount90}건 · {item.tradeDays90}일</dd></div><div><dt>계약 간격</dt><dd>{item.medianIntervalDays || "–"}{item.medianIntervalDays ? "일" : ""}</dd></div><div><dt>실제 체결대</dt><dd>{band}</dd></div></dl>
  </Box>;
}

function PermitCard({ item, onSelect }) {
  return <Box as="button" className="permit-signal-card" type="button" onClick={() => onSelect?.(item)}>
    <span className="permit-signal-date">{item.latestPermitDate}</span>
    <Badge className="permit-signal-state" size="medium" variant="weak" tone={item.permitStatus === "허가" ? "positive" : "warning"}>{item.permitStatus || "처리"}</Badge>
    <strong>{item.complex}</strong>
    <small>{item.district} {item.dong} · {item.permitPurpose || "주거용"}</small>
    <div><span><b>{item.permitCount}</b>건<small>연결 허가</small></span><span><b>{item.approvedCount}</b>건<small>허가 처리</small></span><span><b>{formatPrice(item.price)}</b><small>연결 매매</small></span></div>
  </Box>;
}

function RentCard({ item, onSelect }) {
  return <Box as="button" className="rent-defense-card" type="button" onClick={() => onSelect?.(item)}>
    <span className="rent-defense-place"><Badge size="medium" variant="weak" tone="positive">{item.district}</Badge><small>{item.dong}</small></span>
    <strong>{item.complex}</strong>
    <small>{formatHousingArea(item)}</small>
    <div className="rent-defense-ratio"><b>{item.jeonseRatio}%</b><span>전세가율</span></div>
    <dl><div><dt>매매</dt><dd>{formatPrice(item.price)}</dd></div><div><dt>전세</dt><dd>{formatPrice(item.latestJeonse)}</dd></div><div><dt>필요 차액</dt><dd>{formatPrice(item.gapAmount)}</dd></div></dl>
    <span className={`rent-defense-change ${item.depositChange < 0 ? "down" : ""}`}>기간 첫 계약 대비 {signedPrice(item.depositChange)} · {item.rentCount90}건</span>
  </Box>;
}

export default function HomeThemes({ payload, loading, error, onSelect }) {
  if (loading) return <Grid as="section" className="card market-signals market-signals-loading" aria-label="계약 분석 불러오는 중"><Skeleton radius="16" /><Skeleton radius="16" /><Skeleton radius="16" /></Grid>;
  if (error || !payload) return <Box as="section" className="card market-signals market-signals-empty"><Text>CONTRACT SIGNALS</Text><Text as="p">{error || "계약 분석을 준비하고 있습니다."}</Text></Box>;
  const liquidity = payload.themes.liquidity || [];
  const permits = payload.themes.permitImpact || [];
  const rents = payload.themes.rentDefense || [];
  const maxCount = Math.max(...liquidity.map(item => item.tradeCount90), 1);

  return <Box as="section" className="card market-signals" aria-label="서울 아파트 계약 분석">
    <Box as="header" className="market-signals-intro">
      <Box><Text>CONTRACT INTELLIGENCE</Text><Text as="h2">가격보다 먼저, 계약의 힘을 봅니다</Text><Text as="p">같은 면적에서 실제로 반복된 매매와 전세, 서울시 허가 원장을 한 흐름으로 읽었습니다.</Text></Box>
      <Box as="strong"><Text as="strong">{payload.latestDealDate}</Text><Text>최신 계약일</Text></Box>
    </Box>

    <Box as="section" className="signal-section execution-section">
      <SectionHeading code="01" eyebrow="EXECUTION STRENGTH" title="실제로 잘 거래되는 단지" description="동일 단지·동일 전용면적의 90일 계약 수와 계약 간격을 비교합니다." meta={`${liquidity.length}개 단지`} />
      <Grid className="execution-grid">{liquidity.map((item, index) => <LiquidityCard item={item} index={index} maxCount={maxCount} onSelect={onSelect} key={`liquidity-${item.district}-${item.complex}-${item.area}`} />)}</Grid>
      <p className="signal-method">체결력은 가격 예측이 아닙니다. 직거래를 제외하고 최근 90일의 계약 횟수와 서로 다른 계약일 간격을 요약한 관찰 지표입니다.</p>
    </Box>

    <Box as="section" className="signal-section permit-signal-section">
      <SectionHeading code="02" eyebrow="PERMIT LEDGER" title="토지거래허가와 연결된 단지" description="최근 허가 처리 주소를 실제 아파트 거래 주소와 연결했습니다." meta={`${permits.length}개 단지`} />
      <Grid className="permit-signal-grid">{permits.map(item => <PermitCard item={item} onSelect={onSelect} key={`permit-${item.district}-${item.complex}`} />)}</Grid>
      <ActionButton className="signal-inline-link" asChild variant="ghost" size="small"><Link to="/permits">토지거래허가 원장 전체 보기 <span>→</span></Link></ActionButton>
    </Box>

    <Box as="section" className="signal-section rent-defense-section">
      <SectionHeading code="03" eyebrow="SALE × JEONSE" title="매매와 전세의 실제 간격" description="같은 단지·같은 면적의 최근 매매와 전세 계약을 맞춰 비교합니다." meta={`${rents.length}개 단지`} />
      <Grid className="rent-defense-rail">{rents.map(item => <RentCard item={item} onSelect={onSelect} key={`rent-${item.district}-${item.complex}-${item.area}`} />)}</Grid>
      <p className="signal-method">전세가율과 필요 차액은 표시된 최근 계약끼리 계산한 값이며 현재 매물 가격을 뜻하지 않습니다.</p>
    </Box>

    <Grid as="footer" className="market-signals-actions">
      <Link to="/watchlist"><span><b>저장한 단지 변화 확인</b><small>관심 단지의 최근 계약과 주택 조건을 나란히 비교하세요.</small></span><i>→</i></Link>
      <Link to="/search"><span><b>내 조건으로 아파트 찾기</b><small>예산·면적·준공연도·세대수 조건으로 계약 원장을 검색하세요.</small></span><i>→</i></Link>
    </Grid>
  </Box>;
}
