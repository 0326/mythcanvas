import { characters as seedCharacters } from '../../../data/seed';
import type { Character, SourceRef } from '../types';
import { optionalNumber, optionalString, pageClause, parseJson, parseStringArray } from './shared';
import type { EntityListQuery } from './types';

type CharacterRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  id, mythology_id, slug, name, name_en, role, summary, symbols_json, canonical_design_json,
  portrait_src, portrait_alt, portrait_width, portrait_height, character_type, tradition_tags_json,
  source_periods_json, source_refs_json, editorial_collections_json, canonicality
`;

export function mapCharacterRow(row: CharacterRow, worldIds: readonly string[] = []): Character {
  return {
    id: String(row.id),
    mythologyId: String(row.mythology_id),
    worldIds,
    slug: String(row.slug),
    name: String(row.name),
    nameEn: String(row.name_en),
    role: String(row.role),
    summary: String(row.summary),
    symbols: parseStringArray(row.symbols_json),
    canonicalDesign: parseJson(row.canonical_design_json, { anchors: [] }),
    characterType: optionalString(row.character_type),
    traditionTags: parseStringArray(row.tradition_tags_json),
    sourcePeriods: parseStringArray(row.source_periods_json),
    sourceRefs: parseJson<SourceRef[]>(row.source_refs_json, []),
    editorialCollections: parseStringArray(row.editorial_collections_json),
    canonicality: optionalString(row.canonicality) as Character['canonicality'],
    portrait: row.portrait_src
      ? {
          src: String(row.portrait_src),
          alt: String(row.portrait_alt ?? ''),
          width: optionalNumber(row.portrait_width) ?? 864,
          height: optionalNumber(row.portrait_height) ?? 1152,
        }
      : undefined,
  };
}

/** 批量加载 character_worlds，返回 characterId -> worldIds 映射 */
async function loadWorldIds(db: D1Database, characterIds: readonly string[]): Promise<Map<string, string[]>> {
  if (characterIds.length === 0) return new Map();
  const placeholders = characterIds.map(() => '?').join(',');
  const rows = await db
    .prepare(`SELECT character_id, world_id FROM character_worlds WHERE character_id IN (${placeholders})`)
    .bind(...characterIds)
    .all();
  const map = new Map<string, string[]>();
  for (const row of rows.results) {
    const characterId = String(row.character_id);
    const list = map.get(characterId) ?? [];
    list.push(String(row.world_id));
    map.set(characterId, list);
  }
  return map;
}

export async function getCharacters(db: D1Database | undefined, query: EntityListQuery = {}): Promise<Character[]> {
  if (!db) {
    const { limit, offset } = pageClause(query);
    return seedCharacters.slice(offset, offset + limit);
  }
  const where = query.published === 'all' ? '' : " WHERE publish_status = 'published'";
  const rows = await db.prepare(`SELECT ${SELECT_COLUMNS} FROM characters${where} ORDER BY name`).all();
  const worldMap = await loadWorldIds(db, rows.results.map((row) => String(row.id)));
  return rows.results.map((row) => mapCharacterRow(row, worldMap.get(String(row.id)) ?? []));
}

export async function getCharacterBySlug(db: D1Database | undefined, slug: string): Promise<Character | undefined> {
  if (!db) return seedCharacters.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM characters WHERE slug = ? AND publish_status = 'published'`)
    .bind(slug)
    .first();
  if (!row) return undefined;
  const worldMap = await loadWorldIds(db, [String(row.id)]);
  return mapCharacterRow(row, worldMap.get(String(row.id)) ?? []);
}

export async function getCharacterById(db: D1Database | undefined, id: string): Promise<Character | undefined> {
  if (!db) return seedCharacters.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM characters WHERE id = ? AND publish_status = 'published'`)
    .bind(id)
    .first();
  if (!row) return undefined;
  const worldMap = await loadWorldIds(db, [String(row.id)]);
  return mapCharacterRow(row, worldMap.get(String(row.id)) ?? []);
}

export async function getCharactersForMythology(
  db: D1Database | undefined,
  mythologyId: string,
  query: EntityListQuery = {},
): Promise<Character[]> {
  if (!db) return seedCharacters.filter((item) => item.mythologyId === mythologyId);
  const { limit, offset } = pageClause(query);
  const rows = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM characters WHERE mythology_id = ? AND publish_status = 'published' ORDER BY name LIMIT ? OFFSET ?`)
    .bind(mythologyId, limit, offset)
    .all();
  const worldMap = await loadWorldIds(db, rows.results.map((row) => String(row.id)));
  return rows.results.map((row) => mapCharacterRow(row, worldMap.get(String(row.id)) ?? []));
}

export async function getCharactersForWorld(
  db: D1Database | undefined,
  worldId: string,
  query: EntityListQuery = {},
): Promise<Character[]> {
  if (!db) return seedCharacters.filter((item) => item.worldIds.includes(worldId));
  const { limit, offset } = pageClause(query);
  const rows = await db
    .prepare(`
      SELECT c.id, c.mythology_id, c.slug, c.name, c.name_en, c.role, c.summary,
             c.symbols_json, c.canonical_design_json, c.portrait_src, c.portrait_alt,
             c.portrait_width, c.portrait_height, c.character_type, c.tradition_tags_json,
             c.source_periods_json, c.source_refs_json, c.editorial_collections_json, c.canonicality
      FROM characters c
      JOIN character_worlds cr ON cr.character_id = c.id
      WHERE cr.world_id = ? AND c.publish_status = 'published'
      ORDER BY c.name LIMIT ? OFFSET ?
    `)
    .bind(worldId, limit, offset)
    .all();
  const worldMap = await loadWorldIds(db, rows.results.map((row) => String(row.id)));
  return rows.results.map((row) => mapCharacterRow(row, worldMap.get(String(row.id)) ?? []));
}
