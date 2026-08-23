import type { APIRoute } from 'astro';
import { findAccountByEmail } from '../../../lib/auth/accounts';
import { completeAccountLogin, migratedMessage } from '../../../lib/auth/flow';
import { isValidEmail, storeOtp, verifyNonce } from '../../../lib/auth/otp';
import { validatePassword, verifyPassword } from '../../../lib/auth/password';
import { safeRedirect } from '../../../lib/auth/redirect';
import { sendOtpMail } from '../../../lib/email/send';
import { checkRateLimit, clientIp } from '../../../lib/security/rate-limit';

export const prerender = false;

const OTP_LIMIT = 5;
const IP_LIMIT = 10;
const RESEND_COOLDOWN_SECONDS = 60;

/** POST /api/auth/login — action=password|request|complete */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const action = body?.action === 'request' || body?.action === 'complete' ? body.action : 'password';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (action !== 'password') return handleOtpLogin({ action, body, email, request, env });

  const password = typeof body?.password === 'string' ? body.password : '';
  if (!isValidEmail(email) || !password) return json({ error: { code: 'INVALID_INPUT', message: '请输入有效的邮箱和密码。' } }, 400);
  if (validatePassword(password)) return json({ error: { code: 'INVALID_PASSWORD', message: '密码至少需要 8 位。' } }, 400);
  if (!env.DB) return json({ error: { code: 'AUTH_UNAVAILABLE', message: '账号服务暂时不可用，请稍后重试。' } }, 503);

  const emailLimit = await checkRateLimit(env.SESSION, email, 10, 900, 'rl:auth-password');
  if (!emailLimit.allowed) return json({ error: { code: 'RATE_LIMITED', message: '登录尝试过于频繁，请稍后再试。' } }, 429, undefined, emailLimit.retryAfterSeconds);
  const ipLimit = await checkRateLimit(env.SESSION, clientIp(request), 30, 900, 'rl:auth-password-ip');
  if (!ipLimit.allowed) return json({ error: { code: 'RATE_LIMITED', message: '当前网络登录尝试过于频繁，请稍后再试。' } }, 429, undefined, ipLimit.retryAfterSeconds);

  const account = await findAccountByEmail(env.DB, email);
  const valid = account?.passwordHash ? await verifyPassword(password, account.passwordHash) : false;
  if (!account || !valid) {
    return json({ error: { code: 'INVALID_CREDENTIALS', message: '邮箱或密码不正确。' } }, 401);
  }

  return completeLoginResponse(env, request, account, body);
};

