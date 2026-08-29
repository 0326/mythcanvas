import { artworks as seedArtworks } from '../../../data/seed';
import type { Artwork, ArtworkType, LicenseMeta } from '../types';
import { optionalString, pageClause, parseStringArray } from './shared';
import type { ArtworkListQuery } from './types';

type ArtworkRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  id, slug, title, type, mythology_id, world_id, style_id, mood_ids_json,
  asset_key, asset_mime, width, height, alt_text, source_type, license, creator, review_status
`;

export function mapArtworkRow(row: ArtworkRow, characterIds: readonly string[] = []): Artwork {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    type: String(row.type) as ArtworkType,
    mythologyId: String(row.mythology_id),
    worldId: optionalString(row.world_id),
    characterIds: characterIds.length > 0 ? characterIds : undefined,
    styleId: String(row.style_id),
    moodIds: parseStringArray(row.mood_ids_json),
    image: {
      src: assetUrl(String(row.asset_key)),
      alt: String(row.alt_text),
      width: Number(row.width),
      height: Number(row.height),
    },
    license: {
      sourceType: String(row.source_type) as LicenseMeta['sourceType'],
      license: String(row.license),
      creator: optionalString(row.creator),
    },
    reviewStatus: String(row.review_status) as Artwork['reviewStatus'],
  };
}

/** 批量加载 artwork_characters，返回 artworkId -> characterIds 映射 */
async function loadCharacterIds(db: D1Database, artworkIds: readonly string[]): Promise<Map<string, string[]>> {
  if (artworkIds.length === 0) return new Map();
  const placeholders = artworkIds.map(() => '?').join(',');
  const rows = await db
    .prepare(`SELECT artwork_id, character_id FROM artwork_characters WHERE artwork_id IN (${placeholders})`)
    .bind(...artworkIds)
    .all();
  const map = new Map<string, string[]>();
  for (const row of rows.results) {
    const artworkId = String(row.artwork_id);
    const list = map.get(artworkId) ?? [];
    list.push(String(row.character_id));
    map.set(artworkId, list);
  }
  return map;
}

function applySeedFilters(list: Artwork[], query: ArtworkListQuery): Artwork[] {
  let result = [...list];
  if (query.published !== 'all') result = result.filter((item) => item.reviewStatus === 'approved');
  if (query.mythologyId) result = result.filter((item) => item.mythologyId === query.mythologyId);
  if (query.worldId) result = result.filter((item) => item.worldId === query.worldId);
  if (query.characterId) result = result.filter((item) => item.characterIds?.includes(query.characterId ?? ''));
  if (query.styleId) result = result.filter((item) => item.styleId === query.styleId);
  if (query.type) result = result.filter((item) => item.type === query.type);
  if (query.search) {
    const needle = query.search.trim().toLowerCase();
    if (needle) {
      result = result.filter((item) => `${item.title} ${item.image.alt}`.toLowerCase().includes(needle));
    }
  }
  if (query.device === 'desktop') result = result.filter((item) => item.image.width >= item.image.height);
  if (query.device === 'mobile') result = result.filter((item) => item.image.height > item.image.width);

  // Seed 数据没有正式热度/发布时间元数据：推荐沿用编辑顺序，最新使用反向顺序作为可区分的本地兜底。
  if (query.sort === 'latest') result.reverse();

  const { limit, offset } = pageClause(query);
  return result.slice(offset, offset + limit);
}

function isMissingRankingColumnError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /no such column[^\n]*(featured|favorite_count|download_count|published_at)/i.test(message);
}

export async function getArtworks(db: D1Database | undefined, query: ArtworkListQuery = {}): Promise<Artwork[]> {
  if (!db) return applySeedFilters(seedArtworks, query);

  const where: string[] = [];
  const values: unknown[] = [];
  const join = query.characterId
    ? ' JOIN artwork_characters ac ON ac.artwork_id = a.id'
    : '';

  if (query.characterId) {
    where.push('ac.character_id = ?');
    values.push(query.characterId);
  }
  if (query.mythologyId) {
    where.push('a.mythology_id = ?');
    values.push(query.mythologyId);
  }
  if (query.worldId) {
    where.push('a.world_id = ?');
    values.push(query.worldId);
  }
  if (query.styleId) {
    where.push('a.style_id = ?');
    values.push(query.styleId);
  }
  if (query.type) {
    where.push('a.type = ?');
    values.push(query.type);
  }
  if (query.search?.trim()) {
    const search = query.search.trim();
    where.push('(instr(lower(a.title), lower(?)) > 0 OR instr(lower(a.alt_text), lower(?)) > 0)');
    values.push(search, search);
  }
  if (query.device === 'desktop') {
    where.push('a.width >= a.height');
  }
  if (query.device === 'mobile') {
    where.push('a.height > a.width');
  }
  if (query.published !== 'all') {
    where.push("a.publish_status = 'published'");
    where.push("a.review_status = 'approved'");
  }

  const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';
  const { limit, offset } = pageClause(query);
  const orderBy = query.sort === 'recommended'
    ? 'a.featured DESC, (a.favorite_count * 3 + a.download_count) DESC, COALESCE(a.published_at, a.created_at) DESC, a.id'
    : query.sort === 'popular'
      ? '(a.favorite_count * 3 + a.download_count) DESC, a.favorite_count DESC, a.download_count DESC, COALESCE(a.published_at, a.created_at) DESC, a.id'
      : 'COALESCE(a.published_at, a.created_at) DESC, a.id';

  let rows;
  try {
    rows = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM artworks a${join}${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`)
      .bind(...values, limit, offset)
      .all();
  } catch (error) {
    // 线上 D1 可能尚未应用 0005_user_features.sql。排序增强字段缺失时先降级到旧 Schema，
    // 保证 Explore 可用；待迁移补齐后自动恢复推荐/热门排序，无需再次改代码。
    if (!isMissingRankingColumnError(error)) throw error;
    rows = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM artworks a${join}${whereSql} ORDER BY a.created_at DESC, a.id LIMIT ? OFFSET ?`)
      .bind(...values, limit, offset)
      .all();
  }

  const characterMap = await loadCharacterIds(db, rows.results.map((row) => String(row.id)));
  return rows.results.map((row) => mapArtworkRow(row, characterMap.get(String(row.id)) ?? []));
}

export async function countPublishedArtworks(db: D1Database | undefined): Promise<number> {
  if (!db) return seedArtworks.filter((item) => item.reviewStatus === 'approved').length;
  const row = await db
    .prepare("SELECT COUNT(*) AS count FROM artworks WHERE publish_status = 'published' AND review_status = 'approved'")
    .first<{ count: number }>();
  return Number(row?.count ?? 0);
}

export async function getArtworkBySlug(db: D1Database | undefined, slug: string): Promise<Artwork | undefined> {
  if (!db) return seedArtworks.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM artworks WHERE slug = ? AND publish_status = 'published' AND review_status = 'approved'`)
    .bind(slug)
    .first();
  if (!row) return undefined;
  const characterMap = await loadCharacterIds(db, [String(row.id)]);
  return mapArtworkRow(row, characterMap.get(String(row.id)) ?? []);
}

