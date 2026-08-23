import type { APIRoute } from 'astro';
import { getGenerationJob } from '../../lib/cloudflare/generation-repository';
import { getOrCreateUser, readSessionId } from '../../lib/auth/session';
import { createSubmission, getPendingSubmissionByGeneration } from '../../lib/social/submissions';
import { checkRateLimit, clientIp } from '../../lib/security/rate-limit';

export const prerender = false;

const SUBMISSION_LIMIT = 5; // 每小时最多 5 次申请，防止刷审核队列

export const POST: APIRoute = async ({ request, locals }) => {
  const kv = locals.runtime.env.SESSION;

  // 限流：有 session 按 session，无 session 按 IP
  const sessionId = readSessionId(request);
  const rateLimit = await checkRateLimit(
    kv,
    sessionId ? `s:${sessionId}` : `ip:${clientIp(request)}`,
    SUBMISSION_LIMIT,
    3600,
    'rl:submission',
  );
  if (!rateLimit.allowed) {
    return json({
      error: {
        code: 'RATE_LIMITED',
        message: `申请公开次数已达上限（每小时 ${SUBMISSION_LIMIT} 次），请稍后再试。`,
      },
    }, 429);
  }

  const sessionResult = await getOrCreateUser(kv, request);
  const user = sessionResult.user;

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const generationId = typeof body.generationId === 'string' ? body.generationId : '';
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 80) : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 40) : '';

  if (!generationId) return json({ error: { code: 'MISSING_GENERATION', message: '缺少生成作品 ID。' } }, 400, sessionResult.cookie);
  if (!title) return json({ error: { code: 'MISSING_TITLE', message: '请填写作品标题。' } }, 400, sessionResult.cookie);

  const job = await getGenerationJob(locals.runtime.env.DB, generationId);
  if (!job || job.status !== 'succeeded') {
    return json({ error: { code: 'GENERATION_NOT_READY', message: '生成作品尚未完成，无法申请公开。' } }, 400, sessionResult.cookie);
  }

  // 归属校验：只能为自己的生成作品申请公开
  if (job.userId !== user.id) {
    return json({ error: { code: 'NOT_OWNER', message: '只能为自己的绘神作品申请公开。' } }, 403, sessionResult.cookie);
  }

  // 防重复：同一作品已有待审核提交时拒绝
  const existing = await getPendingSubmissionByGeneration(locals.runtime.env.DB, generationId);
  if (existing) {
    return json({ error: { code: 'ALREADY_PENDING', message: '该作品已在审核中，请耐心等待。' } }, 400, sessionResult.cookie);
  }

  await createSubmission(locals.runtime.env.DB, {
    id: crypto.randomUUID(),
    generationId,
    userId: user.id,
    name: name || (job.entityType === 'character' ? '角色绘神' : '神域绘神'),
    title,
    altText: `${title} — MythCanvas 绘神作品`,
  });

  return json({ ok: true, message: '已提交审核，审核通过后会出现在探索页。' }, 200, sessionResult.cookie);
};

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}