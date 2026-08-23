import type { APIRoute } from 'astro';
import { getOrCreateUser } from '../../lib/auth/session';

export const prerender = false;

/**
 * POST /api/events — 产品埋点
 * body: { name, targetId?, page?, extra? }
 * V1 轻量实现：写入 D1 analytics_events。可后续扩展为批量/采样。
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const sessionResult = await getOrCreateUser(locals.runtime.env.SESSION, request);

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 60) : '';

  if (!name) return json({ ok: false }, 400, sessionResult.cookie);

  const targetId = typeof body.targetId === 'string' ? body.targetId.slice(0, 120) : undefined;
  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : undefined;
  const extra = body.extra && typeof body.extra === 'object' ? body.extra : undefined;

  const db = locals.runtime.env.DB;
  if (db) {
    await db
      .prepare('INSERT INTO analytics_events (id, event_name, target_id, user_id, page, extra_json) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(crypto.randomUUID(), name, targetId ?? null, sessionResult.user.id, page ?? null, extra ? JSON.stringify(extra) : null)
      .run()
      .catch(() => undefined);
  }

  return json({ ok: true }, 200, sessionResult.cookie);
};

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}