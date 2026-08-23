import type { APIRoute } from 'astro';
import {
  getOrCreateUser,
  getUserBySessionId,
  loginWithNickname,
  readSessionId,
  resetSessionToGuest,
} from '../../lib/auth/session';

export const prerender = false;

/** GET /api/user — 返回当前会话用户（匿名/登录昵称）。
 *  注意：此处只读不创建 session，避免在每个页面加载 Header 时都生成幽灵会话。 */
export const GET: APIRoute = async ({ request, locals }) => {
  const sessionId = readSessionId(request);
  if (!sessionId) {
    return json({ user: null });
  }
  const user = await getUserBySessionId(locals.runtime.env.SESSION, sessionId);
  return json({
    user: user
      ? { id: user.id, nickname: user.nickname, isGuest: user.isGuest, email: user.email, displayName: user.displayName }
      : null,
  });
};

/** POST /api/user — 设置昵称（轻量登录）；body: { nickname }。
 *  即使当前没有 session 也会先自动创建一个，保证「设置昵称」在任何情况下都可用，
 *  并通过 Set-Cookie 把新 session 写回客户端。 */
export const POST: APIRoute = async ({ request, locals }) => {
  const sessionResult = await getOrCreateUser(locals.runtime.env.SESSION, request);
  const sessionId = sessionResult.sessionId;
  if (!sessionId) {
    return json({ error: { code: 'NO_SESSION', message: '会话初始化失败，请刷新页面后重试。' } }, 500, sessionResult.cookie);
  }

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const nickname = typeof body.nickname === 'string' ? body.nickname.trim().slice(0, 24) : '';
  if (!nickname) {
    return json({ error: { code: 'INVALID_NICKNAME', message: '请填写昵称。' } }, 400, sessionResult.cookie);
  }

  const user = await loginWithNickname(locals.runtime.env.SESSION, sessionId, nickname);
  if (!user) {
    return json({ error: { code: 'NO_SESSION', message: '会话已失效，请刷新页面后重试。' } }, 401, sessionResult.cookie);
  }
  return json({ user: { id: user.id, nickname: user.nickname, isGuest: user.isGuest }, message: '已登录。' }, 200, sessionResult.cookie);
};

/** DELETE /api/user — 登出：把当前 session 重置为匿名游客（保留同一 sessionId / cookie）。
 *  这样 Header / 我的页面立刻回到游客态，且不会触发新一轮 session 创建。 */
export const DELETE: APIRoute = async ({ request, locals }) => {
  const sessionId = readSessionId(request);
  if (!sessionId) {
    return json({ ok: true, message: '当前无会话，已为游客态。' });
  }
  const user = await resetSessionToGuest(locals.runtime.env.SESSION, sessionId);
  return json({ ok: true, user: { id: user.id, nickname: user.nickname, isGuest: user.isGuest }, message: '已登出。' });
};

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}
