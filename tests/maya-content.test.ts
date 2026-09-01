import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { mayaCharacters, mayaConcepts, mayaRelations, mayaScenes, mayaStories, mayaTaxonomy, mayaWorlds } from '../src/content/maya';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';

describe('Maya P0 structured content', () => {
  const bundle = getStructuredMythologyBundle('myth-maya')!;
  const mythology = mythologies.find((item) => item.id === 'myth-maya')!;

  it('registers a sourced narrative closure across K’iche’, Classic and Codex lanes', () => {
    expect(mayaStories.length).toBeGreaterThanOrEqual(12);
    expect(mayaStories.filter((story) => typeof story.tradition === 'string' && story.tradition.includes('Popol Vuh')).length).toBeGreaterThanOrEqual(10);
    expect(mayaStories.some((story) => story.tradition === 'Classic Lowland Maya')).toBe(true);
    expect(mayaStories.some((story) => story.tradition === 'Postclassic Maya codical tradition')).toBe(true);
    expect(mayaCharacters.map((item) => item.slug)).toEqual(expect.arrayContaining(['hunahpu', 'xbalanque', 'xquic', 'chaak', 'maize-god', 'kawiil']));
    expect(mayaWorlds.map((item) => item.slug)).toEqual(expect.arrayContaining(['xibalba', 'kiche-highlands', 'classic-lowlands']));
  });

  it('keeps identity boundaries, relation endpoints and source coverage valid', () => {
    expect(validateStructuredContent({ bundle, mythology })).toEqual([]);
    expect(mayaRelations.some((relation) => relation.confidence === 'contested')).toBe(true);
    expect(mayaConcepts.length).toBeGreaterThanOrEqual(3);
    expect(mayaScenes.length).toBeGreaterThanOrEqual(10);
    expect(mayaTaxonomy.some((item) => item.slug === 'kiche-popol-vuh')).toBe(true);
  });
});
