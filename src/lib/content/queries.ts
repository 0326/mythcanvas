import { artworks, characters, mythologies, realms } from '../../data/seed';

export const getMythologyById = (id: string) => mythologies.find((item) => item.id === id);
export const getRealmById = (id: string) => realms.find((item) => item.id === id);
export const getCharacterById = (id: string) => characters.find((item) => item.id === id);

export const getMythologyBySlug = (slug: string) => mythologies.find((item) => item.slug === slug);
export const getRealmBySlug = (slug: string) => realms.find((item) => item.slug === slug);
export const getCharacterBySlug = (slug: string) => characters.find((item) => item.slug === slug);
export const getArtworkBySlug = (slug: string) => artworks.find((item) => item.slug === slug);

export const getRealmsForMythology = (mythologyId: string) =>
  realms.filter((item) => item.mythologyId === mythologyId);

export const getCharactersForMythology = (mythologyId: string) =>
  characters.filter((item) => item.mythologyId === mythologyId);

export const getCharactersForRealm = (realmId: string) =>
  characters.filter((item) => item.realmIds.includes(realmId));

export const getArtworksForMythology = (mythologyId: string) =>
  artworks.filter((item) => item.mythologyId === mythologyId && item.reviewStatus === 'approved');

export const getArtworksForRealm = (realmId: string) =>
  artworks.filter((item) => item.realmId === realmId && item.reviewStatus === 'approved');

export const getArtworksForCharacter = (characterId: string) =>
  artworks.filter((item) => item.characterIds?.includes(characterId) && item.reviewStatus === 'approved');
