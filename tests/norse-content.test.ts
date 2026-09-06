import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { getStructuredMythologyBundle } from '../src/content/registry';
import { norseCharacters, norseKnownIssues, norseMythicObjects, norseRelations, norseSourceCoverage, norseSources, norseStories, norseStoryCycles, norseStoryManifest, norseVariantNotes } from '../src/content/norse';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';
import { getStoryRedirectForMythology } from '../src/lib/content/stories';

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

  it('keeps the Phase 0 factual corrections and legacy URL compatibility explicit', () => {
    const stolenHammer = norseStories.find((item) => item.id === 'story-thryms-stolen-hammer')!;
    const baldrFuneral = norseStories.find((item) => item.id === 'story-baldrs-funeral')!;
    expect(stolenHammer.characterIds).toContain('character-thrymr');
    expect(stolenHammer.requiredObjectIds).toContain('object-norse-mjolnir');
    expect(baldrFuneral.requiredObjectIds).toContain('object-norse-hringhorni');
    expect(baldrFuneral.requiredObjectIds).not.toContain('object-norse-naglfar');
    expect(norseRelations.some((relation) => relation.id === 'norse-enemy-thor-fenrir')).toBe(false);
    expect(getStoryRedirectForMythology('myth-norse', 'freyja-and-gerdr')?.slug).toBe('freyr-and-gerdr');
    expect(norseCharacters.filter((item) => ['ymir', 'surtr', 'gerdr'].includes(item.slug)).every((item) => item.characterType === 'mythic-being')).toBe(true);
  });

  it('keeps the Phase 2 research baseline source-complete and auditable', () => {
    expect(norseSources).toHaveLength(45);
    expect(norseSourceCoverage).toHaveLength(norseSources.length);
    expect(norseSourceCoverage.filter((item) => item.priority === 'P0').every((item) => item.status !== 'unreviewed')).toBe(true);
    expect(norseStoryManifest).toHaveLength(74);
    expect(norseStoryCycles).toHaveLength(9);
    expect(norseMythicObjects).toHaveLength(16);
    expect(norseKnownIssues.filter((item) => item.priority === 'P0').every((item) => item.status === 'resolved')).toBe(true);
    expect(norseVariantNotes.filter((item) => item.priority === 'P0').every((item) => item.status === 'scoped')).toBe(true);
    expect(norseSources.filter((item) => ['norse-src-voluspa', 'norse-src-prose-edda-gylfaginning', 'norse-src-haustlong', 'norse-src-volsunga-saga'].includes(item.sourceId)).every((item) => item.edition && item.licenseNote)).toBe(true);
  });
});
