import {
  getArtworksForCharacter,
  getCharacterBySlug,
  getCharacterInterpretations,
  getCharacterNames,
  getCharacterRelations,
  getCharacterVariants,
  getCharacters,
  getMythologyById,
  getWorlds,
} from './repositories';
import { getStoriesForMythology } from './stories';
import type { Character, CharacterRelation, CharacterInterpretation, CharacterName, CharacterVariant, Artwork, MythStory, Mythology, World } from './types';

export type CharacterDetailViewModel = {
  character: Character;
  mythology?: Mythology;
  names: CharacterName[];
  interpretations: CharacterInterpretation[];
  variants: CharacterVariant[];
  worlds: World[];
  stories: MythStory[];
  directRelations: CharacterRelation[];
  relationCharacters: Character[];
  artworks: Artwork[];
  relatedCharacters: Character[];
};

const counterpartId = (relation: CharacterRelation, characterId: string) =>
  relation.fromCharacterId === characterId ? relation.toCharacterId : relation.fromCharacterId;

export async function getCharacterDetailViewModel(
  db: D1Database | undefined,
  slug: string,
): Promise<CharacterDetailViewModel | undefined> {
  const character = await getCharacterBySlug(db, slug);
  if (!character) return undefined;

  const [mythology, artworks, names, interpretations, variants, allWorlds, allCharacters, directRelations] = await Promise.all([
    getMythologyById(db, character.mythologyId),
    getArtworksForCharacter(db, character.id),
    getCharacterNames(db, character.id),
    getCharacterInterpretations(db, character.id),
    getCharacterVariants(db, character.id),
    getWorlds(db, { limit: 1000 }),
    getCharacters(db, { limit: 1000 }),
    getCharacterRelations(db, character.id),
  ]);

  const worldIds = new Set(character.worldIds);
  const worlds = allWorlds.filter((item) => worldIds.has(item.id));
  const stories = getStoriesForMythology(character.mythologyId).filter((story) => story.characterIds.includes(character.id));
  const directIds = new Set(directRelations.map((relation) => counterpartId(relation, character.id)).filter((id): id is string => Boolean(id)));
  const sameStoryIds = new Set(stories.flatMap((story) => story.characterIds).filter((id) => id !== character.id));
  const sameWorldIds = new Set(allCharacters.filter((item) => item.id !== character.id && item.worldIds.some((id) => worldIds.has(id))).map((item) => item.id));
  const rank = (item: Character) => item.id === character.id ? 99 : directIds.has(item.id) ? 0 : sameStoryIds.has(item.id) ? 1 : sameWorldIds.has(item.id) ? 2 : item.mythologyId === character.mythologyId ? 3 : 4;
  const relatedCharacters = allCharacters
    .filter((item) => item.id !== character.id)
    .toSorted((a, b) => rank(a) - rank(b) || (b.clickCount ?? 0) - (a.clickCount ?? 0) || a.name.localeCompare(b.name, 'zh-CN'))
    .slice(0, 6);
  const relationCharacters = allCharacters.filter((item) => directIds.has(item.id));

  return { character, mythology, names, interpretations, variants, worlds, stories, directRelations, relationCharacters, artworks, relatedCharacters };
}
