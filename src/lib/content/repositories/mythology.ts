import { mythologies as seedMythologies } from '../../../data/seed';
import type { Mythology } from '../types';
import { optionalNumber, optionalString, pageClause, parseJson } from './shared';
import type { EntityListQuery } from './types';

type MythologyRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  id, slug, name, name_en, summary, visual_dna_json,
  hero_src, hero_alt, hero_width, hero_height
`;

export function mapMythologyRow(row: MythologyRow): Mythology {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    nameEn: String(row.name_en),
    summary: String(row.summary),
    visualDna: parseJson(row.visual_dna_json, { palette: [], motifs: [], materials: [], atmosphere: [] }),
    heroImage: {
      src: String(row.hero_src ?? '/media/content/chinese-celestial.svg'),
      alt: String(row.hero_alt ?? ''),
      width: optionalNumber(row.hero_width) ?? 1600,
      height: optionalNumber(row.hero_height) ?? 900,
    },
  };
}

export async function getMythologies(db: D1Database | undefined, query: EntityListQuery = {}): Promise<Mythology[]> {
  if (!db) {
    const { limit, offset } = pageClause(query);
    return seedMythologies.slice(offset, offset + limit);
  }
  const where = query.published === 'all' ? '' : " WHERE publish_status = 'published'";
  const rows = await db.prepare(`SELECT ${SELECT_COLUMNS} FROM mythologies${where} ORDER BY name`).all();
  return rows.results.map(mapMythologyRow);
}

export async function getMythologyBySlug(db: D1Database | undefined, slug: string): Promise<Mythology | undefined> {
  if (!db) return seedMythologies.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM mythologies WHERE slug = ? AND publish_status = 'published'`)
    .bind(slug)
    .first();
  return row ? mapMythologyRow(row) : undefined;
}

export async function getMythologyById(db: D1Database | undefined, id: string): Promise<Mythology | undefined> {
  if (!db) return seedMythologies.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM mythologies WHERE id = ? AND publish_status = 'published'`)
    .bind(id)
    .first();
  return row ? mapMythologyRow(row) : undefined;
}
