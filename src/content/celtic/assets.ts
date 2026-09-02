export type CelticAssetProvenance = {
  assetPath: string;
  ownerType: 'mythology' | 'world';
  ownerId: string;
  sourceType: 'original';
  generator: string;
  promptRecipeId: string;
  reviewStatus: 'approved';
  generatedAt: string;
};

export const celticAssetProvenance: readonly CelticAssetProvenance[] = [
  { assetPath: '/art/celtic-mist-and-torc.svg', ownerType: 'mythology', ownerId: 'myth-celtic', sourceType: 'original', generator: 'MythCanvas authored SVG composition', promptRecipeId: 'celtic-p0-mist-torc-entry-v1', reviewStatus: 'approved', generatedAt: '2026-09-02' },
];
