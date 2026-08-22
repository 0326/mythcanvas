import type { APIRoute } from 'astro';
import { getGenerationJob } from '../../../lib/cloudflare/generation-repository';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  if (!id) return json({ error: { code: 'MISSING_ID', message: '缺少生成任务 ID。' } }, 400);

  const job = await getGenerationJob(locals.runtime.env.DB, id);
  if (!job) {
    return json({ error: { code: 'NOT_FOUND', message: '未找到生成任务，或当前环境尚未启用 D1。' } }, 404);
  }

  return json({
    id: job.id,
    status: job.status,
    provider: job.provider,
    imageUrl: job.assetKey ? `/media/${job.assetKey}` : undefined,
    error: job.errorCode ? { code: job.errorCode, message: job.errorMessage } : undefined,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
