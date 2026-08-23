/**
 * 收藏数据访问层（D1）。
 * 支持 Artwork / Character / Realm / Style 四类收藏目标。
 */

export type FavoriteTargetType = 'artwork' | 'character' | 'realm' | 'style' | 'generation';

export type Favorite = {
  userId: string;
  targetType: FavoriteTargetType;
  targetId: string;
  createdAt: string;
};

export async function addFavorite(
  db: D1Database | undefined,
  userId: string,
  targetType: FavoriteTargetType,
  targetId: string,
): Promise<boolean> {
  if (!db) return true;
  await db
    .prepare('INSERT OR IGNORE INTO favorites (user_id, target_type, target_id) VALUES (?, ?, ?)')
    .bind(userId, targetType, targetId)
    .run();
  if (targetType === 'artwork') {
    await db.prepare('UPDATE artworks SET favorite_count = favorite_count + 1 WHERE id = ?').bind(targetId).run().catch(() => undefined);
  }
  return true;
}

export async function removeFavorite(
  db: D1Database | undefined,
  userId: string,
  targetType: FavoriteTargetType,
  targetId: string,
): Promise<boolean> {
  if (!db) return true;
  const result = await db
    .prepare('DELETE FROM favorites WHERE user_id = ? AND target_type = ? AND target_id = ?')
    .bind(userId, targetType, targetId)
    .run();
  if (result.meta.changes > 0 && targetType === 'artwork') {
    await db.prepare('UPDATE artworks SET favorite_count = MAX(0, favorite_count - 1) WHERE id = ?').bind(targetId).run().catch(() => undefined);
  }
  return true;
}

export async function isFavorited(
  db: D1Database | undefined,
  userId: string,
  targetType: FavoriteTargetType,
  targetId: string,
): Promise<boolean> {
  if (!db) return false;
  const row = await db
    .prepare('SELECT 1 AS found FROM favorites WHERE user_id = ? AND target_type = ? AND target_id = ?')
    .bind(userId, targetType, targetId)
    .first();
  return Boolean(row);
}

export async function listFavorites(
  db: D1Database | undefined,
  userId: string,
  targetType?: FavoriteTargetType,
): Promise<Favorite[]> {
  if (!db) return [];
  const rows = await db
    .prepare(
      `SELECT user_id, target_type, target_id, created_at
       FROM favorites
       WHERE user_id = ? ${targetType ? 'AND target_type = ?' : ''}
       ORDER BY created_at DESC`,
    )
    .bind(...(targetType ? [userId, targetType] : [userId]))
    .all();
  return rows.results.map((row) => ({
    userId: String(row.user_id),
    targetType: String(row.target_type) as FavoriteTargetType,
    targetId: String(row.target_id),
    createdAt: String(row.created_at),
  }));
}
