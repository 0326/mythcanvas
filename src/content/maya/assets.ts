export type MayaAssetProvenance = {
  assetPath: string;
  ownerType: 'mythology' | 'world';
  ownerId: string;
  sourceType: 'original';
  generator: string;
  promptRecipeId: string;
  reviewStatus: 'approved';
  generatedAt: string;
};

export const mayaAssetProvenance: readonly MayaAssetProvenance[] = [
  { assetPath: '/art/maya-cosmic-maize.svg', ownerType: 'mythology', ownerId: 'myth-maya', sourceType: 'original', generator: 'MythCanvas authored SVG composition', promptRecipeId: 'maya-p0-cosmic-maize-v1', reviewStatus: 'approved', generatedAt: '2026-09-02' },
];
