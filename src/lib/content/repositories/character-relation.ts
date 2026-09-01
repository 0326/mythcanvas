import type { CharacterRelation, SourceRef } from '../types';
import { getStructuredRelations } from '../../../content/registry';
import { optionalString, parseJson } from './shared';

type CharacterRelationRow = Record<string, unknown>;

const SELECT_COLUMNS = `
  relation.id, relation.from_character_id, relation.to_character_id, relation.to_concept_id,
  relation.from_interpretation_id, relation.to_interpretation_id, relation.relation_type,
  relation.assertion_key, relation.tradition_scope, relation.is_default, relation.source_refs_json, relation.confidence
`;

export function mapCharacterRelationRow(row: CharacterRelationRow): CharacterRelation {
  return {
    id: String(row.id),
    fromCharacterId: String(row.from_character_id),
    toCharacterId: optionalString(row.to_character_id),
    toConceptId: optionalString(row.to_concept_id),
    fromInterpretationId: optionalString(row.from_interpretation_id),
    toInterpretationId: optionalString(row.to_interpretation_id),
    relationType: String(row.relation_type),
    assertionKey: optionalString(row.assertion_key),
    traditionScope: optionalString(row.tradition_scope),
    isDefault: Number(row.is_default ?? 1) === 1,
    sourceRefs: parseJson<SourceRef[]>(row.source_refs_json, []),
    confidence: String(row.confidence) as CharacterRelation['confidence'],
  };
}

export async function getCharacterRelations(
  db: D1Database | undefined,
  characterId: string,
): Promise<CharacterRelation[]> {
  const staticRelations = getStructuredRelations().filter((relation) => relation.fromCharacterId === characterId || relation.toCharacterId === characterId);
  if (!db) return staticRelations;
  const rows = await db.prepare(`
    SELECT ${SELECT_COLUMNS}
    FROM character_relations AS relation
    WHERE relation.status = 'active' AND (relation.from_character_id = ? OR relation.to_character_id = ?)
    ORDER BY relation.is_default DESC, relation.relation_type, relation.id
  `).bind(characterId, characterId).all<CharacterRelationRow>();
  const dbRelations = rows.results.map(mapCharacterRelationRow);
  const byId = new Map(staticRelations.map((relation) => [relation.id, relation]));
  dbRelations.forEach((relation) => byId.set(relation.id, relation));
  return Array.from(byId.values());
}

export async function getCharacterRelationsForMythology(
  db: D1Database | undefined,
  mythologyId: string,
): Promise<CharacterRelation[]> {
  const staticRelations = [...getStructuredRelations(mythologyId)];
  if (!db) return staticRelations;
  const rows = await db.prepare(`
    SELECT ${SELECT_COLUMNS}
    FROM character_relations AS relation
    JOIN characters AS source ON source.id = relation.from_character_id
    WHERE relation.status = 'active' AND source.mythology_id = ?
    ORDER BY relation.is_default DESC, relation.relation_type, relation.id
  `).bind(mythologyId).all<CharacterRelationRow>();
  const dbRelations = rows.results.map(mapCharacterRelationRow);
  const byId = new Map(staticRelations.map((relation) => [relation.id, relation]));
  dbRelations.forEach((relation) => byId.set(relation.id, relation));
  return Array.from(byId.values());
}

export async function getDirectCharacterRelations(
  db: D1Database | undefined,
  characterId: string,
): Promise<CharacterRelation[]> {
  return getCharacterRelations(db, characterId);
}

/** Load relations touching a bounded set of nodes for Graph depth-2 expansion. */
export async function getRelationsForCharacterIds(
  db: D1Database | undefined,
  mythologyId: string,
  characterIds: readonly string[],
): Promise<CharacterRelation[]> {
  const ids = [...new Set(characterIds)].filter(Boolean);
  if (ids.length === 0) return [];
  const staticRelations = getStructuredRelations(mythologyId).filter((relation) => ids.includes(relation.fromCharacterId) || (relation.toCharacterId ? ids.includes(relation.toCharacterId) : false));
  if (!db) return staticRelations;
  const placeholders = ids.map(() => '?').join(',');
  const rows = await db.prepare(`
    SELECT ${SELECT_COLUMNS}
    FROM character_relations AS relation
    JOIN characters AS source ON source.id = relation.from_character_id
    WHERE relation.status = 'active' AND source.mythology_id = ?
      AND (relation.from_character_id IN (${placeholders}) OR relation.to_character_id IN (${placeholders}))
    ORDER BY relation.is_default DESC, relation.relation_type, relation.id
  `).bind(mythologyId, ...ids, ...ids).all<CharacterRelationRow>();
  const byId = new Map(staticRelations.map((relation) => [relation.id, relation]));
  rows.results.map(mapCharacterRelationRow).forEach((relation) => byId.set(relation.id, relation));
  return Array.from(byId.values());
}
