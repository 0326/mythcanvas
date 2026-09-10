import type { CardSeries, CardType, MythicCard, RawCardRecord } from './types';
import { cardAssetUrl } from './assets';

const cardJsonModules = import.meta.glob(
  '../../../docs/cards/norse/M01-norse-genesis/cards/*.json',
  { eager: true, import: 'default' },
) as Record<string, RawCardRecord>;

const typeLabels: Record<CardType, string> = {
  character: '角色',
  scene: '场景',
  story: '故事',
  'mythic-object': '神物',
  ensemble: '封面',
};

const typeLabelsEn: Record<CardType, string> = {
  character: 'Character',
  scene: 'Scene',
  story: 'Story',
  'mythic-object': 'Mythic Object',
  ensemble: 'Ensemble',
};

function deriveIdentity(card: RawCardRecord) {
  const explicitIdentity = (card as RawCardRecord & { display?: { identity?: string } }).display?.identity;
  if (explicitIdentity) return explicitIdentity;

  if (card.type === 'character') {
    const anchors = ((card as RawCardRecord & { canon?: { identityAnchors?: string[] } }).canon?.identityAnchors ?? []).slice(0, 2);
    return anchors.length ? anchors.join(' · ') : '神话角色';
  }
  if (card.type === 'scene') return '北欧神话场景';
  if (card.type === 'story') return card.seriesNarrative?.keyMoment ?? '系列故事节点';
  if (card.type === 'mythic-object') return '神话器物';
  return '系列典藏封面';
}

function normalizeCard(raw: RawCardRecord): MythicCard {
  const legacyDescription = raw.description ?? raw.titleZh;
  const cardDescription = raw.cardDescription ?? {
    short: legacyDescription,
    full: raw.fullDescription ?? legacyDescription,
    roleInSeries: raw.roleInSeries ?? '',
  };
  const imageUrl = raw.generation?.status === 'approved'
    ? cardAssetUrl(raw.output.assetKey)
    : undefined;

  return {
    ...raw,
    display: {
      ...cardDescription,
      categoryLabel: typeLabels[raw.type],
      identity: deriveIdentity(raw),
    },
    imageUrl,
    hasArtwork: Boolean(imageUrl),
    orientation: raw.output.width > raw.output.height ? 'landscape' : 'portrait',
    frameProfileId: 'norse-relic',
  };
}

const cardRecords = Object.entries(cardJsonModules)
  .filter(([file]) => !file.endsWith('artwork.schema.json'))
  .map(([, record]) => normalizeCard(record))
  .toSorted((a, b) => a.cardNumber - b.cardNumber);

export const norseM01Cards: readonly MythicCard[] = cardRecords;

export const norseM01Series: CardSeries = {
  id: 'collection-norse-m01',
  slug: 'm01-norse-genesis',
  mythologyId: 'myth-norse',
  mythologySlug: 'norse',
  name: '北欧创世：世界树与命运',
  nameEn: 'Norse Genesis: Yggdrasil & Fate',
  summary: '从金伦加鸿沟的冰火相遇开始，沿着尤弥尔、世界树与命运的建立，阅读北欧世界第一次成形的故事。',
  summaryEn: 'From the meeting of frost and flame to Ymir, Yggdrasil, and fate, follow the first formation of the Norse cosmos.',
  cardCount: 50,
  status: 'published',
  cards: norseM01Cards,
};

export const cardSeries: readonly CardSeries[] = [norseM01Series];

export function getCardSeriesBySlug(slug: string) {
  return cardSeries.find((series) => series.slug === slug);
}

export function getCardByNumber(cardNumber: number) {
  return norseM01Cards.find((card) => card.cardNumber === cardNumber);
}

export function getCardById(cardId: number) {
  return norseM01Cards.find((card) => card.cardId === cardId);
}

export function formatCardNumber(cardNumber: number, total = 50) {
  return `${String(cardNumber).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

export function getCardTypeLabel(type: CardType, locale: 'zh-Hans' | 'en' = 'zh-Hans') {
  return locale === 'en' ? typeLabelsEn[type] : typeLabels[type];
}
