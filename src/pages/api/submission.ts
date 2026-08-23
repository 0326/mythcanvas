import type { APIRoute } from 'astro';
import { getGenerationJob } from '../../lib/cloudflare/generation-repository';
import { getOrCreateUser } from '../../lib/auth/session';
import { createSubmission } from '../../lib/social/submissions';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const sessionResult = await getOrCreateUser(locals.runtime.env.SESSION, request);
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