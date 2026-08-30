import type { APIRoute } from 'astro';
import { getOrCreateUser, readSessionId } from '../../lib/auth/session';
import { getArtworkById } from '../../lib/content/repositories';
import { checkRateLimit, clientIp } from '../../lib/security/rate-limit';

export const prerender = false;

const DOWNLOAD_LIMIT = 60; // 每小时最多 60 次下载记录，防止刷计数/灌表

/**
 * POST /api/download — 记录一次壁纸下载
 * body: { artworkId: string, variant: 'original'|'hd'|'2k'|'4k' }
 * 返回下载地址。当前真正可下载的资产仍是原图，派生规格上线前不计入下载次数。
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const kv = locals.runtime.env.SESSION;

  // 限流：有 session 按 session，无 session 按 IP
  const sessionId = readSessionId(request);
  const rateLimit = await checkRateLimit(
    kv,
    sessionId ? `s:${sessionId}` : `ip:${clientIp(request)}`,
    DOWNLOAD_LIMIT,
    3600,
    'rl:download',
  );
  if (!rateLimit.allowed) {
    return json({
      error: { code: 'RATE_LIMITED', message: '下载请求过于频繁，请稍后再试。' },
    }, 429);
  }

  const sessionResult = await getOrCreateUser(kv, request);

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const artworkId = typeof body.artworkId === 'string' ? body.artworkId : '';
  const variant = typeof body.variant === 'string' ? body.variant : 'original';
  const allowedVariants = new Set(['original', 'hd', '2k', '4k']);

  if (!artworkId) return json({ error: { code: 'MISSING_ARTWORK', message: '缺少作品 ID。' } }, 400, sessionResult.cookie);
  if (!allowedVariants.has(variant)) return json({ error: { code: 'INVALID_VARIANT', message: '下载规格无效。' } }, 400, sessionResult.cookie);

  const db = locals.runtime.env.DB;
  // 只允许已发布且审核通过的作品（防止枚举未发布作品、刷草稿计数）
  const artwork = await getArtworkById(db, artworkId);

  if (!artwork) return json({ error: { code: 'NOT_FOUND', message: '未找到该作品。' } }, 404, sessionResult.cookie);

  // 当前只有 original 对应真实下载资产。HD/2K/4K 仍是规格选择占位，不应污染下载热度。
  if (db && variant === 'original') {
    await db
      .prepare('INSERT INTO download_events (id, artwork_id, user_id, variant) VALUES (?, ?, ?, ?)')
      .bind(crypto.randomUUID(), artworkId, sessionResult.user.id, variant)
      .run()
      .catch(() => undefined);
    await db
      .prepare('UPDATE artworks SET download_count = download_count + 1 WHERE id = ?')
      .bind(artworkId)
      .run()
      .catch(() => undefined);
  }

  const src = artwork.image.src;
  // image.src 已由 assetUrl 归一化（/media/... 或 data:）；兜底处理纯 key
  const url = src.startsWith('data:') || src.startsWith('/media/')
    ? src
    : src.startsWith('media/') ? `/${src}` : `/media/${src}`;

  return json({
    ok: true,
    url,
    variant,
    counted: variant === 'original',
  }, 200, sessionResult.cookie);
};

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}