import type { APIRoute } from 'astro';
import { getOrCreateUser, readSessionId } from '../../lib/auth/session';
import { generateArtwork } from '../../lib/generation/service';
import { GenerationValidationError, parseGenerationRequest } from '../../lib/generation/validation';
import { checkRateLimit, clientIp } from '../../lib/security/rate-limit';

export const prerender = false;

const ANONYMOUS_LIMIT = 10; // 单个会话每小时 10 次
const IP_LIMIT = 60; // 单个 IP 每小时 60 次（防止轮换会话刷接口）

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const kv = locals.runtime.env.SESSION;

    // 1. Rate limit（先于 session 创建，避免无 cookie 请求刷 KV session）：
    //    - 有 session cookie → 按 session 限流
    //    - 无 cookie → 按 IP 限流（否则每次请求新 user id，限流失效）
    const sessionId = readSessionId(request);
    const ip = clientIp(request);
    const sessionLimit = await checkRateLimit(
      kv,
      sessionId ? `s:${sessionId}` : `ip:${ip}`,
      ANONYMOUS_LIMIT,
      3600,
      'rl:generate',
    );
    if (!sessionLimit.allowed) {
      return json({
        status: 'failed',
        error: {
          code: 'RATE_LIMITED',
          message: `绘神次数已达上限（每小时 ${ANONYMOUS_LIMIT} 次），请稍后再试。`,
        },
      }, 429, undefined, sessionLimit.retryAfterSeconds);
    }
    // IP 级兜底：同一 IP 即使不断更换 session 也有总量上限
    const ipLimit = await checkRateLimit(kv, ip, IP_LIMIT, 3600, 'rl:generate-ip');
    if (!ipLimit.allowed) {
      return json({
        status: 'failed',
        error: {
          code: 'RATE_LIMITED',
          message: '当前网络的绘神次数已达上限，请稍后再试。',
        },
      }, 429, undefined, ipLimit.retryAfterSeconds);
    }

    // 2. Session：匿名用户自动获得身份
    const sessionResult = await getOrCreateUser(kv, request);

    // 3. 解析并生成
    const payload = await request.json().catch(() => null);
    const generationRequest = parseGenerationRequest(payload);
    const result = await generateArtwork(generationRequest, locals.runtime.env, sessionResult.user.id);

    return json(result, result.status === 'failed' ? 502 : 200, sessionResult.cookie);
  } catch (error) {
    if (error instanceof GenerationValidationError) {
      return json({
        status: 'failed',
        error: { code: error.code, message: error.message },
      }, error.status);
    }

    console.error('Unexpected generation API error', error);
    return json({
      status: 'failed',
      error: { code: 'INTERNAL_ERROR', message: '生成服务暂时不可用，请稍后再试。' },
    }, 500);
  }
};

function json(body: unknown, status = 200, cookie?: string, retryAfterSeconds?: number): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  if (retryAfterSeconds) response.headers.set('retry-after', String(retryAfterSeconds));
  return response;
}
