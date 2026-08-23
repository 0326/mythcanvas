import type { APIRoute } from 'astro';
import { getOrCreateUser, readSessionId } from '../../lib/auth/session';
import { addFavorite, isFavorited, listFavorites, removeFavorite } from '../../lib/social/favorites';

export const prerender = false;

const TARGET_TYPES = new Set(['artwork', 'character', 'realm', 'style', 'generation']);

export const POST: APIRoute = async ({ request, locals }) => {
  const sessionResult = await getOrCreateUser(locals.runtime.env.SESSION, request);
  const user = sessionResult.user;

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const targetType = typeof body.targetType === 'string' ? body.targetType : '';
  const targetId = typeof body.targetId === 'string' ? body.targetId : '';

  if (!TARGET_TYPES.has(targetType) || !targetId) {
    return json({ error: 'INVALID_TARGET', message: '收藏参数不正确。' }, 400, sessionResult.cookie);
  }

  const action = body.action === 'remove' ? 'remove' : 'add';
  const already = await isFavorited(locals.runtime.env.DB, user.id, targetType as never, targetId);

  if (action === 'remove') {
    await removeFavorite(locals.runtime.env.DB, user.id, targetType as never, targetId);
    return json({ favorited: false, message: '已取消收藏。' }, 200, sessionResult.cookie);
  }

  if (!already) {
    await addFavorite(locals.runtime.env.DB, user.id, targetType as never, targetId);
    return json({ favorited: true, message: '已收藏。' }, 200, sessionResult.cookie);
  }
  return json({ favorited: true, message: '已在收藏中。' }, 200, sessionResult.cookie);
};

export const GET: APIRoute = async ({ locals, request, url }) => {
  const sessionResult = await getOrCreateUser(locals.runtime.env.SESSION, request);
  const targetType = url.searchParams.get('type');
  const type = targetType && TARGET_TYPES.has(targetType) ? targetType : undefined;
  return json({ ids: await listIds(locals.runtime.env.DB, sessionResult.user.id, type) }, 200, sessionResult.cookie);
};

async function listIds(db: D1Database | undefined, userId: string, targetType?: string): Promise<string[]> {
  if (!db) return [];
  const favorites = await listFavorites(db, userId, targetType as never);
  return favorites.map((favorite) => favorite.targetId);
}

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}
