import { describe, expect, it } from 'vitest';
import { mythStories } from '../src/data/stories';
import { storyIllustrations } from '../src/data/story-illustrations';
import { characters, mythologies, scenes, worlds } from '../src/data/seed';
import { validateMythStories } from '../src/lib/content/story-validation';

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
    expect(mythStories).toHaveLength(15);
    expect(mythStories.every((story) => story.sources.length > 0 && story.sourceNotes.length > 0)).toBe(true);
  });
});
