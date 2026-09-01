/** Japanese visual targets stay separate from the content graph. P0 uses the
 * reviewed legacy atmosphere assets as fallbacks; new Tier S production is P1. */
export const japaneseAssetProvenance = [
  { assetPath: '/media/content/japanese-takamagahara.jpg', ownerType: 'world', ownerId: 'world-takamagahara', sourceType: 'original', generator: 'MythCanvas legacy asset registry', promptRecipeId: 'japanese-takamagahara-fallback-v1', reviewStatus: 'approved', generatedAt: '2026-08-31' },
  { assetPath: '/media/content/art-takamagahara-moon.jpg', ownerType: 'world', ownerId: 'world-takamagahara', sourceType: 'original', generator: 'MythCanvas legacy asset registry', promptRecipeId: 'japanese-takamagahara-mobile-fallback-v1', reviewStatus: 'approved', generatedAt: '2026-08-31' },
] as const;
