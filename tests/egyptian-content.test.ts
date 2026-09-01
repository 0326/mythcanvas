import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import {
  egyptianCharacters,
  egyptianP0RequiredRelationIds,
  egyptianRelations,
  egyptianScenes,
  egyptianTaxonomy,
  egyptianVisualTiers,
  egyptianWorlds,
} from '../src/content/egyptian';
import { egyptianStories } from '../src/content/egyptian/stories';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';
import { storyIllustrations } from '../src/data/story-illustrations';

describe('Egyptian structured content', () => {
  const mythology = mythologies.find((item) => item.id === 'myth-egyptian')!;
  const bundle = getStructuredMythologyBundle('myth-egyptian')!;

  it('publishes the reviewed 28-unit story manifest with dependency closure', () => {
    expect(egyptianStories).toHaveLength(28);
    expect(egyptianStories.every((story) => story.publishStatus === 'published')).toBe(true);
    expect(validateStructuredContent({ bundle, mythology, illustrations: storyIllustrations })).toEqual([]);
  });

  it('preserves legacy Egyptian ids and separates the shared world layers', () => {
    expect(egyptianCharacters.map((item) => item.id)).toEqual(expect.arrayContaining(['character-anubis', 'character-ra', 'character-osiris', 'character-horus']));
    expect(egyptianStories.map((item) => item.id)).toEqual(expect.arrayContaining(['story-ra-solar-voyage', 'story-osiris-isis', 'story-weighing-heart']));
    expect(egyptianWorlds.map((item) => item.id)).toEqual(['world-duat', 'world-celestial-sky']);
    expect(egyptianScenes.map((item) => item.id)).toEqual(expect.arrayContaining(['scene-gates-of-duat', 'scene-hall-of-two-truths', 'scene-field-of-reeds']));
  });

  it('keeps all relation assertions canonical and source-locatable', () => {
    expect(egyptianRelations.length).toBe(egyptianP0RequiredRelationIds.length);
    expect(new Set(egyptianRelations.map((relation) => relation.assertionKey)).size).toBe(egyptianRelations.length);
    expect(egyptianRelations.every((relation) => relation.sourceRefs.every((ref) => ref.sourceId && ref.locator))).toBe(true);
    expect(egyptianRelations.some((relation) => relation.relationType === 'child')).toBe(false);
  });

  it('keeps the 18-character visual priority pool separate from content completeness', () => {
    const characters = new Set(egyptianCharacters.map((character) => character.slug));
    expect(egyptianVisualTiers.S).toHaveLength(18);
    const seen = new Set<string>();
    for (const tier of Object.values(egyptianVisualTiers)) {
      for (const slug of tier) {
        expect(characters.has(slug)).toBe(true);
        expect(seen.has(slug)).toBe(false);
        seen.add(slug);
      }
    }
    expect(egyptianCharacters.every((character) => character.canonicalDesign.originalDesignChoices?.length)).toBe(true);
  });
});
