import type { APIRoute } from 'astro';
import { createAccount, findAccountByEmail } from '../../../lib/auth/accounts';
import { completeAccountLogin, migratedMessage } from '../../../lib/auth/flow';
import { hashPassword, validatePassword } from '../../../lib/auth/password';
import { safeRedirect } from '../../../lib/auth/redirect';
import { isValidEmail, storeOtp, verifyNonce } from '../../../lib/auth/otp';
import { sendOtpMail } from '../../../lib/email/send';
import { checkRateLimit, clientIp } from '../../../lib/security/rate-limit';

export const prerender = false;

const OTP_LIMIT = 5;
const IP_LIMIT = 10;
const RESEND_COOLDOWN_SECONDS = 60;

/** POST /api/auth/register — action=request|complete */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const action = body?.action === 'complete' ? 'complete' : 'request';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const confirmPassword = typeof body?.confirmPassword === 'string' ? body.confirmPassword : '';

  if (!isValidEmail(email)) return json({ error: { code: 'INVALID_EMAIL', message: '请输入有效的邮箱地址。' } }, 400);
  const passwordError = validatePassword(password);
  if (passwordError) return json({ error: { code: 'INVALID_PASSWORD', message: passwordError } }, 400);
  if (password !== confirmPassword) return json({ error: { code: 'PASSWORD_MISMATCH', message: '两次输入的密码不一致。' } }, 400);
  if (!env.DB) return json({ error: { code: 'AUTH_UNAVAILABLE', message: '账号服务暂时不可用，请稍后重试。' } }, 503);

  const existing = await findAccountByEmail(env.DB, email);
  if (existing) return json({ error: { code: 'ACCOUNT_EXISTS', message: '这个邮箱已经注册，请直接登录或重置密码。' } }, 409);

  if (action === 'request') {
    const cooldown = await checkCooldown(env.SESSION, email);
    if (cooldown > 0) return json({ error: { code: 'RESEND_COOLDOWN', message: `验证码已发送，请 ${cooldown} 秒后再试。`, retryAfterSeconds: cooldown } }, 429, undefined, cooldown);

    const limited = await enforceRateLimit(env.SESSION, request, email);
    if (limited) return limited;

    const issued = await storeOtp(env.SESSION, email, 'register');
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
      message: '验证码已发送，请查收邮件。',
      ...(sendResult.ok || !sendResult.devFallback ? {} : { devFallback: sendResult.devFallback }),
    });
  }

  const nonceId = typeof body?.nonceId === 'string' ? body.nonceId : '';
  const code = typeof body?.code === 'string' ? body.code.trim() : '';
  if (!nonceId || !code) return json({ error: { code: 'INVALID_CODE', message: '请输入邮箱验证码。' } }, 400);

  const verification = await verifyNonce(env.SESSION, nonceId, code, 'register');
  if (!verification.ok || verification.channel !== 'otp' || verification.email !== email) {
    return json({ error: { code: 'INVALID_CODE', message: '验证码不正确或已过期，请重新获取。' } }, 401);
  }

  try {
    const account = await createAccount(env.DB, email, await hashPassword(password));
    const login = await completeAccountLogin(env, request, account);
    return json({
      ok: true,
      user: { id: account.id, nickname: account.displayName, email: account.email, isGuest: false },
      message: migratedMessage(login.migrated),
      redirect: safeRedirect(body?.redirect),
    }, 200, login.cookie);
  } catch {
    return json({ error: { code: 'ACCOUNT_EXISTS', message: '这个邮箱已经注册，请直接登录或重置密码。' } }, 409);
  }
};

async function enforceRateLimit(kv: KVNamespace | undefined, request: Request, email: string): Promise<Response | null> {
  const emailLimit = await checkRateLimit(kv, email, OTP_LIMIT, 3600, 'rl:auth-register');
  if (!emailLimit.allowed) return json({ error: { code: 'RATE_LIMITED', message: '验证码请求过于频繁，请稍后再试。' } }, 429, undefined, emailLimit.retryAfterSeconds);
  const ipLimit = await checkRateLimit(kv, clientIp(request), IP_LIMIT, 3600, 'rl:auth-register-ip');
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
  return `auth:cooldown:register:${email}`;
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
