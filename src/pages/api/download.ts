import type { APIRoute } from 'astro';
import { getOrCreateUser } from '../../lib/auth/session';

export const prerender = false;

/**
 * POST /api/download — 记录一次壁纸下载
 * body: { artworkId: string, variant: 'original'|'hd'|'2k'|'4k' }
 * 返回下载地址（原图）；派生规格基于素材，具体 content negotiation 由客户端决定。
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const sessionResult = await getOrCreateUser(locals.runtime.env.SESSION, request);

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const artworkId = typeof body.artworkId === 'string' ? body.artworkId : '';
  const variant = typeof body.variant === 'string' ? body.variant : 'original';
  const allowedVariants = new Set(['original', 'hd', '2k', '4k']);

  if (!artworkId) return json({ error: { code: 'MISSING_ARTWORK', message: '缺少作品 ID。' } }, 400, sessionResult.cookie);
  if (!allowedVariants.has(variant)) return json({ error: { code: 'INVALID_VARIANT', message: '下载规格无效。' } }, 400, sessionResult.cookie);

  const db = locals.runtime.env.DB;
  const artwork = db ? await db
    .prepare('SELECT id, asset_key FROM artworks WHERE id = ?')
    .bind(artworkId)
    .first<Record<string, unknown>>() : undefined;

  if (!artwork) return json({ error: { code: 'NOT_FOUND', message: '未找到该作品。' } }, 404, sessionResult.cookie);

  if (db) {
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

  const assetKey = String(artwork.asset_key);
  // asset_key 可能存完整 delivery 路径（/media/...）或纯 key；统一输出可访问 URL
  const url = assetKey.startsWith('/media/') || assetKey.startsWith('media/')
    ? (assetKey.startsWith('media/') ? `/${assetKey}` : assetKey)
    : `/media/${assetKey}`;

  return json({
    ok: true,
    url,
    variant,
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