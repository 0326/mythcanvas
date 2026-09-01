export type NorseAssetProvenance = {
  assetPath: string;
  ownerType: 'world';
  ownerId: string;
  sourceType: 'prototype' | 'ai';
  generator: string;
  promptRecipeId: string;
  reviewStatus: 'draft';
  generatedAt: string;
};

const owners = ['world-asgard', 'world-midgard', 'world-jotunheim', 'world-hel', 'world-muspell', 'world-niflheim', 'world-vanaheim', 'world-alfheim'];
export const norseAssetProvenance: readonly NorseAssetProvenance[] = owners.flatMap((ownerId) => [
  { assetPath: '/art/norse-asgard.jpg', ownerType: 'world' as const, ownerId, sourceType: 'prototype' as const, generator: 'MythCanvas prototype asset registry', promptRecipeId: `norse-${ownerId}-desktop-v0`, reviewStatus: 'draft' as const, generatedAt: '2026-09-01' },
  { assetPath: '/art/art-asgard-aurora.jpg', ownerType: 'world' as const, ownerId, sourceType: 'prototype' as const, generator: 'MythCanvas prototype asset registry', promptRecipeId: `norse-${ownerId}-mobile-v0`, reviewStatus: 'draft' as const, generatedAt: '2026-09-01' },
]);
