import { describe, expect, it } from 'vitest';
import { norseM01Cards, norseM01Series } from '../src/lib/cards/catalog';
import { getApprovedCardCount } from '../src/lib/cards/validation';
import { validateCardSeries } from '../src/lib/cards/validation';

describe('mythic card catalog', () => {
  it('loads the complete M01 manifest from static card JSON', () => {
    expect(norseM01Cards).toHaveLength(50);
    expect(norseM01Cards.map((card) => card.cardNumber)).toEqual(Array.from({ length: 50 }, (_, index) => index + 1));
    expect(norseM01Cards.map((card) => card.cardId)).toEqual(Array.from({ length: 50 }, (_, index) => 1003010001 + index));
  });

  it('normalizes legacy card descriptions for the UI without mutating source JSON', () => {
    const ymir = norseM01Cards[0];
    expect(ymir.display).toMatchObject({
      short: expect.any(String),
      full: expect.any(String),
      roleInSeries: expect.any(String),
      categoryLabel: '角色',
      identity: expect.any(String),
    });
  });

  it('recognizes the three currently available artworks', () => {
    expect(getApprovedCardCount(norseM01Cards)).toBe(3);
    expect(norseM01Cards.filter((card) => card.hasArtwork).map((card) => card.cardNumber)).toEqual([1, 2, 3]);
  });

  it('validates the card IDs and the 19-card Story chain', () => {
    expect(validateCardSeries(norseM01Series)).toEqual([]);
  });
});
