import type { APIRoute } from 'astro';
import { getOrCreateUser, readSessionId } from '../../lib/auth/session';
import { checkRateLimit, clientIp } from '../../lib/security/rate-limit';

export const prerender = false;

const EVENTS_LIMIT = 120; // 每小时最多 120 条埋点，防止灌表
const EXTRA_MAX_LENGTH = 1000; // extra JSON 序列化后最大长度，超限丢弃

/**
 * POST /api/events — 产品埋点
 * body: { name, targetId?, page?, extra? }
 * V1 轻量实现：写入 D1 analytics_events。可后续扩展为批量/采样。
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const kv = locals.runtime.env.SESSION;

  // 限流：有 session 按 session，无 session 按 IP
  const sessionId = readSessionId(request);
  const rateLimit = await checkRateLimit(
    kv,
    sessionId ? `s:${sessionId}` : `ip:${clientIp(request)}`,
    EVENTS_LIMIT,
    3600,
    'rl:events',
  );
  if (!rateLimit.allowed) return json({ ok: false }, 429);

  const sessionResult = await getOrCreateUser(kv, request);

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 60) : '';

  if (!name) return json({ ok: false }, 400, sessionResult.cookie);

  const targetId = typeof body.targetId === 'string' ? body.targetId.slice(0, 120) : undefined;
  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : undefined;
  let extraJson: string | null = null;
  if (body.extra && typeof body.extra === 'object') {
    const serialized = JSON.stringify(body.extra);
    if (serialized.length <= EXTRA_MAX_LENGTH) extraJson = serialized;
  }

  const db = locals.runtime.env.DB;
  if (db) {
    await db
      .prepare('INSERT INTO analytics_events (id, event_name, target_id, user_id, page, extra_json) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(crypto.randomUUID(), name, targetId ?? null, sessionResult.user.id, page ?? null, extraJson)
      .run()
      .catch(() => undefined);

    // 角色热度与角色入口点击保持一致；D1 的自增更新是原子的。
    if (name === 'character_click' && targetId) {
      await db
        .prepare("UPDATE characters SET click_count = click_count + 1 WHERE id = ? AND publish_status = 'published'")
        .bind(targetId)
        .run()
        .catch(() => undefined);
    }
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
