import { describe, expect, it } from 'vitest';
import { mythStories } from '../src/data/stories';
import { storyIllustrations } from '../src/data/story-illustrations';
import { characters, mythologies, scenes, worlds } from '../src/data/seed';
import { validateMythStories } from '../src/lib/content/story-validation';
import { MYTH_STORY_DETAIL_ROUTE_THRESHOLD, shouldUseMythStoryDetailRoutes } from '../src/lib/content/stories';

describe('MythStory editorial content', () => {
  it('keeps all published stories sourced, categorized, related and backed by attributable image assets', () => {
    const issues = validateMythStories({
      stories: mythStories,
      mythologies,
      characters,
      worlds,
      scenes,
      illustrations: storyIllustrations,
    });

    expect(issues).toEqual([]);
    expect(mythStories).toHaveLength(80);
    expect(mythStories.every((story) => story.sources.length > 0 && story.sourceNotes.length > 0)).toBe(true);
    const greekStories = mythStories.filter((story) => story.mythologyId === 'myth-greek');
    expect(greekStories).toHaveLength(35);
    expect(greekStories.every((story) => story.requiredCharacterIds && story.requiredSourceIds)).toBe(true);
    const norseStories = mythStories.filter((story) => story.mythologyId === 'myth-norse');
    expect(norseStories).toHaveLength(36);
    expect(norseStories.every((story) => story.requiredCharacterIds && story.requiredWorldIds && story.requiredSceneIds && story.requiredSourceIds)).toBe(true);
  });

  it('keeps the complete reader on small Mythology collections and exposes the documented route threshold', () => {
    expect(shouldUseMythStoryDetailRoutes(3)).toBe(false);
    expect(shouldUseMythStoryDetailRoutes(MYTH_STORY_DETAIL_ROUTE_THRESHOLD)).toBe(true);
    expect(shouldUseMythStoryDetailRoutes(1, true)).toBe(true);
  });
});
