import type { APIRoute } from 'astro';
import { revokeAccountSession } from '../../lib/auth/accounts';
import { clearSession, clearSessionCookie, getUserBySessionId, readSessionId } from '../../lib/auth/session';

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

/** DELETE /api/user — 登出并撤销当前设备的会话。 */
export const DELETE: APIRoute = async ({ request, locals }) => {
  const sessionId = readSessionId(request);
  if (!sessionId) {
    return json({ ok: true, message: '当前无会话。' }, 200, clearSessionCookie(new URL(request.url).protocol === 'https:'));
  }
  const user = await getUserBySessionId(locals.runtime.env.SESSION, sessionId);
  if (user?.accountId && locals.runtime.env.DB) await revokeAccountSession(locals.runtime.env.DB, sessionId);
  await clearSession(locals.runtime.env.SESSION, sessionId);
  return json({ ok: true, message: '已退出当前账号。' }, 200, clearSessionCookie(new URL(request.url).protocol === 'https:'));
};

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}
