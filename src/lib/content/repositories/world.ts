import { worlds as seedWorlds } from '../../../data/seed';
import type { World } from '../types';
import { optionalNumber, optionalString, pageClause, parseJson } from './shared';
import type { EntityListQuery } from './types';

type WorldRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  id, mythology_id, slug, name, name_en, summary, canonical_design_json,
  hero_src, hero_alt, hero_width, hero_height
`;

export function mapWorldRow(row: WorldRow): World {
  return {
    id: String(row.id),
    mythologyId: String(row.mythology_id),
    slug: String(row.slug),
    name: String(row.name),
    nameEn: String(row.name_en),
    summary: String(row.summary),
    canonicalDesign: parseJson(row.canonical_design_json, { anchors: [] }),
    heroImage: {
      src: String(row.hero_src ?? '/media/content/chinese-celestial.svg'),
      alt: String(row.hero_alt ?? ''),
      width: optionalNumber(row.hero_width) ?? 1600,
      height: optionalNumber(row.hero_height) ?? 900,
    },
  };
}

export async function getWorlds(db: D1Database | undefined, query: EntityListQuery = {}): Promise<World[]> {
  if (!db) {
    const { limit, offset } = pageClause(query);
    return seedWorlds.slice(offset, offset + limit);
  }
  const where = query.published === 'all' ? '' : " WHERE publish_status = 'published'";
  const { limit, offset } = pageClause(query);
  const rows = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds${where} ORDER BY name LIMIT ? OFFSET ?`)
    .bind(limit, offset)
    .all();
  return rows.results.map(mapWorldRow);
}

export async function getWorldBySlug(db: D1Database | undefined, slug: string): Promise<World | undefined> {
  if (!db) return seedWorlds.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE slug = ? AND publish_status = 'published'`)
    .bind(slug)
    .first();
  return row ? mapWorldRow(row) : undefined;
}

export async function getWorldById(db: D1Database | undefined, id: string): Promise<World | undefined> {
  if (!db) return seedWorlds.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE id = ? AND publish_status = 'published'`)
    .bind(id)
    .first();
  return row ? mapWorldRow(row) : undefined;
}

export async function getWorldsForMythology(
  db: D1Database | undefined,
  mythologyId: string,
  query: EntityListQuery = {},
): Promise<World[]> {
  if (!db) return seedWorlds.filter((item) => item.mythologyId === mythologyId);
  const { limit, offset } = pageClause(query);
  const rows = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE mythology_id = ? AND publish_status = 'published' ORDER BY name LIMIT ? OFFSET ?`)
    .bind(mythologyId, limit, offset)
    .all();
  return rows.results.map(mapWorldRow);
}