import type { MythStory, ReviewActorType, StorySeriesManifest } from '../../lib/content/types';
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
  deferredStoryManifestIds: readonly string[];
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
  snapshotVersion: string;
  status: 'blocked-until-completion' | 'ready-for-discovery';
  mythologyId: 'myth-norse';
  generatedFor: 'collection-discovery';
  eligibleCycleIds: readonly string[];
  deferredCycleIds: readonly string[];
  gates: {
    sourceReviewedP0: 'pending' | 'ready';
    visualApprovedWorlds: 'pending' | 'ready';
    visualApprovedStoryKeyMoments: 'pending' | 'ready';
    identityAudit: 'pending' | 'ready';
    productSignoff: 'pending' | 'ready';
    snapshotApproval: 'pending' | 'ready';
  };
  approvalRecords: {
    identityAudit: NorseIdentityAudit;
    productSignoff: NorseProductSignoff;
    snapshotApproval: NorseSnapshotApproval;
  };
  exclusions: readonly string[];
  cycles: readonly NorseCollectionCycleHandoff[];
};

export type NorseProductSignoff = {
  status: 'pending' | 'ready';
  snapshotVersion?: string;
  reviewer?: string;
  reviewerType?: ReviewActorType;
  signedAt?: string;
  decisionNotes?: readonly string[];
};

export type NorseIdentityAudit = {
  status: 'pending' | 'approved';
  snapshotVersion?: string;
  reviewer?: string;
  reviewerType?: ReviewActorType;
  reviewedAt?: string;
  decisionNotes?: readonly string[];
  unresolvedIssueIds?: readonly string[];
};

export type NorseSnapshotApproval = {
  status: 'pending' | 'approved';
  snapshotVersion?: string;
  reviewer?: string;
  reviewerType?: ReviewActorType;
  reviewedAt?: string;
  decisionNotes?: readonly string[];
  unresolvedIssueIds?: readonly string[];
};

const sorted = (values: Iterable<string>): string[] => [...new Set(values)].toSorted();
const hasReviewNotes = (notes: readonly string[] | undefined): boolean => Boolean(notes?.some((note) => note.trim()));

const isIsoDate = (value: string | undefined): boolean => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

const storyStatusIsReviewed = (story: MythStory | undefined): boolean =>
  ['source-reviewed', 'visual-ready'].includes(story?.editorialStatus ?? '')
  && story?.editorialReview?.status === 'approved'
  && story.editorialReview.reviewerType === 'human'
  && Boolean(story.editorialReview.reviewer?.trim())
  && isIsoDate(story.editorialReview.reviewedAt)
  && hasReviewNotes(story.editorialReview.sourceDecisionNotes)
  && story.editorialReview.unresolvedIssueIds.length === 0;

