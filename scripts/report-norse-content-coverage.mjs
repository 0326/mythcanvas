#!/usr/bin/env node

/**
 * Validates the frozen Norse Phase-2 research baseline and writes a compact,
 * human-readable Story Map plus a machine-readable coverage report. It loads
 * only static source-controlled content and never queries D1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';

const root = process.cwd();
const write = process.argv.includes('--write');
const requireCompletion = process.argv.includes('--require-completion');
const snapshotSchemaVersion = 'norse-completion-snapshot-v2';
const reportPath = path.resolve(root, 'reports/norse-content-coverage.json');
const storyMapPath = path.resolve(root, 'docs/NORSE_STORY_MAP.md');
const completionSnapshotPath = path.resolve(root, 'docs/NORSE_COMPLETION_SNAPSHOT.md');
const editorialReviewQueuePath = path.resolve(root, 'docs/NORSE_EDITORIAL_REVIEW_QUEUE.md');
const sourcePreflightPath = path.resolve(root, 'docs/NORSE_SOURCE_PREFLIGHT.md');
const visualReviewQueuePath = path.resolve(root, 'docs/NORSE_VISUAL_REVIEW_QUEUE.md');
const storyVisualReviewQueuePath = path.resolve(root, 'docs/NORSE_STORY_VISUAL_REVIEW_QUEUE.md');
const reviewHandoffPath = path.resolve(root, 'docs/NORSE_REVIEW_HANDOFF.md');
const collectionHandoffReportPath = path.resolve(root, 'reports/norse-collection-discovery.json');
const collectionHandoffDocPath = path.resolve(root, 'docs/NORSE_COLLECTION_HANDOFF.md');
// This is a one-shot audit, not a development server. Disable Vite's
// WebSocket channel so parallel CI/audit invocations do not contend for the
// default HMR port or emit a misleading "WebSocket server error" warning.
const vite = await createServer({ root, server: { middlewareMode: true, ws: false }, appType: 'custom', logLevel: 'error' });

const isIsoDate = (value) => {
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
const hasReviewNotes = (notes) => Boolean(notes?.some((note) => note.trim()));
const hasHumanSourceReview = (story) => Boolean(
  story
  && ['source-reviewed', 'visual-ready'].includes(story.editorialStatus ?? '')
  && story.editorialReview?.status === 'approved'
  && story.editorialReview.reviewerType === 'human'
  && story.editorialReview.reviewer?.trim()
  && isIsoDate(story.editorialReview.reviewedAt)
  && hasReviewNotes(story.editorialReview.sourceDecisionNotes)
  && story.editorialReview.unresolvedIssueIds.length === 0,
);
const hasHumanAssetReview = (asset) => Boolean(
  asset?.reviewStatus === 'approved'
  && asset.reviewerType === 'human'
  && asset.reviewer?.trim()
  && isIsoDate(asset.reviewedAt)
  && hasReviewNotes(asset.reviewNotes),
);
const hasHumanIllustrationReview = (asset) => Boolean(
  asset?.provenance?.reviewStatus === 'approved'
  && asset.provenance.reviewerType === 'human'
  && asset.provenance.reviewer?.trim()
  && isIsoDate(asset.provenance.reviewedAt)
  && hasReviewNotes(asset.provenance.reviewNotes),
);
const readPngDimensions = (assetPath) => {
  const relativePath = assetPath.replace(/^\/+/, '');
  // Norse production delivery is stored as WebP in R2, while the local PNG
  // remains the immutable source used for editorial QA and fingerprinting.
  // Keep the audit local and deterministic without making the report depend
  // on a remote object read.
  const norseDeliveryMatch = relativePath.match(/^media\/content\/norse\/(?:stories|worlds)\/(.+)\.webp$/i);
  const norseSourceMatch = relativePath.match(/^(?:art|source\/norse)\/(.+\.(?:png|jpe?g))$/i);
  const localPath = norseDeliveryMatch
    ? path.resolve(root, 'content-assets/norse', `${norseDeliveryMatch[1]}.png`)
    : norseSourceMatch
      ? path.resolve(root, 'content-assets/norse', norseSourceMatch[1])
      : path.resolve(root, 'public', relativePath);
  const absolutePath = localPath;
  if (!fs.existsSync(absolutePath)) return { exists: false, byteLength: 0, width: null, height: null, sha256: null };
  const bytes = fs.readFileSync(absolutePath);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const isPng = bytes.length >= 24
    && bytes.readUInt32BE(0) === 0x89504e47
    && bytes.readUInt32BE(4) === 0x0d0a1a0a;
  if (!isPng) return { exists: true, byteLength: bytes.length, width: null, height: null, sha256 };
  return { exists: true, byteLength: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), sha256 };
};

const auditImageFile = (assetPath, expectedWidth, expectedHeight) => {
  const actual = readPngDimensions(assetPath);
  return {
    assetPath,
    ...actual,
    dimensionsMatch: actual.width === expectedWidth && actual.height === expectedHeight,
    expectedWidth,
    expectedHeight,
  };
};

const stableSerialize = (value) => {
  if (value === undefined) return 'null';
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(',')}}`;
};

try {
  const [{ norseSources }, { norseSourceCoverage }, { norseStoryManifest, norseStoryCycles }, { norseKnownIssues }, { norseVariantNotes }, { norseAssetProvenance }, { norseVisualTiers }, { getStructuredMythologyBundle }, { getPublicStoryPaths, getIndexableStoryPaths, getPublicStoryRedirectPaths }, { buildNorseCollectionDiscoveryInput }, { norseIdentityAudit, norseProductSignoff, norseCompletionSnapshotApproval }, { storyIllustrations }] = await Promise.all([
    vite.ssrLoadModule('/src/content/norse/sources.ts'),
    vite.ssrLoadModule('/src/content/norse/source-coverage.ts'),
    vite.ssrLoadModule('/src/content/norse/story-manifest.ts'),
    vite.ssrLoadModule('/src/content/norse/known-issues.ts'),
    vite.ssrLoadModule('/src/content/norse/variant-notes.ts'),
    vite.ssrLoadModule('/src/content/norse/assets.ts'),
    vite.ssrLoadModule('/src/content/norse/visual-tiers.ts'),
    vite.ssrLoadModule('/src/content/registry.ts'),
    vite.ssrLoadModule('/src/lib/content/stories.ts'),
    vite.ssrLoadModule('/src/content/norse/collection-handoff.ts'),
    vite.ssrLoadModule('/src/content/norse/collection-signoff.ts'),
    vite.ssrLoadModule('/src/data/story-illustrations.ts'),
  ]);
  const bundle = getStructuredMythologyBundle('myth-norse');
  const norseStoryIllustrationIds = new Set((bundle?.stories ?? []).map((story) => story.heroAssetId).filter(Boolean));
  const visualFileFingerprints = [...new Set([
    ...norseAssetProvenance.flatMap((asset) => [asset.assetPath, asset.sourceAssetPath].filter(Boolean)),
    ...storyIllustrations.filter((asset) => norseStoryIllustrationIds.has(asset.id)).map((asset) => asset.image.src),
  ])].toSorted().map((assetPath) => ({ assetPath, ...readPngDimensions(assetPath) }));
  const snapshotVersion = `${snapshotSchemaVersion}-${createHash('sha256').update(stableSerialize({
    sources: norseSources,
    sourceCoverage: norseSourceCoverage,
    storyManifest: norseStoryManifest,
    bundle,
    worldAssets: norseAssetProvenance,
    storyIllustrations,
    visualFileFingerprints,
    knownIssues: norseKnownIssues,
    variantNotes: norseVariantNotes,
    // Exclude the self-referential version field; the audit decision itself
    // must change the fingerprint, while its binding is checked separately.
    identityAudit: { ...norseIdentityAudit, snapshotVersion: undefined },
    // The sign-off must bind to the generated fingerprint, but that binding
    // cannot itself participate in the fingerprint calculation.
    productSignoff: { ...norseProductSignoff, snapshotVersion: undefined },
  })).digest('hex').slice(0, 16)}`;
  const collectionHandoff = buildNorseCollectionDiscoveryInput({
    manifest: norseStoryManifest,
    stories: bundle?.stories ?? [],
    series: bundle?.series ?? [],
    worldAssets: norseAssetProvenance,
    illustrations: storyIllustrations,
    identityAudit: norseIdentityAudit,
    productSignoff: norseProductSignoff,
    snapshotApproval: norseCompletionSnapshotApproval,
    snapshotVersion,
  });
  const publicStoryPaths = getPublicStoryPaths().filter((path) => path.mythologyId === 'myth-norse');
  const indexableStoryPaths = getIndexableStoryPaths().filter((path) => path.mythologyId === 'myth-norse');
  const publicStoryRedirectPaths = getPublicStoryRedirectPaths().filter((path) => path.mythologyId === 'myth-norse');

  const sourceIds = new Set(norseSources.map((item) => item.sourceId));
  const manifestIds = new Set(norseStoryManifest.map((item) => item.id));
  const coverageBySourceId = new Map(norseSourceCoverage.map((item) => [item.sourceId, item]));
  const issues = [];
  const impreciseSourceLocatorPattern = /Phase 3|按相关章节|按相关诗篇|按相关 stanza|selected stanzas|locator required/i;
  const impreciseSourceRefs = [];
  if (!bundle) issues.push('missing Norse structured content bundle');
  if (sourceIds.size !== norseSources.length) issues.push('duplicate sourceId in norseSources');
  if (manifestIds.size !== norseStoryManifest.length) issues.push('duplicate manifest id in norseStoryManifest');
  if (coverageBySourceId.size !== norseSourceCoverage.length) issues.push('duplicate sourceId in norseSourceCoverage');
  for (const source of norseSources) if (!coverageBySourceId.has(source.sourceId)) issues.push(`missing coverage row: ${source.sourceId}`);
  for (const row of norseSourceCoverage) {
    if (!sourceIds.has(row.sourceId)) issues.push(`coverage references unknown source: ${row.sourceId}`);
    if (row.priority === 'P0' && !['covered', 'context-only', 'excluded-with-reason'].includes(row.status)) issues.push(`P0 source unresolved: ${row.sourceId} (${row.status})`);
    if (row.reviewKind === 'human-audited' && (row.reviewerType !== 'human' || !row.reviewer?.trim() || !isIsoDate(row.reviewedAt))) {
      issues.push(`human-audited coverage row lacks a complete human review record: ${row.sourceId}`);
    }
    for (const id of row.storyManifestIds) if (!manifestIds.has(id)) issues.push(`coverage references unknown manifest Story: ${id}`);
  }
  for (const story of norseStoryManifest) {
    if (story.priority === 'P0' && !['source-reviewed', 'published'].includes(story.status)) issues.push(`P0 Story is not source-reviewed: ${story.id} (${story.status})`);
    if (!story.sourceScopes.length) issues.push(`Story has no source scope: ${story.id}`);
    for (const source of story.sourceScopes) {
      if (!sourceIds.has(source.sourceId)) issues.push(`Story ${story.id} references unknown source ${source.sourceId}`);
      if (!source.locator.trim()) issues.push(`Story ${story.id} has empty locator`);
      if (impreciseSourceLocatorPattern.test(source.locator)) {
        const finding = { owner: `Manifest Story ${story.id}`, sourceId: source.sourceId, locator: source.locator };
        impreciseSourceRefs.push(finding);
        issues.push(`Manifest Story ${story.id} has an imprecise source locator: ${source.locator}`);
      }
    }
  }
  for (const knownIssue of norseKnownIssues) {
    if (knownIssue.priority === 'P0' && knownIssue.status !== 'resolved') issues.push(`P0 known issue unresolved: ${knownIssue.id}`);
  }
  const manifestByExistingStoryId = new Map(norseStoryManifest.filter((story) => story.existingStoryId).map((story) => [story.existingStoryId, story]));
  const currentStoryMigrationGaps = (bundle?.stories ?? []).filter((story) => {
    const item = manifestByExistingStoryId.get(story.id);
    return !item?.migrationDecision;
  }).map((story) => story.id);
  for (const storyId of currentStoryMigrationGaps) issues.push(`current Story lacks manifest migration decision: ${storyId}`);
  const knownVariantIds = new Set(norseVariantNotes.map((note) => note.id));
  if (knownVariantIds.size !== norseVariantNotes.length) issues.push('duplicate id in norseVariantNotes');

  const validateSourceRefs = (owner, refs) => {
    for (const ref of refs) {
      if (!ref.sourceId) issues.push(`${owner} has a source reference without sourceId`);
      else if (!sourceIds.has(ref.sourceId)) issues.push(`${owner} references unknown source ${ref.sourceId}`);
      const locator = `${ref.locator ?? ''} ${ref.section ?? ''}`.trim();
      if (!locator) issues.push(`${owner} has a source reference without locator`);
      if (impreciseSourceLocatorPattern.test(locator)) {
        const finding = { owner, sourceId: ref.sourceId ?? null, locator };
        impreciseSourceRefs.push(finding);
        issues.push(`${owner} has an imprecise source locator: ${locator}`);
      }
    }
  };
  for (const note of norseVariantNotes) {
    if (note.priority === 'P0' && note.status !== 'scoped') issues.push(`P0 variant note unresolved: ${note.id}`);
    for (const storyId of note.affectedManifestIds) if (!manifestIds.has(storyId)) issues.push(`variant note references unknown manifest Story: ${note.id} → ${storyId}`);
    validateSourceRefs(`variant note ${note.id}`, note.sourceRefs);
  }
  for (const character of bundle?.characters ?? []) validateSourceRefs(`character ${character.id}`, character.sourceRefs ?? []);
  for (const world of bundle?.worlds ?? []) validateSourceRefs(`world ${world.id}`, world.sourceRefs ?? []);
  for (const scene of bundle?.scenes ?? []) validateSourceRefs(`scene ${scene.id}`, scene.sourceRefs ?? []);
  for (const object of bundle?.objects ?? []) validateSourceRefs(`object ${object.id}`, object.sourceRefs ?? []);
  for (const relation of bundle?.relations ?? []) validateSourceRefs(`character relation ${relation.id}`, relation.sourceRefs);
  for (const relation of bundle?.contentRelations ?? []) validateSourceRefs(`content relation ${relation.id}`, relation.sourceRefs);
  for (const story of bundle?.stories ?? []) {
    for (const source of story.sources) {
      if (!source.sourceId) issues.push(`Story ${story.id} has a source without sourceId`);
      else if (!sourceIds.has(source.sourceId)) issues.push(`Story ${story.id} references unknown source ${source.sourceId}`);
      if (!source.locator?.trim()) issues.push(`Story ${story.id} has a source without locator`);
      if (source.locator && impreciseSourceLocatorPattern.test(source.locator)) {
        const finding = { owner: `Story ${story.id}`, sourceId: source.sourceId ?? null, locator: source.locator };
        impreciseSourceRefs.push(finding);
        issues.push(`Story ${story.id} has an imprecise source locator: ${source.locator}`);
      }
    }
    for (const claim of story.claims ?? []) validateSourceRefs(`Story claim ${claim.id}`, claim.sourceRefs);
  }

  const identityLayer = {
    names: bundle?.names ?? [],
    interpretations: bundle?.interpretations ?? [],
    claims: bundle?.claims ?? [],
  };
  const identityIds = {
    character: new Set(bundle?.characters.map((item) => item.id) ?? []),
    world: new Set(bundle?.worlds.map((item) => item.id) ?? []),
    scene: new Set(bundle?.scenes.map((item) => item.id) ?? []),
    story: new Set(bundle?.stories.map((item) => item.id) ?? []),
    relation: new Set(bundle?.relations.map((item) => item.id) ?? []),
    'mythic-object': new Set(bundle?.objects?.map((item) => item.id) ?? []),
  };
  for (const item of identityLayer.names) {
    validateSourceRefs(`Character name ${item.id}`, item.sourceRefs);
    if (!identityIds.character.has(item.characterId)) issues.push(`Character name references unknown Character: ${item.id} → ${item.characterId}`);
    if (item.interpretationId && !identityLayer.interpretations.some((interpretation) => interpretation.id === item.interpretationId && interpretation.characterId === item.characterId)) {
      issues.push(`Character name references unknown or mismatched Interpretation: ${item.id} → ${item.interpretationId}`);
    }
  }
  for (const item of identityLayer.interpretations) {
    validateSourceRefs(`Character interpretation ${item.id}`, item.sourceRefs);
    if (!identityIds.character.has(item.characterId)) issues.push(`Character interpretation references unknown Character: ${item.id} → ${item.characterId}`);
  }
  for (const item of identityLayer.claims) {
    validateSourceRefs(`Content claim ${item.id}`, item.sourceRefs);
    const subjectIds = identityIds[item.subjectType];
    if (!subjectIds?.has(item.subjectId)) issues.push(`Content claim references unknown ${item.subjectType}: ${item.id} → ${item.subjectId}`);
    if (item.status === 'contested' && !item.traditionScope?.trim()) issues.push(`Contested Content claim lacks tradition scope: ${item.id}`);
  }
  const sourceLocatorAudit = {
    status: impreciseSourceRefs.length === 0 ? 'passed' : 'failed',
    impreciseCount: impreciseSourceRefs.length,
    impreciseRefs: impreciseSourceRefs,
  };

  const knownIds = {
    character: new Set(bundle?.characters.map((item) => item.id) ?? []),
    world: new Set(bundle?.worlds.map((item) => item.id) ?? []),
    scene: new Set(bundle?.scenes.map((item) => item.id) ?? []),
    'mythic-object': new Set(bundle?.objects?.map((item) => item.id) ?? []),
    concept: new Set(bundle?.concepts?.map((item) => item.id) ?? []),
  };
  const dependencyGapList = norseStoryManifest.flatMap((story) =>
    Object.entries(story.expectedDependencies).flatMap(([entityType, ids]) =>
      ids
        .filter((id) => !knownIds[entityType].has(id))
        .map((id) => ({ storyManifestId: story.id, entityType, id })),
    ),
  );
  const editorialStatusCounts = Object.groupBy(bundle?.stories ?? [], (story) => story.editorialStatus ?? 'unspecified');
  const prototypeSentence = 'MythCanvas 将本篇作为可追溯的神话叙事入口';
  const storyById = new Map((bundle?.stories ?? []).map((story) => [story.id, story]));
  const requiredDependencyField = {
    character: 'requiredCharacterIds',
    world: 'requiredWorldIds',
    scene: 'requiredSceneIds',
    'mythic-object': 'requiredObjectIds',
  };
  const dependencyClosureGaps = norseStoryManifest.flatMap((manifestStory) => {
    const story = manifestStory.existingStoryId ? storyById.get(manifestStory.existingStoryId) : undefined;
    if (!story) return [];
    return Object.entries(manifestStory.expectedDependencies).flatMap(([entityType, expectedIds]) => {
      const field = requiredDependencyField[entityType];
      if (!field) return [];
      const requiredIds = new Set(story[field] ?? []);
      return expectedIds
        .filter((id) => !requiredIds.has(id))
        .map((id) => ({ manifestStoryId: manifestStory.id, storyId: story.id, entityType, id }));
      });
  });
  for (const gap of dependencyClosureGaps) {
    issues.push(`Story dependency closure gap: ${gap.manifestStoryId} → ${gap.entityType} ${gap.id} is not required by ${gap.storyId}`);
  }
  const manifestExistingStories = norseStoryManifest
    .filter((story) => story.existingStoryId)
    .map((story) => ({ manifest: story, story: storyById.get(story.existingStoryId) }));
  const editorialMigrationGaps = manifestExistingStories
    .filter(({ story }) => !story)
    .map(({ manifest }) => manifest.id);
  const templateStoryIds = (bundle?.stories ?? [])
    .filter((story) => story.blocks.some((block) => block.type === 'paragraph' && block.text.includes(prototypeSentence)))
    .map((story) => story.id);
  const editorialBodyMetrics = (bundle?.stories ?? []).map((story) => {
    const paragraphs = story.blocks.filter((block) => block.type === 'paragraph').map((block) => block.text).join('').replace(/\s/g, '');
    const headingCount = story.blocks.filter((block) => block.type === 'heading').length;
    const readingTimeMismatch = Boolean(story.readingMinutes && Math.abs(Math.round(paragraphs.length / 250) - story.readingMinutes) > 1);
    return { storyId: story.id, paragraphCharacters: paragraphs.length, headingCount, readingTimeMismatch };
  });
  const editorialBodyReadyStoryIds = editorialBodyMetrics
    .filter((item) => item.paragraphCharacters >= 800 && item.headingCount >= 3 && !templateStoryIds.includes(item.storyId) && !item.readingTimeMismatch)
    .map((item) => item.storyId);
  const editorialBodyShortStoryIds = editorialBodyMetrics
    .filter((item) => item.paragraphCharacters < 800)
    .map((item) => item.storyId);
  const readingTimeMismatchStoryIds = editorialBodyMetrics
    .filter((item) => item.readingTimeMismatch)
    .map((item) => item.storyId);
  const sourceCoverageById = new Map(norseSourceCoverage.map((row) => [row.sourceId, row]));
  const sourceRegistryById = new Map(norseSources.map((source) => [source.sourceId, source]));
  const formatSourceForReview = (source) => {
    const registry = sourceRegistryById.get(source.sourceId ?? '');
    const label = `${source.sourceId ?? source.title} ${source.locator ?? 'locator required'}`;
    return registry?.url ? `[${label}](${registry.url})` : label;
  };
  const sourcePreflight = (bundle?.stories ?? []).map((story) => {
    const manifestStories = norseStoryManifest.filter((item) => item.existingStoryId === story.id);
    const manifestStory = manifestStories[0];
    const manifestIds = manifestStories.map((item) => item.id);
    const manifestSourceIds = manifestStories.flatMap((item) => item.sourceScopes.map((scope) => scope.sourceId));
    const storySourceIds = story.sources.map((source) => source.sourceId).filter(Boolean);
    const sourceIds = [...new Set([...manifestSourceIds, ...storySourceIds])];
    const missingRegistrySourceIds = sourceIds.filter((sourceId) => !sourceRegistryById.has(sourceId));
    const missingCoverageSourceIds = sourceIds.filter((sourceId) => {
      const coverage = sourceCoverageById.get(sourceId);
      return !coverage || !manifestIds.some((manifestId) => coverage.storyManifestIds.includes(manifestId));
    });
    const missingStorySourceIds = [...new Set(manifestSourceIds)].filter((sourceId) => !storySourceIds.includes(sourceId));
    const broadLocatorRefs = [
      ...manifestStory?.sourceScopes ?? [],
      ...story.sources,
      ...story.claims.flatMap((claim) => claim.sourceRefs),
    ].filter((ref) => /Phase 3|按相关章节|按相关诗篇|selected stanzas|fragmentary|editorial split|locator required/i.test(ref.locator ?? ''));
    const bodyMetric = editorialBodyMetrics.find((item) => item.storyId === story.id);
    const variantNoteIds = norseVariantNotes
      .filter((note) => manifestStory && note.affectedManifestIds.includes(manifestStory.id))
      .map((note) => note.id);
    const checks = {
      sourceRegistryComplete: missingRegistrySourceIds.length === 0,
      sourceCoverageMapped: missingCoverageSourceIds.length === 0,
      storySourceAlignment: missingStorySourceIds.length === 0,
      locatorSpecific: broadLocatorRefs.length === 0,
      bodyGate: Boolean(bodyMetric && editorialBodyReadyStoryIds.includes(story.id)),
    };
    return {
      storyId: story.id,
      slug: story.slug,
      priority: manifestStory?.priority ?? 'legacy',
      manifestIds,
      sourceIds,
      sourceTitles: sourceIds.map((sourceId) => sourceRegistryById.get(sourceId)?.title ?? sourceId),
      sourceUrls: sourceIds.map((sourceId) => sourceRegistryById.get(sourceId)?.url ?? null),
      checks,
      missingRegistrySourceIds,
      missingCoverageSourceIds,
      missingStorySourceIds,
      broadLocators: broadLocatorRefs.map((ref) => ref.locator),
      variantNoteIds,
      editorialReviewStatus: story.editorialReview?.status ?? 'needs-review',
      machineStatus: Object.values(checks).every(Boolean) ? 'review-ready' : 'changes-needed-before-human-review',
    };
  });
  const sourcePreflightSummary = {
    totalStories: sourcePreflight.length,
    reviewReadyStories: sourcePreflight.filter((item) => item.machineStatus === 'review-ready').length,
    changesNeededStories: sourcePreflight.filter((item) => item.machineStatus !== 'review-ready').length,
    p0Total: sourcePreflight.filter((item) => item.priority === 'P0').length,
    p0ReviewReady: sourcePreflight.filter((item) => item.priority === 'P0' && item.machineStatus === 'review-ready').length,
    p0ChangesNeeded: sourcePreflight.filter((item) => item.priority === 'P0' && item.machineStatus !== 'review-ready').length,
  };
  const impreciseSourceLocatorStoryIds = (bundle?.stories ?? [])
    .filter((story) => [
      ...story.sources,
      ...story.claims.flatMap((claim) => claim.sourceRefs),
    ].some((source) => /Phase 3|按相关章节|按相关诗篇|按相关 stanza/i.test(source.locator ?? '')))
    .map((story) => story.id);
  const readiness = {
    publicStories: (bundle?.stories ?? []).filter((story) => story.publishStatus === 'published').length,
    structuredStories: (bundle?.stories ?? []).filter((story) => ['structured', 'dependency-complete', 'source-reviewed', 'visual-ready'].includes(story.editorialStatus ?? '')).length,
    editorialReadyStories: (bundle?.stories ?? []).filter(hasHumanSourceReview).length,
    prototypeStories: (bundle?.stories ?? []).filter((story) => story.editorialStatus === 'prototype').length,
    researchingStories: (bundle?.stories ?? []).filter((story) => story.editorialStatus === 'researching').length,
    templateStories: templateStoryIds.length,
    impreciseSourceLocatorStories: impreciseSourceLocatorStoryIds.length,
    editorialBodyReadyStories: editorialBodyReadyStoryIds.length,
    editorialBodyShortStories: editorialBodyShortStoryIds.length,
    readingTimeMismatchStories: readingTimeMismatchStoryIds.length,
    missingManifestBackedStories: editorialMigrationGaps.length,
    dependencyClosureGaps: dependencyClosureGaps.length,
  };
  const norseWorldIds = new Set((bundle?.worlds ?? []).map((world) => world.id));
  const aiWorldAssetPairs = [...norseWorldIds].filter((worldId) =>
    ['desktop-wallpaper', 'mobile-wallpaper'].every((outputSpecId) =>
      norseAssetProvenance.some((asset) => asset.ownerId === worldId && asset.outputSpecId === outputSpecId && asset.sourceType === 'ai'),
    ),
  );
  const approvedWorldAssetPairs = [...norseWorldIds].filter((worldId) =>
    ['desktop-wallpaper', 'mobile-wallpaper'].every((outputSpecId) =>
      norseAssetProvenance.some((asset) => asset.ownerId === worldId && asset.outputSpecId === outputSpecId && hasHumanAssetReview(asset)),
    ),
  );
  const prototypeOnlyWorlds = [...norseWorldIds].filter((worldId) => !aiWorldAssetPairs.includes(worldId));
  const visualReadiness = {
    worldCount: norseWorldIds.size,
    independentlyGeneratedWorldPairs: aiWorldAssetPairs.length,
    approvedWorldPairs: approvedWorldAssetPairs.length,
    draftAiAssets: norseAssetProvenance.filter((asset) => asset.sourceType === 'ai' && asset.reviewStatus === 'draft').length,
    prototypeOnlyWorlds,
  };
  const coreVisualCharacterIds = new Set([...norseVisualTiers.S, ...norseVisualTiers.A].map((slug) => `character-${slug}`));
  const coreVisualCharacters = (bundle?.characters ?? []).filter((character) => coreVisualCharacterIds.has(character.id));
  const canonicalDesignReadyCoreCharacters = coreVisualCharacters.filter((character) => character.canonicalDesign?.anchors?.length && character.canonicalDesign?.originalDesignChoices?.length).length;
  const storyIllustrationsById = new Map(storyIllustrations.map((asset) => [asset.id, asset]));
  const worldById = new Map((bundle?.worlds ?? []).map((world) => [world.id, world]));
  const worldImageFileAudit = norseAssetProvenance
    .filter((asset) => asset.sourceType === 'ai')
    .map((asset) => {
      const world = worldById.get(asset.ownerId);
      const expected = asset.outputSpecId === 'desktop-wallpaper' ? world?.heroImage : world?.heroImageMobile;
      const finalOutputSpec = asset.outputSpecId === 'desktop-wallpaper'
        ? { width: 2560, height: 1440 }
        : { width: 1440, height: 2560 };
      return {
        ownerId: asset.ownerId,
        outputSpecId: asset.outputSpecId,
        finalOutputSpec,
        finalOutputSpecMatch: expected?.width === finalOutputSpec.width && expected?.height === finalOutputSpec.height,
        sourceAssetPath: asset.sourceAssetPath ?? null,
        sourceAssetFile: asset.sourceAssetPath ? readPngDimensions(asset.sourceAssetPath) : null,
        ...auditImageFile(asset.assetPath, expected?.width ?? 0, expected?.height ?? 0),
      };
    });
  const storyVisualSlots = (bundle?.stories ?? []).map((story) => ({
    storyId: story.id,
    slug: story.slug,
    title: story.title,
    status: story.heroAssetId ? 'attributed' : 'missing',
    heroAssetId: story.heroAssetId ?? null,
    assetReviewStatus: story.heroAssetId ? storyIllustrationsById.get(story.heroAssetId)?.provenance.reviewStatus ?? 'untracked' : 'missing',
    worldIds: story.requiredWorldIds ?? story.worldIds,
    sceneIds: story.requiredSceneIds ?? story.sceneIds,
    characterIds: story.requiredCharacterIds ?? story.characterIds,
    objectIds: story.requiredObjectIds ?? story.objectIds ?? [],
  }));
  const storyImageFileAudit = storyVisualSlots.map((slot) => {
    const illustration = slot.heroAssetId ? storyIllustrationsById.get(slot.heroAssetId) : undefined;
    return {
      storyId: slot.storyId,
      heroAssetId: slot.heroAssetId,
      ...(illustration ? auditImageFile(illustration.image.src, illustration.image.width, illustration.image.height) : {
        assetPath: null,
        exists: false,
        width: null,
        height: null,
        dimensionsMatch: false,
        expectedWidth: null,
        expectedHeight: null,
      }),
    };
  });
  const visualFileAudit = {
    worldAiAssets: worldImageFileAudit,
    storyKeyMoments: storyImageFileAudit,
    missingFiles: [...worldImageFileAudit, ...storyImageFileAudit].filter((item) => !item.exists).length,
    invalidOrMismatchedDimensions: [...worldImageFileAudit, ...storyImageFileAudit].filter((item) => item.exists && !item.dimensionsMatch).length,
    nonFinalWorldOutputSpecs: worldImageFileAudit.filter((item) => !item.finalOutputSpecMatch).length,
    missingWorldSourceAssets: worldImageFileAudit.filter((item) => item.sourceAssetFile?.exists === false).length,
    suspiciouslySmallFiles: visualFileFingerprints.filter((item) => item.exists && item.byteLength < 100_000).map((item) => ({ assetPath: item.assetPath, byteLength: item.byteLength })),
    duplicateContentGroups: Object.entries(Object.groupBy(visualFileFingerprints.filter((item) => item.exists && item.sha256), (item) => item.sha256))
      .filter(([, items]) => items.length > 1)
      .map(([sha256, items]) => ({ sha256, assetPaths: items.map((item) => item.assetPath) })),
    visualFileFingerprints,
  };
  for (const item of [...worldImageFileAudit, ...storyImageFileAudit]) {
    if (!item.exists) issues.push(`visual asset file is missing: ${item.assetPath ?? item.heroAssetId}`);
    else if (!item.dimensionsMatch) issues.push(`visual asset dimensions mismatch: ${item.assetPath} (${item.width}×${item.height}; expected ${item.expectedWidth}×${item.expectedHeight})`);
  }
  if (visualFileAudit.nonFinalWorldOutputSpecs > 0) issues.push(`World asset metadata does not match final OutputSpec: ${visualFileAudit.nonFinalWorldOutputSpecs}`);
  if (visualFileAudit.missingWorldSourceAssets > 0) issues.push(`World source asset file is missing: ${visualFileAudit.missingWorldSourceAssets}`);
  if (visualFileAudit.suspiciouslySmallFiles.length > 0) issues.push(`visual asset file is suspiciously small (<100KB): ${visualFileAudit.suspiciouslySmallFiles.map((item) => item.assetPath).join(', ')}`);
  if (visualFileAudit.duplicateContentGroups.length > 0) issues.push(`visual asset files contain duplicate content: ${visualFileAudit.duplicateContentGroups.map((group) => group.assetPaths.join(' = ')).join('; ')}`);
  const storyVisualReadiness = {
    totalSlots: storyVisualSlots.length,
    attributedSlots: storyVisualSlots.filter((slot) => slot.status === 'attributed').length,
    missingSlots: storyVisualSlots.filter((slot) => slot.status === 'missing').length,
    approvedSlots: storyVisualSlots.filter((slot) => hasHumanIllustrationReview(storyIllustrationsById.get(slot.heroAssetId ?? ''))).length,
    coreCharacterCount: coreVisualCharacterIds.size,
    canonicalDesignReadyCoreCharacters,
    coreCharacterDesignGate: canonicalDesignReadyCoreCharacters === coreVisualCharacterIds.size,
  };
  const P0ManifestStories = norseStoryManifest.filter((story) => story.priority === 'P0');
  const P0ManifestStoriesWithPublishedPage = P0ManifestStories.filter((manifestStory) => {
    const story = manifestStory.existingStoryId ? storyById.get(manifestStory.existingStoryId) : undefined;
    return story?.publishStatus === 'published';
  });
  const P0ManifestStoriesSourceReviewed = P0ManifestStories.filter((manifestStory) => {
    const story = manifestStory.existingStoryId ? storyById.get(manifestStory.existingStoryId) : undefined;
    return hasHumanSourceReview(story);
  });
  const certification = {
    status: 'in-progress',
    sourceResolution: issues.length === 0,
    sourceResolutionMeaning: 'machine-source-registry-and-known-issue-integrity-only',
    semanticDependencyClosure: dependencyGapList.length === 0 && dependencyClosureGaps.length === 0,
    publishedP0Pages: { complete: P0ManifestStoriesWithPublishedPage.length === P0ManifestStories.length, completed: P0ManifestStoriesWithPublishedPage.length, total: P0ManifestStories.length },
    sourceReviewedP0Pages: { complete: P0ManifestStoriesSourceReviewed.length === P0ManifestStories.length, completed: P0ManifestStoriesSourceReviewed.length, total: P0ManifestStories.length },
    visualReadyWorlds: { complete: approvedWorldAssetPairs.length === norseWorldIds.size, completed: approvedWorldAssetPairs.length, total: norseWorldIds.size },
    visualFileAudit: {
      complete: visualFileAudit.missingFiles === 0
        && visualFileAudit.invalidOrMismatchedDimensions === 0
        && visualFileAudit.suspiciouslySmallFiles.length === 0
        && visualFileAudit.duplicateContentGroups.length === 0,
      missingFiles: visualFileAudit.missingFiles,
      invalidOrMismatchedDimensions: visualFileAudit.invalidOrMismatchedDimensions,
      suspiciouslySmallFiles: visualFileAudit.suspiciouslySmallFiles.length,
      duplicateContentGroups: visualFileAudit.duplicateContentGroups.length,
    },
    manualApprovalRequired: true,
  };

  const cycleRows = norseStoryCycles.map((cycle) => ({
    cycle,
    stories: norseStoryManifest.filter((story) => story.cycleIds.includes(cycle)),
  }));
  const inventory = {
    sources: norseSources.length,
    coverageRows: norseSourceCoverage.length,
    uniqueStories: norseStoryManifest.length,
    P0Stories: norseStoryManifest.filter((story) => story.priority === 'P0').length,
    researchReadyP0StoryUnits: norseStoryManifest.filter((story) => story.priority === 'P0' && ['source-reviewed', 'published'].includes(story.status)).length,
    P1Stories: norseStoryManifest.filter((story) => story.priority === 'P1').length,
    P2Stories: norseStoryManifest.filter((story) => story.priority === 'P2').length,
    P0Sources: norseSourceCoverage.filter((row) => row.priority === 'P0').length,
    currentCharacters: bundle?.characters.length ?? 0,
    currentWorlds: bundle?.worlds.length ?? 0,
    currentScenes: bundle?.scenes.length ?? 0,
    currentObjects: bundle?.objects?.length ?? 0,
    currentStories: bundle?.stories.length ?? 0,
    currentCharacterRelations: bundle?.relations.length ?? 0,
    currentContentRelations: bundle?.contentRelations?.length ?? 0,
    currentCharacterNames: identityLayer.names.length,
    currentCharacterInterpretations: identityLayer.interpretations.length,
    currentContentClaims: identityLayer.claims.length,
    contestedContentClaims: identityLayer.claims.filter((claim) => claim.status === 'contested').length,
    manifestWorldScenePlanStories: norseStoryManifest.filter((story) => story.existingStoryId && story.expectedDependencies.world.length > 0 && story.expectedDependencies.scene.length > 0).length,
    manifestBackedStories: manifestExistingStories.length,
    dependencyGaps: dependencyGapList.length,
    resolvedP0KnownIssues: norseKnownIssues.filter((issue) => issue.priority === 'P0' && issue.status === 'resolved').length,
    scopedP0Variants: norseVariantNotes.filter((note) => note.priority === 'P0' && note.status === 'scoped').length,
    currentStoryMigrationDecisions: (bundle?.stories.length ?? 0) - currentStoryMigrationGaps.length,
    plannedNewStories: norseStoryManifest.filter((story) => !story.existingStoryId && story.status !== 'excluded').length,
  };
  const payload = {
    generatedAt: new Date().toISOString(),
    inventory,
    sourceCoverage: norseSourceCoverage,
    storyManifest: norseStoryManifest,
    currentContent: {
      editorialStatusCounts,
      identityLayer: {
        names: identityLayer.names,
        interpretations: identityLayer.interpretations,
        claims: identityLayer.claims,
      },
      sourceLocatorAudit,
      readiness,
      visualReadiness,
      visualFileAudit,
      storyVisualReadiness,
      sourcePreflightSummary,
      sourcePreflight,
      storyVisualSlots,
      editorialMigrationGaps,
      templateStoryIds,
      editorialBodyMetrics,
      editorialBodyReadyStoryIds,
      editorialBodyShortStoryIds,
      readingTimeMismatchStoryIds,
      impreciseSourceLocatorStoryIds,
      knownIssues: norseKnownIssues,
      variantNotes: norseVariantNotes,
      currentStoryMigrationGaps,
      dependencyClosureGaps,
      plannedNewStories: norseStoryManifest.filter((story) => !story.existingStoryId && story.status !== 'excluded').map((story) => story.id),
      dependencyGapList,
    },
    certification,
    delivery: {
      publicStoryRoutes: publicStoryPaths.length,
      indexableStoryRoutes: indexableStoryPaths.length,
      publicStoryRedirectRoutes: publicStoryRedirectPaths.length,
      indexableStoryGate: indexableStoryPaths.every((path) => publicStoryPaths.some((publicPath) => publicPath.slug === path.slug)),
    },
    collectionHandoff,
    issues,
  };
  const completionBlockers = [
    ...(issues.length ? [`coverage report has ${issues.length} issue(s)`] : []),
    ...(!certification.visualFileAudit.complete ? [`visual file audit ${certification.visualFileAudit.missingFiles} missing / ${certification.visualFileAudit.invalidOrMismatchedDimensions} invalid-or-mismatched / ${certification.visualFileAudit.suspiciouslySmallFiles} suspiciously-small / ${certification.visualFileAudit.duplicateContentGroups} duplicate-groups`] : []),
    ...(!certification.sourceReviewedP0Pages.complete ? [`P0 source review ${certification.sourceReviewedP0Pages.completed}/${certification.sourceReviewedP0Pages.total}`] : []),
    ...(!certification.visualReadyWorlds.complete ? [`World visual approval ${certification.visualReadyWorlds.completed}/${certification.visualReadyWorlds.total}`] : []),
    ...(collectionHandoff.gates.visualApprovedStoryKeyMoments !== 'ready' ? ['Story key-moment visual approval is pending'] : []),
    ...(collectionHandoff.eligibleCycleIds.length !== collectionHandoff.cycles.length ? [`Collection-eligible cycles ${collectionHandoff.eligibleCycleIds.length}/${collectionHandoff.cycles.length}`] : []),
    ...(collectionHandoff.gates.identityAudit !== 'ready' ? ['Phase 6 identity audit is pending or lacks a complete approval record'] : []),
    ...(collectionHandoff.gates.productSignoff !== 'ready' ? ['product sign-off is pending or lacks a complete approval record'] : []),
    ...(collectionHandoff.gates.snapshotApproval !== 'ready' ? ['Completion Snapshot approval is pending or lacks a complete approval record'] : []),
    ...(!payload.delivery.indexableStoryGate ? ['indexable Story routes are not a subset of public Story routes'] : []),
  ];
  payload.completionBlockers = completionBlockers;

  if (write) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    const lines = [
      '# MythCanvas 北欧 Story Map',
      '',
      '> 由 `src/content/norse/story-manifest.ts` 与 `source-coverage.ts` 生成。此文档是 Phase 2 研究快照，不替代源文件；修改范围应回写到静态 Manifest。',
      '',
      '## 基线',
      '',
      `- Source Registry：${inventory.sources}`,
      `- Coverage Rows：${inventory.coverageRows}`,
      `- Coverage 行审校语义（scope-mapped / human-audited）：${norseSourceCoverage.filter((row) => row.reviewKind === 'scope-mapped').length} / ${norseSourceCoverage.filter((row) => row.reviewKind === 'human-audited').length}`,
      `- Unique Story Units：${inventory.uniqueStories}`,
      `- P0 / P1 / P2：${inventory.P0Stories} / ${inventory.P1Stories} / ${inventory.P2Stories}`,
      `- 已完成来源研究的 P0 Story Manifest（研究状态，不代表读者页已审校）：${inventory.researchReadyP0StoryUnits} / ${inventory.P0Stories}`,
      `- 当前已落库静态内容（Character / World / Scene / Object / Story / CharacterRelation / ContentRelation）：${inventory.currentCharacters} / ${inventory.currentWorlds} / ${inventory.currentScenes} / ${inventory.currentObjects} / ${inventory.currentStories} / ${inventory.currentCharacterRelations} / ${inventory.currentContentRelations}`,
      `- 身份与事实层（CharacterName / CharacterInterpretation / ContentClaim；其中 contested Claim）：${inventory.currentCharacterNames} / ${inventory.currentCharacterInterpretations} / ${inventory.currentContentClaims}；${inventory.contestedContentClaims}`,
      `- Manifest 已明确 World + Scene 依赖计划的现有 Story 单元：${inventory.manifestWorldScenePlanStories} / ${inventory.manifestBackedStories}`,
      `- 网站交付路由（public / indexable / legacy redirect）：${publicStoryPaths.length} / ${indexableStoryPaths.length} / ${publicStoryRedirectPaths.length}`,
      `- 当前 Story editorial readiness（public / structured-or-better / source-reviewed-or-visual-ready / researching / prototype / shared-template）：${readiness.publicStories} / ${readiness.structuredStories} / ${readiness.editorialReadyStories} / ${readiness.researchingStories} / ${readiness.prototypeStories} / ${readiness.templateStories}`,
      `- 仍使用宽泛/Phase 3 占位 locator 的 Story：${readiness.impreciseSourceLocatorStories}`,
      `- Editorial body gate 候选（正文 ≥800 字符、至少 3 个分段、无模板、阅读时长一致）：${readiness.editorialBodyReadyStories} / ${readiness.publicStories}`,
      `- 正文仍低于 Editorial Gate 的 Story：${readiness.editorialBodyShortStories}`,
      `- readingMinutes 不一致的 Story：${readiness.readingTimeMismatchStories}`,
      `- 世界视觉就绪度（独立生成桌面+移动组 / 人工批准组 / 总世界数）：${visualReadiness.independentlyGeneratedWorldPairs} / ${visualReadiness.approvedWorldPairs} / ${visualReadiness.worldCount}`,
      `- 视觉文件审计（World AI + Story key-moment；缺失 / 尺寸不符 / 可疑小文件 / 重复内容组）：${visualFileAudit.missingFiles} / ${visualFileAudit.invalidOrMismatchedDimensions} / ${visualFileAudit.suspiciouslySmallFiles.length} / ${visualFileAudit.duplicateContentGroups.length}`,
      `- World 最终 OutputSpec（desktop 2560×1440 / mobile 1440×2560）：${visualFileAudit.nonFinalWorldOutputSpecs === 0 ? '通过' : '未通过'}；原始草稿可追溯性缺失 ${visualFileAudit.missingWorldSourceAssets}`,
      `- 视觉文件内容指纹：${visualFileFingerprints.filter((item) => item.exists && item.sha256).length} / ${visualFileFingerprints.length} 个文件已纳入 Snapshot SHA-256 锁定`,
      `- Story key-moment 视觉槽位（已归属 / 已批准 / 总数）：${storyVisualReadiness.attributedSlots} / ${storyVisualReadiness.approvedSlots} / ${storyVisualReadiness.totalSlots}`,
      `- Tier S/A Character Canonical Design（已具备 / 总数）：${storyVisualReadiness.canonicalDesignReadyCoreCharacters} / ${storyVisualReadiness.coreCharacterCount}`,
      `- Manifest 已有 Story 但静态内容缺失：${readiness.missingManifestBackedStories}`,
      `- Manifest expectedDependencies 未进入 Story.required*Ids 的闭包缺口：${readiness.dependencyClosureGaps}`,
      `- 现有 Story 迁移决策：${inventory.currentStoryMigrationDecisions} / ${inventory.currentStories}`,
      `- 新增 Story 待办：${inventory.plannedNewStories}`,
      `- Story Manifest 依赖缺口：${inventory.dependencyGaps}（作为 Phase 3–4 的实体补全待办，不是本阶段 gate failure）`,
      `- 已解决 P0 已知问题：${inventory.resolvedP0KnownIssues}`,
      `- 已范围化 P0 版本冲突：${inventory.scopedP0Variants}`,
      `- Collection Discovery 输入：${collectionHandoff.status}（候选 Cycle ${collectionHandoff.eligibleCycleIds.length} / ${collectionHandoff.cycles.length}）`,
      `- Report Gate：${issues.length === 0 ? '通过' : `失败（${issues.length} 项）`}`,
      '',
      '## Story Cycles',
      '',
    ];
    for (const row of cycleRows) {
      lines.push(`### ${row.cycle}（${row.stories.length}）`, '');
      for (const story of row.stories) lines.push(`- [${story.priority}] ${story.titleZh} · \`${story.proposedSlug}\` · ${story.sourceScopes.map((source) => `${source.sourceId} ${source.locator}`).join('；')}`);
      lines.push('');
    }
    lines.push('## Source-scoped Variant Notes', '');
    for (const note of norseVariantNotes) lines.push(`- [${note.priority}] ${note.topic} · ${note.editorialRule}`);
    lines.push('');
    const gapsByType = Object.groupBy(dependencyGapList, (gap) => gap.entityType);
    lines.push('## Phase 3–4 Dependency Gaps', '');
    if (dependencyGapList.length === 0) {
      lines.push('- 无。');
    } else {
      for (const [entityType, gaps] of Object.entries(gapsByType)) {
        lines.push(`### ${entityType}（${gaps.length}）`, '');
        for (const gap of gaps) lines.push(`- \`${gap.id}\` ← ${gap.storyManifestId}`);
        lines.push('');
      }
    }
    lines.push('## Manifest → Story Required Dependency Closure', '');
    if (dependencyClosureGaps.length === 0) {
      lines.push('- 无。');
    } else {
      for (const gap of dependencyClosureGaps) lines.push(`- \`${gap.manifestStoryId}\` → \`${gap.storyId}\`: missing required ${gap.entityType} \`${gap.id}\``);
    }
    lines.push('## Gate Issues', '', ...(issues.length ? issues.map((issue) => `- ${issue}`) : ['- 无。']), '');
    fs.writeFileSync(storyMapPath, lines.join('\n'), 'utf8');
    const handoffLines = [
      '# 北欧神话 Collection Handoff（Discovery Input）',
      '',
      '> 这是完成内容体系后才能使用的 Collection Discovery 输入，不是商品方案，也不会自动创建 Collection 或 Card Manifest。',
      '',
      `- Version: ${collectionHandoff.version}`,
      `- Snapshot version: ${collectionHandoff.snapshotVersion}`,
      `- Status: ${collectionHandoff.status}`,
      `- Eligible cycles: ${collectionHandoff.eligibleCycleIds.length} / ${collectionHandoff.cycles.length}`,
      `- Deferred cycles: ${collectionHandoff.deferredCycleIds.join('、') || 'none'}`,
      '',
      '## Gates',
      '',
      `- P0 source review: ${collectionHandoff.gates.sourceReviewedP0}`,
      `- World visual approval: ${collectionHandoff.gates.visualApprovedWorlds}`,
      `- Story key-moment visual approval: ${collectionHandoff.gates.visualApprovedStoryKeyMoments}`,
      `- Phase 6 identity audit: ${collectionHandoff.gates.identityAudit}`,
      `- Product sign-off: ${collectionHandoff.gates.productSignoff}`,
      `- Completion Snapshot approval: ${collectionHandoff.gates.snapshotApproval}`,
      `- Phase 6 identity audit record: ${collectionHandoff.approvalRecords.identityAudit.status} · snapshot version: ${collectionHandoff.approvalRecords.identityAudit.snapshotVersion ?? 'pending'} · reviewer type: ${collectionHandoff.approvalRecords.identityAudit.reviewerType ?? 'pending'} · reviewer: ${collectionHandoff.approvalRecords.identityAudit.reviewer ?? 'pending'} · reviewed at: ${collectionHandoff.approvalRecords.identityAudit.reviewedAt ?? 'pending'}`,
      `- Product sign-off record: ${collectionHandoff.approvalRecords.productSignoff.status} · snapshot: ${collectionHandoff.approvalRecords.productSignoff.snapshotVersion ?? 'pending'} · reviewer type: ${collectionHandoff.approvalRecords.productSignoff.reviewerType ?? 'pending'} · reviewer: ${collectionHandoff.approvalRecords.productSignoff.reviewer ?? 'pending'} · signed at: ${collectionHandoff.approvalRecords.productSignoff.signedAt ?? 'pending'}`,
      `- Completion Snapshot approval record: ${collectionHandoff.approvalRecords.snapshotApproval.status} · snapshot version: ${collectionHandoff.approvalRecords.snapshotApproval.snapshotVersion ?? 'pending'} · reviewer type: ${collectionHandoff.approvalRecords.snapshotApproval.reviewerType ?? 'pending'} · reviewer: ${collectionHandoff.approvalRecords.snapshotApproval.reviewer ?? 'pending'} · reviewed at: ${collectionHandoff.approvalRecords.snapshotApproval.reviewedAt ?? 'pending'}`,
      `- Visual file audit: ${certification.visualFileAudit.complete ? 'passed' : 'failed'} · missing ${visualFileAudit.missingFiles} · invalid/mismatched dimensions ${visualFileAudit.invalidOrMismatchedDimensions} · suspiciously small ${visualFileAudit.suspiciouslySmallFiles.length} · duplicate groups ${visualFileAudit.duplicateContentGroups.length}`,
      `- World final OutputSpec (desktop 2560×1440 / mobile 1440×2560): ${visualFileAudit.nonFinalWorldOutputSpecs === 0 ? 'passed' : 'failed'} · missing source assets ${visualFileAudit.missingWorldSourceAssets}`,
      `- Visual file content fingerprints: ${visualFileFingerprints.filter((item) => item.exists && item.sha256).length}/${visualFileFingerprints.length} files included in Snapshot SHA-256 binding`,
      '- Sign-off source: `src/content/norse/collection-signoff.ts`',
      '',
      '## Cycle evidence',
      '',
    ];
    for (const cycle of collectionHandoff.cycles) {
      handoffLines.push(
        `### ${cycle.cycleId}`,
        '',
        `- Stories: ${cycle.storyCount}；published: ${cycle.publishedStoryCount}；source-reviewed: ${cycle.sourceReviewedStoryCount}`,
        `- Explicitly deferred / excluded Stories: ${cycle.deferredStoryManifestIds.length}${cycle.deferredStoryManifestIds.length ? `（${cycle.deferredStoryManifestIds.join('、')}）` : ''}`,
        `- P0: ${cycle.p0SourceReviewedStoryCount} / ${cycle.p0StoryCount} source-reviewed`,
        `- Entities: Character ${cycle.characterIds.length} · World ${cycle.worldIds.length} · Scene ${cycle.sceneIds.length} · Object ${cycle.objectIds.length}`,
        `- Narrative continuity: ${cycle.narrativeContinuity.status}${cycle.narrativeContinuity.reasons.length ? `（${cycle.narrativeContinuity.reasons.join('；')}）` : ''}`,
        `- Visual diversity: ${cycle.visualDiversity.status}（worlds ${cycle.visualDiversity.approvedWorldCount}/${cycle.visualDiversity.worldCount} approved · key moments ${cycle.visualDiversity.approvedStoryKeyMomentCount}/${cycle.storyCount} approved · ${cycle.visualDiversity.sceneCount} scenes · ${cycle.visualDiversity.objectCount} objects${cycle.visualDiversity.reasons.length ? ` · ${cycle.visualDiversity.reasons.join('；')}` : ''}）`,
        `- Natural card capacity: ${cycle.naturalCardCapacity.status}`,
        `- Cross-cycle dependencies: ${cycle.crossCycleDependencies.map((item) => `${item.cycleId} [characters ${item.sharedCharacterIds.length}, worlds ${item.sharedWorldIds.length}]`).join('；') || 'none recorded'}`,
        '',
      );
    }
    handoffLines.push('## Explicit exclusions', '', ...collectionHandoff.exclusions.map((item) => `- ${item}`), '');
    fs.writeFileSync(collectionHandoffDocPath, handoffLines.join('\n'), 'utf8');
    fs.writeFileSync(collectionHandoffReportPath, `${JSON.stringify(collectionHandoff, null, 2)}\n`, 'utf8');
    const snapshotLines = [
      '# 北欧神话 Completion Snapshot（草稿）',
      '',
      '> 本文件由 `npm run content:coverage:norse` 自动生成，用于 Phase 9 的证据汇总。它不是完成认证，也不能替代人工来源审校、身份审计、视觉批准或产品验收。',
      '',
      `- 生成时间：${payload.generatedAt}`,
      `- Snapshot version：${collectionHandoff.snapshotVersion}`,
      `- 认证状态：${certification.status}`,
      `- 认证命令阻塞项：${completionBlockers.length}`,
      `- Source Registry / Coverage Rows：${inventory.sources} / ${inventory.coverageRows}`,
      `- Coverage 行审校语义（scope-mapped / human-audited）：${norseSourceCoverage.filter((row) => row.reviewKind === 'scope-mapped').length} / ${norseSourceCoverage.filter((row) => row.reviewKind === 'human-audited').length}`,
      `- Story Manifest（P0 / P1 / P2）：${inventory.uniqueStories}（${inventory.P0Stories} / ${inventory.P1Stories} / ${inventory.P2Stories}）`,
      `- 静态实体（Character / World / Scene / Object / Story）：${inventory.currentCharacters} / ${inventory.currentWorlds} / ${inventory.currentScenes} / ${inventory.currentObjects} / ${inventory.currentStories}`,
      `- 身份与事实层（CharacterName / CharacterInterpretation / ContentClaim；其中 contested Claim）：${inventory.currentCharacterNames} / ${inventory.currentCharacterInterpretations} / ${inventory.currentContentClaims}；${inventory.contestedContentClaims}`,
      `- Manifest 已明确 World + Scene 依赖计划的现有 Story 单元：${inventory.manifestWorldScenePlanStories} / ${inventory.manifestBackedStories}`,
      `- 网站交付路由（public / indexable / legacy redirect）：${publicStoryPaths.length} / ${indexableStoryPaths.length} / ${publicStoryRedirectPaths.length}`,
      `- Collection Discovery 输入：${collectionHandoff.status}（候选 Cycle ${collectionHandoff.eligibleCycleIds.length} / ${collectionHandoff.cycles.length}）；详见 \`docs/NORSE_COLLECTION_HANDOFF.md\`。`,
      '',
      '## Gate evidence',
      '',
      `- 机器来源登记与已知问题完整性：${certification.sourceResolution ? '通过' : '未通过'}（不等于逐篇人工 source review）`,
      `- Semantic dependency closure：${certification.semanticDependencyClosure ? '通过' : '未通过'}（缺口 ${inventory.dependencyGaps}）`,
      `- Entity / Relation / Claim locator audit：${sourceLocatorAudit.status}（不精确 locator ${sourceLocatorAudit.impreciseCount}）`,
      `- P0 已有读者页：${certification.publishedP0Pages.completed} / ${certification.publishedP0Pages.total}`,
      `- P0 已通过来源审校的读者页：${certification.sourceReviewedP0Pages.completed} / ${certification.sourceReviewedP0Pages.total}`,
      `- 世界视觉资产已人工批准（独立桌面 + 移动构图）：${certification.visualReadyWorlds.completed} / ${certification.visualReadyWorlds.total}`,
      `- 产品签字：${collectionHandoff.gates.productSignoff}（snapshot: ${collectionHandoff.approvalRecords.productSignoff.snapshotVersion ?? 'pending'}；reviewer type: ${collectionHandoff.approvalRecords.productSignoff.reviewerType ?? 'pending'}；reviewer: ${collectionHandoff.approvalRecords.productSignoff.reviewer ?? 'pending'}；signed at: ${collectionHandoff.approvalRecords.productSignoff.signedAt ?? 'pending'}）`,
      `- Completion Snapshot 人工批准：${collectionHandoff.gates.snapshotApproval}（snapshot version: ${collectionHandoff.approvalRecords.snapshotApproval.snapshotVersion ?? 'pending'}；reviewer type: ${collectionHandoff.approvalRecords.snapshotApproval.reviewerType ?? 'pending'}；reviewer: ${collectionHandoff.approvalRecords.snapshotApproval.reviewer ?? 'pending'}；reviewed at: ${collectionHandoff.approvalRecords.snapshotApproval.reviewedAt ?? 'pending'}）`,
      `- Phase 6 身份与事实层人工审校：${collectionHandoff.gates.identityAudit}（CharacterName ${identityLayer.names.length}；CharacterInterpretation ${identityLayer.interpretations.length}；ContentClaim ${identityLayer.claims.length}；reviewer: ${collectionHandoff.approvalRecords.identityAudit.reviewer ?? 'pending'}；reviewed at: ${collectionHandoff.approvalRecords.identityAudit.reviewedAt ?? 'pending'}）`,
      `- 世界视觉资产已生成但仍为草稿：${visualReadiness.independentlyGeneratedWorldPairs} / ${visualReadiness.worldCount}（草稿资产 ${visualReadiness.draftAiAssets} 个）`,
      `- 视觉文件审计：${certification.visualFileAudit.complete ? '通过' : '未通过'}（缺失 ${visualFileAudit.missingFiles}；尺寸不符 ${visualFileAudit.invalidOrMismatchedDimensions}；可疑小文件 ${visualFileAudit.suspiciouslySmallFiles.length}；重复内容组 ${visualFileAudit.duplicateContentGroups.length}）`,
      `- World 最终 OutputSpec（desktop 2560×1440 / mobile 1440×2560）：${visualFileAudit.nonFinalWorldOutputSpecs === 0 ? '通过' : '未通过'}；原始草稿可追溯性缺失 ${visualFileAudit.missingWorldSourceAssets}`,
      `- 视觉文件内容指纹：${visualFileFingerprints.filter((item) => item.exists && item.sha256).length} / ${visualFileFingerprints.length} 个文件已纳入 Snapshot SHA-256 锁定`,
      `- 仍只有共享 prototype fallback、尚无独立 AI 双端组的世界：${visualReadiness.prototypeOnlyWorlds.length} / ${visualReadiness.worldCount}`,
      '- 逐世界视觉审查队列：`docs/NORSE_VISUAL_REVIEW_QUEUE.md`。',
      '- Story key-moment 审查队列：`docs/NORSE_STORY_VISUAL_REVIEW_QUEUE.md`。',
      '',
      '## Blocking work',
      '',
      `- 尚无读者页的 Manifest Story：${inventory.plannedNewStories}`,
      `- 尚处于 researching 的来源绑定研究稿：${readiness.researchingStories}`,
      `- 仍使用宽泛/Phase 3 占位 locator 的 Story：${readiness.impreciseSourceLocatorStories}`,
      `- Entity / Relation / Claim 仍使用宽泛 locator：${sourceLocatorAudit.impreciseCount}`,
      `- Editorial body gate 候选（正文 ≥800 字符、至少 3 个分段、无模板、阅读时长一致）：${readiness.editorialBodyReadyStories} / ${readiness.publicStories}`,
      `- 正文仍低于 Editorial Gate 的 Story：${readiness.editorialBodyShortStories}`,
      `- readingMinutes 不一致的 Story：${readiness.readingTimeMismatchStories}`,
      `- 仍含共享模板正文的已发布 Story：${readiness.templateStories}`,
      `- 尚未完成 source-reviewed 的 P0 读者页：${certification.sourceReviewedP0Pages.total - certification.sourceReviewedP0Pages.completed}`,
      `- 尚未由人工批准的世界双端视觉组：${certification.visualReadyWorlds.total - certification.visualReadyWorlds.completed}`,
      `- 尚未补齐 Story key-moment 视觉槽位：${storyVisualReadiness.missingSlots}`,
      '- 最终 Snapshot 必须记录人工审校人、日期、未决项和明确批准；自动化不会将上述状态改为完成。',
      '',
      '## Deferred / exclusions',
      '',
      ...collectionHandoff.exclusions.filter((item) => item.startsWith('P2 ')).map((item) => `- ${item}`),
      '- 英文长文、关键时刻插画和 Collection 编排仅在对应 Story 完成来源审校与视觉批准后进入交付范围。',
      '',
    ];
    fs.writeFileSync(completionSnapshotPath, snapshotLines.join('\n'), 'utf8');
    const visualReviewQueueLines = [
      '# 北欧世界视觉审查队列',
      '',
      '> 由 `npm run content:coverage:norse` 生成。每个世界必须分别检查桌面与移动构图、来源边界、主题适配、可读性和人工批准状态；共享 prototype fallback 不算完成。',
      '',
      `- 生成时间：${payload.generatedAt}`,
      `- 独立 AI 双端草稿：${visualReadiness.independentlyGeneratedWorldPairs} / ${visualReadiness.worldCount}`,
      `- 人工批准双端组：${visualReadiness.approvedWorldPairs} / ${visualReadiness.worldCount}`,
      '',
      '## World queue',
      '',
    ];
    const worldImageFileAuditByPath = new Map(worldImageFileAudit.map((item) => [item.assetPath, item]));
    for (const world of [...(bundle?.worlds ?? [])].toSorted((a, b) => a.name.localeCompare(b.name, 'zh-CN'))) {
      const desktop = norseAssetProvenance.find((asset) => asset.ownerId === world.id && asset.outputSpecId === 'desktop-wallpaper' && asset.sourceType === 'ai');
      const mobile = norseAssetProvenance.find((asset) => asset.ownerId === world.id && asset.outputSpecId === 'mobile-wallpaper' && asset.sourceType === 'ai');
      const describe = (asset) => {
        if (!asset) return '共享 prototype fallback · 未完成独立生成';
        const audit = worldImageFileAuditByPath.get(asset.assetPath);
        const fileStatus = audit?.exists ? `${audit.width}×${audit.height}` : 'missing';
        const fileFingerprint = audit?.sha256 ?? 'missing';
        const provenance = asset.sourceAssetPath
          ? `source: ${asset.sourceAssetPath} · transform: ${asset.deliveryTransform ?? 'none'}`
          : 'source: n/a';
        return `${asset.assetPath} · ${asset.reviewStatus} · file: ${fileStatus} · sha256: ${fileFingerprint} · ${provenance} · reviewer type: ${asset.reviewerType ?? 'pending'} · reviewer: ${asset.reviewer ?? 'pending'} · reviewed at: ${asset.reviewedAt ?? 'pending'} · review notes: ${asset.reviewNotes?.join('；') || 'pending'}`;
      };
      visualReviewQueueLines.push(
        `- **${world.name} / ${world.nameEn}** (\`${world.id}\`)`,
        `  - Desktop: ${describe(desktop)}`,
        `  - Mobile: ${describe(mobile)}`,
        `  - Human QA: ${hasHumanAssetReview(desktop) && hasHumanAssetReview(mobile) ? 'approved' : 'needs-review'}`,
        `  - Review focus: ${world.canonicalDesign.anchors.join('、')}；检查素材是否仍停留在来源事实、物质证据与 MythCanvas 原创设计的分层边界。`,
        '',
      );
    }
    visualReviewQueueLines.push('## Approval record', '', '- Reviewer type: pending', '- Reviewer: pending', '- Reviewed at: pending', '- Decision: pending', '');
    fs.writeFileSync(visualReviewQueuePath, visualReviewQueueLines.join('\n'), 'utf8');
    const storyVisualReviewQueueLines = [
      '# 北欧 Story Key-Moment 视觉审查队列',
      '',
      '> 本队列对应 Phase 7 的 Story key-moment 插画槽位。World 双端草稿不能替代故事视觉证据；没有明确 hero/key-moment 资产的 Story 不得进入 `visual-ready`。',
      '',
      `- 已归属槽位：${storyVisualReadiness.attributedSlots} / ${storyVisualReadiness.totalSlots}`,
      `- 已批准槽位：${storyVisualReadiness.approvedSlots} / ${storyVisualReadiness.totalSlots}`,
      `- Tier S/A Character Canonical Design：${storyVisualReadiness.canonicalDesignReadyCoreCharacters} / ${storyVisualReadiness.coreCharacterCount}`,
      '',
      '## Story queue',
      '',
    ];
    for (const slot of storyVisualSlots) {
      const fileAudit = storyImageFileAudit.find((item) => item.storyId === slot.storyId);
      storyVisualReviewQueueLines.push(
        `- **${slot.title}** (\`${slot.slug}\`) · ${slot.status === 'attributed' ? 'attributed' : 'needs-key-moment-asset'}`,
        `  - characters: ${slot.characterIds.join(', ') || 'none'} · worlds: ${slot.worldIds.join(', ') || 'none'} · scenes: ${slot.sceneIds.join(', ') || 'none'} · objects: ${slot.objectIds.join(', ') || 'none'}`,
        `  - heroAssetId: ${slot.heroAssetId ?? 'pending'} · asset review: ${slot.assetReviewStatus} · file: ${fileAudit?.exists ? `${fileAudit.width}×${fileAudit.height}` : 'missing'} · sha256: ${fileAudit?.sha256 ?? 'missing'} · reviewer type: ${slot.heroAssetId ? storyIllustrationsById.get(slot.heroAssetId)?.provenance.reviewerType ?? 'pending' : 'pending'} · reviewer: ${slot.heroAssetId ? storyIllustrationsById.get(slot.heroAssetId)?.provenance.reviewer ?? 'pending' : 'pending'} · reviewed at: ${slot.heroAssetId ? storyIllustrationsById.get(slot.heroAssetId)?.provenance.reviewedAt ?? 'pending' : 'pending'} · review notes: ${slot.heroAssetId ? storyIllustrationsById.get(slot.heroAssetId)?.provenance.reviewNotes?.join('；') || 'pending' : 'pending'}`,
      );
    }
    storyVisualReviewQueueLines.push('', '## Gate', '', '- Reviewer type: pending', '- Reviewer: pending', '- Decision: pending', '- Note: 资产生成、来源边界、桌面/移动构图和产品文案安全区必须分别审查。', '');
    fs.writeFileSync(storyVisualReviewQueuePath, storyVisualReviewQueueLines.join('\n'), 'utf8');
    const reviewQueueLines = [
      '# 北欧 Story 编辑审校队列',
      '',
      '> 由 `npm run content:coverage:norse` 生成。每一项必须由具名人工审校者依据列出的来源范围作出决定；不得把此队列或自动校验视为审校通过。',
      '',
      `- 生成时间：${payload.generatedAt}`,
      `- 已发布 Story：${readiness.publicStories}`,
      `- 待人工来源审校：${readiness.publicStories - readiness.editorialReadyStories}`,
      '',
      '## Review procedure',
      '',
      '1. 核对正文、摘要、人物/地点/物件和 Claim 是否被指定 locator 支持。',
      '2. 记录版本差异、争议、错误或需要补充的来源；不能确认时标记 `changes-requested`。',
      '3. 仅在正文达到 Editorial Gate 后，将 `editorialStatus` 改为 `source-reviewed`，并写入具名 reviewer、日期、决定说明及空的 unresolvedIssueIds。',
      '4. key moment 图像与双端视觉通过人工 QA 后，才可再升为 `visual-ready`。',
      '',
      '## Current queue',
      '',
    ];
    const manifestByExistingStoryIdForQueue = new Map(norseStoryManifest
      .filter((story) => story.existingStoryId)
      .map((story) => [story.existingStoryId, story]));
    for (const story of (bundle?.stories ?? []).toSorted((a, b) => a.volumeOrder - b.volumeOrder || a.displayOrder - b.displayOrder)) {
      const manifestStory = manifestByExistingStoryIdForQueue.get(story.id);
      const priority = manifestStory?.priority ?? 'legacy';
      const sources = story.sources.map(formatSourceForReview).join('；');
      const reviewStatus = story.editorialReview?.status ?? 'needs-review';
      const dependencies = [
        `characters=${(manifestStory?.expectedDependencies.character ?? story.requiredCharacterIds ?? []).join(', ') || 'none'}`,
        `worlds=${(manifestStory?.expectedDependencies.world ?? story.requiredWorldIds ?? []).join(', ') || 'none'}`,
        `scenes=${(manifestStory?.expectedDependencies.scene ?? story.requiredSceneIds ?? []).join(', ') || 'none'}`,
        `objects=${(manifestStory?.expectedDependencies['mythic-object'] ?? story.requiredObjectIds ?? []).join(', ') || 'none'}`,
      ].join(' · ');
      const bodyMetric = editorialBodyMetrics.find((item) => item.storyId === story.id);
      reviewQueueLines.push(
        `- [${priority}] \`${story.slug}\` · ${story.title} · editorial: \`${story.editorialStatus ?? 'unspecified'}\` · review: \`${reviewStatus}\` · sources: ${sources}`,
        `  - dependency closure: ${dependencies}`,
        `  - body gate: ${bodyMetric?.paragraphCharacters ?? 0} chars / ${bodyMetric?.headingCount ?? 0} headings / ${bodyMetric?.readingTimeMismatch ? 'readingMinutes mismatch' : 'readingMinutes aligned'} · ${bodyMetric && editorialBodyReadyStoryIds.includes(bodyMetric.storyId) ? 'candidate' : 'needs rewrite'}`,
        `  - reviewer type: ${story.editorialReview?.reviewerType ?? 'pending'} · reviewer: ${story.editorialReview?.reviewer ?? 'pending'} · reviewed at: ${story.editorialReview?.reviewedAt ?? 'pending'} · decision notes: ${story.editorialReview?.sourceDecisionNotes?.join('；') || 'pending'} · unresolved issues: ${story.editorialReview?.unresolvedIssueIds?.join(', ') || 'none recorded'}`,
      );
    }
    reviewQueueLines.push('', '## Certification note', '', '- 本队列全部清零也不自动构成 Phase 9 完成；最终仍需检查 P0 coverage、关系审计、身份审计、视觉批准、SEO/无 JS 阅读与 Completion Snapshot 的人工签核。', '');
    fs.writeFileSync(editorialReviewQueuePath, reviewQueueLines.join('\n'), 'utf8');
    const reviewHandoffLines = [
      '# 北欧神话人工审校交接单',
      '',
      '> 这份交接单把机器侧已完成的内容拆成可分批签核的工作包。它不替代来源阅读、身份审计、视觉 QA 或产品验收；所有 `ready` 只表示可以开始人工复核。',
      '',
      '- 认证命令：`npm run content:certify:norse`；当前若仍有人工 Gate 未完成，该命令应失败并列出阻塞项。',
      '',
      `- 生成时间：${payload.generatedAt}`,
      `- Snapshot version：${collectionHandoff.snapshotVersion}`,
      `- 机器来源预审：${sourcePreflightSummary.reviewReadyStories} / ${sourcePreflightSummary.totalStories} 可进入人工复核`,
      `- P0 来源审校：${certification.sourceReviewedP0Pages.completed} / ${certification.sourceReviewedP0Pages.total}`,
      `- World 双端视觉批准：${certification.visualReadyWorlds.completed} / ${certification.visualReadyWorlds.total}`,
      `- Story key-moment 视觉批准：${storyVisualReadiness.approvedSlots} / ${storyVisualReadiness.totalSlots}`,
      `- Phase 6 identity audit：${collectionHandoff.gates.identityAudit}（${identityLayer.names.length} names / ${identityLayer.interpretations.length} interpretations / ${identityLayer.claims.length} claims）`,
      `- Collection Discovery：${collectionHandoff.status}；当前候选 Cycle ${collectionHandoff.eligibleCycleIds.length} / ${collectionHandoff.cycles.length}`,
      '',
      '## 执行顺序',
      '',
      '1. 先按下表完成 P0 Story 来源审校；`changes-requested` 必须回写正文、locator、依赖或 Claim 后重审。',
      '2. 再审 P1/P2 与跨 Cycle 关系，明确版本差异和本期排除项。',
      '3. 并行审 World 桌面/移动双端构图；同一 World 两端都通过后才可标记批准。',
      '4. 审 Story key-moment 图像：来源边界、角色身份、场景锚点、构图安全区、双端/主题适配和原创性分别记录。',
      '5. 完成身份审计队列与 P2 排除项决策，并将结果写回对应静态内容或审计记录。',
      '6. 所有 P0、视觉组、身份审计和排除项完成后，先生成 Snapshot A；再写入 identity audit / product sign-off，并重新生成 Snapshot B。若版本变化，必须按 B 重绑记录并重跑，直到版本稳定。',
      '7. 版本稳定后，由产品负责人完成 product sign-off，并由真人将独立 Snapshot approval 绑定同一最终版本；最后运行 `npm run content:certify:norse`。',
      '',
      '## Cycle 级内容批次',
      '',
      '| 批次 | Story | P0 | 机器预审可复核 | 已 source-reviewed | 当前状态 |',
      '|---|---:|---:|---:|---:|---|',
    ];
    for (const row of cycleRows) {
      const stories = row.stories
        .map((manifestStory) => manifestStory.existingStoryId ? storyById.get(manifestStory.existingStoryId) : undefined)
        .filter(Boolean);
      const p0Count = row.stories.filter((story) => story.priority === 'P0').length;
      const machineReadyCount = stories.filter((story) => sourcePreflight.find((item) => item.storyId === story.id)?.machineStatus === 'review-ready').length;
      const sourceReviewedCount = stories.filter(hasHumanSourceReview).length;
      const status = sourceReviewedCount === stories.length
        ? '待视觉/产品验收'
        : machineReadyCount === stories.length
          ? '可开始人工来源审校'
          : '先修机器预审问题';
      reviewHandoffLines.push(`| \`${row.cycle}\` | ${row.stories.length} | ${p0Count} | ${machineReadyCount} | ${sourceReviewedCount} | ${status} |`);
    }
    reviewHandoffLines.push(
      '',
      '## 可领取的 Story 来源审校工作包',
      '',
      '> 每个工作包最多 4 篇，按 P0 → P1 → P2 排序；同一 Story 只分配到一个工作包，跨 Cycle 归属仍以 Cycle 表和 Story Manifest 为准。工作包状态只表示机器预审是否完成，不代表人工批准。审校人领取后应按包回写 `stories.ts`，并在修改后重新生成本交接单。',
      '',
      '| 工作包 | Cycle | Story（slug） | P0 | P2 暂缓 | 来源 | 当前状态 |',
      '|---|---|---|---:|---:|---|---|',
    );
    let reviewBatchNumber = 0;
    const assignedReviewStoryIds = new Set();
    for (const row of cycleRows) {
      const stories = row.stories
        .map((manifestStory) => ({ manifestStory, story: manifestStory.existingStoryId ? storyById.get(manifestStory.existingStoryId) : undefined }))
        .filter((item) => item.story && !assignedReviewStoryIds.has(item.story.id))
        .toSorted((a, b) => {
          const priorityOrder = { P0: 0, P1: 1, P2: 2 };
          return (priorityOrder[a.manifestStory.priority] - priorityOrder[b.manifestStory.priority])
            || ((a.story?.displayOrder ?? 0) - (b.story?.displayOrder ?? 0));
      });
      for (let start = 0; start < stories.length; start += 4) {
        const batch = stories.slice(start, start + 4);
        batch.forEach(({ story }) => assignedReviewStoryIds.add(story.id));
        reviewBatchNumber += 1;
        const batchId = `norse-review-${String(reviewBatchNumber).padStart(2, '0')}`;
        const batchSourceIds = [...new Set(batch.flatMap(({ story }) => sourcePreflight.find((item) => item.storyId === story?.id)?.sourceIds ?? []))];
        const machineReady = batch.every(({ story }) => sourcePreflight.find((item) => item.storyId === story?.id)?.machineStatus === 'review-ready');
        const reviewed = batch.every(({ story }) => story && hasHumanSourceReview(story));
        reviewHandoffLines.push(`| \`${batchId}\` | \`${row.cycle}\` | ${batch.map(({ manifestStory, story }) => `\`${story?.slug}\` (${manifestStory.priority})`).join('<br>')} | ${batch.filter(({ manifestStory }) => manifestStory.priority === 'P0').length} | ${batch.filter(({ manifestStory }) => manifestStory.collectionDisposition === 'deferred' || manifestStory.collectionDisposition === 'excluded').length} | ${batchSourceIds.join(', ') || 'none'} | ${reviewed ? '已审校' : machineReady ? '可领取' : '先修机器预审'} |`);
      }
    }
    reviewHandoffLines.push(
      '',
      '## 视觉批次',
      '',
      `- World 批次：${visualReadiness.worldCount} 个 World、${visualReadiness.worldCount * 2} 个独立 AI 资产；当前 ${visualReadiness.independentlyGeneratedWorldPairs} 组齐备，${visualReadiness.approvedWorldPairs} 组已批准。逐项记录见 \`docs/NORSE_VISUAL_REVIEW_QUEUE.md\`。`,
      `- Story 批次：${storyVisualReadiness.totalSlots} 个 key-moment 槽位；当前 ${storyVisualReadiness.attributedSlots} 个已归属，${storyVisualReadiness.approvedSlots} 个已批准。逐项记录见 \`docs/NORSE_STORY_VISUAL_REVIEW_QUEUE.md\`。`,
      '',
      '## Phase 6 identity audit queue',
      '',
      '> These records are machine-validated and ready for human source review. They do not carry an approval record yet.',
      '',
      `- Status: needs-human-review · names ${identityLayer.names.length} · interpretations ${identityLayer.interpretations.length} · claims ${identityLayer.claims.length} · contested claims ${identityLayer.claims.filter((claim) => claim.status === 'contested').length}`,
      '',
      '### Interpretations',
      '',
      ...identityLayer.interpretations.flatMap((interpretation) => [
        `- **${interpretation.name}** (\`${interpretation.id}\`) · Character: \`${interpretation.characterId}\` · confidence: ${interpretation.confidence}`,
        `  - ${interpretation.summary}`,
        `  - Sources: ${interpretation.sourceRefs.map(formatSourceForReview).join('；')}`,
      ]),
      '',
      '### Names',
      '',
      ...identityLayer.names.flatMap((name) => [
        `- **${name.name}** / ${name.nameEn ?? name.name} (\`${name.id}\`) · Character: \`${name.characterId}\` · kind: ${name.nameKind} · confidence: ${name.confidence} · interpretation: ${name.interpretationId ?? 'base Character'}`,
        `  - Sources: ${name.sourceRefs.map(formatSourceForReview).join('；')}`,
      ]),
      '',
      '### Claims',
      '',
      ...identityLayer.claims.flatMap((claim) => [
        `- **${claim.id}** · ${claim.status} · ${claim.claimType} · subject: \`${claim.subjectType}:${claim.subjectId}\``,
        `  - ${claim.summary}`,
        `  - Tradition scope: ${claim.traditionScope ?? 'not required'}`,
        `  - Sources: ${claim.sourceRefs.map(formatSourceForReview).join('；')}`,
      ]),
      '',
      '### Identity review record',
      '',
      `- Snapshot version: ${collectionHandoff.snapshotVersion}`,
      '- Reviewer type: pending',
      '- Reviewer: pending',
      '- Reviewed at: pending',
      '- Decision: pending',
      '- Unresolved issue IDs: pending',
      '',
      '## 回写规则',
      '',
      '- Story 来源审校：在 `src/content/norse/stories.ts` 写入 `editorialReview.status/reviewerType/reviewer/reviewedAt/sourceDecisionNotes/unresolvedIssueIds`；`reviewerType` 必须为 `human`，`sourceDecisionNotes` 至少一条非空结论，仅 `approved` 且无未决问题时把 `editorialStatus` 推进到 `source-reviewed`。',
      '- World 视觉批准：在 `src/content/norse/assets.ts` 中为同一 World 的 desktop/mobile 两条 AI 资产分别写入 `reviewStatus: approved`、`reviewerType: human`、reviewer、日期和至少一条非空 `reviewNotes`；任一端不通过都保持 draft。',
      '- Story 视觉批准：在 `src/data/story-illustrations.ts` 写入 provenance 的 `reviewStatus/reviewerType/reviewer/reviewedAt/reviewNotes`，其中 `reviewerType` 必须为 `human`，`reviewNotes` 至少一条非空结论；图像通过不等于正文来源审校通过。',
      '- 产品签字：在 `src/content/norse/collection-signoff.ts` 写入带 `status/snapshotVersion/reviewerType: human/reviewer/signedAt/decisionNotes` 的产品签字记录；`snapshotVersion` 必须等于当前生成版本，报告会自动读取它，只有记录完整才会得到 `productSignoff: ready`，不得通过改报告文字伪造 gate。',
      '- Phase 6 identity audit：在 `src/content/norse/collection-signoff.ts` 写入带 `status: approved/snapshotVersion: <当前生成版本>/reviewerType: human/reviewer/reviewedAt/decisionNotes/unresolvedIssueIds: []` 的独立记录；身份层变更后必须重新核对并更新该记录。',
      '- Completion Snapshot 批准：在 `src/content/norse/collection-signoff.ts` 写入带 `status: approved/snapshotVersion: <当前生成版本>/reviewerType: human/reviewer/reviewedAt/decisionNotes/unresolvedIssueIds: []` 的独立记录；Snapshot reviewer 必须不同于 product sign-off reviewer；重新生成 Snapshot 后若版本变化，必须重新核对并更新该记录。',
      '- 版本锁定顺序：先生成 Snapshot A，再写入身份/产品审批记录并生成 Snapshot B；若 B 与 A 不同，必须用 B 更新审批记录并重新生成，直到版本稳定后才能做最终 Snapshot approval。',
      '',
      '## 单项签核模板',
      '',
      '```text',
      'Item / Cycle:',
      'Reviewer type: human',
      'Reviewer:',
      'Reviewed at:',
      'Snapshot version (when approving a Gate):',
      'Decision: approved | changes-requested | excluded',
      'Evidence / locator or asset checks:',
      'Unresolved issue IDs:',
      'Follow-up owner:',
      '```',
      '',
      '## 完成判定',
      '',
      '- 本交接单不是完成认证；只有 Completion Snapshot 中 P0 来源、视觉、身份审计、交付、product sign-off 和独立 Snapshot approval 全部留痕后，Collection Discovery 才能从 blocked 转为可用。',
      '- 本阶段不创建 Collection Manifest、Card Manifest、卡数、定价或稀有度。',
      '',
    );
    fs.writeFileSync(reviewHandoffPath, reviewHandoffLines.join('\n'), 'utf8');
    const sourcePreflightLines = [
      '# 北欧 Story 来源预审报告',
      '',
      '> 由 `npm run content:coverage:norse` 生成。这里是机器预审，不是人工来源审校：它只检查来源是否登记、是否映射到 Manifest、locator 是否足够具体、正文是否达到结构门槛；不得据此把 Story 标记为 `source-reviewed`。本报告不把自动 HTTP 状态当作来源有效性结论；部分来源站点会拒绝脚本请求，审校人仍需在可用浏览器或图书馆/学术数据库中核对具体 locator。',
      '',
      `- 总 Story：${sourcePreflightSummary.totalStories}`,
      `- 机器预审可进入人工复核：${sourcePreflightSummary.reviewReadyStories}`,
      `- 机器预审需先修改：${sourcePreflightSummary.changesNeededStories}`,
      `- P0 可进入人工复核：${sourcePreflightSummary.p0ReviewReady} / ${sourcePreflightSummary.p0Total}`,
      `- P0 需先修改：${sourcePreflightSummary.p0ChangesNeeded}`,
      '',
      '## 使用方式',
      '',
      '1. 先处理 `changes-needed-before-human-review`，尤其是宽泛 locator、错误来源映射和正文门槛问题。',
      '2. 对 `review-ready` Story 逐条打开指定来源，核对正文、摘要、Claim、人物/地点/物件关系。',
      '3. 只有具名编辑完成核对并写入 `editorialReview` 后，才可推进 `editorialStatus: source-reviewed`。',
      '4. `variantNoteIds` 只是提醒审校者加载版本边界，不代表事实已经被自动判定。',
      '',
      '## Story 预审结果',
      '',
    ];
    for (const item of sourcePreflight.toSorted((a, b) => (a.priority === b.priority ? a.slug.localeCompare(b.slug) : a.priority.localeCompare(b.priority)))) {
      sourcePreflightLines.push(
        `- [${item.priority}] \`${item.slug}\` · ${item.machineStatus} · human review: \`${item.editorialReviewStatus}\``,
        `  - sources: ${item.sourceTitles.join('；') || 'none'} · variant notes: ${item.variantNoteIds.join(', ') || 'none'}`,
        `  - source links: ${item.sourceUrls.filter(Boolean).join('；') || 'none'}`,
        `  - checks: registry=${item.checks.sourceRegistryComplete ? 'ok' : 'fail'} · coverage=${item.checks.sourceCoverageMapped ? 'ok' : 'fail'} · story-source=${item.checks.storySourceAlignment ? 'ok' : 'fail'} · locator=${item.checks.locatorSpecific ? 'ok' : 'fail'} · body=${item.checks.bodyGate ? 'ok' : 'fail'}`,
        `  - missing registry: ${item.missingRegistrySourceIds.join(', ') || 'none'} · missing coverage: ${item.missingCoverageSourceIds.join(', ') || 'none'} · missing from Story sources: ${item.missingStorySourceIds.join(', ') || 'none'} · broad locators: ${item.broadLocators.join('；') || 'none'}`,
      );
    }
    fs.writeFileSync(sourcePreflightPath, sourcePreflightLines.join('\n'), 'utf8');
  }

  console.log(`Norse content coverage: ${inventory.sources} sources, ${inventory.uniqueStories} unique Story units, ${issues.length} issue(s).`);
  if (issues.length) {
    issues.forEach((issue) => console.error(`[norse-content-coverage] ${issue}`));
    process.exitCode = 1;
  }
  if (requireCompletion && completionBlockers.length) {
    completionBlockers.forEach((blocker) => console.error(`[norse-content-certification] ${blocker}`));
    process.exitCode = 1;
  }
} finally {
  await vite.close();
}
