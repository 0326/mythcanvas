import { worlds as seedWorlds } from '../../../data/seed';
import { getStructuredMythologyBundle, getStructuredWorlds } from '../../../content/registry';
import type { World } from '../types';
import { optionalNumber, optionalString, pageClause, parseJson, withD1ReadFallback } from './shared';
import type { EntityListQuery } from './types';

type WorldRow = Record<string, unknown>;

function mergeStructuredWorlds(items: readonly World[], mythologyId?: string): World[] {
  const staticItems = mythologyId ? seedWorlds.filter((item) => item.mythologyId === mythologyId) : seedWorlds;
  const byId = new Map(staticItems.map((item) => [item.id, item]));
  getStructuredWorlds(mythologyId).forEach((item) => byId.set(item.id, item));
  items.forEach((item) => {
    const authored = byId.get(item.id);
    byId.set(item.id, authored ? { ...authored, ...item, heroImageMobile: authored.heroImageMobile } : item);
  });
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
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
  const fallback = () => {
    const { limit, offset } = pageClause(query);
    return mergeStructuredWorlds([]).slice(offset, offset + limit);
  };
  if (!db) return fallback();
  return withD1ReadFallback(async () => {
    const where = query.published === 'all' ? '' : " WHERE publish_status = 'published'";
    const { limit, offset } = pageClause(query);
    const hasStructuredContent = getStructuredWorlds().length > 0;
    const rows = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds${where} ORDER BY name${hasStructuredContent ? '' : ' LIMIT ? OFFSET ?'}`)
      .bind(...(hasStructuredContent ? [] : [limit, offset]))
      .all();
    return mergeStructuredWorlds(rows.results.map(mapWorldRow)).slice(offset, offset + limit);
  }, fallback);
}

export async function getWorldBySlug(db: D1Database | undefined, slug: string): Promise<World | undefined> {
  if (!db) return mergeStructuredWorlds([]).find((item) => item.slug === slug);
  return withD1ReadFallback(async () => {
    const row = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE slug = ? AND publish_status = 'published'`)
      .bind(slug)
      .first();
    return row ? mergeStructuredWorlds([mapWorldRow(row)]).find((item) => item.slug === slug) : mergeStructuredWorlds([]).find((item) => item.slug === slug);
  }, () => mergeStructuredWorlds([]).find((item) => item.slug === slug));
}

export async function getWorldById(db: D1Database | undefined, id: string): Promise<World | undefined> {
  if (!db) return mergeStructuredWorlds([]).find((item) => item.id === id);
  return withD1ReadFallback(async () => {
    const row = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE id = ? AND publish_status = 'published'`)
      .bind(id)
      .first();
    return row ? mergeStructuredWorlds([mapWorldRow(row)]).find((item) => item.id === id) : mergeStructuredWorlds([]).find((item) => item.id === id);
  }, () => mergeStructuredWorlds([]).find((item) => item.id === id));
}

export async function getWorldsForMythology(
  db: D1Database | undefined,
  mythologyId: string,
  query: EntityListQuery = {},
): Promise<World[]> {
  const fallback = () => {
    const { limit, offset } = pageClause(query);
    return mergeStructuredWorlds([], mythologyId).slice(offset, offset + limit);
  };
  if (!db) return fallback();
  return withD1ReadFallback(async () => {
    const { limit, offset } = pageClause(query);
    const hasStructuredBundle = Boolean(getStructuredMythologyBundle(mythologyId));
    const rows = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM worlds WHERE mythology_id = ? AND publish_status = 'published' ORDER BY name${hasStructuredBundle ? '' : ' LIMIT ? OFFSET ?'}`)
      .bind(mythologyId, ...(hasStructuredBundle ? [] : [limit, offset]))
      .all();
    const worlds = rows.results.map(mapWorldRow);
    const merged = mergeStructuredWorlds(worlds, mythologyId).filter((item) => item.mythologyId === mythologyId);
    return hasStructuredBundle ? merged.slice(offset, offset + limit) : worlds;
  }, fallback);
}
