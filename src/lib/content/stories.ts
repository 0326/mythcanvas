import { mythStories } from '../../data/stories';
import type { MythStory } from './types';

export type MythStoryVolume = {
  id: string;
  title: string;
  order: number;
  stories: MythStory[];
};

export const getStoriesForMythology = (mythologyId: string): MythStory[] =>
  mythStories
    .filter((story) => story.mythologyId === mythologyId && story.publishStatus === 'published')
    .toSorted((a, b) => a.volumeOrder - b.volumeOrder || a.displayOrder - b.displayOrder);

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
