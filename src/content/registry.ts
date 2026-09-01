import type {
  Character,
  CharacterRelation,
  ContentConcept,
  MythStory,
  Scene,
  TaxonomyTerm,
  World,
} from '../lib/content/types';
import { greekCharacters, greekRelations, greekScenes, greekTaxonomy, greekWorlds } from './greek/catalog';
import { greekStories } from './greek/stories';
import { greekAssetProvenance } from './greek/assets';
import { greekVisualTiers } from './greek/visual-tiers';
import { norseCharacters, norseRelations, norseScenes, norseTaxonomy, norseWorlds } from './norse/catalog';
import { norseStories } from './norse/stories';
import { norseAssetProvenance } from './norse/assets';
import { norseVisualTiers } from './norse/visual-tiers';

export type StructuredMythologyBundle = {
  mythologyId: string;
  slug: string;
  characters: readonly Character[];
  relations: readonly CharacterRelation[];
  concepts?: readonly ContentConcept[];
  taxonomy?: readonly TaxonomyTerm[];
  worlds: readonly World[];
  scenes: readonly Scene[];
  stories: readonly MythStory[];
  assetProvenance?: readonly unknown[];
  visualTiers?: Record<string, readonly string[]>;
};

const bundles: readonly StructuredMythologyBundle[] = [
  {
    mythologyId: 'myth-greek',
    slug: 'greek',
    characters: greekCharacters,
    relations: greekRelations,
    taxonomy: greekTaxonomy,
    worlds: greekWorlds,
    scenes: greekScenes,
    stories: greekStories,
    assetProvenance: greekAssetProvenance,
    visualTiers: greekVisualTiers,
  },
  {
    mythologyId: 'myth-norse',
    slug: 'norse',
    characters: norseCharacters,
    relations: norseRelations,
    taxonomy: norseTaxonomy,
    worlds: norseWorlds,
    scenes: norseScenes,
    stories: norseStories,
    assetProvenance: norseAssetProvenance,
    visualTiers: norseVisualTiers,
  },
];

const bundleById = new Map(bundles.map((bundle) => [bundle.mythologyId, bundle]));

export function listStructuredMythologyBundles(): readonly StructuredMythologyBundle[] {
  return bundles;
}

export function getStructuredMythologyBundle(mythologyId: string): StructuredMythologyBundle | undefined {
  return bundleById.get(mythologyId);
}

export function getStructuredCharacters(mythologyId?: string): readonly Character[] {
  return mythologyId
    ? getStructuredMythologyBundle(mythologyId)?.characters ?? []
    : bundles.flatMap((bundle) => bundle.characters);
}

export function getStructuredRelations(mythologyId?: string): readonly CharacterRelation[] {
  return mythologyId
    ? getStructuredMythologyBundle(mythologyId)?.relations ?? []
    : bundles.flatMap((bundle) => bundle.relations);
}

export function getStructuredWorlds(mythologyId?: string): readonly World[] {
  return mythologyId
    ? getStructuredMythologyBundle(mythologyId)?.worlds ?? []
    : bundles.flatMap((bundle) => bundle.worlds);
}

export function getStructuredScenes(mythologyId?: string): readonly Scene[] {
  return mythologyId
    ? getStructuredMythologyBundle(mythologyId)?.scenes ?? []
    : bundles.flatMap((bundle) => bundle.scenes);
}

export function getStructuredStories(mythologyId?: string): readonly MythStory[] {
  return mythologyId
    ? getStructuredMythologyBundle(mythologyId)?.stories ?? []
    : bundles.flatMap((bundle) => bundle.stories);
}
