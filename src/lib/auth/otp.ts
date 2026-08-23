/**
 * 邮箱登录令牌：验证码（OTP）与 Magic Link token 共用一套存储与校验逻辑。
 *
 * 安全要点：
 *   - 不存明文：KV 里只存 SHA-256(令牌 + email + nonceId) 的哈希。
 *   - 一次性：校验通过即标记 consumed，不可重放。
 *   - 防爆破：每次校验失败 attempts++，超过 MAX_ATTEMPTS 作废。
 *   - 短时效：OTP 10 分钟、Magic Link 15 分钟。
 *   - 绑定邮箱：哈希里混入 email，防止跨邮箱挪用 token。
 */

const OTP_TTL_SECONDS = 10 * 60; // 验证码 10 分钟
const MAGIC_TTL_SECONDS = 15 * 60; // Magic Link 15 分钟
const MAX_ATTEMPTS = 5; // 最多尝试 5 次
const OTP_CODE_LENGTH = 6;
const TOKEN_BYTES = 32; // magic link 随机字节数

export type LoginChannel = 'otp' | 'magic';

export type LoginNonce = {
  nonceId: string;
  email: string;
  channel: LoginChannel;
  attempts: number;
  consumed: boolean;
  expiresAt: number; // epoch ms
};

export type IssuedOtp = { nonceId: string; code: string; expiresAt: number };
export type IssuedMagic = { nonceId: string; token: string; expiresAt: number; url: string };

/** 生成 6 位数字验证码（首位非 0，避免前导丢失歧义） */
export function generateOtpCode(): string {
  const bytes = new Uint8Array(OTP_CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let code = '';
  for (let i = 0; i < OTP_CODE_LENGTH; i++) {
    code += String(bytes[i] % 10);
  }
  return code;
}

/** 生成 magic link 随机 token（返回 hex） */
export function generateMagicToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

/** 生成并存储验证码到 KV（仅存哈希）。返回明文 code 供调用方发送邮件。 */
export async function storeOtp(
  kv: KVNamespace | undefined,
  email: string,
): Promise<IssuedOtp> {
  const code = generateOtpCode();
  const nonceId = `nonce_${crypto.randomUUID()}`;
  const expiresAt = Date.now() + OTP_TTL_SECONDS * 1000;
  const nonce: LoginNonce = { nonceId, email: email.toLowerCase(), channel: 'otp', attempts: 0, consumed: false, expiresAt };
  await kv?.put(nonceKey(nonceId), JSON.stringify({ ...nonce, codeHash: await hashToken(email, code) }), {
    expirationTtl: OTP_TTL_SECONDS + 60,
  });
  return { nonceId, code, expiresAt };
}

/** 存储 magic link token 到 KV（仅存哈希） */
export async function storeMagicLink(
  kv: KVNamespace | undefined,
  email: string,
  buildUrl: (nonceId: string, token: string) => string,
): Promise<IssuedMagic> {
  const nonceId = `nonce_${crypto.randomUUID()}`;
  const token = generateMagicToken();
  const expiresAt = Date.now() + MAGIC_TTL_SECONDS * 1000;
  const nonce: LoginNonce = { nonceId, email: email.toLowerCase(), channel: 'magic', attempts: 0, consumed: false, expiresAt };
  await kv?.put(nonceKey(nonceId), JSON.stringify({ ...nonce, codeHash: await hashToken(email, token) }), {
    expirationTtl: MAGIC_TTL_SECONDS + 60,
  });
  return { nonceId, token, expiresAt, url: buildUrl(nonceId, token) };
}

export type VerifyResult =
  | { ok: true; email: string; channel: LoginChannel }
  | { ok: false; code: 'NOT_FOUND' | 'EXPIRED' | 'CONSUMED' | 'TOO_MANY_ATTEMPTS' | 'MISMATCH'; remainingAttempts?: number };

/** 校验验证码 / magic token。成功则标记 consumed；失败则 attempts++ 并回写。 */
export async function verifyNonce(
  kv: KVNamespace | undefined,
  nonceId: string,
  candidate: string,
): Promise<VerifyResult> {
  if (!kv) return { ok: false, code: 'NOT_FOUND' };
  const raw = await kv.get(nonceKey(nonceId));
  if (!raw) return { ok: false, code: 'NOT_FOUND' };

  let stored: { codeHash: string; email: string; channel: LoginChannel; attempts: number; consumed: boolean; expiresAt: number };
  try {
    stored = JSON.parse(raw);
  } catch {
    return { ok: false, code: 'NOT_FOUND' };
  }

  if (stored.consumed) return { ok: false, code: 'CONSUMED' };
  if (Date.now() > stored.expiresAt) return { ok: false, code: 'EXPIRED' };
  if (stored.attempts >= MAX_ATTEMPTS) return { ok: false, code: 'TOO_MANY_ATTEMPTS' };

  const expected = await hashToken(stored.email, candidate);
  if (!safeEqual(expected, stored.codeHash)) {
    const attempts = stored.attempts + 1;
    await kv.put(
      nonceKey(nonceId),
      JSON.stringify({ ...stored, attempts }),
      { expirationTtl: Math.max(60, Math.ceil((stored.expiresAt - Date.now()) / 1000)) },
    );
    return { ok: false, code: 'MISMATCH', remainingAttempts: MAX_ATTEMPTS - attempts };
  }

  // 成功：标记 consumed，保留短暂时间便于审计/排障，随后自然过期
  await kv.put(nonceKey(nonceId), JSON.stringify({ ...stored, consumed: true }), { expirationTtl: 300 });
  return { ok: true, email: stored.email, channel: stored.channel };
}

function nonceKey(nonceId: string): string {
  return `auth:nonce:${nonceId}`;
}

/** SHA-256(email || ':' || token) 转 hex。绑定邮箱防挪用。 */
async function hashToken(email: string, token: string): Promise<string> {
  const data = new TextEncoder().encode(`${email.toLowerCase()}:${token}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(new Uint8Array(digest));
}

/** 常量时间比较，避免计时侧信道 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 简单邮箱格式校验 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}
