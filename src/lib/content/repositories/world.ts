import { worlds as seedWorlds } from '../../../data/seed';
import { greekWorlds } from '../../../content/greek/catalog';
import type { World } from '../types';
import { optionalNumber, optionalString, pageClause, parseJson } from './shared';
import type { EntityListQuery } from './types';

type WorldRow = Record<string, unknown>;

function mergeGreekWorlds(items: readonly World[]): World[] {
  const byId = new Map(greekWorlds.map((item) => [item.id, item]));
  items.forEach((item) => {
    const authored = byId.get(item.id);
    byId.set(item.id, authored ? { ...authored, ...item, heroImageMobile: authored.heroImageMobile } : item);
  });
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

function withGreekWorldVariants(item: World): World {
  const authored = greekWorlds.find((world) => world.id === item.id);
  return authored ? { ...authored, ...item, heroImageMobile: authored.heroImageMobile } : item;
}

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
  return mergeGreekWorlds(rows.results.map(mapWorldRow));
}

export async function getWorldBySlug(db: D1Database | undefined, slug: string): Promise<World | undefined> {
  if (!db) return seedWorlds.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE slug = ? AND publish_status = 'published'`)
    .bind(slug)
    .first();
  return row ? withGreekWorldVariants(mapWorldRow(row)) : greekWorlds.find((item) => item.slug === slug);
}

export async function getWorldById(db: D1Database | undefined, id: string): Promise<World | undefined> {
  if (!db) return seedWorlds.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE id = ? AND publish_status = 'published'`)
    .bind(id)
    .first();
  return row ? withGreekWorldVariants(mapWorldRow(row)) : greekWorlds.find((item) => item.id === id);
}

export async function getWorldsForMythology(
  db: D1Database | undefined,
  mythologyId: string,
  query: EntityListQuery = {},
): Promise<World[]> {
  if (!db) return seedWorlds.filter((item) => item.mythologyId === mythologyId);
  const { limit, offset } = pageClause(query);
  const isGreek = mythologyId === 'myth-greek';
  const rows = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE mythology_id = ? AND publish_status = 'published' ORDER BY name${isGreek ? '' : ' LIMIT ? OFFSET ?'}`)
    .bind(mythologyId, ...(isGreek ? [] : [limit, offset]))
    .all();
  const worlds = rows.results.map(mapWorldRow);
  return isGreek ? mergeGreekWorlds(worlds).slice(offset, offset + limit) : worlds;
}
