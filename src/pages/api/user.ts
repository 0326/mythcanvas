import type { APIRoute } from 'astro';
import {
  clearSessionCookie,
  getUserBySessionId,
  loginWithNickname,
  readSessionId,
} from '../../lib/auth/session';

export const prerender = false;

/** GET /api/user — 返回当前会话用户（匿名/登录昵称） */
export const GET: APIRoute = async ({ request, locals }) => {
  const sessionId = readSessionId(request);
  if (!sessionId) {
    return json({ user: null });
  }
  const user = await getUserBySessionId(locals.runtime.env.SESSION, sessionId);
  return json({ user: user ? { id: user.id, nickname: user.nickname, isGuest: user.isGuest } : null });
};

/** POST /api/user — 设置昵称（轻量登录）；body: { nickname } */
export const POST: APIRoute = async ({ request, locals }) => {
  const sessionId = readSessionId(request);
  if (!sessionId) {
    return json({ error: { code: 'NO_SESSION', message: '无法识别当前会话，请刷新页面后重试。' } }, 401);
  }
  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const nickname = typeof body.nickname === 'string' ? body.nickname.trim().slice(0, 24) : '';
  if (!nickname) {
    return json({ error: { code: 'INVALID_NICKNAME', message: '请填写昵称。' } }, 400);
  }
  const user = await loginWithNickname(locals.runtime.env.SESSION, sessionId, nickname);
  if (!user) {
    return json({ error: { code: 'NO_SESSION', message: '会话已失效，请刷新页面后重试。' } }, 401);
  }
  return json({ user: { id: user.id, nickname: user.nickname, isGuest: user.isGuest }, message: '已登录。' });
};

/** DELETE /api/user — 登出（清除 session） */
export const DELETE: APIRoute = async () => {
  const response = json({ ok: true, message: '已登出。' });
  response.headers.set('set-cookie', clearSessionCookie());
  return response;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}