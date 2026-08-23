import type { CharacterVariantProfile, OutputSpecProfile } from './config-repository';
import { getOutputSpecProfile } from './config-repository';

export async function listCharacterVariantProfiles(
  db: D1Database | undefined,
  characterIds: string[],
): Promise<CharacterVariantProfile[]> {
  if (!db || characterIds.length === 0) return [];

  const placeholders = characterIds.map(() => '?').join(',');
  try {
    const rows = await db.prepare(`
      SELECT id, character_id, name, variant_type, description,
             identity_overrides_json, prompt_fragment, reference_pack_json
      FROM character_variants
      WHERE status = 'active' AND character_id IN (${placeholders})
      ORDER BY character_id,
        CASE variant_type
          WHEN 'age' THEN 1
          WHEN 'costume' THEN 2
          WHEN 'form' THEN 3
          ELSE 4
        END,
        created_at ASC
    `).bind(...characterIds).all<Record<string, unknown>>();

    return rows.results.map((row) => ({
      id: String(row.id),
      characterId: String(row.character_id),
      name: String(row.name),
      variantType: String(row.variant_type) as CharacterVariantProfile['variantType'],
      description: String(row.description ?? ''),
      identityOverrides: stringArray(row.identity_overrides_json),
      promptFragment: String(row.prompt_fragment ?? ''),
      referenceAssetIds: stringArray(row.reference_pack_json),
    }));
  } catch {
    // The Creator must remain usable while D1 migrations roll out.
    return [];
  }
}

export async function listCreatorOutputSpecs(db: D1Database | undefined): Promise<OutputSpecProfile[]> {
  return Promise.all([
    getOutputSpecProfile(db, 'mobile-wallpaper', '9:16'),
    getOutputSpecProfile(db, 'desktop-wallpaper', '16:9'),
  ]);
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== 'string' || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
