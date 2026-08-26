import type {
  Character,
  MythStory,
  Mythology,
  Scene,
  StoryIllustrationAsset,
  World,
} from './types';

export type StoryValidationIssue = {
  storyId?: string;
  field: string;
  message: string;
};

export type StoryValidationInput = {
  stories: readonly MythStory[];
  mythologies: readonly Mythology[];
  characters: readonly Character[];
  worlds: readonly World[];
  scenes: readonly Scene[];
  illustrations: readonly StoryIllustrationAsset[];
};

const hasText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const isIsoDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
};

const duplicateValues = (values: readonly string[]): string[] => {
  const seen = new Set<string>();
  return values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  });
};

/**
 * Checks the editorial invariants that TypeScript alone cannot prove for Story
 * seed data or later Content Collection adapters.
 */
export const validateMythStories = ({
  stories,
  mythologies,
  characters,
  worlds,
  scenes,
  illustrations,
}: StoryValidationInput): StoryValidationIssue[] => {
  const issues: StoryValidationIssue[] = [];
  const mythologyIds = new Set(mythologies.map((item) => item.id));
  const characterIds = new Set(characters.map((item) => item.id));
  const worldIds = new Set(worlds.map((item) => item.id));
  const sceneIds = new Set(scenes.map((item) => item.id));
  const illustrationIds = new Set(illustrations.map((item) => item.id));

  duplicateValues(stories.map((story) => story.id)).forEach((id) => {
    issues.push({ storyId: id, field: 'id', message: 'Story id must be unique.' });
  });
  duplicateValues(stories.map((story) => story.slug)).forEach((slug) => {
    issues.push({ field: 'slug', message: `Story slug must be unique: ${slug}.` });
  });
  duplicateValues(illustrations.map((asset) => asset.id)).forEach((id) => {
    issues.push({ field: 'illustrations', message: `Illustration id must be unique: ${id}.` });
  });

  illustrations.forEach((asset) => {
    if (!hasText(asset.image.src) || !hasText(asset.image.alt) || asset.image.width <= 0 || asset.image.height <= 0) {
      issues.push({ field: `illustrations.${asset.id}.image`, message: 'Story illustration needs src, alt, width and height.' });
    }
    if (!hasText(asset.provenance.sourceType)) {
      issues.push({ field: `illustrations.${asset.id}.provenance`, message: 'Story illustration provenance is required.' });
    }
  });

  stories.forEach((story) => {
    const scope = { storyId: story.id };
    if (!mythologyIds.has(story.mythologyId)) {
      issues.push({ ...scope, field: 'mythologyId', message: 'Story must reference an existing Mythology.' });
    }
    if (!hasText(story.kind)) {
      issues.push({ ...scope, field: 'kind', message: 'Story category is required.' });
    }
    if (story.publishStatus === 'published') {
      if (!isIsoDate(story.publishedAt) || !isIsoDate(story.updatedAt)) {
        issues.push({ ...scope, field: 'dates', message: 'Published Stories need valid ISO publishedAt and updatedAt dates.' });
      } else if (story.updatedAt < story.publishedAt) {
        issues.push({ ...scope, field: 'dates', message: 'updatedAt cannot be before publishedAt.' });
      }
      if (story.sources.length === 0) {
        issues.push({ ...scope, field: 'sources', message: 'Published Stories need at least one structured source.' });
      }
      if (story.sourceNotes.length === 0) {
        issues.push({ ...scope, field: 'sourceNotes', message: 'Published Stories need a reader-facing version note.' });
      }
    }

    story.sources.forEach((item, index) => {
      if (!hasText(item.title) || !hasText(item.sourceType)) {
        issues.push({ ...scope, field: `sources.${index}`, message: 'Each source needs a title and source type.' });
      }
    });

    story.characterIds.forEach((id) => {
      if (!characterIds.has(id)) issues.push({ ...scope, field: 'characterIds', message: `Unknown Character: ${id}.` });
    });
    story.worldIds.forEach((id) => {
      if (!worldIds.has(id)) issues.push({ ...scope, field: 'worldIds', message: `Unknown World: ${id}.` });
    });
    story.sceneIds.forEach((id) => {
      if (!sceneIds.has(id)) issues.push({ ...scope, field: 'sceneIds', message: `Unknown Scene: ${id}.` });
    });

    if (story.heroAssetId && !illustrationIds.has(story.heroAssetId)) {
      issues.push({ ...scope, field: 'heroAssetId', message: `Unknown Story illustration: ${story.heroAssetId}.` });
    }

    const headingIds: string[] = [];
    story.blocks.forEach((block, index) => {
      if (block.type === 'image' && !illustrationIds.has(block.assetId)) {
        issues.push({ ...scope, field: `blocks.${index}.assetId`, message: `Unknown Story illustration: ${block.assetId}.` });
      }
      if (block.type === 'heading') headingIds.push(block.id);
    });
    duplicateValues(headingIds).forEach((id) => {
      issues.push({ ...scope, field: 'blocks.heading.id', message: `Heading id must be unique within a Story: ${id}.` });
    });
  });

  return issues;
};

export const assertValidMythStories = (input: StoryValidationInput): void => {
  const issues = validateMythStories(input);
  if (issues.length > 0) {
    throw new Error(`MythStory validation failed:\n${issues.map((issue) => `${issue.storyId ?? 'global'} ${issue.field}: ${issue.message}`).join('\n')}`);
  }
};
