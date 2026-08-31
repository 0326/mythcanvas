import type { Character, CharacterRelation, MythStory, Mythology, Scene, StoryIllustrationAsset, TaxonomyTerm, World } from './types';
import { validateMythStories, type StoryValidationIssue } from './story-validation';
import type { GreekAssetProvenance } from '../../content/greek/assets';

export type GreekContentValidationInput = {
  mythology: Mythology;
  characters: readonly Character[];
  worlds: readonly World[];
  scenes: readonly Scene[];
  stories: readonly MythStory[];
  relations: readonly CharacterRelation[];
  requiredRelationIds?: readonly string[];
  taxonomy: readonly TaxonomyTerm[];
  illustrations: readonly StoryIllustrationAsset[];
  assetProvenance?: readonly GreekAssetProvenance[];
};

export type GreekContentValidationIssue = StoryValidationIssue & { category: 'entity' | 'relation' | 'taxonomy' | 'story' };

const duplicates = (values: readonly string[]) => values.filter((value, index) => values.indexOf(value) !== index);

/** Validates the P0 contract before Greek source files are released or synchronized to D1. */
export function validateGreekContent(input: GreekContentValidationInput): GreekContentValidationIssue[] {
  const issues: GreekContentValidationIssue[] = [];
  const { mythology, characters, worlds, scenes, stories, relations, taxonomy, illustrations, assetProvenance = [], requiredRelationIds = [] } = input;
  const characterIds = new Set(characters.map((item) => item.id));
  const worldIds = new Set(worlds.map((item) => item.id));
  const sceneIds = new Set(scenes.map((item) => item.id));
  const taxonomySlugs = new Set(taxonomy.map((item) => item.slug));

  for (const id of duplicates([...characterIds])) issues.push({ category: 'entity', field: 'character.id', message: `Duplicate Character: ${id}` });
  for (const slug of duplicates(characters.map((item) => item.slug))) issues.push({ category: 'entity', field: 'character.slug', message: `Duplicate Character slug: ${slug}` });
  for (const slug of duplicates(worlds.map((item) => item.slug))) issues.push({ category: 'entity', field: 'world.slug', message: `Duplicate World slug: ${slug}` });
  for (const slug of duplicates(scenes.map((item) => item.slug))) issues.push({ category: 'entity', field: 'scene.slug', message: `Duplicate Scene slug: ${slug}` });

  characters.forEach((item) => {
    if (!item.characterType || !item.sourceRefs?.length || !item.canonicalDesign.anchors.length || !item.canonicalDesign.originalDesignChoices?.length) {
      issues.push({ category: 'entity', field: 'character.production', message: `${item.id} is missing a P0 identity, source or Canonical Design requirement.` });
    }
  });
  scenes.forEach((item) => {
    if (item.worldId && !worldIds.has(item.worldId)) issues.push({ category: 'entity', field: 'scene.worldId', message: `${item.id} has unknown World ${item.worldId}.` });
  });
  const worldAssetOwners = new Set(assetProvenance.filter((asset) => asset.ownerType === 'world' && asset.reviewStatus === 'approved').map((asset) => `${asset.ownerId}|${asset.assetPath}`));
  worlds.forEach((item) => {
    if (!worldAssetOwners.has(`${item.id}|${item.heroImage.src}`)) {
      issues.push({ category: 'entity', field: 'world.heroProvenance', message: `${item.id} needs approved hero asset provenance.` });
    }
    if (item.heroImage.width <= item.heroImage.height) {
      issues.push({ category: 'entity', field: 'world.heroImage', message: `${item.id} desktop hero must be landscape.` });
    }
    if (!item.heroImageMobile) {
      issues.push({ category: 'entity', field: 'world.heroImageMobile', message: `${item.id} needs an independent mobile hero asset.` });
    } else {
      if (item.heroImageMobile.width >= item.heroImageMobile.height) {
        issues.push({ category: 'entity', field: 'world.heroImageMobile', message: `${item.id} mobile hero must be portrait.` });
      }
      if (!worldAssetOwners.has(`${item.id}|${item.heroImageMobile.src}`)) {
        issues.push({ category: 'entity', field: 'world.heroMobileProvenance', message: `${item.id} needs approved mobile hero asset provenance.` });
      }
    }
  });
  taxonomy.forEach((item) => {
    if (item.mythologyId !== mythology.id || !item.summary || !item.kind) issues.push({ category: 'taxonomy', field: 'taxonomy', message: `${item.id} has an invalid taxonomy contract.` });
  });
  characters.forEach((item) => item.traditionTags?.forEach((tag) => {
    if (['primordial', 'titan', 'olympian', 'chthonic', 'sea-deity', 'hero-age', 'perseus-cycle', 'heracles-cycle', 'theseus-cycle', 'argonaut', 'theban-cycle', 'trojan', 'odyssey'].includes(tag) && !taxonomySlugs.has(tag)) {
      issues.push({ category: 'taxonomy', field: 'character.traditionTags', message: `${item.id} references unregistered taxonomy ${tag}.` });
    }
  }));

  const assertions = new Set<string>();
  relations.forEach((relation) => {
    if (!characterIds.has(relation.fromCharacterId) || (relation.toCharacterId && !characterIds.has(relation.toCharacterId))) {
      issues.push({ category: 'relation', field: 'relation.endpoint', message: `${relation.id} has an invalid Character endpoint.` });
    }
    if (relation.relationType === 'child') issues.push({ category: 'relation', field: 'relation.direction', message: `${relation.id} uses child; store genealogy as parent → child.` });
    if (!relation.sourceRefs.length || relation.sourceRefs.some((source) => !source.locator && !source.section)) {
      issues.push({ category: 'relation', field: 'relation.source', message: `${relation.id} needs source locators.` });
    }
    const key = [relation.fromCharacterId, relation.toCharacterId ?? relation.toConceptId ?? '', relation.relationType, relation.traditionScope ?? ''].join('|');
    if (assertions.has(key)) issues.push({ category: 'relation', field: 'relation.duplicate', message: `${relation.id} duplicates a canonical assertion.` });
    assertions.add(key);
  });
  const relationIds = new Set(relations.map((relation) => relation.id));
  for (const id of requiredRelationIds) if (!relationIds.has(id)) {
    issues.push({ category: 'relation', field: 'relation.p0Closure', message: `Missing required P0 relation ${id}.` });
  }

  validateMythStories({
    stories,
    mythologies: [mythology],
    characters,
    worlds,
    scenes,
    illustrations,
  }).forEach((issue) => issues.push({ ...issue, category: 'story' }));

  return issues;
}

export function assertValidGreekContent(input: GreekContentValidationInput): void {
  const issues = validateGreekContent(input);
  if (issues.length) throw new Error(`Greek content validation failed:\n${issues.map((issue) => `${issue.category} ${issue.field}: ${issue.message}`).join('\n')}`);
}
