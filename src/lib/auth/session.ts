/**
 * 基于 KV 的会话身份 + D1 账号体系。
 *
 * 两层身份：
 *   - 游客（guest）：无账号，user.id 形如 `guest-<uuid>`，数据挂在 user.id 上。
 *   - 账号（account）：邮箱注册后的稳定身份，user.id = account.id（`acc-<uuid>`）。
 *
 * SessionUser 向后兼容旧字段（id / nickname / isGuest），新增 accountId / email / displayName。
 * 对外暴露的 user.id 在账号态下等于 accountId，游客态下等于 guest id，
 * 这样 generation_jobs / favorites 的 user_id 列无需改动即可同时承载两种身份。
 */

export type SessionUser = {
  /** 数据归属主键：游客态 = guest id，账号态 = account id。下游表都用这一列。 */
  id: string;
  nickname: string;
  isGuest: boolean;
  /** 账号态字段：登录后写入，便于 Header/API 直接展示。游客态为 undefined。 */
  accountId?: string;
  email?: string;
  displayName?: string;
};

export const SESSION_COOKIE = 'mythcanvas_session';
const GUEST_PREFIX = 'guest';
const KV_TTL = 60 * 60 * 24 * 180; // 180 天

/** 供 Astro.cookies.set 使用的 cookie 选项（保持 HttpOnly） */
export function sessionCookieOptions() {
  return {
    path: '/',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: KV_TTL,
  };
}

export function readSessionId(request: Request): string | null {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(SESSION_COOKIE.length + 1));
}

export function buildSessionCookie(sessionId: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${KV_TTL}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/** 获取当前会话用户；不存在则创建一个匿名用户并持久化到 KV */
export async function getOrCreateUser(
  kv: KVNamespace | undefined,
  request: Request,
): Promise<{ user: SessionUser; cookie?: string; sessionId?: string }> {
  const existing = readSessionId(request);
  return resolveForSession(kv, request, existing);
}

/** 解析已存在 session（用于需要 cookie 回写的场景） */
export async function resolveForSession(
  kv: KVNamespace | undefined,
  _request: Request,
  sessionId: string | null,
): Promise<{ user: SessionUser; cookie?: string; sessionId?: string }> {
  if (sessionId) {
    const cached = await kv?.get(sessionKey(sessionId));
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SessionUser;
        return { user: normalizeUser(parsed), sessionId };
      } catch {
        // 损坏的缓存，继续创建新 session
      }
    }
  }

  const newSessionId = crypto.randomUUID();
  const user = createGuest();
  await kv?.put(sessionKey(newSessionId), JSON.stringify(user), { expirationTtl: KV_TTL });
  return { user, cookie: buildSessionCookie(newSessionId), sessionId: newSessionId };
}

/** 根据 session id 读取用户；无则返回 null（用于已登录态校验） */
export async function getUserBySessionId(
  kv: KVNamespace | undefined,
  sessionId: string,
): Promise<SessionUser | null> {
  const cached = await kv?.get(sessionKey(sessionId));
  if (!cached) return null;
  try {
    return normalizeUser(JSON.parse(cached) as SessionUser);
  } catch {
    return null;
  }
}

/** 为已有 session 设置昵称（轻量登录，保留同一用户 id，使生成历史跨登录延续）。 */
export async function loginWithNickname(
  kv: KVNamespace | undefined,
  sessionId: string,
  nickname: string,
): Promise<SessionUser | null> {
  const existing = await getUserBySessionId(kv, sessionId);
  const user: SessionUser = {
    id: existing ? existing.id : `${GUEST_PREFIX}-${crypto.randomUUID()}`,
    nickname: nickname.trim().slice(0, 24) || '神话旅人',
    isGuest: false,
    accountId: existing?.accountId,
    email: existing?.email,
    displayName: existing?.displayName ?? nickname.trim().slice(0, 24),
  };
  await kv?.put(sessionKey(sessionId), JSON.stringify(user), { expirationTtl: KV_TTL });
  return user;
}

/**
 * 把一个已存在的 session 绑定到真实账号（邮箱验证通过后调用）。
 * - user.id 切换为 accountId，使后续生成/收藏直接挂在账号上。
 * - 写入 account_sessions 映射（DB）。
 * - 返回新 SessionUser，调用方负责回写 KV。
 */
export async function bindSessionToAccount(
  kv: KVNamespace | undefined,
  sessionId: string,
  account: { id: string; email: string; displayName: string },
): Promise<SessionUser> {
  const user: SessionUser = {
    id: account.id,
    nickname: account.displayName || account.email.split('@')[0],
    isGuest: false,
    accountId: account.id,
    email: account.email,
    displayName: account.displayName,
  };
  await kv?.put(sessionKey(sessionId), JSON.stringify(user), { expirationTtl: KV_TTL });
  return user;
}

/** 登出：保留同一 sessionId（cookie 不变），但把身份重置为一个全新的匿名游客。 */
export async function resetSessionToGuest(
  kv: KVNamespace | undefined,
  sessionId: string,
): Promise<SessionUser> {
  const user = createGuest();
  await kv?.put(sessionKey(sessionId), JSON.stringify(user), { expirationTtl: KV_TTL });
  return user;
}

/** 构造一个全新的游客 SessionUser */
export function createGuest(): SessionUser {
  return {
    id: `${GUEST_PREFIX}-${crypto.randomUUID()}`,
    nickname: '神话旅人',
    isGuest: true,
  };
}

/** 规整历史 KV 数据：保证 id/nickname/isGuest 三字段存在，账号字段按需透传。 */
function normalizeUser(raw: SessionUser): SessionUser {
  return {
    id: raw.id ?? `${GUEST_PREFIX}-${crypto.randomUUID()}`,
    nickname: raw.nickname ?? '神话旅人',
    isGuest: raw.isGuest ?? true,
    accountId: raw.accountId,
    email: raw.email,
    displayName: raw.displayName,
  };
}

export function sessionKey(sessionId: string): string {
  return `session:${sessionId}`;
}
