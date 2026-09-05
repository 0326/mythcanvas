import { DEFAULT_LOCALE, type Locale } from '../../i18n/config';
import type { Character, Mythology, World } from '../types';
import { mapCharacterRow, getCharacterById, getCharacterBySlug, getCharacters } from './character';
import { mapMythologyRow, getMythologies, getMythologyById, getMythologyBySlug } from './mythology';
import { mapWorldRow, getWorldById, getWorldBySlug, getWorlds } from './world';
import { pageClause, parseStringArray, withD1ReadFallback } from './shared';
import type { EntityListQuery } from './types';

type Row = Record<string, unknown>;

function localizedMythology(row: Row): Mythology {
  return mapMythologyRow({
    ...row,
    name: row.localized_name,
    tagline: row.localized_tagline,
    summary: row.localized_summary,
    hero_alt: row.localized_hero_alt ?? row.hero_alt,
  });
}

function localizedWorld(row: Row): World {
  return mapWorldRow({
    ...row,
    name: row.localized_name,
    summary: row.localized_summary,
    hero_alt: row.localized_hero_alt ?? row.hero_alt,
  });
}

function localizedCharacter(row: Row): Character {
  return mapCharacterRow(
    {
      ...row,
      name: row.localized_name,
      role: row.localized_role,
      summary: row.localized_summary,
      portrait_alt: row.localized_portrait_alt ?? row.portrait_alt,
    },
    parseStringArray(row.world_ids_json),
  );
}

const MYTHOLOGY_SELECT = `
  m.id, m.slug, m.name, m.name_en, m.tagline, m.summary, m.display_order, m.visual_dna_json,
  m.hero_src, m.hero_alt, m.hero_width, m.hero_height,
  m.home_hero_light_src, m.home_hero_dark_src, m.home_hero_focal_x, m.home_hero_focal_y,
  t.name AS localized_name, t.tagline AS localized_tagline, t.summary AS localized_summary,
  t.hero_alt AS localized_hero_alt
`;

const WORLD_SELECT = `
  w.id, w.mythology_id, w.slug, w.name, w.name_en, w.summary, w.canonical_design_json,
  w.hero_src, w.hero_alt, w.hero_width, w.hero_height,
  t.name AS localized_name, t.summary AS localized_summary, t.hero_alt AS localized_hero_alt
`;

const CHARACTER_SELECT = `
  c.id, c.mythology_id, c.slug, c.name, c.name_en, c.role, c.click_count, c.summary,
  c.symbols_json, c.canonical_design_json, c.portrait_src, c.portrait_alt,
  c.portrait_width, c.portrait_height, c.character_type, c.tradition_tags_json,
  c.source_periods_json, c.source_refs_json, c.editorial_collections_json, c.canonicality,
  t.name AS localized_name, t.role AS localized_role, t.summary AS localized_summary,
  t.portrait_alt AS localized_portrait_alt,
  (SELECT json_group_array(cw.world_id) FROM character_worlds cw WHERE cw.character_id = c.id) AS world_ids_json
`;

/**
 * Public localized reads are strict: a non-default locale never falls back to
 * Chinese reader-facing prose. Only explicitly published translation rows are returned.
 */
export async function getLocalizedMythologies(
  db: D1Database | undefined,
  locale: Locale,
  query: EntityListQuery = {},
): Promise<Mythology[]> {
  if (locale === DEFAULT_LOCALE) return getMythologies(db, query);
  if (!db) return [];
  const { limit, offset } = pageClause(query);
  return withD1ReadFallback(async () => {
    const rows = await db.prepare(`
      SELECT ${MYTHOLOGY_SELECT}
      FROM mythologies m
      JOIN mythology_translations t ON t.mythology_id = m.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE m.publish_status = 'published'
      ORDER BY m.display_order, t.name COLLATE NOCASE
      LIMIT ? OFFSET ?
    `).bind(locale, limit, offset).all();
    return rows.results.map((row) => localizedMythology(row as Row));
  }, () => []);
}

export async function getLocalizedMythologyBySlug(
  db: D1Database | undefined,
  slug: string,
  locale: Locale,
): Promise<Mythology | undefined> {
  if (locale === DEFAULT_LOCALE) return getMythologyBySlug(db, slug);
  if (!db) return undefined;
  return withD1ReadFallback(async () => {
    const row = await db.prepare(`
      SELECT ${MYTHOLOGY_SELECT}
      FROM mythologies m
      JOIN mythology_translations t ON t.mythology_id = m.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE m.slug = ? AND m.publish_status = 'published'
    `).bind(locale, slug).first();
    return row ? localizedMythology(row as Row) : undefined;
  }, () => undefined);
}

