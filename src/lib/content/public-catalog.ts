import { getStructuredCharacters, getStructuredRelations, getStructuredScenes, getStructuredWorlds, listStructuredMythologyBundles } from '../../content/registry';
import { artworks as seedArtworks, characterVariants as seedCharacterVariants, characters as seedCharacters, scenes as seedScenes, styles as seedStyles, worlds as seedWorlds } from '../../data/seed';
import { mythologies as seedMythologies } from '../../data/mythologies';
import { mythStories } from './stories';
import type { Artwork, Character, CharacterInterpretation, CharacterName, CharacterRelation, CharacterVariant, ContentClaim, ContentConcept, ContentSource, Mythology, MythStory, Scene, Style, TaxonomyTerm, World } from './types';
import type { ArtworkListQuery, EntityListQuery } from './repositories/types';

export type PublicArtwork = Artwork & {
  downloadCount: number;
  viewCount: number;
};

export type PublicContentCatalog = {
  mythologies: readonly Mythology[];
  worlds: readonly World[];
  scenes: readonly Scene[];
  characters: readonly Character[];
  characterRelations: readonly CharacterRelation[];
  characterNames: readonly CharacterName[];
  characterInterpretations: readonly CharacterInterpretation[];
  contentConcepts: readonly ContentConcept[];
  contentClaims: readonly ContentClaim[];
  sources: readonly ContentSource[];
  taxonomy: readonly TaxonomyTerm[];
  stories: readonly MythStory[];
  styles: readonly Style[];
  characterVariants: readonly CharacterVariant[];
  curatedArtworks: readonly Artwork[];
};

function mergeById<T extends { id: string }>(base: readonly T[], additions: readonly T[]): T[] {
  const byId = new Map(base.map((item) => [item.id, item]));
  additions.forEach((item) => {
    const existing = byId.get(item.id);
    byId.set(item.id, existing ? { ...existing, ...item } : item);
  });
  return Array.from(byId.values());
}

const structuredBundles = listStructuredMythologyBundles();

