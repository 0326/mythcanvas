export type MesopotamianAssetProvenance = {
  assetPath: string;
  ownerType: 'mythology' | 'world' | 'scene';
  ownerId: string;
  sourceType: 'original' | 'prototype';
  generator: string;
  promptRecipeId: string;
  reviewStatus: 'approved' | 'prototype';
  generatedAt: string;
  note: string;
};

/** P0 keeps source-aware placeholders explicit; formal character / wallpaper production is P1. */
export const mesopotamianAssetProvenance: readonly MesopotamianAssetProvenance[] = [
  { assetPath: '/art/mythology-placeholder.svg', ownerType: 'mythology', ownerId: 'myth-mesopotamian', sourceType: 'prototype', generator: 'MythCanvas structured-content prototype', promptRecipeId: 'mesopotamian-p0-source-aware-prototype-v1', reviewStatus: 'prototype', generatedAt: '2026-09-02', note: 'Placeholder is labeled as a prototype and must not be presented as ancient canonical iconography.' },
  { assetPath: '/art/mythology-placeholder.svg', ownerType: 'world', ownerId: 'world-mesopotamian-netherworld', sourceType: 'prototype', generator: 'MythCanvas structured-content prototype', promptRecipeId: 'mesopotamian-netherworld-p0-prototype-v1', reviewStatus: 'prototype', generatedAt: '2026-09-02', note: 'World prototype intentionally avoids a universal underworld map.' },
  { assetPath: '/art/mythology-placeholder.svg', ownerType: 'world', ownerId: 'world-abzu', sourceType: 'prototype', generator: 'MythCanvas structured-content prototype', promptRecipeId: 'mesopotamian-abzu-p0-prototype-v1', reviewStatus: 'prototype', generatedAt: '2026-09-02', note: 'Abzu prototype is separate from Apsu Character identity.' },
];
