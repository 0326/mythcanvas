import type { CardSeries, MythicCard } from './types';

export type CardCatalogIssue = {
  cardId?: number;
  field: string;
  message: string;
};

export function validateCardSeries(series: CardSeries): CardCatalogIssue[] {
  const issues: CardCatalogIssue[] = [];
  const cards = series.cards;
  const ids = new Set(cards.map((card) => card.cardId));
  const numbers = new Set(cards.map((card) => card.cardNumber));

  if (cards.length !== series.cardCount) {
    issues.push({ field: 'series.cards', message: `${series.id} declares ${series.cardCount} cards but provides ${cards.length}.` });
  }

  cards.forEach((card) => {
    const expectedId = 1000000000
      + card.mythologyCode * 1000000
      + card.seriesCode * 10000
      + card.styleCode * 100
      + card.cardNumber;

    if (card.cardId !== expectedId) issues.push({ cardId: card.cardId, field: 'cardId', message: `Card ID does not match its encoded fields; expected ${expectedId}.` });
    if (card.output.fileName !== `${card.cardId}.png`) issues.push({ cardId: card.cardId, field: 'output.fileName', message: 'Output filename must use the Card ID.' });
    if (!card.display.short || !card.display.full || !card.display.identity) issues.push({ cardId: card.cardId, field: 'display', message: 'Card display copy is incomplete.' });
    if (card.type === 'story' && !card.seriesNarrative) issues.push({ cardId: card.cardId, field: 'seriesNarrative', message: 'Story cards need a readable narrative record.' });
    if (card.type !== 'story' && card.seriesNarrative !== null && card.seriesNarrative !== undefined) issues.push({ cardId: card.cardId, field: 'seriesNarrative', message: 'Only Story cards may have seriesNarrative.' });
    if (card.generation?.status === 'approved' && !card.hasArtwork) issues.push({ cardId: card.cardId, field: 'image', message: 'Approved card must have a local artwork asset.' });
  });

  if (ids.size !== cards.length) issues.push({ field: 'cardId', message: 'Card IDs must be unique.' });
  if (numbers.size !== cards.length) issues.push({ field: 'cardNumber', message: 'Card numbers must be unique.' });

  const stories = cards.filter((card) => card.type === 'story').toSorted((a, b) => (a.seriesNarrative?.sequence ?? 0) - (b.seriesNarrative?.sequence ?? 0));
  stories.forEach((card, index) => {
    const narrative = card.seriesNarrative;
    if (!narrative) return;
    const previous = stories[index - 1]?.cardId ?? null;
    const next = stories[index + 1]?.cardId ?? null;
    if (narrative.previousCardId !== previous) issues.push({ cardId: card.cardId, field: 'seriesNarrative.previousCardId', message: `Story chain should point to ${previous ?? 'null'}.` });
    if (narrative.nextCardId !== next) issues.push({ cardId: card.cardId, field: 'seriesNarrative.nextCardId', message: `Story chain should point to ${next ?? 'null'}.` });
  });

  return issues;
}

export function validateCardCatalog(series: readonly CardSeries[]) {
  return series.flatMap((item) => validateCardSeries(item));
}

export function getApprovedCardCount(cards: readonly MythicCard[]) {
  return cards.filter((card) => card.hasArtwork && card.generation?.status === 'approved').length;
}
