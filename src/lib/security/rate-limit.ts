/**
 * 基于 KV 的滑动窗口 Rate Limit。
 *
 * V1 策略：匿名用户按 IP + session 组合限流，防止刷接口与 Provider 成本滥用。
 * KV key: `rl:{prefix}:{identifier}`，值 = JSON 数组窗口时间戳。
 */

const DEFAULT_WINDOW_SECONDS = 3600; // 1 小时

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds?: number;
};

export async function checkRateLimit(
  kv: KVNamespace | undefined,
  identifier: string,
  limit: number,
  windowSeconds: number = DEFAULT_WINDOW_SECONDS,
  prefix = 'rl',
): Promise<RateLimitResult> {
  // 无 KV（本地降级）时放行，避免阻断开发
  if (!kv) return { allowed: true, remaining: limit, limit };

  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  const raw = await kv.get(key);
  let timestamps: number[] = [];
  if (raw) {
    try {
      timestamps = JSON.parse(raw) as number[];
    } catch {
      timestamps = [];
    }
  }
  timestamps = timestamps.filter((ts) => ts > windowStart);

  if (timestamps.length >= limit) {
    const oldest = Math.min(...timestamps);
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowSeconds * 1000 - now) / 1000));
    await kv.put(key, JSON.stringify(timestamps), { expirationTtl: windowSeconds * 2 });
    return { allowed: false, remaining: 0, limit, retryAfterSeconds };
  }

  timestamps.push(now);
  await kv.put(key, JSON.stringify(timestamps), { expirationTtl: windowSeconds * 2 });
  return { allowed: true, remaining: limit - timestamps.length, limit };
}

/** 提取请求的限流标识：优先 session，其次 IP */
export function rateLimitIdentifier(request: Request, sessionId?: string | null): string {
  if (sessionId) return `s:${sessionId}`;
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  return `ip:${ip}`;
}