async function handleOtpLogin({
  action,
  body,
  email,
  request,
  env,
}: {
  action: 'request' | 'complete';
  body: Record<string, unknown> | null;
  email: string;
  request: Request;
  env: Cloudflare.Env;
}): Promise<Response> {
  if (!isValidEmail(email)) return json({ error: { code: 'INVALID_EMAIL', message: '请输入有效的邮箱地址。' } }, 400);
  if (!env.DB) return json({ error: { code: 'AUTH_UNAVAILABLE', message: '账号服务暂时不可用，请稍后重试。' } }, 503);

  if (action === 'request') {
    const cooldown = await checkCooldown(env.SESSION, email);
    if (cooldown > 0) {
      return json({ error: { code: 'RESEND_COOLDOWN', message: `验证码已发送，请 ${cooldown} 秒后再试。`, retryAfterSeconds: cooldown } }, 429, undefined, cooldown);
    }

    const limited = await enforceOtpRateLimit(env.SESSION, request, email);
    if (limited) return limited;

    const account = await findAccountByEmail(env.DB, email);
    // 不暴露邮箱是否注册，避免账号枚举；未注册邮箱不会生成可用 nonce。
    if (!account) {
      await setCooldown(env.SESSION, email);
      return json({ ok: true, message: '如果该邮箱已注册，验证码会发送到你的邮箱，请查收。', expiresInSeconds: 600, resendAfterSeconds: RESEND_COOLDOWN_SECONDS });
    }

    const issued = await storeOtp(env.SESSION, email, 'login');
    const sendResult = await sendOtpMail(env, email, issued.code, 10);
    if (!sendResult.ok && env.AUTH_DEV_FALLBACK !== 'true') {
      return json({ error: { code: 'MAIL_SEND_FAILED', message: '邮件发送失败，请稍后重试。' } }, 502);
    }
    await setCooldown(env.SESSION, email);
    return json({
      ok: true,
      nonceId: issued.nonceId,
      expiresInSeconds: 600,
      resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
      message: '验证码已发送，请查收邮件（10 分钟内有效）。',
      ...(sendResult.ok || !sendResult.devFallback ? {} : { devFallback: sendResult.devFallback }),
    });
  }

  const nonceId = typeof body?.nonceId === 'string' ? body.nonceId : '';
  const code = typeof body?.code === 'string' ? body.code.trim() : '';
  if (!nonceId || !code) return json({ error: { code: 'INVALID_CODE', message: '请输入邮箱验证码。' } }, 400);

  const verification = await verifyNonce(env.SESSION, nonceId, code, 'login');
  if (!verification.ok || verification.channel !== 'otp' || verification.email !== email) {
    return json({ error: { code: 'INVALID_CODE', message: '验证码不正确或已过期，请重新获取。' } }, 401);
  }

  const account = await findAccountByEmail(env.DB, email);
  if (!account) return json({ error: { code: 'INVALID_CODE', message: '验证码不正确或已过期，请重新获取。' } }, 401);
  return completeLoginResponse(env, request, account, body);
}

async function completeLoginResponse(env: Cloudflare.Env, request: Request, account: NonNullable<Awaited<ReturnType<typeof findAccountByEmail>>>, body: Record<string, unknown> | null): Promise<Response> {
  const login = await completeAccountLogin(env, request, account);
  return json({
    ok: true,
    user: { id: account.id, nickname: account.displayName, email: account.email, isGuest: false },
    message: migratedMessage(login.migrated),
    redirect: safeRedirect(body?.redirect),
  }, 200, login.cookie);
}

async function enforceOtpRateLimit(kv: KVNamespace | undefined, request: Request, email: string): Promise<Response | null> {
  const emailLimit = await checkRateLimit(kv, email, OTP_LIMIT, 3600, 'rl:auth-login-otp');
  if (!emailLimit.allowed) return json({ error: { code: 'RATE_LIMITED', message: '验证码请求过于频繁，请稍后再试。' } }, 429, undefined, emailLimit.retryAfterSeconds);
  const ipLimit = await checkRateLimit(kv, clientIp(request), IP_LIMIT, 3600, 'rl:auth-login-otp-ip');
  if (!ipLimit.allowed) return json({ error: { code: 'RATE_LIMITED', message: '当前网络请求过于频繁，请稍后再试。' } }, 429, undefined, ipLimit.retryAfterSeconds);
  return null;
}

async function checkCooldown(kv: KVNamespace | undefined, email: string): Promise<number> {
  if (!kv) return 0;
  const raw = await kv.get(cooldownKey(email));
  if (!raw) return 0;
  return Math.max(0, Math.ceil((Number(raw) - Date.now()) / 1000));
}

async function setCooldown(kv: KVNamespace | undefined, email: string): Promise<void> {
  await kv?.put(cooldownKey(email), String(Date.now() + RESEND_COOLDOWN_SECONDS * 1000), { expirationTtl: RESEND_COOLDOWN_SECONDS });
}

function cooldownKey(email: string): string {
  return `auth:cooldown:login:${email}`;
}

function json(body: unknown, status = 200, cookie?: string, retryAfterSeconds?: number): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
    },
  });
  if (cookie) response.headers.set('set-cookie', cookie);
  if (retryAfterSeconds) response.headers.set('retry-after', String(retryAfterSeconds));
  return response;
}
