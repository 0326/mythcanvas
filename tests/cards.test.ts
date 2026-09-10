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

  it('publishes the complete M01 collection from R2 WebP delivery assets', () => {
    expect(getApprovedCardCount(norseM01Cards)).toBe(50);
    expect(norseM01Cards.filter((card) => card.hasArtwork)).toHaveLength(50);
    expect(norseM01Cards.every((card) => card.generation?.status === 'approved')).toBe(true);
    expect(norseM01Cards.every((card) => card.output.format === 'webp' && card.imageUrl === `/media/${card.output.assetKey}`)).toBe(true);
    expect(norseM01Cards.every((card) => /^[a-f0-9]{64}$/.test(card.output.sha256))).toBe(true);
    expect(norseM01Cards.filter((card) => card.orientation === 'landscape').map((card) => card.cardNumber)).toEqual([49, 50]);
    expect(norseM01Series.status).toBe('published');
  });

  it('validates the card IDs and the 19-card Story chain', () => {
    expect(validateCardSeries(norseM01Series)).toEqual([]);
  });
});
