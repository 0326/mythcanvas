import type {
  CharacterInterpretation,
  CharacterName,
  CharacterNameKind,
  SourceRef,
} from '../types';
import { optionalString, parseJson, parseStringArray, withD1ReadFallback } from './shared';
import { listStructuredMythologyBundles } from '../../../content/registry';

type CharacterInterpretationRow = Record<string, unknown>;
type CharacterNameRow = Record<string, unknown>;

const INTERPRETATION_COLUMNS = `
  id, character_id, slug, name, role, summary, tradition_tags_json, source_periods_json,
  source_refs_json, identity_anchors_json, symbols_json, canonical_design_overrides_json,
  prompt_fragment, confidence
`;

export function mapCharacterInterpretationRow(row: CharacterInterpretationRow): CharacterInterpretation {
  return {
    id: String(row.id),
    characterId: String(row.character_id),
    slug: String(row.slug),
    name: String(row.name),
    role: String(row.role ?? ''),
    summary: String(row.summary ?? ''),
    traditionTags: parseStringArray(row.tradition_tags_json),
    sourcePeriods: parseStringArray(row.source_periods_json),
    sourceRefs: parseJson<SourceRef[]>(row.source_refs_json, []),
    identityAnchors: parseStringArray(row.identity_anchors_json),
    symbols: parseStringArray(row.symbols_json),
    canonicalDesignOverrides: parseJson<Record<string, unknown>>(row.canonical_design_overrides_json, {}),
    promptFragment: String(row.prompt_fragment ?? ''),
    confidence: String(row.confidence) as CharacterInterpretation['confidence'],
  };
}

export async function getCharacterInterpretationById(
  db: D1Database | undefined,
  interpretationId: string,
  characterId?: string,
): Promise<CharacterInterpretation | undefined> {
  const staticItem = listStructuredMythologyBundles()
    .flatMap((bundle) => bundle.interpretations ?? [])
    .find((item) => item.id === interpretationId && (!characterId || item.characterId === characterId));
  if (!db) return staticItem;
  const where = characterId
    ? 'id = ? AND character_id = ? AND status = \'active\''
    : 'id = ? AND status = \'active\'';
  const bindings = characterId ? [interpretationId, characterId] : [interpretationId];
  return withD1ReadFallback(async () => {
    const row = await db.prepare(`
      SELECT ${INTERPRETATION_COLUMNS}
      FROM character_interpretations
      WHERE ${where}
    `).bind(...bindings).first<CharacterInterpretationRow>();
    return row ? mapCharacterInterpretationRow(row) : staticItem;
  }, () => staticItem);
}

export async function getCharacterInterpretations(
  db: D1Database | undefined,
  characterId: string,
): Promise<CharacterInterpretation[]> {
  const staticItems = listStructuredMythologyBundles().flatMap((bundle) => bundle.interpretations ?? []).filter((item) => item.characterId === characterId);
  if (!db) return staticItems;
  return withD1ReadFallback(async () => {
    const rows = await db.prepare(`
      SELECT ${INTERPRETATION_COLUMNS}
      FROM character_interpretations
      WHERE character_id = ? AND status = 'active'
      ORDER BY created_at, id
    `).bind(characterId).all<CharacterInterpretationRow>();
    const byId = new Map(staticItems.map((item) => [item.id, item]));
    rows.results.map(mapCharacterInterpretationRow).forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
  }, () => staticItems);
}

export function mapCharacterNameRow(row: CharacterNameRow): CharacterName {
  return {
    id: String(row.id),
    characterId: String(row.character_id),
    interpretationId: optionalString(row.interpretation_id),
    name: String(row.name),
    nameEn: optionalString(row.name_en),
    nameKind: String(row.name_kind) as CharacterNameKind,
    isPrimaryForScope: Number(row.is_primary_for_scope) === 1,
    sourceRefs: parseJson<SourceRef[]>(row.source_refs_json, []),
    confidence: String(row.confidence) as CharacterName['confidence'],
  };
}

export async function getCharacterNames(
  db: D1Database | undefined,
  characterId: string,
): Promise<CharacterName[]> {
  const staticItems = listStructuredMythologyBundles().flatMap((bundle) => bundle.names ?? []).filter((item) => item.characterId === characterId);
  if (!db) return staticItems;
  return withD1ReadFallback(async () => {
    const rows = await db.prepare(`
      SELECT id, character_id, interpretation_id, name, name_en, name_kind,
             is_primary_for_scope, source_refs_json, confidence
      FROM character_names
      WHERE character_id = ? AND status = 'active'
      ORDER BY interpretation_id IS NOT NULL, is_primary_for_scope DESC, created_at, id
    `).bind(characterId).all<CharacterNameRow>();
    const byId = new Map(staticItems.map((item) => [item.id, item]));
    rows.results.map(mapCharacterNameRow).forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
  }, () => staticItems);
}