export async function getLocalizedMythologyById(
  db: D1Database | undefined,
  id: string,
  locale: Locale,
): Promise<Mythology | undefined> {
  if (locale === DEFAULT_LOCALE) return getMythologyById(db, id);
  if (!db) return undefined;
  return withD1ReadFallback(async () => {
    const row = await db.prepare(`
      SELECT ${MYTHOLOGY_SELECT}
      FROM mythologies m
      JOIN mythology_translations t ON t.mythology_id = m.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE m.id = ? AND m.publish_status = 'published'
    `).bind(locale, id).first();
    return row ? localizedMythology(row as Row) : undefined;
  }, () => undefined);
}

export async function getLocalizedWorlds(
  db: D1Database | undefined,
  locale: Locale,
  query: EntityListQuery = {},
): Promise<World[]> {
  if (locale === DEFAULT_LOCALE) return getWorlds(db, query);
  if (!db) return [];
  const { limit, offset } = pageClause(query);
  return withD1ReadFallback(async () => {
    const rows = await db.prepare(`
      SELECT ${WORLD_SELECT}
      FROM worlds w
      JOIN world_translations t ON t.world_id = w.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE w.publish_status = 'published'
      ORDER BY t.name COLLATE NOCASE
      LIMIT ? OFFSET ?
    `).bind(locale, limit, offset).all();
    return rows.results.map((row) => localizedWorld(row as Row));
  }, () => []);
}

export async function getLocalizedWorldBySlug(
  db: D1Database | undefined,
  slug: string,
  locale: Locale,
): Promise<World | undefined> {
  if (locale === DEFAULT_LOCALE) return getWorldBySlug(db, slug);
  if (!db) return undefined;
  return withD1ReadFallback(async () => {
    const row = await db.prepare(`
      SELECT ${WORLD_SELECT}
      FROM worlds w
      JOIN world_translations t ON t.world_id = w.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE w.slug = ? AND w.publish_status = 'published'
    `).bind(locale, slug).first();
    return row ? localizedWorld(row as Row) : undefined;
  }, () => undefined);
}

export async function getLocalizedWorldById(
  db: D1Database | undefined,
  id: string,
  locale: Locale,
): Promise<World | undefined> {
  if (locale === DEFAULT_LOCALE) return getWorldById(db, id);
  if (!db) return undefined;
  return withD1ReadFallback(async () => {
    const row = await db.prepare(`
      SELECT ${WORLD_SELECT}
      FROM worlds w
      JOIN world_translations t ON t.world_id = w.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE w.id = ? AND w.publish_status = 'published'
    `).bind(locale, id).first();
    return row ? localizedWorld(row as Row) : undefined;
  }, () => undefined);
}

export async function getLocalizedCharacters(
  db: D1Database | undefined,
  locale: Locale,
  query: EntityListQuery = {},
): Promise<Character[]> {
  if (locale === DEFAULT_LOCALE) return getCharacters(db, query);
  if (!db) return [];
  const { limit, offset } = pageClause(query);
  return withD1ReadFallback(async () => {
    const rows = await db.prepare(`
      SELECT ${CHARACTER_SELECT}
      FROM characters c
      JOIN character_translations t ON t.character_id = c.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE c.publish_status = 'published'
      ORDER BY c.click_count DESC, t.name COLLATE NOCASE, c.id
      LIMIT ? OFFSET ?
    `).bind(locale, limit, offset).all();
    return rows.results.map((row) => localizedCharacter(row as Row));
  }, () => []);
}

export async function getLocalizedCharacterBySlug(
  db: D1Database | undefined,
  slug: string,
  locale: Locale,
): Promise<Character | undefined> {
  if (locale === DEFAULT_LOCALE) return getCharacterBySlug(db, slug);
  if (!db) return undefined;
  return withD1ReadFallback(async () => {
    const row = await db.prepare(`
      SELECT ${CHARACTER_SELECT}
      FROM characters c
      JOIN character_translations t ON t.character_id = c.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE c.slug = ? AND c.publish_status = 'published'
    `).bind(locale, slug).first();
    return row ? localizedCharacter(row as Row) : undefined;
  }, () => undefined);
}

export async function getLocalizedCharacterById(
  db: D1Database | undefined,
  id: string,
  locale: Locale,
): Promise<Character | undefined> {
  if (locale === DEFAULT_LOCALE) return getCharacterById(db, id);
  if (!db) return undefined;
  return withD1ReadFallback(async () => {
    const row = await db.prepare(`
      SELECT ${CHARACTER_SELECT}
      FROM characters c
      JOIN character_translations t ON t.character_id = c.id
        AND t.locale = ? AND t.translation_status = 'published'
      WHERE c.id = ? AND c.publish_status = 'published'
    `).bind(locale, id).first();
    return row ? localizedCharacter(row as Row) : undefined;
  }, () => undefined);
}
