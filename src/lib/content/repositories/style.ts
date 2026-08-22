import { styles as seedStyles } from '../../../data/seed';
import type { Style } from '../types';
import { optionalString } from './shared';

type StyleRow = Record<string, unknown>;

const SELECT_COLUMNS = 'id, slug, name, name_en, prompt_hint';

export function mapStyleRow(row: StyleRow): Style {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    nameEn: String(row.name_en),
    promptHint: optionalString(row.prompt_hint),
  };
}

export async function getStyles(db: D1Database | undefined): Promise<Style[]> {
  if (!db) return seedStyles;
  const rows = await db.prepare(`SELECT ${SELECT_COLUMNS} FROM styles ORDER BY name`).all();
  return rows.results.map(mapStyleRow);
}

export async function getStyleBySlug(db: D1Database | undefined, slug: string): Promise<Style | undefined> {
  if (!db) return seedStyles.find((item) => item.slug === slug);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM styles WHERE slug = ?`)
    .bind(slug)
    .first();
  return row ? mapStyleRow(row) : undefined;
}

export async function getStyleById(db: D1Database | undefined, id: string): Promise<Style | undefined> {
  if (!db) return seedStyles.find((item) => item.id === id);
  const row = await db
    .prepare(`SELECT ${SELECT_COLUMNS} FROM styles WHERE id = ?`)
    .bind(id)
    .first();
  return row ? mapStyleRow(row) : undefined;
}
