import type { APIRoute } from 'astro';
import { findOrCreateAccount, migrateGuestData, recordAccountSession } from '../../../lib/auth/accounts';
import { verifyNonce } from '../../../lib/auth/otp';
import { bindSessionToAccount, getOrCreateUser } from '../../../lib/auth/session';

export const prerender = false;

/** POST /api/auth/verify — 验证码登录：body { email, code, nonceId, redirect? } */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const nonceId = typeof body.nonceId === 'string' ? body.nonceId : '';

  if (!email || !code || !nonceId) {
    return json({ error: { code: 'INVALID_INPUT', message: '请输入邮箱和验证码。' } }, 400);
  }

  const result = await verifyNonce(env.SESSION, nonceId, code);
  if (!result.ok) {
    return verifyError(result);
  }

  const login = await runLogin(env, request, result.email);
  return json(
    {
      ok: true,
      user: { id: login.account.id, nickname: login.account.displayName, email: login.account.email, isGuest: false },
      migrated: login.migrated,
      message: migratedMessage(login.migrated),
    },
    200,
    login.cookie,
  );
};

/** GET /api/auth/verify?nonce=...&token=...&redirect=... — Magic Link 落地 */
export const GET: APIRoute = async ({ request, locals, url }) => {
  const env = locals.runtime.env;
  const nonceId = url.searchParams.get('nonce') ?? '';
  const token = url.searchParams.get('token') ?? '';
  const redirectRaw = url.searchParams.get('redirect') ?? '/my/';
  const redirect = redirectRaw.startsWith('/') ? redirectRaw : '/my/';

  if (!nonceId || !token) {
    return htmlError('登录链接无效或已损坏，请重新发起登录。');
  }

  const result = await verifyNonce(env.SESSION, nonceId, token);
  if (!result.ok) {
    return htmlError(verifyFriendly(result.code));
  }

  const login = await runLogin(env, request, result.email);
  return redirectTo(redirect, login.cookie);
};

/** 登录闭环共享逻辑：建/找账号 → 绑 session → 继承游客数据 → 记录多端映射。 */
async function runLogin(
  env: { SESSION?: KVNamespace; DB?: import('@cloudflare/workers-types').D1Database },
  request: Request,
  email: string,
): Promise<{ cookie: string; account: { id: string; email: string; displayName: string }; migrated: { generations: number; favorites: number; downloads: number; submissions: number } }> {
  const kv = env.SESSION;
  const d1 = env.DB;

  // 1. 保证有 session（首次直接登录的用户可能还没访问过页面，没有 cookie）
  const sessionResult = await getOrCreateUser(kv, request);
  const sessionId = sessionResult.sessionId!;
  const oldGuestId = sessionResult.user.isGuest ? sessionResult.user.id : undefined;

  // 2. 建/找账号（必须先有账号，才能把数据迁过去）
  const account = d1 ? await findOrCreateAccount(d1, email) : { id: `acc_${crypto.randomUUID()}`, email, displayName: email.split('@')[0].slice(0, 24) };

  // 3. 继承游客数据（DB 可用时才迁）
  const migrated = d1 ? await migrateGuestData(d1, oldGuestId, account.id) : { generations: 0, favorites: 0, downloads: 0, submissions: 0 };

  // 4. session 绑账号（KV）
  await bindSessionToAccount(kv, sessionId, account);

  // 5. 记录多端映射（DB）
  if (d1) await recordAccountSession(d1, sessionId, account.id);

  return { cookie: sessionResult.cookie ?? '', account, migrated };
}

function verifyFriendly(code: string): string {
  const map: Record<string, string> = {
    NOT_FOUND: '验证码不存在或已过期，请重新获取。',
    EXPIRED: '验证码已过期，请重新获取。',
    CONSUMED: '该验证码已被使用，请重新获取。',
    TOO_MANY_ATTEMPTS: '尝试次数过多，请稍后再试。',
    MISMATCH: '验证码不正确。',
  };
  return map[code] ?? '验证失败，请重试。';
}

function verifyError(result: { ok: false; code: string; remainingAttempts?: number }): Response {
  const error: { code: string; message: string; remainingAttempts?: number } = { code: result.code, message: verifyFriendly(result.code) };
  if (result.remainingAttempts !== undefined) error.remainingAttempts = result.remainingAttempts;
  return json({ error }, 401);
}

function migratedMessage(m: { generations: number; favorites: number }): string {
  if (m.generations === 0 && m.favorites === 0) return '登录成功。';
  return `登录成功，已为你保留 ${m.generations} 件作品与 ${m.favorites} 个收藏。`;
}

function json(body: unknown, status = 200, cookie?: string): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  return response;
}

function redirectTo(path: string, cookie?: string): Response {
  const headers: Record<string, string> = { location: path, 'cache-control': 'no-store' };
  if (cookie) headers['set-cookie'] = cookie;
  return new Response(null, { status: 302, headers });
}

function htmlError(message: string): Response {
  const html = `<!doctype html><html lang="zh-CN"><body style="margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#0b1320;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
    <div style="text-align:center;padding:24px">
      <p style="color:#e8ecf3;font-size:16px;margin:0 0 16px">${escapeHtml(message)}</p>
      <a href="/login/" style="color:#e6c07b;text-decoration:none">返回登录</a>
    </div></body></html>`;
  return new Response(html, { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
