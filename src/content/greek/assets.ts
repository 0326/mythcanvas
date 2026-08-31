/**
 * Project-local provenance for generated public World heroes. Image bytes live
 * in `public/media/content`; this registry keeps the publishable asset from
 * being reduced to an anonymous URL while World asset storage is introduced.
 */
export type GreekAssetProvenance = {
  assetPath: string;
  ownerType: 'world';
  ownerId: string;
  sourceType: 'ai';
  generator: 'OpenAI built-in image generation';
  promptRecipeId: string;
  reviewStatus: 'approved';
  generatedAt: string;
};

export const greekAssetProvenance: readonly GreekAssetProvenance[] = [
  { assetPath: '/media/content/greek-olympus-v2.webp', ownerType: 'world', ownerId: 'world-olympus', sourceType: 'ai', generator: 'OpenAI built-in image generation', promptRecipeId: 'greek-world-olympus-desktop-v1', reviewStatus: 'approved', generatedAt: '2026-08-30' },
  { assetPath: '/media/content/greek-olympus-mobile-v1.webp', ownerType: 'world', ownerId: 'world-olympus', sourceType: 'ai', generator: 'OpenAI built-in image generation', promptRecipeId: 'greek-world-olympus-mobile-v1', reviewStatus: 'approved', generatedAt: '2026-08-31' },
  { assetPath: '/media/content/greek-underworld-v1.webp', ownerType: 'world', ownerId: 'world-underworld', sourceType: 'ai', generator: 'OpenAI built-in image generation', promptRecipeId: 'greek-world-underworld-desktop-v1', reviewStatus: 'approved', generatedAt: '2026-08-30' },
  { assetPath: '/media/content/greek-underworld-mobile-v1.webp', ownerType: 'world', ownerId: 'world-underworld', sourceType: 'ai', generator: 'OpenAI built-in image generation', promptRecipeId: 'greek-world-underworld-mobile-v1', reviewStatus: 'approved', generatedAt: '2026-08-30' },
  { assetPath: '/media/content/greek-tartarus-v1.webp', ownerType: 'world', ownerId: 'world-tartarus', sourceType: 'ai', generator: 'OpenAI built-in image generation', promptRecipeId: 'greek-world-tartarus-desktop-v1', reviewStatus: 'approved', generatedAt: '2026-08-30' },
  { assetPath: '/media/content/greek-tartarus-mobile-v1.webp', ownerType: 'world', ownerId: 'world-tartarus', sourceType: 'ai', generator: 'OpenAI built-in image generation', promptRecipeId: 'greek-world-tartarus-mobile-v1', reviewStatus: 'approved', generatedAt: '2026-08-31' },
  { assetPath: '/media/content/greek-sea-realm-v1.webp', ownerType: 'world', ownerId: 'world-sea-realm', sourceType: 'ai', generator: 'OpenAI built-in image generation', promptRecipeId: 'greek-world-sea-realm-desktop-v1', reviewStatus: 'approved', generatedAt: '2026-08-30' },
  { assetPath: '/media/content/greek-sea-realm-mobile-v1.webp', ownerType: 'world', ownerId: 'world-sea-realm', sourceType: 'ai', generator: 'OpenAI built-in image generation', promptRecipeId: 'greek-world-sea-realm-mobile-v1', reviewStatus: 'approved', generatedAt: '2026-08-31' },
];
