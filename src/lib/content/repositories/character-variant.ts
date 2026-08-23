import { characterVariants as seedCharacterVariants } from '../../../data/seed';
import type { CharacterVariant, CharacterVariantType } from '../types';
import { parseJson, parseStringArray } from './shared';

type CharacterVariantRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  id, character_id, slug, name, variant_type, description, traits_json,
  identity_overrides_json, reference_pack_json
`;

export function mapCharacterVariantRow(row: CharacterVariantRow): CharacterVariant {
  return {
    id: String(row.id),
    characterId: String(row.character_id),
    slug: String(row.slug),
    name: String(row.name),
    variantType: String(row.variant_type) as CharacterVariantType,
    description: String(row.description ?? ''),
    traits: parseJson<Record<string, unknown>>(row.traits_json, {}),
    identityOverrides: parseStringArray(row.identity_overrides_json),
    referencePack: parseStringArray(row.reference_pack_json),
  };
}

export async function getCharacterVariants(
  db: D1Database | undefined,
  characterId: string,
): Promise<CharacterVariant[]> {
  if (!db) return seedCharacterVariants.filter((variant) => variant.characterId === characterId);
  const rows = await db
    .prepare(
      `SELECT ${SELECT_COLUMNS} FROM character_variants WHERE character_id = ? AND status = 'active' ORDER BY created_at, id`,
    )
    .bind(characterId)
    .all();
  return rows.results.map(mapCharacterVariantRow);
}

export async function getCharacterVariantBySlug(
  db: D1Database | undefined,
  characterId: string,
  slug: string,
): Promise<CharacterVariant | undefined> {
  if (!db) return seedCharacterVariants.find((variant) => variant.characterId === characterId && variant.slug === slug);
  const row = await db
    .prepare(
      `SELECT ${SELECT_COLUMNS} FROM character_variants WHERE character_id = ? AND slug = ? AND status = 'active'`,
    )
    .bind(characterId, slug)
    .first();
  return row ? mapCharacterVariantRow(row) : undefined;
}
