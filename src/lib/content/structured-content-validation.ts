import type { Character, CharacterInterpretation, CharacterName, CharacterRelation, ContentClaim, Mythology, Scene, TaxonomyTerm, World } from './types';
import type { StructuredMythologyBundle } from '../../content/registry';
import { validateMythStories, type StoryValidationIssue } from './story-validation';
import { SUPPORTED_RELATION_TYPES } from './relation-semantics';

export type StructuredContentIssue = StoryValidationIssue & {
  category: 'entity' | 'relation' | 'taxonomy' | 'story';
};

type Input = {
  bundle: StructuredMythologyBundle;
  mythology: Mythology;
  illustrations?: Parameters<typeof validateMythStories>[0]['illustrations'];
};

const duplicateValues = (values: readonly string[]) => {
  const seen = new Set<string>();
  return values.filter((value) => seen.has(value) || !seen.add(value));
};

const hasLocator = (source: { locator?: string; section?: string }) => Boolean(source.locator || source.section);

/** Stable Character types are shared across civilizations; taxonomy carries
 * culture-specific lineage, domain and editorial distinctions. */
export const SUPPORTED_CHARACTER_TYPES = new Set(['deity', 'hero', 'mortal', 'monster', 'creature', 'collective']);

export function validateStructuredContent({ bundle, mythology, illustrations = [] }: Input): StructuredContentIssue[] {
  const issues: StructuredContentIssue[] = [];
  const { characters, worlds, scenes, stories, relations, taxonomy = [], concepts = [], claims = [], names = [], interpretations = [] } = bundle;
  const characterIds = new Set(characters.map((item) => item.id));
  const conceptIds = new Set(concepts.map((item) => item.id));
  const worldIds = new Set(worlds.map((item) => item.id));
  const sceneIds = new Set(scenes.map((item) => item.id));
  const taxonomySlugs = new Set(taxonomy.map((item) => item.slug));
  const interpretationIds = new Set(interpretations.map((item) => item.id));

  if (bundle.mythologyId !== mythology.id) issues.push({ category: 'entity', field: 'bundle.mythologyId', message: 'Bundle mythologyId must match the registered Mythology.' });
  for (const id of duplicateValues(characters.map((item) => item.id))) issues.push({ category: 'entity', field: 'character.id', message: `Duplicate Character id: ${id}` });
  for (const slug of duplicateValues(characters.map((item) => item.slug))) issues.push({ category: 'entity', field: 'character.slug', message: `Duplicate Character slug: ${slug}` });
  for (const slug of duplicateValues(worlds.map((item) => item.slug))) issues.push({ category: 'entity', field: 'world.slug', message: `Duplicate World slug: ${slug}` });
  for (const slug of duplicateValues(scenes.map((item) => item.slug))) issues.push({ category: 'entity', field: 'scene.slug', message: `Duplicate Scene slug: ${slug}` });

  const validateCharacter = (item: Character) => {
    if (item.mythologyId !== mythology.id) issues.push({ category: 'entity', field: 'character.mythologyId', message: `${item.id} belongs to another Mythology.` });
    if (!item.characterType || !item.summary || !item.sourceRefs?.length || !item.canonicalDesign.anchors.length || !item.canonicalDesign.originalDesignChoices?.length) {
      issues.push({ category: 'entity', field: 'character.production', message: `${item.id} is missing character type, summary, source or Canonical Design.` });
    }
    if (item.characterType && !SUPPORTED_CHARACTER_TYPES.has(item.characterType)) {
      issues.push({ category: 'entity', field: 'character.characterType', message: `${item.id} uses non-generic stable Character type ${item.characterType}; use taxonomy for civilization-specific classification.` });
    }
    item.worldIds.forEach((worldId) => {
      if (!worldIds.has(worldId)) issues.push({ category: 'entity', field: 'character.worldIds', message: `${item.id} references unknown World ${worldId}.` });
    });
  };
  characters.forEach(validateCharacter);
  names.forEach((item: CharacterName) => {
    if (!characterIds.has(item.characterId) || (item.interpretationId && !interpretationIds.has(item.interpretationId))) issues.push({ category: 'entity', field: 'characterName.endpoint', message: `${item.id} references an unknown Character or Interpretation.` });
    if (!item.sourceRefs.length || item.sourceRefs.some((ref) => !hasLocator(ref))) issues.push({ category: 'entity', field: 'characterName.source', message: `${item.id} needs a source locator or section.` });
  });
  interpretations.forEach((item: CharacterInterpretation) => {
    if (!characterIds.has(item.characterId) || !item.sourceRefs.length || !item.identityAnchors.length) issues.push({ category: 'entity', field: 'interpretation.production', message: `${item.id} is missing Character, source or identity anchors.` });
  });
  claims.forEach((claim: ContentClaim) => {
    if (!claim.id || !claim.summary || !claim.sourceRefs.length || claim.sourceRefs.some((ref) => !hasLocator(ref))) issues.push({ category: 'entity', field: 'claim.source', message: `${claim.id} needs a summary and located source.` });
  });
  worlds.forEach((item: World) => {
    if (item.mythologyId !== mythology.id || !item.summary || !item.canonicalDesign.anchors.length) issues.push({ category: 'entity', field: 'world.production', message: `${item.id} is missing World identity data.` });
    if (/(palace|temple|shrine|hall)$/i.test(item.slug)) issues.push({ category: 'entity', field: 'world.sceneSemantics', message: `${item.id} looks like a building or landmark; model it as a Scene or create a spatial World above it.` });
  });
  scenes.forEach((item: Scene) => {
    if (item.worldId && !worldIds.has(item.worldId)) issues.push({ category: 'entity', field: 'scene.worldId', message: `${item.id} references unknown World ${item.worldId}.` });
  });
  concepts.forEach((item) => {
    if (item.mythologyId !== mythology.id || !item.name || !item.summary || item.sourceRefs.length === 0) {
      issues.push({ category: 'entity', field: 'concept.production', message: `${item.id} is missing Mythology, summary or source data.` });
    }
  });

  taxonomy.forEach((item: TaxonomyTerm) => {
    if (item.mythologyId !== mythology.id || !item.name || !item.summary || !item.kind) issues.push({ category: 'taxonomy', field: 'taxonomy', message: `${item.id} has an invalid taxonomy contract.` });
  });
  characters.forEach((item) => item.traditionTags?.forEach((tag) => {
    if (!taxonomySlugs.has(tag)) issues.push({ category: 'taxonomy', field: 'character.traditionTags', message: `${item.id} references unregistered taxonomy ${tag}.` });
  }));

  const assertions = new Set<string>();
  relations.forEach((relation: CharacterRelation) => {
    if (!characterIds.has(relation.fromCharacterId) || (relation.toCharacterId && !characterIds.has(relation.toCharacterId)) || (relation.toConceptId && !conceptIds.has(relation.toConceptId))) {
      issues.push({ category: 'relation', field: 'relation.endpoint', message: `${relation.id} has an invalid Character endpoint.` });
    }
    if (Boolean(relation.toCharacterId) === Boolean(relation.toConceptId)) issues.push({ category: 'relation', field: 'relation.endpoint', message: `${relation.id} must have exactly one target endpoint.` });
    if (relation.relationType === 'child') issues.push({ category: 'relation', field: 'relation.direction', message: `${relation.id} uses child; store genealogy as parent → child.` });
    if (!SUPPORTED_RELATION_TYPES.has(relation.relationType)) issues.push({ category: 'relation', field: 'relation.type', message: `${relation.id} uses unsupported relation type ${relation.relationType}; add it to the D1 migration and relation semantics contract first.` });
    if (!relation.toCharacterId && !relation.toConceptId) issues.push({ category: 'relation', field: 'relation.endpoint', message: `${relation.id} needs a Character or ContentConcept endpoint.` });
    if (!relation.sourceRefs.length || relation.sourceRefs.some((ref) => !hasLocator(ref))) issues.push({ category: 'relation', field: 'relation.source', message: `${relation.id} needs a source locator or section.` });
    if (relation.isDefault === false && !relation.traditionScope) issues.push({ category: 'relation', field: 'relation.traditionScope', message: `${relation.id} is an alternate assertion and must declare a selectable tradition scope.` });
    const assertionKey = relation.assertionKey ?? [relation.fromCharacterId, relation.toCharacterId ?? relation.toConceptId ?? '', relation.relationType].join('|');
    const key = [assertionKey, relation.traditionScope ?? ''].join('|');
    if (assertions.has(key)) issues.push({ category: 'relation', field: 'relation.duplicate', message: `${relation.id} duplicates a canonical assertion.` });
    assertions.add(key);
  });

  validateMythStories({ stories, mythologies: [mythology], characters, worlds, scenes, illustrations }).forEach((issue) => issues.push({ ...issue, category: 'story' }));
  return issues;
}

export function assertValidStructuredContent(input: Input): void {
  const issues = validateStructuredContent(input);
  if (issues.length) throw new Error(`Structured content validation failed:\n${issues.map((issue) => `${issue.category} ${issue.field}: ${issue.message}`).join('\n')}`);
}
