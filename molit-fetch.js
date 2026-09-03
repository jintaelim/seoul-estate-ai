const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchMolit(url, options = {}, { attempts = 5, baseDelayMs = 700 } = {}) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok || !RETRYABLE_STATUS.has(response.status)) return response;

      const retryAfter = Number(response.headers.get("retry-after"));
      const backoff = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : baseDelayMs * (2 ** attempt) + Math.floor(Math.random() * 250);
      lastError = new Error(`API ${response.status}`);
      if (attempt < attempts - 1) await wait(backoff);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await wait(baseDelayMs * (2 ** attempt));
    }
  }

  throw lastError ?? new Error("국토교통부 API 요청 실패");
}

export async function runInBatches(tasks, size = 3, intervalMs = 250) {
  const results = [];
  for (let index = 0; index < tasks.length; index += size) {
    const chunk = await Promise.all(tasks.slice(index, index + size).map((task) => task()));
    results.push(...chunk);
    if (index + size < tasks.length) await wait(intervalMs);
  }
  return results;
}
