import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { aztecAssetProvenance, aztecCharacters, aztecClaims, aztecRelations, aztecStories, aztecVisualTiers, aztecWorlds } from '../src/content/aztec';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';
import { buildCharacterGraph } from '../src/lib/content/character-graph';
import { getPublicCharacterBySlug, getPublicMythologyById, getPublicStoriesForMythology, publicCatalog } from '../src/lib/content/public-catalog';
import { searchAll } from '../src/lib/content/search';

const bundle = getStructuredMythologyBundle('myth-aztec')!;
const mythology = mythologies.find((item) => item.id === 'myth-aztec')!;
const legacy12 = ['quetzalcoatl', 'huitzilopochtli', 'tezcatlipoca', 'tlaloc', 'coatlicue', 'xipe-totec', 'mictlantecuhtli', 'mictecacihuatl', 'tonatiuh', 'coyolxauhqui', 'xiuhtecuhtli', 'xochipilli'];

describe('Aztec P0 structured content', () => {
  it('registers and validates the complete source-aware bundle', () => {
    expect(bundle).toBeDefined();
    expect(validateStructuredContent({ bundle, mythology })).toEqual([]);
    expect(aztecStories.length).toBeGreaterThanOrEqual(14);
    expect(aztecStories.every((story) => story.publishStatus === 'published' && story.tradition && story.requiredSourceIds?.length)).toBe(true);
    expect(aztecStories.every((story) => story.sources.every((source) => source.sourceId && source.locator))).toBe(true);
    expect(new Set(bundle.sources?.map((source) => source.sourceId)).size).toBe(bundle.sources?.length);
    const sourceIds = new Set(bundle.sources?.map((source) => source.sourceId));
    const refs = [
      ...aztecCharacters.flatMap((item) => item.sourceRefs ?? []),
      ...aztecRelations.flatMap((item) => item.sourceRefs),
      ...aztecClaims.flatMap((item) => item.sourceRefs),
      ...(bundle.names ?? []).flatMap((item) => item.sourceRefs),
      ...(bundle.interpretations ?? []).flatMap((item) => item.sourceRefs),
      ...aztecStories.flatMap((item) => item.sources),
      ...aztecStories.flatMap((item) => item.claims ?? []).flatMap((item) => item.sourceRefs),
    ];
    expect(refs.every((ref) => ref.sourceId && sourceIds.has(ref.sourceId))).toBe(true);
  });

  it('preserves the legacy twelve IDs and keeps additions dependency-driven', () => {
    expect(aztecCharacters.map((character) => character.slug)).toEqual(expect.arrayContaining(legacy12));
    expect(new Set(aztecCharacters.map((character) => character.id)).size).toBe(aztecCharacters.length);
    expect(new Set(aztecCharacters.map((character) => character.slug)).size).toBe(aztecCharacters.length);
    expect(aztecCharacters.every((character) => character.canonicalDesign.anchors.length > 0 && character.canonicalDesign.originalDesignChoices?.length && character.sourceRefs?.length)).toBe(true);
    expect(aztecWorlds.map((world) => world.id)).toEqual(expect.arrayContaining(['world-mictlan', 'world-tlalocan', 'world-coatepec', 'world-tenochtitlan']));
  });

  it('keeps identity claims, aliases and alternate relations source-scoped', () => {
    expect(aztecClaims.some((claim) => claim.id.includes('topiltzin') && claim.status === 'contested')).toBe(true);
    expect(aztecClaims.some((claim) => claim.id.includes('nanahuatzin') && claim.status === 'contested')).toBe(true);
    expect(aztecClaims.some((claim) => claim.id.includes('coyolxauhqui') && claim.status === 'contested')).toBe(true);
    expect(aztecRelations.some((relation) => relation.isDefault === false && relation.traditionScope)).toBe(true);
    expect(aztecRelations.some((relation) => relation.relationType === 'child')).toBe(false);
    expect(new Set(aztecRelations.map((relation) => `${relation.assertionKey}|${relation.traditionScope}`)).size).toBe(aztecRelations.length);
  });

  it('makes alternate graph scope reachable and serves static public consumers without D1', async () => {
    const characters = bundle.characters;
    const graph = buildCharacterGraph({ focusId: 'character-nanahuatzin', mythologyId: 'myth-aztec', characters, concepts: bundle.concepts, relations: bundle.relations });
    expect(graph.availableScopes).toContain('Central Mexican Nahua tradition');
    const alternate = buildCharacterGraph({ focusId: 'character-nanahuatzin', mythologyId: 'myth-aztec', characters, concepts: bundle.concepts, relations: bundle.relations, scope: 'Central Mexican Nahua tradition' });
    expect(alternate.links.some((link) => link.relationType === 'transformed-into')).toBe(true);
    expect(getPublicMythologyById('myth-aztec')?.slug).toBe('aztec');
    expect(getPublicCharacterBySlug('quetzalcoatl')?.mythologyId).toBe('myth-aztec');
    expect(getPublicStoriesForMythology('myth-aztec').length).toBe(aztecStories.length);
    expect(publicCatalog.contentClaims.some((claim) => claim.id === 'claim-aztec-quetzalcoatl-topiltzin-boundary')).toBe(true);
    expect((await searchAll(undefined, '魁札尔科亚特尔')).some((item) => item.slug === 'quetzalcoatl')).toBe(true);
  });

  it('keeps visual priority separate from content and carries contamination guardrails', () => {
    const allTierSlugs = Object.values(aztecVisualTiers).flat();
    expect(new Set(allTierSlugs).size).toBe(allTierSlugs.length);
    expect(allTierSlugs.every((slug) => aztecCharacters.some((character) => character.slug === slug))).toBe(true);
    for (const slug of ['quetzalcoatl', 'tlaloc', 'mictecacihuatl', 'xipe-totec']) {
      const character = aztecCharacters.find((item) => item.slug === slug)!;
      const avoid = character.canonicalDesign.avoid?.join(' ') ?? '';
      expect(avoid).toMatch(/Maya|Catrina|gore|generic tribal/i);
    }
    expect(aztecAssetProvenance.every((asset) => asset.assetPath && asset.generator && asset.promptRecipeId && asset.reviewStatus === 'approved')).toBe(true);
  });
});