export async function getArtworkById(db: D1Database | undefined, id: string): Promise<Artwork | undefined> {
  if (!db) return seedArtworks.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM artworks WHERE id = ? AND publish_status = 'published' AND review_status = 'approved'`)
    .bind(id)
    .first();
  if (!row) return undefined;
  const characterMap = await loadCharacterIds(db, [String(row.id)]);
  return mapArtworkRow(row, characterMap.get(String(row.id)) ?? []);
}

export async function getArtworksForMythology(
  db: D1Database | undefined,
  mythologyId: string,
  query: ArtworkListQuery = {},
): Promise<Artwork[]> {
  return getArtworks(db, { ...query, mythologyId });
}

export async function getArtworksForWorld(
  db: D1Database | undefined,
  worldId: string,
  query: ArtworkListQuery = {},
): Promise<Artwork[]> {
  return getArtworks(db, { ...query, worldId });
}

export async function getArtworksForCharacter(
  db: D1Database | undefined,
  characterId: string,
  query: ArtworkListQuery = {},
): Promise<Artwork[]> {
  return getArtworks(db, { ...query, characterId });
}

export async function getArtworksForStyle(
  db: D1Database | undefined,
  styleId: string,
  query: ArtworkListQuery = {},
): Promise<Artwork[]> {
  return getArtworks(db, { ...query, styleId });
}

/** 归一化 asset -> 可访问 delivery URL */
export function assetUrl(assetKey: string): string {
  if (!assetKey) return '';
  // data: 或完整媒体路径直接返回
  if (assetKey.startsWith('data:') || assetKey.startsWith('/media/')) return assetKey;
  if (assetKey.startsWith('media/')) return `/${assetKey}`;
  // 纯 key（generated/... 或 content/...），加 /media/ 前缀
  return `/media/${assetKey}`;
}
