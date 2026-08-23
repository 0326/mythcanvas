/**
 * 邮件发送封装（Resend REST API）。
 *
 * 设计要点：
 *   - 配置了 RESEND_API_KEY 即走 Resend 生产发送；未配置则降级到 console（开发可见验证码/链接）。
 *   - 发件地址由 MAIL_FROM_EMAIL / MAIL_FROM_NAME 配置；未配置时用兜底值（生产必须改为 Resend 已验证的发件地址）。
 *   - 同时产出 html 与 text 两份正文，提升可达性。
 *   - 不抛错到上层阻断流程：发信失败返回 { ok:false, devFallback? }，由调用方决定降级策略。
 */

export type MailEnv = {
  RESEND_API_KEY?: string;
  MAIL_FROM_EMAIL?: string;
  MAIL_FROM_NAME?: string;
  PUBLIC_BASE_URL?: string;
};

export type SendResult = { ok: true; messageId?: string } | { ok: false; error: string; devFallback?: DevFallback };

/** 本地降级输出（含验证码或链接，方便开发期不配 API key 也能登录） */
export type DevFallback = { to: string; subject: string; otp?: string; magicUrl?: string };

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';
const DEFAULT_FROM_NAME = '绘神宇宙 MythCanvas';

/** 发送验证码登录邮件 */
export async function sendOtpMail(
  env: MailEnv,
  to: string,
  code: string,
  expiresInMinutes = 10,
): Promise<SendResult> {
  const subject = `【绘神宇宙】登录验证码 ${code}`;
  const html = otpTemplate(code, expiresInMinutes);
  const text = `你的绘神宇宙登录验证码是：${code}，${expiresInMinutes} 分钟内有效。若非本人操作请忽略本邮件。`;
  return doSend(env, to, subject, html, text, { otp: code });
}

/** 发送 Magic Link 登录邮件 */
export async function sendMagicLinkMail(
  env: MailEnv,
  to: string,
  url: string,
  expiresInMinutes = 15,
): Promise<SendResult> {
  const subject = '【绘神宇宙】点击链接登录';
  const html = magicTemplate(url, expiresInMinutes);
  const text = `点击以下链接登录绘神宇宙（${expiresInMinutes} 分钟内有效）：\n${url}\n\n若非本人操作请忽略本邮件。`;
  return doSend(env, to, subject, html, text, { magicUrl: url });
}

async function doSend(
  env: MailEnv,
  to: string,
  subject: string,
  html: string,
  text: string,
  dev: Omit<DevFallback, 'to' | 'subject'>,
): Promise<SendResult> {
  if (!env.RESEND_API_KEY) {
    const fallback: DevFallback = { to, subject, ...dev };
    console.info('[email:dev-fallback]', JSON.stringify(fallback));
    return { ok: false, error: 'RESEND_API_KEY not configured (dev fallback)', devFallback: fallback };
  }
  try {
    const fromEmail = env.MAIL_FROM_EMAIL || DEFAULT_FROM_EMAIL;
    const fromName = env.MAIL_FROM_NAME || DEFAULT_FROM_NAME;
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to,
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) {
      const errBody = (await res.json().catch(() => null)) as { message?: string } | null;
      const message = errBody?.message ?? `Resend API error ${res.status}`;
      console.error('[email:send-failed]', res.status, message);
      return { ok: false, error: message };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, messageId: data.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[email:send-failed]', message);
    return { ok: false, error: message };
  }
}

function otpTemplate(code: string, expiresInMinutes: number): string {
  return `<!doctype html><html lang="zh-CN"><body style="margin:0;background:#0b1320;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#e8ecf3">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px">
    <p style="font-size:13px;color:#8b97ad;margin:0 0 16px">绘神宇宙 · 登录验证码</p>
    <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#e6c07b;text-align:center;padding:24px 0;border:1px solid #1f2c44;border-radius:10px;background:#0f1a2b">${code}</div>
    <p style="font-size:14px;line-height:1.7;color:#b8c2d4;margin:20px 0 0">验证码 <strong>${expiresInMinutes}</strong> 分钟内有效。若这不是你本人的操作，请忽略本邮件，你的账号安全如常。</p>
    <p style="font-size:12px;color:#5e6a80;margin-top:32px">— 绘神宇宙 MythCanvas</p>
  </div></body></html>`;
}

function magicTemplate(url: string, expiresInMinutes: number): string {
  return `<!doctype html><html lang="zh-CN"><body style="margin:0;background:#0b1320;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#e8ecf3">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px">
    <p style="font-size:13px;color:#8b97ad;margin:0 0 16px">绘神宇宙 · 登录链接</p>
    <p style="font-size:15px;line-height:1.7;color:#b8c2d4;margin:0 0 24px">点击下方按钮即可登录，链接 <strong>${expiresInMinutes}</strong> 分钟内有效。</p>
    <div style="text-align:center">
      <a href="${url}" style="display:inline-block;padding:14px 32px;background:#e6c07b;color:#1a1408;font-weight:700;border-radius:8px;text-decoration:none">登录绘神宇宙</a>
    </div>
    <p style="font-size:12px;color:#5e6a80;margin:24px 0 0;word-break:break-all">如果按钮无法点击，请直接访问：<br><a href="${url}" style="color:#8ba2c7">${url}</a></p>
    <p style="font-size:12px;color:#5e6a80;margin-top:32px">— 绘神宇宙 MythCanvas</p>
  </div></body></html>`;
}
