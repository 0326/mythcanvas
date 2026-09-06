import type { MythStory, StorySeriesManifest } from '../../lib/content/types';
import type { StoryIllustrationAsset } from '../../lib/content/types';
import type { NorseAssetProvenance } from './assets';
import type { NorseStoryManifestItem } from './story-manifest';

export type NorseCollectionCycleHandoff = {
  cycleId: string;
  storyCount: number;
  publishedStoryCount: number;
  sourceReviewedStoryCount: number;
  p0StoryCount: number;
  p0SourceReviewedStoryCount: number;
  missingStoryManifestIds: readonly string[];
  characterIds: readonly string[];
  worldIds: readonly string[];
  sceneIds: readonly string[];
  objectIds: readonly string[];
  crossCycleDependencies: readonly {
    cycleId: string;
    sharedCharacterIds: readonly string[];
    sharedWorldIds: readonly string[];
  }[];
  narrativeContinuity: {
    status: 'blocked' | 'candidate';
    reasons: readonly string[];
  };
  visualDiversity: {
    worldCount: number;
    approvedWorldCount: number;
    sceneCount: number;
    objectCount: number;
    storyKeyMomentCount: number;
    approvedStoryKeyMomentCount: number;
    status: 'blocked' | 'candidate';
    reasons: readonly string[];
  };
  naturalCardCapacity: {
    status: 'deferred-until-content-gate';
    reason: string;
  };
};

export type NorseCollectionDiscoveryInput = {
  version: '0.1.0';
  status: 'blocked-until-completion';
  mythologyId: 'myth-norse';
  generatedFor: 'collection-discovery';
  eligibleCycleIds: readonly string[];
  deferredCycleIds: readonly string[];
  gates: {
    sourceReviewedP0: 'pending' | 'ready';
    visualApprovedWorlds: 'pending' | 'ready';
    visualApprovedStoryKeyMoments: 'pending' | 'ready';
    productSignoff: 'pending' | 'ready';
  };
  exclusions: readonly string[];
  cycles: readonly NorseCollectionCycleHandoff[];
};

const sorted = (values: Iterable<string>): string[] => [...new Set(values)].toSorted();

const storyStatusIsReviewed = (story: MythStory | undefined): boolean =>
  ['source-reviewed', 'visual-ready'].includes(story?.editorialStatus ?? '');

/**
 * Produces the evidence packet that is allowed to start Collection Discovery.
 * It intentionally does not select a product, card count, price or art style.
 */
