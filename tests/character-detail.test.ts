import { describe, expect, it } from 'vitest';
import { getCharacterDetailViewModel } from '../src/lib/content/character-detail';

describe('Character detail ViewModel', () => {
  it('keeps Norse static fallback aligned with the D1-shaped detail contract', async () => {
    const viewModel = await getCharacterDetailViewModel(undefined, 'odin');

    expect(viewModel?.character.id).toBe('character-odin');
    expect(viewModel?.mythology?.id).toBe('myth-norse');
    expect(viewModel?.worlds.map((world) => world.slug)).toContain('asgard');
    expect(viewModel?.stories.length).toBeGreaterThan(0);
    expect(viewModel?.directRelations.length).toBeGreaterThan(0);
    expect(viewModel?.relationCharacters.map((character) => character.slug)).toEqual(expect.arrayContaining(['thor', 'loki', 'frigg']));
  });
});
