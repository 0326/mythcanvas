import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { norseCharacters, norseRelations, norseStories } from '../src/content/norse';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';

describe('Norse structured content', () => {
  const bundle = getStructuredMythologyBundle('myth-norse')!;

  it('keeps launch ids and legacy stories stable while closing the P0 story graph', () => {
    expect(norseCharacters.map((item) => item.slug)).toEqual(expect.arrayContaining(['odin', 'thor', 'loki', 'freyja', 'hel', 'fenrir', 'jormungandr']));
    expect(norseStories.length).toBeGreaterThanOrEqual(32);
    expect(norseStories.map((item) => item.id)).toEqual(expect.arrayContaining(['story-ymir-creation', 'story-odin-world-tree', 'story-ragnarok']));
    expect(norseRelations.length).toBeGreaterThan(30);
  });

  it('has no unresolved dependencies or unscoped relation duplicates', () => {
    const mythology = mythologies.find((item) => item.id === 'myth-norse')!;
    expect(validateStructuredContent({ bundle, mythology })).toEqual([]);
  });
});
