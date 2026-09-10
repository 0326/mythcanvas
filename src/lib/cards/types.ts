export type CardType = 'character' | 'scene' | 'story' | 'mythic-object' | 'ensemble';

export type CardGenerationStatus = 'planned' | 'generated' | 'approved' | 'rejected' | 'superseded';
export type CardQaStatus = 'planned' | 'prompt-ready' | 'review' | 'approved' | 'rejected' | 'superseded';

export type CardDescription = {
  short: string;
  full: string;
  roleInSeries: string;
};

export type CardOutput = {
  fileName: string;
  assetKey: string;
  sha256: string;
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'jpeg' | 'webp';
};

export type CardSeriesNarrative = {
  seriesTitle: string;
  seriesSummary: string;
  chapter: number;
  chapterTitle: string;
  sequence: number;
  keyMoment: string;
  narrative: string;
  previousCardId: number | null;
  nextCardId: number | null;
};

export type RawCardRecord = {
  schemaVersion: string;
  cardId: number;
  categoryCode: number;
  mythologyCode: number;
  seriesCode: number;
  seriesLabel: string;
  styleCode: number;
  styleName: string;
  cardNumber: number;
  type: CardType;
  slug: string;
  titleZh: string;
  titleEn: string;
  description?: string;
  fullDescription?: string;
  cardDescription?: CardDescription;
  roleInSeries?: string;
  storyIds?: string[];
  characterIds?: string[];
  worldIds?: string[];
  sceneIds?: string[];
  objectIds?: string[];
  sourceRefs?: Array<{ sourceId: string; locator: string; note?: string }>;
  seriesNarrative?: CardSeriesNarrative | null;
  output: CardOutput;
  generation?: {
    status?: CardGenerationStatus;
    attempt?: number;
    approvedAt?: string | null;
    referenceImageFile?: string | null;
    notes?: string;
  };
  qa?: {
    status?: CardQaStatus;
    reviewNotes?: string[];
  };
  [key: string]: unknown;
};

export type CardDisplay = CardDescription & {
  categoryLabel: string;
  identity: string;
};

export type MythicCard = RawCardRecord & {
  display: CardDisplay;
  imageUrl?: string;
  hasArtwork: boolean;
  orientation: 'portrait' | 'landscape';
  frameProfileId: 'norse-relic';
};

export type CardSeriesStatus = 'in-progress' | 'planned' | 'published';

export type CardSeries = {
  id: string;
  slug: string;
  mythologyId: string;
  mythologySlug: string;
  name: string;
  nameEn: string;
  summary: string;
  summaryEn: string;
  cardCount: number;
  status: CardSeriesStatus;
  cards: readonly MythicCard[];
};
