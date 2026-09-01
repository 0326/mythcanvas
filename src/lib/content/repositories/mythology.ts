import { mythologies as seedMythologies } from '../../../data/mythologies';
import type { Mythology } from '../types';
import { optionalNumber, optionalString, pageClause, parseJson } from './shared';
import type { EntityListQuery } from './types';

type MythologyRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  id, slug, name, name_en, tagline, summary, display_order, visual_dna_json,
  hero_src, hero_alt, hero_width, hero_height,
  home_hero_light_src, home_hero_dark_src, home_hero_focal_x, home_hero_focal_y
`;

export function mapMythologyRow(row: MythologyRow): Mythology {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    nameEn: String(row.name_en),
    tagline: optionalString(row.tagline) ?? '',
    summary: String(row.summary),
    displayOrder: optionalNumber(row.display_order) ?? 999,
    visualDna: parseJson(row.visual_dna_json, { palette: [], motifs: [], materials: [], atmosphere: [] }),
    heroImage: {
      src: optionalString(row.hero_src) ?? '/art/mythology-placeholder.svg',
      alt: optionalString(row.hero_alt) ?? '',
      width: optionalNumber(row.hero_width) ?? 1600,
      height: optionalNumber(row.hero_height) ?? 900,
    },
    homeHero: {
      lightSrc: optionalString(row.home_hero_light_src),
      darkSrc: optionalString(row.home_hero_dark_src),
      focalPoint: {
        x: optionalNumber(row.home_hero_focal_x) ?? 0.5,
        y: optionalNumber(row.home_hero_focal_y) ?? 0.5,
      },
    },
  };
}

export async function getMythologies(db: D1Database | undefined, query: EntityListQuery = {}): Promise<Mythology[]> {
  if (!db) {
    const { limit, offset } = pageClause(query);
    return seedMythologies.slice(offset, offset + limit);
  }
  const where = query.published === 'all' ? '' : " WHERE publish_status = 'published'";
  const rows = await db.prepare(`SELECT ${SELECT_COLUMNS} FROM mythologies${where} ORDER BY display_order, name`).all();
  const stored = rows.results.map(mapMythologyRow);
  const storedIds = new Set(stored.map((item) => item.id));
  const merged = [...stored, ...seedMythologies.filter((item) => !storedIds.has(item.id))]
    .toSorted((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999) || a.name.localeCompare(b.name, 'zh-CN'));
  const { limit, offset } = pageClause(query);
  return merged.slice(offset, offset + limit);
}

export async function getMythologyBySlug(db: D1Database | undefined, slug: string): Promise<Mythology | undefined> {
  if (!db) return seedMythologies.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM mythologies WHERE slug = ? AND publish_status = 'published'`)
    .bind(slug)
    .first();
  return row ? mapMythologyRow(row) : seedMythologies.find((item) => item.slug === slug);
}

export async function getMythologyById(db: D1Database | undefined, id: string): Promise<Mythology | undefined> {
  if (!db) return seedMythologies.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM mythologies WHERE id = ? AND publish_status = 'published'`)
    .bind(id)
    .first();
  return row ? mapMythologyRow(row) : seedMythologies.find((item) => item.id === id);
}
