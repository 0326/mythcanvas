export type ThemeName = 'light' | 'dark';

export type ArtworkType = 'character' | 'world' | 'scene' | 'creature' | 'architecture';

export type VisualDNA = {
  palette: readonly string[];
  motifs: readonly string[];
  materials: readonly string[];
  atmosphere: readonly string[];
};

export type CanonicalAppearance = {
  face?: readonly string[];
  hair?: readonly string[];
  body?: readonly string[];
};

export type CanonicalDesign = {
  anchors: readonly string[];
  silhouette?: string;
  appearance?: CanonicalAppearance;
  costumeLanguage?: readonly string[];
  paletteCues?: readonly string[];
  signatureMaterials?: readonly string[];
  temperament?: readonly string[];
  /** Source-grounded identity facts for audit/research; not blindly injected into image prompts. */
  mythologicalFacts?: readonly string[];
  /** MythCanvas-owned visual interpretation choices, kept separate from source facts. */
  originalDesignChoices?: readonly string[];
  /** Character-specific design failures/confusions that generation should avoid. */
  avoid?: readonly string[];
  /** Character-owned GPT Image prompt fragment. Style/scene/output instructions are composed later. */
  canonicalPrompt?: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ImageFocalPoint = {
  x: number;
  y: number;
};

export type ThemeHeroSet = {
  lightSrc?: string;
  darkSrc?: string;
  focalPoint?: ImageFocalPoint;
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
  tagline?: string;
  summary: string;
  displayOrder?: number;
  visualDna: VisualDNA;
  heroImage: ImageAsset;
  homeHero?: ThemeHeroSet;
};

export type StoryImageLayout = 'wide' | 'portrait' | 'inset';

export type MythStoryBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'quote';
      text: string;
      source?: string;
    }
  | {
      type: 'image';
      image: ImageAsset;
      caption?: string;
      layout?: StoryImageLayout;
    };

export type MythStory = {
  id: string;
  slug: string;
  mythologyId: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  summary: string;
  volumeId: string;
  volumeTitle: string;
  volumeOrder: number;
  displayOrder: number;
  tradition?: string;
  readingMinutes?: number;
  sourceNotes: readonly string[];
  characterIds: readonly string[];
  worldIds: readonly string[];
  sceneIds: readonly string[];
  blocks: readonly MythStoryBlock[];
  heroImage?: ImageAsset;
  publishStatus: 'draft' | 'published';
};

export type World = {
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
  worldIds: readonly string[];
  slug: string;
  name: string;
  nameEn: string;
  role: string;
  summary: string;
  symbols: readonly string[];
  canonicalDesign: CanonicalDesign;
  /** Canonical Design 肖像视觉,缺失时 UI 回退到符号意象占位 */
  portrait?: ImageAsset;
};

export type CharacterVariantType = 'age' | 'costume' | 'form' | 'composite';

export type CharacterVariant = {
  id: string;
  characterId: string;
  slug: string;
  name: string;
  variantType: CharacterVariantType;
  description: string;
  traits: Record<string, unknown>;
  identityOverrides: readonly string[];
  referencePack: readonly string[];
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  type: ArtworkType;
  mythologyId: string;
  worldId?: string;
  characterIds?: readonly string[];
  styleId: string;
  moodIds: readonly string[];
  image: ImageAsset;
  license: LicenseMeta;
  reviewStatus: 'draft' | 'approved' | 'hidden';
};

export type Scene = {
  id: string;
  mythologyId: string;
  worldId?: string;
  slug: string;
  name: string;
  nameEn: string;
  summary: string;
  canonicalDesign: CanonicalDesign;
  heroImage?: ImageAsset;
};

export type Style = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  promptHint?: string;
};
