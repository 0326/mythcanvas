export type NorseAssetProvenance = {
  assetPath: string;
  ownerType: 'world';
  ownerId: string;
  sourceType: 'prototype' | 'ai';
  generator: string;
  promptRecipeId: string;
  outputSpecId: 'desktop-wallpaper' | 'mobile-wallpaper';
  reviewStatus: 'draft' | 'approved';
  generatedAt: string;
};

const owners = ['world-asgard', 'world-midgard', 'world-jotunheim', 'world-hel', 'world-muspell', 'world-niflheim', 'world-vanaheim', 'world-alfheim'];
const prototypeAssets: readonly NorseAssetProvenance[] = owners.flatMap((ownerId) => [
  { assetPath: '/art/norse-asgard.jpg', ownerType: 'world' as const, ownerId, sourceType: 'prototype' as const, generator: 'MythCanvas prototype asset registry', promptRecipeId: `norse-${ownerId}-desktop-v0`, outputSpecId: 'desktop-wallpaper' as const, reviewStatus: 'draft' as const, generatedAt: '2026-09-01' },
  { assetPath: '/art/art-asgard-aurora.jpg', ownerType: 'world' as const, ownerId, sourceType: 'prototype' as const, generator: 'MythCanvas prototype asset registry', promptRecipeId: `norse-${ownerId}-mobile-v0`, outputSpecId: 'mobile-wallpaper' as const, reviewStatus: 'draft' as const, generatedAt: '2026-09-01' },
]);

export const norseAssetProvenance: readonly NorseAssetProvenance[] = [
  ...prototypeAssets,
  {
    assetPath: '/art/norse-asgard-v1.png',
    ownerType: 'world' as const,
    ownerId: 'world-asgard',
    sourceType: 'ai' as const,
    generator: 'OpenAI GPT Image built-in generation',
    promptRecipeId: 'norse-world-asgard-desktop-v1',
    outputSpecId: 'desktop-wallpaper' as const,
    reviewStatus: 'draft' as const,
    generatedAt: '2026-09-06',
  },
  {
    assetPath: '/art/norse-asgard-mobile-v1.png',
    ownerType: 'world' as const,
    ownerId: 'world-asgard',
    sourceType: 'ai' as const,
    generator: 'OpenAI GPT Image built-in generation',
    promptRecipeId: 'norse-world-asgard-mobile-v1',
    outputSpecId: 'mobile-wallpaper' as const,
    reviewStatus: 'draft' as const,
    generatedAt: '2026-09-06',
  },
  {
    assetPath: '/art/norse-jotunheim-v1.png',
    ownerType: 'world' as const,
    ownerId: 'world-jotunheim',
    sourceType: 'ai' as const,
    generator: 'OpenAI GPT Image built-in generation',
    promptRecipeId: 'norse-world-jotunheim-desktop-v1',
    outputSpecId: 'desktop-wallpaper' as const,
    reviewStatus: 'draft' as const,
    generatedAt: '2026-09-06',
  },
  {
    assetPath: '/art/norse-jotunheim-mobile-v1.png',
    ownerType: 'world' as const,
    ownerId: 'world-jotunheim',
    sourceType: 'ai' as const,
    generator: 'OpenAI GPT Image built-in generation',
    promptRecipeId: 'norse-world-jotunheim-mobile-v1',
    outputSpecId: 'mobile-wallpaper' as const,
    reviewStatus: 'draft' as const,
    generatedAt: '2026-09-06',
  },
  {
    assetPath: '/art/norse-midgard-v1.png',
    ownerType: 'world' as const,
    ownerId: 'world-midgard',
    sourceType: 'ai' as const,
    generator: 'OpenAI GPT Image built-in generation',
    promptRecipeId: 'norse-world-midgard-desktop-v1',
    outputSpecId: 'desktop-wallpaper' as const,
    reviewStatus: 'draft' as const,
    generatedAt: '2026-09-06',
  },
  {
    assetPath: '/art/norse-midgard-mobile-v1.png',
    ownerType: 'world' as const,
    ownerId: 'world-midgard',
    sourceType: 'ai' as const,
    generator: 'OpenAI GPT Image built-in generation',
    promptRecipeId: 'norse-world-midgard-mobile-v1',
    outputSpecId: 'mobile-wallpaper' as const,
    reviewStatus: 'draft' as const,
    generatedAt: '2026-09-06',
  },
  {
    assetPath: '/art/norse-hel-v1.png',
    ownerType: 'world' as const,
    ownerId: 'world-hel',
    sourceType: 'ai' as const,
    generator: 'OpenAI GPT Image built-in generation',
    promptRecipeId: 'norse-world-hel-desktop-v1',
    outputSpecId: 'desktop-wallpaper' as const,
    reviewStatus: 'draft' as const,
    generatedAt: '2026-09-06',
  },
  {
    assetPath: '/art/norse-hel-mobile-v1.png',
    ownerType: 'world' as const,
    ownerId: 'world-hel',
    sourceType: 'ai' as const,
    generator: 'OpenAI GPT Image built-in generation',
    promptRecipeId: 'norse-world-hel-mobile-v1',
    outputSpecId: 'mobile-wallpaper' as const,
    reviewStatus: 'draft' as const,
    generatedAt: '2026-09-06',
  },
];
