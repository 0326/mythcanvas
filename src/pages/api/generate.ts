import type { APIRoute } from 'astro';
import { getOrCreateUser, readSessionId } from '../../lib/auth/session';
import { generateArtwork } from '../../lib/generation/service';
import { GenerationValidationError, parseGenerationRequest } from '../../lib/generation/validation';
import { checkRateLimit, rateLimitIdentifier } from '../../lib/security/rate-limit';

export const prerender = false;

const ANONYMOUS_LIMIT = 10; // 匿名每小时 10 次

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Session：匿名用户自动获得身份
    const sessionResult = await getOrCreateUser(locals.runtime.env.SESSION, request);
    const sessionId = readSessionId(request);

    // 2. Rate limit：防止刷接口
    const rateLimit = await checkRateLimit(
      locals.runtime.env.SESSION,
      rateLimitIdentifier(request, sessionId ?? sessionResult.user.id),
      ANONYMOUS_LIMIT,
      3600,
      'rl:generate',
    );
    if (!rateLimit.allowed) {
      return json({
        status: 'failed',
        error: {
          code: 'RATE_LIMITED',
          message: `绘神次数已达上限（每小时 ${ANONYMOUS_LIMIT} 次），请稍后再试。`,
        },
      }, 429, sessionResult.cookie);
    }

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

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}