const publicContentCatalog: PublicContentCatalog = {
  mythologies: [...seedMythologies].toSorted((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999) || a.name.localeCompare(b.name, 'zh-CN')),
  worlds: mergeById(seedWorlds, getStructuredWorlds()).toSorted((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
  scenes: mergeById(seedScenes, getStructuredScenes()).toSorted((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
  characters: mergeById(seedCharacters, getStructuredCharacters()).toSorted((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0) || a.name.localeCompare(b.name, 'zh-CN') || a.id.localeCompare(b.id)),
  characterRelations: getStructuredRelations(),
  characterNames: structuredBundles.flatMap((bundle) => bundle.names ?? []),
  characterInterpretations: structuredBundles.flatMap((bundle) => bundle.interpretations ?? []),
  contentConcepts: structuredBundles.flatMap((bundle) => bundle.concepts ?? []),
  contentClaims: structuredBundles.flatMap((bundle) => bundle.claims ?? []),
  sources: structuredBundles.flatMap((bundle) => bundle.sources ?? []),
  taxonomy: structuredBundles.flatMap((bundle) => bundle.taxonomy ?? []),
  stories: mythStories,
  styles: seedStyles,
  characterVariants: seedCharacterVariants,
  curatedArtworks: seedArtworks,
};

const mythologyById = new Map(publicContentCatalog.mythologies.map((item) => [item.id, item]));
const mythologyBySlug = new Map(publicContentCatalog.mythologies.map((item) => [item.slug, item]));
const worldById = new Map(publicContentCatalog.worlds.map((item) => [item.id, item]));
const worldBySlug = new Map(publicContentCatalog.worlds.map((item) => [item.slug, item]));
const characterById = new Map(publicContentCatalog.characters.map((item) => [item.id, item]));
const characterBySlug = new Map(publicContentCatalog.characters.map((item) => [item.slug, item]));
const sceneById = new Map(publicContentCatalog.scenes.map((item) => [item.id, item]));
const artworkById = new Map(publicContentCatalog.curatedArtworks.map((item) => [item.id, item]));
const artworkBySlug = new Map(publicContentCatalog.curatedArtworks.map((item) => [item.slug, item]));
const styleById = new Map(publicContentCatalog.styles.map((item) => [item.id, item]));
const styleBySlug = new Map(publicContentCatalog.styles.map((item) => [item.slug, item]));

const worldsByMythology = groupBy(publicContentCatalog.worlds, (item) => item.mythologyId);
const scenesByWorld = groupBy(publicContentCatalog.scenes.filter((item) => item.worldId), (item) => item.worldId!);
const scenesByMythology = groupBy(publicContentCatalog.scenes, (item) => item.mythologyId);
const charactersByMythology = groupBy(publicContentCatalog.characters, (item) => item.mythologyId);
const charactersByWorld = groupBy(publicContentCatalog.characters.flatMap((character) => character.worldIds.map((worldId) => ({ worldId, character }))), (item) => item.worldId);
const artworksByMythology = groupBy(publicContentCatalog.curatedArtworks, (item) => item.mythologyId);
const artworksByWorld = groupBy(publicContentCatalog.curatedArtworks.filter((item) => item.worldId), (item) => item.worldId!);
const artworksByCharacter = groupBy(publicContentCatalog.curatedArtworks.flatMap((artwork) => (artwork.characterIds ?? []).map((characterId) => ({ characterId, artwork }))), (item) => item.characterId);
const storiesByMythology = groupBy(publicContentCatalog.stories, (item) => item.mythologyId);

export const publicCatalog = publicContentCatalog;

export function getPublicContentCatalog(): PublicContentCatalog {
  return publicContentCatalog;
}

export function getPublicMythologies(query: EntityListQuery = {}): Mythology[] {
  return paginate(publicContentCatalog.mythologies, query);
}

export function getPublicMythologyBySlug(slug: string): Mythology | undefined {
  return mythologyBySlug.get(slug);
}

export function getPublicMythologyById(id: string): Mythology | undefined {
  return mythologyById.get(id);
}

export function getPublicWorlds(query: EntityListQuery = {}): World[] {
  return paginate(publicContentCatalog.worlds, query);
}

export function getPublicWorldBySlug(slug: string): World | undefined {
  return worldBySlug.get(slug);
}

export function getPublicWorldById(id: string): World | undefined {
  return worldById.get(id);
}

export function getPublicWorldsForMythology(mythologyId: string, query: EntityListQuery = {}): World[] {
  return paginate(worldsByMythology.get(mythologyId) ?? [], query);
}

export function getPublicCharacters(query: EntityListQuery = {}): Character[] {
  return paginate(publicContentCatalog.characters, query);
}

export function getPublicCharacterBySlug(slug: string): Character | undefined {
  return characterBySlug.get(slug);
}

export function getPublicCharacterById(id: string): Character | undefined {
  return characterById.get(id);
}

export function getPublicCharactersByIds(ids: readonly string[]): Character[] {
  const wanted = new Set(ids);
  return publicContentCatalog.characters.filter((item) => wanted.has(item.id));
}

export function getPublicCharactersForMythology(mythologyId: string, query: EntityListQuery = {}): Character[] {
  return paginate(charactersByMythology.get(mythologyId) ?? [], query);
}

export function getPublicCharactersForWorld(worldId: string, query: EntityListQuery = {}): Character[] {
  return paginate((charactersByWorld.get(worldId) ?? []).map((item) => item.character), query);
}

export function getPublicScenes(query: EntityListQuery = {}): Scene[] {
  return paginate(publicContentCatalog.scenes, query);
}

export function getPublicSceneById(id: string): Scene | undefined {
  return sceneById.get(id);
}

export function getPublicScenesForMythology(mythologyId: string, query: EntityListQuery = {}): Scene[] {
  return paginate(scenesByMythology.get(mythologyId) ?? [], query);
}

export function getPublicScenesForWorld(worldId: string, query: EntityListQuery = {}): Scene[] {
  return paginate(scenesByWorld.get(worldId) ?? [], query);
}

export function getPublicCharacterRelations(characterId: string): CharacterRelation[] {
  return publicContentCatalog.characterRelations.filter((relation) => relation.fromCharacterId === characterId || relation.toCharacterId === characterId);
}

export function getPublicCharacterRelationsForMythology(mythologyId: string): CharacterRelation[] {
  const characterIds = new Set((charactersByMythology.get(mythologyId) ?? []).map((item) => item.id));
  return publicContentCatalog.characterRelations.filter((relation) => characterIds.has(relation.fromCharacterId));
}

export function getPublicCharacterNames(characterId: string): CharacterName[] {
  return characterId ? publicContentCatalog.characterNames.filter((item) => item.characterId === characterId) : [...publicContentCatalog.characterNames];
}

export function getPublicCharacterInterpretations(characterId: string): CharacterInterpretation[] {
  return characterId ? publicContentCatalog.characterInterpretations.filter((item) => item.characterId === characterId) : [...publicContentCatalog.characterInterpretations];
}

export function getPublicCharacterVariants(characterId: string): CharacterVariant[] {
  return characterId ? publicContentCatalog.characterVariants.filter((item) => item.characterId === characterId) : [...publicContentCatalog.characterVariants];
}

export function getPublicContentConceptsByIds(ids: readonly string[]): ContentConcept[] {
  const wanted = new Set(ids);
  return publicContentCatalog.contentConcepts.filter((item) => wanted.has(item.id));
}

export function getPublicStoriesForMythology(mythologyId: string): MythStory[] {
  return storiesByMythology.get(mythologyId) ?? [];
}

export function getPublicStyles(): Style[] {
  return [...publicContentCatalog.styles];
}

export function getPublicStyleById(id: string): Style | undefined {
  return styleById.get(id);
}

export function getPublicStyleBySlug(slug: string): Style | undefined {
  return styleBySlug.get(slug);
}

export function getPublicArtworks(query: ArtworkListQuery = {}): PublicArtwork[] {
  let result = [...publicContentCatalog.curatedArtworks];
  if (query.mythologyId) result = result.filter((item) => item.mythologyId === query.mythologyId);
  if (query.worldId) result = result.filter((item) => item.worldId === query.worldId);
  if (query.characterId) result = result.filter((item) => item.characterIds?.includes(query.characterId!));
  if (query.styleId) result = result.filter((item) => item.styleId === query.styleId);
  if (query.type) result = result.filter((item) => item.type === query.type);
  if (query.search?.trim()) {
    const needle = query.search.trim().toLowerCase();
    result = result.filter((item) => `${item.title} ${item.image.alt}`.toLowerCase().includes(needle));
  }
  if (query.device === 'desktop') result = result.filter((item) => item.image.width >= item.image.height);
  if (query.device === 'mobile') result = result.filter((item) => item.image.height > item.image.width);
  if (query.sort === 'latest') result.reverse();
  return paginate(result, query).map((item) => ({ ...item, downloadCount: 0, viewCount: 0 }));
}

export function getPublicArtworkBySlug(slug: string): PublicArtwork | undefined {
  const artwork = artworkBySlug.get(slug);
  return artwork ? { ...artwork, downloadCount: 0, viewCount: 0 } : undefined;
}

export function getPublicArtworkById(id: string): PublicArtwork | undefined {
  const artwork = artworkById.get(id);
  return artwork ? { ...artwork, downloadCount: 0, viewCount: 0 } : undefined;
}

export function getPublicArtworksForMythology(mythologyId: string, query: ArtworkListQuery = {}): PublicArtwork[] {
  return getPublicArtworks({ ...query, mythologyId });
}

export function getPublicArtworksForWorld(worldId: string, query: ArtworkListQuery = {}): PublicArtwork[] {
  return getPublicArtworks({ ...query, worldId });
}

export function getPublicArtworksForCharacter(characterId: string, query: ArtworkListQuery = {}): PublicArtwork[] {
  return getPublicArtworks({ ...query, characterId });
}

export function countPublicArtworks(): number {
  return publicContentCatalog.curatedArtworks.filter((item) => item.reviewStatus === 'approved').length;
}

function paginate<T>(items: readonly T[], query: { limit?: number; offset?: number }): T[] {
  const limit = Math.min(Math.max(query.limit ?? 100, 1), 1000);
  const offset = Math.max(query.offset ?? 0, 0);
  return items.slice(offset, offset + limit);
}

function groupBy<T>(items: readonly T[], keyOf: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return groups;
}
