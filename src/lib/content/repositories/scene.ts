import { scenes as seedScenes } from '../../../data/seed';
import type { Scene } from '../types';
import { optionalNumber, optionalString, parseJson } from './shared';
import type { EntityListQuery } from './types';

type SceneRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  id, mythology_id, realm_id, slug, name, name_en, summary, canonical_design_json,
  hero_src, hero_alt, hero_width, hero_height
`;

export function mapSceneRow(row: SceneRow): Scene {
  const heroSrc = optionalString(row.hero_src);
  return {
    id: String(row.id),
    mythologyId: String(row.mythology_id),
    realmId: optionalString(row.realm_id),
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
  if (!db) return seedScenes;
  const where = query.published === 'all' ? '' : " WHERE publish_status = 'published'";
  const rows = await db.prepare(`SELECT ${SELECT_COLUMNS} FROM scenes${where} ORDER BY name`).all();
  return rows.results.map(mapSceneRow);
}

export async function getSceneBySlug(db: D1Database | undefined, slug: string): Promise<Scene | undefined> {
  if (!db) return seedScenes.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM scenes WHERE slug = ? AND publish_status = 'published'`)
    .bind(slug)
    .first();
  return row ? mapSceneRow(row) : undefined;
}

export async function getSceneById(db: D1Database | undefined, id: string): Promise<Scene | undefined> {
  if (!db) return seedScenes.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM scenes WHERE id = ? AND publish_status = 'published'`)
    .bind(id)
    .first();
  return row ? mapSceneRow(row) : undefined;
}

export async function getScenesForMythology(
  db: D1Database | undefined,
  mythologyId: string,
  query: EntityListQuery = {},
): Promise<Scene[]> {
  if (!db) return seedScenes.filter((item) => item.mythologyId === mythologyId);
  const rows = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM scenes WHERE mythology_id = ? AND publish_status = 'published' ORDER BY name`)
    .bind(mythologyId)
    .all();
  return rows.results.map(mapSceneRow);
}

export async function getScenesForRealm(
  db: D1Database | undefined,
  realmId: string,
  query: EntityListQuery = {},
): Promise<Scene[]> {
  if (!db) return seedScenes.filter((item) => item.realmId === realmId);
  const rows = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM scenes WHERE realm_id = ? AND publish_status = 'published' ORDER BY name`)
    .bind(realmId)
    .all();
  return rows.results.map(mapSceneRow);
}
