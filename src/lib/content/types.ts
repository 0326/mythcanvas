export type ThemeName = 'light' | 'dark';

export type ArtworkType = 'character' | 'realm' | 'scene' | 'creature' | 'architecture';

export type VisualDNA = {
  palette: readonly string[];
  motifs: readonly string[];
  materials: readonly string[];
  atmosphere: readonly string[];
};

export type CanonicalDesign = {
  anchors: readonly string[];
  silhouette?: string;
  signatureMaterials?: readonly string[];
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LicenseMeta = {
  sourceType: 'prototype' | 'platform' | 'creator' | 'public-domain';
  license: string;
  creator?: string;
};

export type Mythology = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  summary: string;
  visualDna: VisualDNA;
  heroImage: ImageAsset;
};

export type Realm = {
  id: string;
  mythologyId: string;
  slug: string;
  name: string;
  nameEn: string;
  summary: string;
  canonicalDesign: CanonicalDesign;
  heroImage: ImageAsset;
};

export type Character = {
  id: string;
  mythologyId: string;
  realmIds: readonly string[];
  slug: string;
  name: string;
  nameEn: string;
  role: string;
  summary: string;
  symbols: readonly string[];
  canonicalDesign: CanonicalDesign;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  type: ArtworkType;
  mythologyId: string;
  realmId?: string;
  characterIds?: readonly string[];
  styleId: string;
  moodIds: readonly string[];
  image: ImageAsset;
  license: LicenseMeta;
  reviewStatus: 'draft' | 'approved' | 'hidden';
};