const worldAssetIsApproved = (asset: NorseAssetProvenance): boolean =>
  asset.sourceType === 'ai'
  && asset.reviewStatus === 'approved'
  && asset.reviewerType === 'human'
  && Boolean(asset.reviewer?.trim())
  && isIsoDate(asset.reviewedAt)
  && hasReviewNotes(asset.reviewNotes);

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
  identityAudit = 'pending',
  snapshotApproval = 'pending',
  snapshotVersion = 'unversioned',
}: {
  manifest: readonly NorseStoryManifestItem[];
  stories: readonly MythStory[];
  series?: readonly StorySeriesManifest[];
  worldAssets?: readonly NorseAssetProvenance[];
  illustrations?: readonly StoryIllustrationAsset[];
  productSignoff?: NorseProductSignoff | 'pending' | 'ready';
  identityAudit?: NorseIdentityAudit | 'pending';
  snapshotApproval?: NorseSnapshotApproval | 'pending';
  snapshotVersion?: string;
}): NorseCollectionDiscoveryInput => {
  const productSignoffRecord: NorseProductSignoff = typeof productSignoff === 'string'
    ? { status: productSignoff }
    : productSignoff;
  const productSignoffReady = productSignoffRecord.status === 'ready'
    && productSignoffRecord.snapshotVersion === snapshotVersion
    && productSignoffRecord.reviewerType === 'human'
    && Boolean(productSignoffRecord.reviewer?.trim())
    && isIsoDate(productSignoffRecord.signedAt)
    && hasReviewNotes(productSignoffRecord.decisionNotes);
  const identityAuditRecord: NorseIdentityAudit = typeof identityAudit === 'string'
    ? { status: identityAudit }
    : identityAudit;
  const identityAuditReady = identityAuditRecord.status === 'approved'
    && identityAuditRecord.snapshotVersion === snapshotVersion
    && identityAuditRecord.reviewerType === 'human'
    && Boolean(identityAuditRecord.reviewer?.trim())
    && isIsoDate(identityAuditRecord.reviewedAt)
    && hasReviewNotes(identityAuditRecord.decisionNotes)
    && (identityAuditRecord.unresolvedIssueIds ?? []).length === 0;
  const snapshotApprovalRecord: NorseSnapshotApproval = typeof snapshotApproval === 'string'
    ? { status: snapshotApproval }
    : snapshotApproval;
  const snapshotApprovalReady = snapshotApprovalRecord.status === 'approved'
    && snapshotApprovalRecord.snapshotVersion === snapshotVersion
    && snapshotApprovalRecord.reviewerType === 'human'
    && Boolean(snapshotApprovalRecord.reviewer?.trim())
    && snapshotApprovalRecord.reviewer !== productSignoffRecord.reviewer
    && isIsoDate(snapshotApprovalRecord.reviewedAt)
    && hasReviewNotes(snapshotApprovalRecord.decisionNotes)
    && (snapshotApprovalRecord.unresolvedIssueIds ?? []).length === 0;
  const storiesById = new Map(stories.map((story) => [story.id, story]));
  const cycleIds = sorted(manifest.flatMap((item) => item.cycleIds));
  // Product discovery evaluates only candidate content. Explicitly deferred or
  // excluded P2 items remain visible in the handoff exclusions but must not make
  // an otherwise complete candidate Cycle permanently ineligible.
  const collectionManifest = manifest.filter((item) => item.collectionDisposition !== 'deferred' && item.collectionDisposition !== 'excluded');
  const approvedWorldIds = new Set(
    worldAssets
      .filter(worldAssetIsApproved)
      .map((asset) => asset.ownerId)
      .filter((worldId) => ['desktop-wallpaper', 'mobile-wallpaper'].every((outputSpecId) => worldAssets.some((asset) => asset.ownerId === worldId && asset.outputSpecId === outputSpecId && worldAssetIsApproved(asset)))),
  );
  const approvedStoryIllustrationIds = new Set(
    illustrations
      .filter((asset) => asset.provenance.reviewStatus === 'approved' && asset.provenance.reviewerType === 'human' && Boolean(asset.provenance.reviewer?.trim()) && isIsoDate(asset.provenance.reviewedAt) && hasReviewNotes(asset.provenance.reviewNotes))
      .map((asset) => asset.id),
  );
  const allCycleRows = cycleIds.map((cycleId) => {
    const cycleManifest = collectionManifest.filter((item) => item.cycleIds.includes(cycleId));
    const deferredStoryManifestIds = manifest
      .filter((item) => item.cycleIds.includes(cycleId) && (item.collectionDisposition === 'deferred' || item.collectionDisposition === 'excluded'))
      .map((item) => item.id);
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
      ...(records.length === 0 ? ['当前 Cycle 没有可纳入 Collection Discovery 的 Story'] : []),
      ...(missingStoryManifestIds.length ? [`${missingStoryManifestIds.length} 个 Manifest Story 尚无静态读者页`] : []),
      ...(sourceReviewedStoryCount < records.length ? [`${records.length - sourceReviewedStoryCount} 个 Story 尚未完成来源审校`] : []),
      ...(p0SourceReviewedStoryCount < p0Records.length ? [`P0 来源审校为 ${p0SourceReviewedStoryCount}/${p0Records.length}`] : []),
    ];
    const cycleEntities = new Map(cycleIds.map((id) => [id, { characters: new Set<string>(), worlds: new Set<string>() }]));
    for (const otherCycleId of cycleIds) {
      for (const otherItem of collectionManifest.filter((item) => item.cycleIds.includes(otherCycleId))) {
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
      deferredStoryManifestIds,
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
        reason: '先完成 P0 来源审校、Phase 6 身份审计、视觉批准、Completion Snapshot 批准和产品签字；本报告不推导卡数或商品规格。',
      },
    } satisfies NorseCollectionCycleHandoff;
  });
  const publishedSeriesCycleIds = new Set(series.flatMap((item) => item.storyRefs.map((storyRef) => collectionManifest.find((manifestItem) => manifestItem.existingStoryId === storyRef.storyId)?.cycleIds ?? [])).flat());
  const eligibleCycleIds = allCycleRows.filter((row) => row.narrativeContinuity.status === 'candidate' && row.visualDiversity.status === 'candidate').map((row) => row.cycleId);
  const p0ManifestRows = manifest.filter((item) => item.priority === 'P0');
  const allWorldIds = sorted(collectionManifest.flatMap((item) => item.expectedDependencies.world));
  const collectionStoryIds = new Set(collectionManifest.map((item) => item.existingStoryId).filter((storyId): storyId is string => Boolean(storyId)));
  const collectionStories = stories.filter((story) => collectionStoryIds.has(story.id));
  const allStoryKeyMomentsApproved = collectionStories.length > 0 && collectionStories.every((story) => Boolean(story.heroAssetId && approvedStoryIllustrationIds.has(story.heroAssetId)));
  const gates = {
    sourceReviewedP0: p0ManifestRows.length > 0 && p0ManifestRows.every((item) => Boolean(item.existingStoryId && storyStatusIsReviewed(storiesById.get(item.existingStoryId)))) ? 'ready' : 'pending',
    visualApprovedWorlds: allWorldIds.length > 0 && allWorldIds.every((worldId) => approvedWorldIds.has(worldId)) ? 'ready' : 'pending',
    visualApprovedStoryKeyMoments: allStoryKeyMomentsApproved ? 'ready' : 'pending',
    identityAudit: identityAuditReady ? 'ready' : 'pending',
    productSignoff: productSignoffReady ? 'ready' : 'pending',
    snapshotApproval: snapshotApprovalReady ? 'ready' : 'pending',
  } as const;
  const discoveryReady = Object.values(gates).every((status) => status === 'ready') && eligibleCycleIds.length === cycleIds.length;
  return {
    version: '0.1.0',
    snapshotVersion,
    status: discoveryReady ? 'ready-for-discovery' : 'blocked-until-completion',
    mythologyId: 'myth-norse',
    generatedFor: 'collection-discovery',
    eligibleCycleIds,
    deferredCycleIds: allCycleRows.filter((row) => !eligibleCycleIds.includes(row.cycleId)).map((row) => row.cycleId),
    gates,
    approvalRecords: { identityAudit: identityAuditRecord, productSignoff: productSignoffRecord, snapshotApproval: snapshotApprovalRecord },
    exclusions: [
      '不创建 Collection Manifest、Card Manifest、卡数、定价或稀有度。',
      ...manifest
        .filter((item) => item.priority === 'P2' && item.collectionDisposition === 'deferred')
        .map((item) => `P2 独立传统暂缓纳入 Collection Discovery：${item.titleZh}（${item.proposedSlug}）；需完成独立来源与产品适配复核。`),
      ...(publishedSeriesCycleIds.size ? [] : ['当前没有可作为商品系列承诺的已批准 Story Series。']),
    ],
    cycles: allCycleRows,
  };
};
