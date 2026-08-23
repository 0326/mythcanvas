import type { APIRoute } from 'astro';
import { getOrCreateUser } from '../../../lib/auth/session';
import { listGenerationsByUser } from '../../../lib/cloudflare/generation-repository';

export const prerender = false;

/** GET /api/my/generations — 当前用户的绘神历史（按 session 识别） */
export const GET: APIRoute = async ({ request, locals }) => {
  const sessionResult = await getOrCreateUser(locals.runtime.env.SESSION, request);
  const jobs = await listGenerationsByUser(locals.runtime.env.DB, sessionResult.user.id);

  const items = jobs.map((job) => ({
    id: job.id,
    status: job.status,
    entityType: job.entityType,
    entityId: job.entityId,
    scene: job.scene,
    styleId: job.styleId,
    ratio: job.ratio,
    imageUrl: job.assetKey ? `/media/${job.assetKey}` : undefined,
    errorCode: job.errorCode,
    createdAt: job.createdAt,
    isPublic: job.isPublic,
  }));

  return json({ items, total: items.length }, 200, sessionResult.cookie);
};

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}