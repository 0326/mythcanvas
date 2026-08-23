/**
 * 基于 KV 的匿名/简易身份会话。
 *
 * V1 策略：先获得价值，再要求登录。匿名访客会自动获得一个 session，
 * session id 写入 HttpOnly cookie，KV 中保存 userId + nickname。
 * 收藏、生成历史等个人数据都挂在 userId 上。
 */

export type SessionUser = {
  id: string;
  nickname: string;
  isGuest: boolean;
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
  request: Request,
  sessionId: string | null,
): Promise<{ user: SessionUser; cookie?: string; sessionId?: string }> {
  if (sessionId) {
    const cached = await kv?.get(sessionKey(sessionId));
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SessionUser;
        return { user: parsed, sessionId };
      } catch {
        // 损坏的缓存，继续创建新 session
      }
    }
  }

  const newSessionId = crypto.randomUUID();
  const user: SessionUser = {
    id: `${GUEST_PREFIX}-${crypto.randomUUID()}`,
    nickname: '神话旅人',
    isGuest: true,
  };
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
    return JSON.parse(cached) as SessionUser;
  } catch {
    return null;
  }
}

/** 为已有 session 设置昵称（模拟登录；真实 OAuth 接入时替换此实现）。保留同一用户 id，使生成历史跨登录延续。 */
export async function loginWithNickname(
  kv: KVNamespace | undefined,
  sessionId: string,
  nickname: string,
): Promise<SessionUser | null> {
  const existing = await getUserBySessionId(kv, sessionId);
  const user: SessionUser = {
    // 保留原 id（可能含 guest 前缀），这样登录前后的生成历史、收藏连续
    id: existing ? existing.id : `${GUEST_PREFIX}-${crypto.randomUUID()}`,
    nickname: nickname.trim().slice(0, 24) || '神话旅人',
    isGuest: false,
  };
  await kv?.put(sessionKey(sessionId), JSON.stringify(user), { expirationTtl: KV_TTL });
  return user;
}

function sessionKey(sessionId: string): string {
  return `session:${sessionId}`;
}
