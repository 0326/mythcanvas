import { mythStories } from '../../data/stories';
import type { MythStory } from './types';

export type MythStoryVolume = {
  id: string;
  title: string;
  order: number;
  stories: MythStory[];
};

/**
 * Below this count, keeping the complete reader on its Mythology page gives a
 * better first-reading experience. The route also turns on when product work
 * explicitly adds independent sharing, search, or ongoing Story operations.
 */
export const MYTH_STORY_DETAIL_ROUTE_THRESHOLD = 8;

export const shouldUseMythStoryDetailRoutes = (
  publishedStoryCount: number,
  requiresIndependentStoryUrl = false,
): boolean => publishedStoryCount >= MYTH_STORY_DETAIL_ROUTE_THRESHOLD || requiresIndependentStoryUrl;

export const getStoriesForMythology = (mythologyId: string): MythStory[] =>
  mythStories
    .filter((story) => story.mythologyId === mythologyId && story.publishStatus === 'published')
    .toSorted((a, b) => a.volumeOrder - b.volumeOrder || a.displayOrder - b.displayOrder);

export const getStoryForMythology = (mythologyId: string, slug: string): MythStory | undefined =>
  mythStories.find((story) => story.mythologyId === mythologyId && story.slug === slug && story.publishStatus === 'published');

export const getPublicStoryPaths = (): { mythologyId: string; slug: string }[] =>
  mythStories
    .filter((story) => story.publishStatus === 'published')
    .filter((story) => shouldUseMythStoryDetailRoutes(getStoriesForMythology(story.mythologyId).length))
    .map((story) => ({ mythologyId: story.mythologyId, slug: story.slug }));

export const groupStoriesByVolume = (stories: readonly MythStory[]): MythStoryVolume[] => {
  const volumes = new Map<string, MythStoryVolume>();

  stories.forEach((story) => {
    const current = volumes.get(story.volumeId);
    if (current) {
      current.stories.push(story);
      return;
    }

    volumes.set(story.volumeId, {
      id: story.volumeId,
      title: story.volumeTitle,
      order: story.volumeOrder,
      stories: [story],
    });
  });

  return Array.from(volumes.values())
    .map((volume) => ({
      ...volume,
      stories: volume.stories.toSorted((a, b) => a.displayOrder - b.displayOrder),
    }))
    .toSorted((a, b) => a.order - b.order);
};
