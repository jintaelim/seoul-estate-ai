export function storageError(error) {
  const code = error.cause?.code || error.code;
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") return "DB_DNS_ERROR: 외부 DB 주소를 찾을 수 없습니다. SUPABASE_URL과 프로젝트 실행 상태를 확인하세요.";
  if (error.name === "TimeoutError") return "DB_TIMEOUT: 외부 DB 연결 시간이 초과되었습니다.";
  return error.message || "외부 DB 요청에 실패했습니다.";
}

export function rentError(status, parsed) {
  const auth = parsed?.OpenAPI_ServiceResponse?.cmmMsgHeader;
  const code = String(auth?.returnReasonCode ?? "");
  if (code === "30") return "전월세 서비스에 등록되지 않은 인증키입니다 (403 / 코드 30). 공공데이터포털의 아파트 전월세 자료 활용 승인과 해당 인증키를 확인하세요.";
  return `전월세 API ${status}${code ? ` / 코드 ${code}` : ""}`;
}
