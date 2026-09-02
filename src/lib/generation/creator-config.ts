import type { CharacterInterpretationProfile, CharacterVariantProfile, OutputSpecProfile } from './config-repository';
import { getOutputSpecProfile, listCharacterInterpretationProfiles } from './config-repository';
import { getPublicCharacterInterpretations, getPublicCharacterVariants } from '../content/public-catalog';

export { listCharacterInterpretationProfiles };
export type { CharacterInterpretationProfile };

/** Published Creator identity options come from the static content catalog. */
export function listPublicCharacterVariantProfiles(characterIds: string[]): CharacterVariantProfile[] {
  const wanted = new Set(characterIds);
  return getPublicCharacterVariants('').filter((variant) => wanted.has(variant.characterId)).map((variant) => ({
    id: variant.id,
    characterId: variant.characterId,
    slug: variant.slug,
    interpretationId: variant.interpretationId,
    name: variant.name,
    variantType: variant.variantType,
    description: variant.description,
    identityOverrides: [...variant.identityOverrides],
    promptFragment: '',
    referenceAssetIds: [...variant.referencePack],
  }));
}

export function listPublicCharacterInterpretationProfiles(characterIds: string[]): CharacterInterpretationProfile[] {
  const wanted = new Set(characterIds);
  return getPublicCharacterInterpretations('').filter((interpretation) => wanted.has(interpretation.characterId)).map((interpretation) => ({
    id: interpretation.id,
    characterId: interpretation.characterId,
    slug: interpretation.slug,
    name: interpretation.name,
    role: interpretation.role,
    summary: interpretation.summary,
    traditionTags: [...interpretation.traditionTags],
    sourcePeriods: [...interpretation.sourcePeriods],
    sourceRefs: [...interpretation.sourceRefs],
    identityAnchors: [...interpretation.identityAnchors],
    symbols: [...interpretation.symbols],
    canonicalDesignOverrides: interpretation.canonicalDesignOverrides,
    promptFragment: interpretation.promptFragment,
    confidence: interpretation.confidence,
  }));
}

export async function listCharacterVariantProfiles(
  db: D1Database | undefined,
  characterIds: string[],
  includeInterpretationSpecific = false,
): Promise<CharacterVariantProfile[]> {
  if (!db || characterIds.length === 0) return [];

  const placeholders = characterIds.map(() => '?').join(',');
  try {
    const rows = await db.prepare(`
      SELECT id, character_id, slug, name, variant_type, description,
             identity_overrides_json, prompt_fragment, reference_pack_json, character_interpretation_id
      FROM character_variants
      WHERE status = 'active' AND character_id IN (${placeholders})
        ${includeInterpretationSpecific ? '' : 'AND character_interpretation_id IS NULL'}
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
      slug: String(row.slug),
      interpretationId: row.character_interpretation_id == null ? undefined : String(row.character_interpretation_id),
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
