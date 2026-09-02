import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { celticAssetProvenance, celticCharacters, celticClaims, celticRelations, celticSources, celticStories, celticTaxonomy, celticVisualTiers, celticWorlds } from '../src/content/celtic';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { buildCharacterGraph } from '../src/lib/content/character-graph';
import { getPublicCharacterBySlug, getPublicMythologyById, getPublicStoriesForMythology, publicCatalog } from '../src/lib/content/public-catalog';
import { searchAll } from '../src/lib/content/search';
import { getPublicStoryPaths } from '../src/lib/content/stories';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';

const bundle = getStructuredMythologyBundle('myth-celtic')!;
const mythology = mythologies.find((item) => item.id === 'myth-celtic')!;
const launchCharacters = ['morrigan', 'cu-chulainn', 'lugh', 'brigid', 'dagda', 'nuada', 'fionn-mac-cumhaill', 'medb', 'manannan', 'aengus', 'cernunnos', 'epona'];

describe('Celtic P0 structured content', () => {
  it('registers five source-scoped coverage lanes and closes every Story dependency', () => {
    expect(bundle).toBeDefined();
    expect(validateStructuredContent({ bundle, mythology })).toEqual([]);
    expect(celticStories).toHaveLength(25);
    expect(celticStories.filter((story) => story.tradition === 'Irish Mythological Cycle / Tuatha Dé Danann')).toHaveLength(6);
    expect(celticStories.some((story) => story.slug === 'celtic-noinden-ulad')).toBe(true);
    expect(celticStories.filter((story) => story.tradition === 'Ulster Cycle')).toHaveLength(8);
    expect(celticStories.filter((story) => story.tradition === 'Welsh Four Branches of the Mabinogi')).toHaveLength(9);
    expect(celticStories.some((story) => story.tradition === 'Fenian Cycle')).toBe(true);
    expect(celticCharacters.map((character) => character.slug)).toEqual(expect.arrayContaining(launchCharacters));
    expect(celticWorlds.map((world) => world.id)).toContain('world-annwn');
    expect(celticStories.every((story) => story.publishStatus === 'published' && story.requiredSourceIds?.length && story.sourceNotes.length)).toBe(true);
    expect(celticStories.every((story) => story.sources.every((source) => source.sourceId && source.locator))).toBe(true);
    const characterIds = new Set(celticCharacters.map((character) => character.id));
    const worldIds = new Set(celticWorlds.map((world) => world.id));
    const sceneIds = new Set(bundle.scenes.map((scene) => scene.id));
    const sourceIds = new Set(celticSources.map((source) => source.sourceId));
    for (const story of celticStories) {
      expect(story.requiredCharacterIds?.every((id) => characterIds.has(id))).toBe(true);
      expect(story.requiredWorldIds?.every((id) => worldIds.has(id))).toBe(true);
      expect(story.requiredSceneIds?.every((id) => sceneIds.has(id))).toBe(true);
      expect(story.requiredSourceIds?.every((id) => sourceIds.has(id))).toBe(true);
      expect(story.sources.every((source) => sourceIds.has(source.sourceId!))).toBe(true);
    }
    const refs = [
      ...celticCharacters.flatMap((item) => item.sourceRefs ?? []), ...celticRelations.flatMap((item) => item.sourceRefs),
      ...celticClaims.flatMap((item) => item.sourceRefs), ...(bundle.names ?? []).flatMap((item) => item.sourceRefs),
      ...(bundle.interpretations ?? []).flatMap((item) => item.sourceRefs), ...celticStories.flatMap((item) => item.sources),
      ...celticStories.flatMap((item) => item.claims ?? []).flatMap((item) => item.sourceRefs),
    ];
    expect(refs.every((ref) => ref.sourceId && sourceIds.has(ref.sourceId))).toBe(true);
    expect(publicCatalog.sources.filter((source) => source.sourceId.startsWith('celtic-src-'))).toHaveLength(celticSources.length);
  });

  it('preserves identity boundaries and evidence-first Continental characters', () => {
    expect(new Set(celticCharacters.map((character) => character.id)).size).toBe(celticCharacters.length);
    expect(new Set(celticCharacters.map((character) => character.slug)).size).toBe(celticCharacters.length);
    expect(celticRelations.some((relation) => relation.relationType === 'child')).toBe(false);
    expect(celticRelations.some((relation) => relation.isDefault === false && relation.traditionScope)).toBe(true);
    expect(celticClaims.some((claim) => claim.id === 'claim-celtic-lugh-lugus' && claim.status === 'contested')).toBe(true);
    expect(celticClaims.some((claim) => claim.id === 'claim-celtic-macha-morrigan' && claim.status === 'contested')).toBe(true);
    expect(celticCharacters.find((character) => character.slug === 'cernunnos')?.canonicality).toBe('contested');
    expect(celticCharacters.find((character) => character.slug === 'epona')?.traditionTags).toEqual(expect.arrayContaining(['celtic-gallo-roman']));
    expect(getPublicCharacterBySlug('manannan')?.id).not.toBe(getPublicCharacterBySlug('manawydan')?.id);
    expect(celticTaxonomy.map((item) => item.kind)).not.toContain('tradition');
  });

  it('serves static mythology, graph, aliases, story routes and visual provenance', async () => {
    expect(getPublicMythologyById('myth-celtic')?.heroImage.src).toBe('/art/celtic-mist-and-torc.svg');
    expect(getPublicStoriesForMythology('myth-celtic')).toHaveLength(celticStories.length);
    expect(getPublicStoryPaths().filter((path) => path.mythologyId === 'myth-celtic')).toHaveLength(celticStories.length);
    const graph = buildCharacterGraph({ focusId: 'character-cernunnos', mythologyId: 'myth-celtic', characters: celticCharacters, concepts: bundle.concepts, relations: celticRelations, scope: 'celtic-continental-gaulish' });
    expect(graph.links.some((link) => link.target === 'concept-cernunnos-iconography')).toBe(true);
    expect(graph.links[0]?.sourceRefs[0]?.locator).toBeTruthy();
    expect((await searchAll(undefined, 'Maeve')).some((item) => item.slug === 'medb')).toBe(true);
    expect((await searchAll(undefined, 'Bendigeidfran')).some((item) => item.slug === 'brân')).toBe(true);
    const tierSlugs = Object.values(celticVisualTiers).flat();
    expect(new Set(tierSlugs).size).toBe(tierSlugs.length);
    expect(tierSlugs).toHaveLength(celticCharacters.length);
    expect(tierSlugs.every((slug) => celticCharacters.some((character) => character.slug === slug))).toBe(true);
    expect(celticAssetProvenance.every((asset) => asset.reviewStatus === 'approved' && asset.sourceType === 'original' && asset.promptRecipeId)).toBe(true);
  });
});
