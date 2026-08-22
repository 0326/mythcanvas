import { realms as seedRealms } from '../../../data/seed';
import type { Realm } from '../types';
import { optionalNumber, optionalString, pageClause, parseJson } from './shared';
import type { EntityListQuery } from './types';

type RealmRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  id, mythology_id, slug, name, name_en, summary, canonical_design_json,
  hero_src, hero_alt, hero_width, hero_height
`;

export function mapRealmRow(row: RealmRow): Realm {
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

export async function getRealms(db: D1Database | undefined, query: EntityListQuery = {}): Promise<Realm[]> {
  if (!db) {
    const { limit, offset } = pageClause(query);
    return seedRealms.slice(offset, offset + limit);
  }
  const where = query.published === 'all' ? '' : " WHERE publish_status = 'published'";
  const { limit, offset } = pageClause(query);
  const rows = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM realms${where} ORDER BY name LIMIT ? OFFSET ?`)
    .bind(limit, offset)
    .all();
  return rows.results.map(mapRealmRow);
}

export async function getRealmBySlug(db: D1Database | undefined, slug: string): Promise<Realm | undefined> {
  if (!db) return seedRealms.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM realms WHERE slug = ? AND publish_status = 'published'`)
    .bind(slug)
    .first();
  return row ? mapRealmRow(row) : undefined;
}

export async function getRealmById(db: D1Database | undefined, id: string): Promise<Realm | undefined> {
  if (!db) return seedRealms.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM realms WHERE id = ? AND publish_status = 'published'`)
    .bind(id)
    .first();
  return row ? mapRealmRow(row) : undefined;
}

export async function getRealmsForMythology(
  db: D1Database | undefined,
  mythologyId: string,
  query: EntityListQuery = {},
): Promise<Realm[]> {
  if (!db) return seedRealms.filter((item) => item.mythologyId === mythologyId);
  const { limit, offset } = pageClause(query);
  const rows = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM realms WHERE mythology_id = ? AND publish_status = 'published' ORDER BY name LIMIT ? OFFSET ?`)
    .bind(mythologyId, limit, offset)
    .all();
  return rows.results.map(mapRealmRow);
}
