/**
 * 账号 D1 持久层 + 游客数据继承。
 *
 * 关键流程（邮箱验证通过后调用 completeLogin）：
 *   1. findAccountByEmail/createAccount(email) → 拿到稳定的 account.id。
 *   2. bindSessionToAccount(sessionId, account) → session 绑账号、回写 KV。
 *   3. migrateGuestData(d1, oldGuestId, account.id) → 把游客期间的生成/收藏改挂到账号。
 *   4. recordAccountSession(d1, sessionId, account.id) → 多端映射。
 */

import type { D1Database } from '@cloudflare/workers-types';

export type Account = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  passwordHash?: string | null;
};

/** 按邮箱查找账号，不存在时返回 null。 */
export async function findAccountByEmail(
  d1: D1Database,
  email: string,
): Promise<Account | null> {
  const normalized = email.toLowerCase().trim();
  const existing = await d1
    .prepare('SELECT id, email, display_name, avatar_url, password_hash FROM accounts WHERE email = ?')
    .bind(normalized)
    .first<{ id: string; email: string; display_name: string; avatar_url: string | null; password_hash: string | null }>();

  if (!existing) return null;
  return {
    id: existing.id,
    email: existing.email,
    displayName: existing.display_name,
    avatarUrl: existing.avatar_url,
    passwordHash: existing.password_hash,
  };
}

/** 创建一个带密码的稳定邮箱账号。 */
export async function createAccount(
  d1: D1Database,
  email: string,
  passwordHash: string,
): Promise<Account> {
  const normalized = email.toLowerCase().trim();
  const id = `acc_${crypto.randomUUID()}`;
  const defaultName = normalized.split('@')[0].slice(0, 24) || '神话旅人';
  await d1
    .prepare('INSERT INTO accounts (id, email, display_name, provider, password_hash, password_updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)')
    .bind(id, normalized, defaultName, 'email', passwordHash)
    .run();
  return { id, email: normalized, displayName: defaultName, avatarUrl: null, passwordHash };
}

export async function setAccountPassword(
  d1: D1Database,
  accountId: string,
  passwordHash: string,
): Promise<void> {
  await d1
    .prepare('UPDATE accounts SET password_hash = ?, password_updated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(passwordHash, accountId)
    .run();
}

export async function revokeAccountSession(d1: D1Database, sessionId: string): Promise<void> {
  await d1.prepare('DELETE FROM account_sessions WHERE session_id = ?').bind(sessionId).run();
}

/** 记录 session 与账号的映射（多端登录各自一条记录；冲突则 upsert）。 */
export async function recordAccountSession(
  d1: D1Database,
  sessionId: string,
  accountId: string,
): Promise<void> {
  await d1
    .prepare(
      `INSERT INTO account_sessions (session_id, account_id, last_seen_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(session_id) DO UPDATE SET account_id = excluded.account_id, last_seen_at = CURRENT_TIMESTAMP`,
    )
    .bind(sessionId, accountId)
    .run();
}

/**
 * 游客数据继承：把游客期间产生的数据从 oldGuestId 改挂到 accountId。
 * - 仅处理游客 id（以 guest 开头或非 acc_ 前缀），避免误迁移已有账号数据。
 * - favorites 有唯一约束 (user_id, target_type, target_id)，需先删旧后插，或用 INSERT OR IGNORE 合并。
 * - 返回各表迁移条数，便于前端提示「已为你保留 N 件作品」。
 */
export async function migrateGuestData(
  d1: D1Database,
  oldGuestId: string | undefined,
  accountId: string,
): Promise<{ generations: number; favorites: number; downloads: number; submissions: number }> {
  if (!oldGuestId || !shouldMigrate(oldGuestId, accountId)) {
    return { generations: 0, favorites: 0, downloads: 0, submissions: 0 };
  }

  const generations = await d1
    .prepare('UPDATE generation_jobs SET user_id = ? WHERE user_id = ?')
    .bind(accountId, oldGuestId)
    .run()
    .then((r) => r.meta.changes);

  // favorites: 先搬未冲突的，再删旧记录（冲突的被 accountId 版本覆盖，等于保留）
  const favMoved = await d1
    .prepare('UPDATE OR IGNORE favorites SET user_id = ? WHERE user_id = ?')
    .bind(accountId, oldGuestId)
    .run()
    .then((r) => r.meta.changes);
  await d1.prepare('DELETE FROM favorites WHERE user_id = ?').bind(oldGuestId).run();
  const favorites = favMoved;

  const downloads = await d1
    .prepare('UPDATE download_events SET user_id = ? WHERE user_id = ?')
    .bind(accountId, oldGuestId)
    .run()
    .then((r) => r.meta.changes);

  const submissions = await d1
    .prepare('UPDATE content_submissions SET user_id = ? WHERE user_id = ?')
    .bind(accountId, oldGuestId)
    .run()
    .then((r) => r.meta.changes);

  return { generations, favorites, downloads, submissions };
}

/** 只有当旧 id 是游客 id 且与账号 id 不同时才迁移 */
function shouldMigrate(oldGuestId: string, accountId: string): boolean {
  return oldGuestId !== accountId && !oldGuestId.startsWith('acc_');
}
