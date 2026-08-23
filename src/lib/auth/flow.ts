import type { D1Database } from '@cloudflare/workers-types';
import { migrateGuestData, recordAccountSession, type Account } from './accounts';
import { bindSessionToAccount, buildSessionCookie, getOrCreateUser } from './session';

export async function completeAccountLogin(
  env: { SESSION?: KVNamespace; DB?: D1Database },
  request: Request,
  account: Account,
): Promise<{
  account: Account;
  cookie?: string;
  migrated: { generations: number; favorites: number; downloads: number; submissions: number };
}> {
  const sessionResult = await getOrCreateUser(env.SESSION, request);
  const sessionId = sessionResult.sessionId!;
  const oldAnonymousId = sessionResult.user.isGuest ? sessionResult.user.id : undefined;
  const migrated = env.DB
    ? await migrateGuestData(env.DB, oldAnonymousId, account.id)
    : { generations: 0, favorites: 0, downloads: 0, submissions: 0 };

  await bindSessionToAccount(env.SESSION, sessionId, {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
  });
  if (env.DB) await recordAccountSession(env.DB, sessionId, account.id);

  return {
    account,
    cookie: buildSessionCookie(sessionId, new URL(request.url).protocol === 'https:'),
    migrated,
  };
}

export function migratedMessage(migrated: { generations: number; favorites: number }): string {
  if (migrated.generations === 0 && migrated.favorites === 0) return '登录成功。';
  return `登录成功，已为你保留 ${migrated.generations} 件作品与 ${migrated.favorites} 个收藏。`;
}
