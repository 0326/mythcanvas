import { artworks, characters, mythologies, worlds } from '../../data/seed';

export const getMythologyById = (id: string) => mythologies.find((item) => item.id === id);
export const getWorldById = (id: string) => worlds.find((item) => item.id === id);
export const getCharacterById = (id: string) => characters.find((item) => item.id === id);

export const getMythologyBySlug = (slug: string) => mythologies.find((item) => item.slug === slug);
export const getWorldBySlug = (slug: string) => worlds.find((item) => item.slug === slug);
export const getCharacterBySlug = (slug: string) => characters.find((item) => item.slug === slug);
export const getArtworkBySlug = (slug: string) => artworks.find((item) => item.slug === slug);

export const getWorldsForMythology = (mythologyId: string) =>
  worlds.filter((item) => item.mythologyId === mythologyId);

export const getCharactersForMythology = (mythologyId: string) =>
  characters.filter((item) => item.mythologyId === mythologyId);

export const getCharactersForWorld = (worldId: string) =>
  characters.filter((item) => item.worldIds.includes(worldId));

export const getArtworksForMythology = (mythologyId: string) =>
  artworks.filter((item) => item.mythologyId === mythologyId && item.reviewStatus === 'approved');

export const getArtworksForWorld = (worldId: string) =>
  artworks.filter((item) => item.worldId === worldId && item.reviewStatus === 'approved');

export const getArtworksForCharacter = (characterId: string) =>
  artworks.filter((item) => item.characterIds?.includes(characterId) && item.reviewStatus === 'approved');
