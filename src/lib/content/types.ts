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
  /** Stable environmental light/atmosphere cues, primarily for World/Scene design. */
  atmosphere?: readonly string[];
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

export type SourceRefType =
  | 'primary-text'
  | 'religious-canon'
  | 'historical-record'
  | 'local-cult-record'
  | 'literature'
  | 'academic-secondary';

/** A source attached to a concrete claim, identity, relation, or name. */
export type SourceRef = {
  /** Stable source registry identifier when the source belongs to a managed content set. */
  sourceId?: string;
  type: SourceRefType;
  title: string;
  section?: string;
  author?: string;
  period?: string;
  edition?: string;
  locator?: string;
  /** Language of the cited text or translation, for example `grc`, `la`, or `zh-CN`. */
  language?: string;
  /** Edition or translator used by the editorial team. Never imply a translation is ancient text. */
  translation?: string;
  url?: string;
  note?: string;
};

/** Whether MythCanvas presents a statement as directly supported, disputed, or editorial synthesis. */
export type ContentClaimStatus = 'supported' | 'contested' | 'editorial-synthesis';

/**
 * A claim is intentionally separate from an entity summary. This keeps a chosen
 * reader-facing interpretation from masquerading as the only ancient tradition.
 */
export type ContentClaim = {
  id: string;
  subjectType: 'character' | 'world' | 'scene' | 'story' | 'relation' | 'visual-anchor';
  subjectId: string;
  claimType: 'identity' | 'genealogy' | 'narrative' | 'interpretation' | 'visual-anchor';
  summary: string;
  status: ContentClaimStatus;
  traditionScope?: string;
  sourceRefs: readonly SourceRef[];
};

export type TaxonomyKind = 'lineage' | 'domain' | 'story-cycle' | 'editorial-collection';

export type TaxonomyTerm = {
  id: string;
  slug: string;
  mythologyId: string;
  kind: TaxonomyKind;
  name: string;
  nameEn?: string;
  summary: string;
  displayOrder: number;
};

export type CharacterInterpretationConfidence = 'high' | 'medium' | 'contested';

export type CharacterNameKind = 'primary' | 'alias' | 'title' | 'literary-identity';

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
  sourceType: 'original' | 'prototype' | 'platform' | 'creator' | 'ai' | 'public-domain';
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

/** Editorial category. It is displayed to readers and must not be inferred from a volume title. */
export type MythStoryKind = 'myth' | 'folk-legend' | 'religious-tradition' | 'literary-fantasy';

export type MythStorySourceType = 'primary-text' | 'translation' | 'scholarly-reference' | 'oral-tradition';

/** A source that identifies the textual, oral, or scholarly basis of a MythStory. */
export type MythStorySource = {
  sourceId?: string;
  title: string;
  sourceType: MythStorySourceType;
  tradition?: string;
  period?: string;
  locator?: string;
  language?: string;
  translation?: string;
  note?: string;
  url?: string;
};

export type StoryIllustrationProvenance = {
  sourceType: 'original' | 'ai' | 'public-domain' | 'licensed';
  creator?: string;
  sourceUrl?: string;
  licenseName?: string;
  model?: string;
  promptRecipeId?: string;
};

/**
 * An editorial illustration used in a Story. It may point to a reusable Artwork,
 * but retains its own provenance instead of treating a bare image URL as content.
 */
export type StoryIllustrationAsset = {
  id: string;
  image: ImageAsset;
  provenance: StoryIllustrationProvenance;
  artworkId?: string;
};

export type MythStoryBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'heading';
      id: string;
      text: string;
      level: 2 | 3;
    }
  | {
      type: 'quote';
      text: string;
      source?: string;
    }
  | {
      type: 'image';
      assetId: string;
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
  kind: MythStoryKind;
  tradition?: string;
  readingMinutes?: number;
  sources: readonly MythStorySource[];
  sourceNotes: readonly string[];
  /** P0 dependency closure distinguishes required entities from useful context links. */
  requiredCharacterIds?: readonly string[];
  requiredWorldIds?: readonly string[];
  requiredSceneIds?: readonly string[];
  /** Source ids or inline source keys required before publication. */
  requiredSourceIds?: readonly string[];
  claims?: readonly ContentClaim[];
  characterIds: readonly string[];
  worldIds: readonly string[];
  sceneIds: readonly string[];
  blocks: readonly MythStoryBlock[];
  heroAssetId?: string;
  publishStatus: 'draft' | 'published';
  publishedAt: string;
  updatedAt: string;
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
  /** Independently composed narrow-viewport World Hero, never a desktop crop. */
  heroImageMobile?: ImageAsset;
};

export type Character = {
  id: string;
  mythologyId: string;
  worldIds: readonly string[];
  slug: string;
  name: string;
  nameEn: string;
  role: string;
  /** Number of published character detail-page views used for popularity display. */
  clickCount?: number;
  summary: string;
  symbols: readonly string[];
  canonicalDesign: CanonicalDesign;
  characterType?: string;
  traditionTags?: readonly string[];
  sourcePeriods?: readonly string[];
  sourceRefs?: readonly SourceRef[];
  editorialCollections?: readonly string[];
  canonicality?: 'primary' | 'layered' | 'literary' | 'contested';
  /** Canonical Design 肖像视觉,缺失时 UI 回退到符号意象占位 */
  portrait?: ImageAsset;
};

/** A source-scoped historical, religious, folk, or literary identity of one Character. */
export type CharacterInterpretation = {
  id: string;
  characterId: string;
  slug: string;
  name: string;
  role: string;
  summary: string;
  traditionTags: readonly string[];
  sourcePeriods: readonly string[];
  sourceRefs: readonly SourceRef[];
  identityAnchors: readonly string[];
  symbols: readonly string[];
  canonicalDesignOverrides: Record<string, unknown>;
  promptFragment: string;
  confidence: CharacterInterpretationConfidence;
};

/** A stable or interpretation-scoped name; not a second Character by default. */
export type CharacterName = {
  id: string;
  characterId: string;
  interpretationId?: string;
  name: string;
  nameEn?: string;
  nameKind: CharacterNameKind;
  isPrimaryForScope: boolean;
  sourceRefs: readonly SourceRef[];
  confidence: CharacterInterpretationConfidence;
};

export type ContentConcept = {
  id: string;
  mythologyId: string;
  slug: string;
  name: string;
  summary: string;
  sourceRefs: readonly SourceRef[];
};

export type CharacterRelation = {
  id: string;
  fromCharacterId: string;
  toCharacterId?: string;
  toConceptId?: string;
  fromInterpretationId?: string;
  toInterpretationId?: string;
  relationType: string;
  /** Stable semantic key used to prevent duplicate assertions within one tradition scope. */
  assertionKey?: string;
  /** Empty for a cross-tradition-neutral assertion; otherwise identifies the asserted tradition. */
  traditionScope?: string;
  /** One supported relation may be selected for the compact default genealogy view. */
  isDefault?: boolean;
  sourceRefs: readonly SourceRef[];
  confidence: CharacterInterpretationConfidence;
};

export type CharacterVariantType = 'age' | 'costume' | 'form' | 'composite';

export type CharacterVariant = {
  id: string;
  characterId: string;
  interpretationId?: string;
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
