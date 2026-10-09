import { Link } from "react-router-dom";
import { ActionButton, Badge, Box, Grid, Text } from "@seed-design/react";
import { formatHousingArea, formatPrice, isRecord, latestDate } from "../utils";

export default function HomeSnapshot({ transactions = [], onSelect }) {
  const latest = latestDate(transactions);
  const rows = transactions.filter(item => item.dealDate === latest).sort((a, b) => b.price - a.price).slice(0, 5);
  const today = transactions.filter(item => item.dealDate === latest);
  const recordCount = today.filter(isRecord).length;
  const directCount = today.filter(item => item.dealingGbn === "직거래").length;
  const districtCount = new Set(today.map(item => item.district)).size;
  return <Box as="section" className="card home-snapshot contract-tape">
    <Box as="header"><Box><Text as="span">LATEST CONTRACT TAPE</Text><Text as="h2">가장 최근 확인된 서울 계약</Text><Text as="p">신고일이 아닌 실제 계약일을 기준으로 원장을 읽습니다.</Text></Box><Box className="snapshot-date"><Text as="strong">{latest || "확인 중"}</Text><Text as="span">국토교통부 계약일</Text></Box></Box>
    <Grid className="contract-tape-stats"><Box as="span"><Text className="contract-stat-label">확인 계약</Text><Text as="strong">{today.length.toLocaleString("ko-KR")}<i>건</i></Text></Box><Box as="span"><Text className="contract-stat-label">거래 자치구</Text><Text as="strong">{districtCount}<i>곳</i></Text></Box><Box as="span"><Text className="contract-stat-label">최고가 경신</Text><Text as="strong">{recordCount}<i>건</i></Text></Box><Box as="span"><Text className="contract-stat-label">직거래</Text><Text as="strong">{directCount}<i>건</i></Text></Box></Grid>
    <Box className="contract-tape-ledger"><Grid className="contract-tape-head"><Text>단지</Text><Text>면적·층</Text><Text>계약 금액</Text></Grid>{rows.map(item => <Box as="button" type="button" key={item.id} onClick={() => onSelect?.(item)}><Box as="span"><Text as="strong">{item.complex}</Text><Text className="contract-tape-meta">{item.district} {item.dong}</Text></Box><Box as="span"><Text as="strong">{formatHousingArea(item)}</Text><Text className="contract-tape-meta">{item.floor}층</Text></Box><Box as="span"><Text as="strong">{formatPrice(item.price)}</Text><Badge className="contract-method-badge" size="medium" variant="weak" tone={item.dealingGbn === "직거래" ? "warning" : "neutral"}>{item.dealingGbn || "방식 미기재"}</Badge></Box></Box>)}</Box>
    <ActionButton className="snapshot-link" asChild variant="ghost" size="small"><Link to="/transactions">계약일별 원장 전체 보기 <span>→</span></Link></ActionButton>
  </Box>;
}
