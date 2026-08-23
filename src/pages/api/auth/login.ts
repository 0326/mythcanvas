import type { APIRoute } from 'astro';
import { isValidEmail, storeMagicLink, storeOtp } from '../../../lib/auth/otp';
import { sendMagicLinkMail, sendOtpMail } from '../../../lib/email/send';
import { checkRateLimit, clientIp } from '../../../lib/security/rate-limit';
import { readSessionId } from '../../../lib/auth/session';

export const prerender = false;

const OTP_LIMIT = 5; // 每邮箱每小时 5 次（含 magic link）
const IP_LIMIT = 10; // 每 IP 每小时 10 次

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const kv = env.SESSION;

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const mode: 'otp' | 'magic' = body.mode === 'magic' ? 'magic' : 'otp';

  if (!email || !isValidEmail(email)) {
    return json({ error: { code: 'INVALID_EMAIL', message: '请输入有效的邮箱地址。' } }, 400);
  }

  // 限流：邮箱级 + IP 级双保险
  const ip = clientIp(request);
  const emailLimit = await checkRateLimit(kv, email.toLowerCase(), OTP_LIMIT, 3600, 'rl:auth-login');
  if (!emailLimit.allowed) {
    return json({ error: { code: 'RATE_LIMITED', message: '验证码请求过于频繁，请稍后再试。' } }, 429, emailLimit.retryAfterSeconds);
  }
  const ipLimit = await checkRateLimit(kv, ip, IP_LIMIT, 3600, 'rl:auth-login-ip');
  if (!ipLimit.allowed) {
    return json({ error: { code: 'RATE_LIMITED', message: '当前网络的请求过于频繁，请稍后再试。' } }, 429, ipLimit.retryAfterSeconds);
  }

  // 构造回跳目标：登录成功后回到来源页或我的页面
  const sessionId = readSessionId(request);
  const redirect = typeof body.redirect === 'string' && body.redirect.startsWith('/') ? body.redirect : '/my/';
  const baseUrl = env.PUBLIC_BASE_URL || originFrom(request);

  if (mode === 'magic') {
    const issued = await storeMagicLink(kv, email, (nonceId, token) =>
      `${baseUrl}/api/auth/verify?nonce=${encodeURIComponent(nonceId)}&token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirect)}`,
    );
    const sendResult = await sendMagicLinkMail(env, email, issued.url, 15);
    return respondLogin(sendResult, sessionId, 'magic', undefined);
  }

  const issued = await storeOtp(kv, email);
  const sendResult = await sendOtpMail(env, email, issued.code, 10);
  return respondLogin(sendResult, sessionId, 'otp', issued.nonceId);
};

function respondLogin(
  sendResult: Awaited<ReturnType<typeof sendOtpMail>>,
  _sessionId: string | null,
  channel: 'otp' | 'magic',
  nonceId: string | undefined,
) {
  if (sendResult.ok) {
    return json({
      ok: true,
      channel,
      nonceId,
      message: channel === 'otp' ? '验证码已发送，请查收邮件（10 分钟内有效）。' : '登录链接已发送至邮箱，点击即可登录（15 分钟内有效）。',
    });
  }
  // 本地降级：把验证码/链接直接回给前端，方便开发期无域名也能完成登录闭环
  if (sendResult.devFallback) {
    return json({
      ok: true,
      channel,
      nonceId,
      devFallback: sendResult.devFallback,
      message: '邮件服务未配置，已进入开发降级模式。',
    });
  }
  return json({ error: { code: 'MAIL_SEND_FAILED', message: '邮件发送失败，请稍后重试。' } }, 502);
}

function json(body: unknown, status = 200, retryAfterSeconds?: number): Response {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
  if (retryAfterSeconds) response.headers.set('retry-after', String(retryAfterSeconds));
  return response;
}

function originFrom(request: Request): string {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}
