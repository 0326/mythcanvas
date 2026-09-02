import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { mesopotamianCharacters, mesopotamianConcepts, mesopotamianRelations, mesopotamianScenes, mesopotamianStories, mesopotamianTaxonomy, mesopotamianWorlds } from '../src/content/mesopotamian';
import { mesopotamianClaims, mesopotamianInterpretations, mesopotamianNames } from '../src/content/mesopotamian/identities';
import { mesopotamianSources } from '../src/content/mesopotamian/sources';
import { SUPPORTED_RELATION_TYPES } from '../src/lib/content/relation-semantics';
import { searchAll } from '../src/lib/content/search';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';

describe('Mesopotamian P0 structured content', () => {
  const bundle = getStructuredMythologyBundle('myth-mesopotamian')!;
  const mythology = mythologies.find((item) => item.id === 'myth-mesopotamian')!;
  const ids = new Set(mesopotamianCharacters.map((item) => item.id));

  it('registers a multi-tradition narrative closure', () => {
    expect(bundle).toBeDefined();
    expect(mesopotamianStories.length).toBeGreaterThanOrEqual(20);
    expect(mesopotamianStories.map((story) => story.slug)).toEqual(expect.arrayContaining([
      'inannas-descent', 'atrahasis-population-and-flood', 'utnapishtim-flood-account',
      'enuma-elish-apsu-tiamat', 'ashur-assyrian-state-theology',
    ]));
    expect(new Set(mesopotamianStories.map((story) => story.tradition)).size).toBeGreaterThanOrEqual(5);
    expect(mesopotamianWorlds.map((world) => world.id)).toEqual(expect.arrayContaining(['world-mesopotamian-netherworld', 'world-abzu']));
    expect(mesopotamianScenes.length).toBeGreaterThanOrEqual(20);
    expect(mesopotamianTaxonomy.map((term) => term.slug)).toEqual(expect.arrayContaining(['sumerian-foundations', 'babylonian-theology', 'assyrian-bridge']));
  });

  it('passes the generic source, identity, dependency and graph contract', () => {
    expect(validateStructuredContent({ bundle, mythology })).toEqual([]);
    expect(Object.keys(mesopotamianSources).length).toBeGreaterThanOrEqual(15);
    expect(mesopotamianNames.length).toBeGreaterThanOrEqual(25);
    expect(mesopotamianInterpretations.length).toBeGreaterThanOrEqual(5);
    expect(mesopotamianConcepts.length).toBeGreaterThanOrEqual(4);
    expect(mesopotamianClaims.length).toBeGreaterThanOrEqual(8);
    expect(mesopotamianRelations.every((relation) => SUPPORTED_RELATION_TYPES.has(relation.relationType))).toBe(true);
    expect(mesopotamianRelations.every((relation) => relation.sourceRefs.every((ref) => ref.sourceId && (ref.locator || ref.section)))).toBe(true);
  });

  it('keeps high-risk identities and comparison layers separate', () => {
    expect(ids.has('character-inanna-ishtar')).toBe(true);
    expect(ids.has('character-enki-ea')).toBe(true);
    expect(ids.has('character-utu-shamash')).toBe(true);
    expect(ids.has('character-nanna-sin')).toBe(true);
    expect(ids.has('character-ishkur-adad')).toBe(true);
    expect(ids.has('character-dumuzi-tammuz')).toBe(true);
    expect(ids.has('character-ziusudra')).toBe(true);
    expect(ids.has('character-atrahasis')).toBe(true);
    expect(ids.has('character-utnapishtim')).toBe(true);
    expect(ids.has('character-apsu-enuma-elish')).toBe(true);
    expect(ids.has('character-tiamat')).toBe(true);
    expect(mesopotamianWorlds.some((world) => world.id === 'world-abzu')).toBe(true);
    expect(mesopotamianRelations.some((relation) => relation.relationType === 'literary-correspondence')).toBe(false);
    expect(mesopotamianClaims.some((claim) => claim.summary.includes('不固定“七位 Anunnaki”'))).toBe(true);
    expect(mesopotamianClaims.some((claim) => claim.summary.includes('Adapa = Adam'))).toBe(true);
    expect(mesopotamianClaims.some((claim) => claim.summary.includes('Ashur 与 Marduk 保持分离'))).toBe(true);
  });

  it('resolves core bilingual aliases from the static public catalog', async () => {
    const aliases = [
      ['Ea', 'character-enki-ea'],
      ['埃阿', 'character-enki-ea'],
      ['Ištar', 'character-inanna-ishtar'],
      ['伊什塔尔', 'character-inanna-ishtar'],
      ['Šamaš', 'character-utu-shamash'],
      ['沙玛什', 'character-utu-shamash'],
    ] as const;

    for (const [query, expectedId] of aliases) {
      const results = await searchAll(undefined, query);
      expect(results.some((result) => result.type === 'character' && result.id === expectedId), query).toBe(true);
    }
  });
});
