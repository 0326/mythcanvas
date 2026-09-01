import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { japaneseCharacters, japaneseRelations, japaneseScenes, japaneseStories, japaneseTaxonomy, japaneseWorlds } from '../src/content/japanese';
import { getCharacterBySlug, getCharactersForMythology } from '../src/lib/content/repositories/character';
import { getStoryForMythology, getStoriesForMythology } from '../src/lib/content/stories';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';
import { storyIllustrations } from '../src/data/story-illustrations';

describe('Japanese P0 structured content', () => {
  const bundle = getStructuredMythologyBundle('myth-japanese')!;
  const mythology = mythologies.find((item) => item.id === 'myth-japanese')!;

  it('closes the narrative spine without making entity counts the KPI', () => {
    expect(japaneseStories.length).toBeGreaterThanOrEqual(20);
    expect(japaneseStories.map((item) => item.id)).toEqual(expect.arrayContaining([
      'story-izanagi-izanami', 'story-amaterasu-cave', 'story-kaguya-return',
    ]));
    expect(japaneseCharacters.map((item) => item.slug)).toEqual(expect.arrayContaining(['izanagi', 'izanami', 'amaterasu', 'susanoo', 'okuninushi', 'ninigi', 'kaguya']));
    expect(japaneseWorlds.map((item) => item.slug)).toEqual(expect.arrayContaining(['takamagahara', 'ashihara-no-nakatsukuni', 'yomi', 'ne-no-katasukuni', 'watatsumi-realm']));
  });

  it('validates source-scoped relations, common types and World/Scene semantics', () => {
    expect(validateStructuredContent({ bundle, mythology, illustrations: storyIllustrations })).toEqual([]);
    expect(japaneseRelations.some((item) => item.isDefault === false && item.traditionScope?.includes('Nihon Shoki'))).toBe(true);
    expect(japaneseTaxonomy.some((item) => item.slug === 'classical-tale')).toBe(true);
    expect(japaneseScenes.some((item) => item.slug === 'watatsumi-palace' && item.worldId === 'world-watatsumi-realm')).toBe(true);
    expect(japaneseCharacters.find((item) => item.slug === 'kaguya')?.worldIds).toEqual([]);
    expect(japaneseCharacters.find((item) => item.slug === 'kaguya')?.canonicality).toBe('literary');
  });

  it('serves migrated Japanese content from the static fallback', async () => {
    expect(getStoryForMythology('myth-japanese', 'kaguya-return')?.kind).toBe('literary-fantasy');
    expect(getStoriesForMythology('myth-japanese')).toHaveLength(japaneseStories.length);
    expect((await getCharacterBySlug(undefined, 'kaguya'))?.worldIds).toEqual([]);
    expect((await getCharactersForMythology(undefined, 'myth-japanese')).length).toBe(japaneseCharacters.length);
  });
});
