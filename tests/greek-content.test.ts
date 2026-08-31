import { describe, expect, it } from 'vitest';
import { greekCharacters, greekP0RequiredRelationIds, greekRelations, greekScenes, greekTaxonomy, greekWorlds } from '../src/content/greek/catalog';
import { greekStories } from '../src/content/greek/stories';
import { greekAssetProvenance } from '../src/content/greek/assets';
import { mythologies } from '../src/data/mythologies';
import { storyIllustrations } from '../src/data/story-illustrations';
import { validateGreekContent } from '../src/lib/content/greek-content-validation';
import { greekVisualTiers } from '../src/content/greek/visual-tiers';

describe('Greek P0 content graph', () => {
  it('closes all required Story dependencies with sourced, typed entities', () => {
    const mythology = mythologies.find((item) => item.id === 'myth-greek');
    expect(mythology).toBeDefined();
    expect(greekStories).toHaveLength(35);
    expect(greekCharacters.length).toBeGreaterThanOrEqual(60);
    expect(validateGreekContent({ mythology: mythology!, characters: greekCharacters, worlds: greekWorlds, scenes: greekScenes, stories: greekStories, relations: greekRelations, requiredRelationIds: greekP0RequiredRelationIds, taxonomy: greekTaxonomy, illustrations: storyIllustrations, assetProvenance: greekAssetProvenance })).toEqual([]);
  });

  it('keeps the explicit P0 genealogy and story-relation closure', () => {
    expect(greekRelations.length).toBe(greekP0RequiredRelationIds.length);
    expect(new Set(greekRelations.map((relation) => relation.id))).toEqual(new Set(greekP0RequiredRelationIds));
  });

  it('keeps visual production tiers explicit and non-overlapping', () => {
    const characterSlugs = new Set(greekCharacters.map((character) => character.slug));
    const seen = new Set<string>();
    for (const [tier, slugs] of Object.entries(greekVisualTiers)) {
      expect(slugs.length, `${tier} tier should not be empty`).toBeGreaterThan(0);
      for (const slug of slugs) {
        expect(characterSlugs.has(slug), `${tier} references unknown Character ${slug}`).toBe(true);
        expect(seen.has(slug), `${slug} appears in multiple visual tiers`).toBe(false);
        seen.add(slug);
      }
    }
  });

  it('gives every Tier B character enough identity data for a symbol fallback', () => {
    const charactersBySlug = new Map(greekCharacters.map((character) => [character.slug, character]));
    for (const slug of greekVisualTiers.B) {
      const character = charactersBySlug.get(slug);
      expect(character?.symbols.length, `${slug} needs at least one canonical symbol`).toBeGreaterThan(0);
      expect(character?.canonicalDesign.anchors.length, `${slug} needs canonical anchors`).toBeGreaterThan(0);
    }
  });

  it('keeps public Story illustrations free of prototype provenance', () => {
    for (const asset of storyIllustrations) {
      expect(asset.provenance.sourceType).not.toBe('prototype');
      expect(asset.provenance.creator, `${asset.id} needs a provenance creator`).toBeTruthy();
      expect(asset.provenance.licenseName, `${asset.id} needs a provenance license`).toBeTruthy();
      expect(asset.image.alt, `${asset.id} needs alt text`).toBeTruthy();
      expect(asset.image.width).toBeGreaterThan(0);
      expect(asset.image.height).toBeGreaterThan(0);
    }
  });
});