export const buildNorseCollectionDiscoveryInput = ({
  manifest,
  stories,
  series = [],
  worldAssets = [],
  illustrations = [],
  productSignoff = 'pending',
}: {
  manifest: readonly NorseStoryManifestItem[];
  stories: readonly MythStory[];
  series?: readonly StorySeriesManifest[];
  worldAssets?: readonly NorseAssetProvenance[];
  illustrations?: readonly StoryIllustrationAsset[];
  productSignoff?: 'pending' | 'ready';
}): NorseCollectionDiscoveryInput => {
  const storiesById = new Map(stories.map((story) => [story.id, story]));
  const cycleIds = sorted(manifest.flatMap((item) => item.cycleIds));
  const approvedWorldIds = new Set(
    worldAssets
      .filter((asset) => asset.sourceType === 'ai' && asset.reviewStatus === 'approved')
      .map((asset) => asset.ownerId)
      .filter((worldId) => ['desktop-wallpaper', 'mobile-wallpaper'].every((outputSpecId) => worldAssets.some((asset) => asset.ownerId === worldId && asset.sourceType === 'ai' && asset.reviewStatus === 'approved' && asset.outputSpecId === outputSpecId))),
  );
  const approvedStoryIllustrationIds = new Set(
    illustrations.filter((asset) => asset.provenance.reviewStatus === 'approved').map((asset) => asset.id),
  );
  const allCycleRows = cycleIds.map((cycleId) => {
    const cycleManifest = manifest.filter((item) => item.cycleIds.includes(cycleId));
    const records = cycleManifest.map((item) => ({ manifest: item, story: item.existingStoryId ? storiesById.get(item.existingStoryId) : undefined }));
    const missingStoryManifestIds = records.filter((record) => !record.story).map((record) => record.manifest.id);
    const characterIds = sorted(records.flatMap(({ manifest, story }) => story?.characterIds ?? manifest.expectedDependencies.character));
    const worldIds = sorted(records.flatMap(({ manifest, story }) => story?.worldIds ?? manifest.expectedDependencies.world));
    const sceneIds = sorted(records.flatMap(({ manifest, story }) => story?.sceneIds ?? manifest.expectedDependencies.scene));
    const objectIds = sorted(records.flatMap(({ manifest, story }) => story?.objectIds ?? manifest.expectedDependencies['mythic-object']));
    const publishedStoryCount = records.filter(({ story }) => story?.publishStatus === 'published').length;
    const sourceReviewedStoryCount = records.filter(({ story }) => storyStatusIsReviewed(story)).length;
    const p0Records = records.filter(({ manifest: item }) => item.priority === 'P0');
    const p0SourceReviewedStoryCount = p0Records.filter(({ story }) => storyStatusIsReviewed(story)).length;
    const continuityReasons = [
      ...(missingStoryManifestIds.length ? [`${missingStoryManifestIds.length} 个 Manifest Story 尚无静态读者页`] : []),
      ...(sourceReviewedStoryCount < records.length ? [`${records.length - sourceReviewedStoryCount} 个 Story 尚未完成来源审校`] : []),
      ...(p0SourceReviewedStoryCount < p0Records.length ? [`P0 来源审校为 ${p0SourceReviewedStoryCount}/${p0Records.length}`] : []),
    ];
    const cycleEntities = new Map(cycleIds.map((id) => [id, { characters: new Set<string>(), worlds: new Set<string>() }]));
    for (const otherCycleId of cycleIds) {
      for (const otherItem of manifest.filter((item) => item.cycleIds.includes(otherCycleId))) {
        const otherStory = otherItem.existingStoryId ? storiesById.get(otherItem.existingStoryId) : undefined;
        for (const id of otherStory?.characterIds ?? otherItem.expectedDependencies.character) cycleEntities.get(otherCycleId)?.characters.add(id);
        for (const id of otherStory?.worldIds ?? otherItem.expectedDependencies.world) cycleEntities.get(otherCycleId)?.worlds.add(id);
      }
    }
    const crossCycleDependencies = cycleIds
      .filter((otherCycleId) => otherCycleId !== cycleId)
      .map((otherCycleId) => ({
        cycleId: otherCycleId,
        sharedCharacterIds: sorted(characterIds.filter((id) => cycleEntities.get(otherCycleId)?.characters.has(id))),
        sharedWorldIds: sorted(worldIds.filter((id) => cycleEntities.get(otherCycleId)?.worlds.has(id))),
      }))
      .filter((row) => row.sharedCharacterIds.length || row.sharedWorldIds.length);
    const approvedWorldCount = worldIds.filter((worldId) => approvedWorldIds.has(worldId)).length;
    const storyKeyMomentCount = records.filter(({ story }) => Boolean(story?.heroAssetId)).length;
    const approvedStoryKeyMomentCount = records.filter(({ story }) => Boolean(story?.heroAssetId && approvedStoryIllustrationIds.has(story.heroAssetId))).length;
    const visualReasons = [
      ...(approvedWorldCount < worldIds.length ? [`World 双端视觉批准为 ${approvedWorldCount}/${worldIds.length}`] : []),
      ...(approvedStoryKeyMomentCount < records.length ? [`Story key-moment 批准为 ${approvedStoryKeyMomentCount}/${records.length}`] : []),
    ];
    return {
      cycleId,
      storyCount: records.length,
      publishedStoryCount,
      sourceReviewedStoryCount,
      p0StoryCount: p0Records.length,
      p0SourceReviewedStoryCount,
      missingStoryManifestIds,
      characterIds,
      worldIds,
      sceneIds,
      objectIds,
      crossCycleDependencies,
      narrativeContinuity: {
        status: continuityReasons.length ? 'blocked' : 'candidate',
        reasons: continuityReasons,
      },
      visualDiversity: {
        worldCount: worldIds.length,
        approvedWorldCount,
        sceneCount: sceneIds.length,
        objectCount: objectIds.length,
        storyKeyMomentCount,
        approvedStoryKeyMomentCount,
        status: sourceReviewedStoryCount === records.length && visualReasons.length === 0 ? 'candidate' : 'blocked',
        reasons: visualReasons,
      },
      naturalCardCapacity: {
        status: 'deferred-until-content-gate',
        reason: '先完成 P0 来源审校、视觉批准和产品签字；本报告不推导卡数或商品规格。',
      },
    } satisfies NorseCollectionCycleHandoff;
  });
  const publishedSeriesCycleIds = new Set(series.flatMap((item) => item.storyRefs.map((storyRef) => manifest.find((manifestItem) => manifestItem.existingStoryId === storyRef.storyId)?.cycleIds ?? [])).flat());
  const eligibleCycleIds = allCycleRows.filter((row) => row.narrativeContinuity.status === 'candidate' && row.visualDiversity.status === 'candidate').map((row) => row.cycleId);
  const p0ManifestRows = manifest.filter((item) => item.priority === 'P0');
  const allWorldIds = sorted(manifest.flatMap((item) => item.expectedDependencies.world));
  const allStoryKeyMomentsApproved = stories.length > 0 && stories.every((story) => Boolean(story.heroAssetId && approvedStoryIllustrationIds.has(story.heroAssetId)));
  return {
    version: '0.1.0',
    status: 'blocked-until-completion',
    mythologyId: 'myth-norse',
    generatedFor: 'collection-discovery',
    eligibleCycleIds,
    deferredCycleIds: allCycleRows.filter((row) => !eligibleCycleIds.includes(row.cycleId)).map((row) => row.cycleId),
    gates: {
      sourceReviewedP0: p0ManifestRows.length > 0 && p0ManifestRows.every((item) => Boolean(item.existingStoryId && storyStatusIsReviewed(storiesById.get(item.existingStoryId)))) ? 'ready' : 'pending',
      visualApprovedWorlds: allWorldIds.length > 0 && allWorldIds.every((worldId) => approvedWorldIds.has(worldId)) ? 'ready' : 'pending',
      visualApprovedStoryKeyMoments: allStoryKeyMomentsApproved ? 'ready' : 'pending',
      productSignoff,
    },
    exclusions: [
      '不创建 Collection Manifest、Card Manifest、卡数、定价或稀有度。',
      'P2 独立传统是否纳入 Collection 仍需 Phase 9 人工排除项决定。',
      ...(publishedSeriesCycleIds.size ? [] : ['当前没有可作为商品系列承诺的已批准 Story Series。']),
    ],
    cycles: allCycleRows,
  };
};
