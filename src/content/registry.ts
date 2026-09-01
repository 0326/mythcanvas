import type {
  Character,
  CharacterRelation,
  CharacterInterpretation,
  CharacterName,
  ContentConcept,
  ContentClaim,
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
import { mayaCharacters, mayaConcepts, mayaRelations, mayaScenes, mayaTaxonomy, mayaWorlds } from './maya/catalog';
import { mayaStories } from './maya/stories';
import { mayaAssetProvenance } from './maya/assets';
import { mayaVisualTiers } from './maya/visual-tiers';
import { mayaClaims, mayaInterpretations, mayaNames } from './maya/identities';
import { japaneseCharacters, japaneseRelations, japaneseScenes, japaneseTaxonomy, japaneseWorlds } from './japanese/catalog';
import { japaneseStories } from './japanese/stories';
import { japaneseAssetProvenance } from './japanese/assets';
import { japaneseVisualTiers } from './japanese/visual-tiers';
import { egyptianCharacters, egyptianRelations, egyptianScenes, egyptianTaxonomy, egyptianWorlds } from './egyptian/catalog';
import { egyptianStories } from './egyptian/stories';
import { egyptianAssetProvenance } from './egyptian/assets';
import { egyptianVisualTiers } from './egyptian/visual-tiers';

export type StructuredMythologyBundle = {
  mythologyId: string;
  slug: string;
  characters: readonly Character[];
  relations: readonly CharacterRelation[];
  concepts?: readonly ContentConcept[];
  claims?: readonly ContentClaim[];
  names?: readonly CharacterName[];
  interpretations?: readonly CharacterInterpretation[];
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
  {
    mythologyId: 'myth-maya',
    slug: 'maya',
    characters: mayaCharacters,
    relations: mayaRelations,
    concepts: mayaConcepts,
    claims: mayaClaims,
    names: mayaNames,
    interpretations: mayaInterpretations,
    taxonomy: mayaTaxonomy,
    worlds: mayaWorlds,
    scenes: mayaScenes,
    stories: mayaStories,
    assetProvenance: mayaAssetProvenance,
    visualTiers: mayaVisualTiers,
  },
  {
    mythologyId: 'myth-japanese',
    slug: 'japanese',
    characters: japaneseCharacters,
    relations: japaneseRelations,
    taxonomy: japaneseTaxonomy,
    worlds: japaneseWorlds,
    scenes: japaneseScenes,
    stories: japaneseStories,
    assetProvenance: japaneseAssetProvenance,
    visualTiers: japaneseVisualTiers,
  },
  {
    mythologyId: 'myth-egyptian',
    slug: 'egyptian',
    characters: egyptianCharacters,
    relations: egyptianRelations,
    taxonomy: egyptianTaxonomy,
    worlds: egyptianWorlds,
    scenes: egyptianScenes,
    stories: egyptianStories,
    assetProvenance: egyptianAssetProvenance,
    visualTiers: egyptianVisualTiers,
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
