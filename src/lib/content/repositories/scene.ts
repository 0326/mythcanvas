import { scenes as seedScenes } from '../../../data/seed';
import { getStructuredScenes } from '../../../content/registry';
import type { Scene } from '../types';
import { optionalNumber, optionalString, parseJson, withD1ReadFallback } from './shared';
import type { EntityListQuery } from './types';

type SceneRow = Record<string, unknown>;

function mergeStructuredScenes(items: readonly Scene[], mythologyId?: string): Scene[] {
  const staticItems = mythologyId ? seedScenes.filter((item) => item.mythologyId === mythologyId) : seedScenes;
  const byId = new Map(staticItems.map((item) => [item.id, item]));
  getStructuredScenes(mythologyId).forEach((item) => byId.set(item.id, item));
  items.forEach((item) => {
    const authored = byId.get(item.id);
    byId.set(item.id, authored?.heroImage && !item.heroImage ? { ...authored, ...item, heroImage: authored.heroImage } : item);
  });
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

const SELECT_COLUMNS = `
  id, mythology_id, world_id, slug, name, name_en, summary, canonical_design_json,
  hero_src, hero_alt, hero_width, hero_height
`;

export function mapSceneRow(row: SceneRow): Scene {
  const heroSrc = optionalString(row.hero_src);
  return {
    id: String(row.id),
    mythologyId: String(row.mythology_id),
    worldId: optionalString(row.world_id),
    slug: String(row.slug),
    name: String(row.name),
    nameEn: String(row.name_en),
    summary: String(row.summary),
    canonicalDesign: parseJson(row.canonical_design_json, { anchors: [] }),
    heroImage: heroSrc
      ? {
          src: heroSrc,
          alt: String(row.hero_alt ?? ''),
          width: optionalNumber(row.hero_width) ?? 1600,
          height: optionalNumber(row.hero_height) ?? 900,
        }
      : undefined,
  };
}

export async function getScenes(db: D1Database | undefined, query: EntityListQuery = {}): Promise<Scene[]> {
  if (!db) return mergeStructuredScenes([]);
  return withD1ReadFallback(async () => {
    const where = query.published === 'all' ? '' : " WHERE publish_status = 'published'";
    const rows = await db.prepare(`SELECT ${SELECT_COLUMNS} FROM scenes${where} ORDER BY name`).all();
    return mergeStructuredScenes(rows.results.map(mapSceneRow));
  }, () => mergeStructuredScenes([]));
}

export async function getSceneBySlug(db: D1Database | undefined, slug: string): Promise<Scene | undefined> {
  if (!db) return mergeStructuredScenes([]).find((item) => item.slug === slug);
  return withD1ReadFallback(async () => {
    const row = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM scenes WHERE slug = ? AND publish_status = 'published'`)
      .bind(slug)
      .first();
    return row ? mergeStructuredScenes([mapSceneRow(row)]).find((item) => item.slug === slug) : mergeStructuredScenes([]).find((item) => item.slug === slug);
  }, () => mergeStructuredScenes([]).find((item) => item.slug === slug));
}

export async function getSceneById(db: D1Database | undefined, id: string): Promise<Scene | undefined> {
  if (!db) return mergeStructuredScenes([]).find((item) => item.id === id);
  return withD1ReadFallback(async () => {
    const row = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM scenes WHERE id = ? AND publish_status = 'published'`)
      .bind(id)
      .first();
    return row ? mergeStructuredScenes([mapSceneRow(row)]).find((item) => item.id === id) : mergeStructuredScenes([]).find((item) => item.id === id);
  }, () => mergeStructuredScenes([]).find((item) => item.id === id));
}

export async function getScenesForMythology(
  db: D1Database | undefined,
  mythologyId: string,
  query: EntityListQuery = {},
): Promise<Scene[]> {
  if (!db) return mergeStructuredScenes([], mythologyId).filter((item) => item.mythologyId === mythologyId);
  return withD1ReadFallback(async () => {
    const rows = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM scenes WHERE mythology_id = ? AND publish_status = 'published' ORDER BY name`)
      .bind(mythologyId)
      .all();
    return mergeStructuredScenes(rows.results.map(mapSceneRow), mythologyId).filter((item) => item.mythologyId === mythologyId);
  }, () => mergeStructuredScenes([], mythologyId).filter((item) => item.mythologyId === mythologyId));
}

export async function getScenesForWorld(
  db: D1Database | undefined,
  worldId: string,
  query: EntityListQuery = {},
): Promise<Scene[]> {
  if (!db) return mergeStructuredScenes([]).filter((item) => item.worldId === worldId);
  return withD1ReadFallback(async () => {
    const rows = await db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM scenes WHERE world_id = ? AND publish_status = 'published' ORDER BY name`)
      .bind(worldId)
      .all();
    return mergeStructuredScenes(rows.results.map(mapSceneRow)).filter((item) => item.worldId === worldId);
  }, () => mergeStructuredScenes([]).filter((item) => item.worldId === worldId));
}
