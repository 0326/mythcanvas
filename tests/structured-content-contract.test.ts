import { describe, expect, it } from 'vitest';
import { mythologies } from '../src/data/mythologies';
import { listStructuredMythologyBundles } from '../src/content/registry';
import { validateStructuredContent } from '../src/lib/content/structured-content-validation';
import { storyIllustrations } from '../src/data/story-illustrations';

describe('structured mythology content contract', () => {
  it('validates every registered bundle with the same contract', () => {
    for (const bundle of listStructuredMythologyBundles()) {
      const mythology = mythologies.find((item) => item.id === bundle.mythologyId);
      expect(mythology, bundle.mythologyId).toBeDefined();
      expect(validateStructuredContent({ bundle, mythology: mythology!, illustrations: storyIllustrations }), bundle.mythologyId).toEqual([]);
    }
  });

  it('validates every published Story Series against its static dependency graph', () => {
    for (const bundle of listStructuredMythologyBundles()) {
      for (const series of bundle.series ?? []) {
        expect(series.mythologyId, series.id).toBe(bundle.mythologyId);
        expect(series.status === 'published' ? series.review : true, series.id).toBeTruthy();
        expect(new Set(series.storyRefs.map((ref) => ref.storyId)).size, series.id).toBe(series.storyRefs.length);
        expect(series.storyRefs.every((ref) => bundle.stories.some((story) => story.id === ref.storyId && story.mythologyId === bundle.mythologyId)), series.id).toBe(true);
        expect(series.storyRefs.filter((ref) => ref.role === 'core').every((ref) => bundle.stories.some((story) => story.id === ref.storyId && story.publishStatus === 'published')), series.id).toBe(true);
        expect(series.characterIds.every((id) => bundle.characters.some((character) => character.id === id)), series.id).toBe(true);
        expect(series.worldIds.every((id) => bundle.worlds.some((world) => world.id === id)), series.id).toBe(true);
        expect(series.sceneIds.every((id) => bundle.scenes.some((scene) => scene.id === id)), series.id).toBe(true);
        expect(series.sourceRefs.every((source) => Boolean(source.locator)), series.id).toBe(true);
        expect(series.traditionLanes.every((lane) => lane.sourceRefs.length > 0), series.id).toBe(true);
      }
    }
  });

  it('requires a tradition scope for contested claims', () => {
    const bundle = listStructuredMythologyBundles().find((item) => item.mythologyId === 'myth-norse')!;
    const mythology = mythologies.find((item) => item.id === bundle.mythologyId)!;
    const story = bundle.stories[0];
    const invalidBundle = {
      ...bundle,
      claims: [{
        id: 'claim-missing-tradition-scope',
        subjectType: 'story' as const,
        subjectId: story.id,
        claimType: 'interpretation' as const,
        summary: 'A contested claim without a declared tradition scope.',
        status: 'contested' as const,
        sourceRefs: story.claims?.[0]?.sourceRefs ?? [],
      }],
    };

    expect(validateStructuredContent({ bundle: invalidBundle, mythology, illustrations: storyIllustrations })).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'claim.traditionScope', message: expect.stringContaining('contested') }),
    ]));
  });

  it('rejects multiple primary names in one Character/Interpretation scope', () => {
    const bundle = listStructuredMythologyBundles().find((item) => item.mythologyId === 'myth-norse')!;
    const mythology = mythologies.find((item) => item.id === bundle.mythologyId)!;
    const firstName = bundle.names?.[0];
    expect(firstName).toBeDefined();
    const invalidBundle = {
      ...bundle,
      names: [...(bundle.names ?? []), { ...firstName!, id: 'duplicate-primary-name', name: '重复主名' }],
    };

    expect(validateStructuredContent({ bundle: invalidBundle, mythology, illustrations: storyIllustrations })).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'characterName.primaryScope', message: expect.stringContaining('primary name') }),
    ]));
  });
});
