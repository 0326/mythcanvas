#!/usr/bin/env node

/**
 * Validates the frozen Norse Phase-2 research baseline and writes a compact,
 * human-readable Story Map plus a machine-readable coverage report. It loads
 * only static source-controlled content and never queries D1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const write = process.argv.includes('--write');
const reportPath = path.resolve(root, 'reports/norse-content-coverage.json');
const storyMapPath = path.resolve(root, 'docs/NORSE_STORY_MAP.md');
const completionSnapshotPath = path.resolve(root, 'docs/NORSE_COMPLETION_SNAPSHOT.md');
const editorialReviewQueuePath = path.resolve(root, 'docs/NORSE_EDITORIAL_REVIEW_QUEUE.md');
const sourcePreflightPath = path.resolve(root, 'docs/NORSE_SOURCE_PREFLIGHT.md');
const visualReviewQueuePath = path.resolve(root, 'docs/NORSE_VISUAL_REVIEW_QUEUE.md');
const storyVisualReviewQueuePath = path.resolve(root, 'docs/NORSE_STORY_VISUAL_REVIEW_QUEUE.md');
const collectionHandoffReportPath = path.resolve(root, 'reports/norse-collection-discovery.json');
const collectionHandoffDocPath = path.resolve(root, 'docs/NORSE_COLLECTION_HANDOFF.md');
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });

try {
  const [{ norseSources }, { norseSourceCoverage }, { norseStoryManifest, norseStoryCycles }, { norseKnownIssues }, { norseVariantNotes }, { norseAssetProvenance }, { norseVisualTiers }, { getStructuredMythologyBundle }, { getPublicStoryPaths, getIndexableStoryPaths, getPublicStoryRedirectPaths }, { buildNorseCollectionDiscoveryInput }, { storyIllustrations }] = await Promise.all([
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
    vite.ssrLoadModule('/src/data/story-illustrations.ts'),
  ]);
  const bundle = getStructuredMythologyBundle('myth-norse');
  const collectionHandoff = buildNorseCollectionDiscoveryInput({
    manifest: norseStoryManifest,
    stories: bundle?.stories ?? [],
    series: bundle?.series ?? [],
    worldAssets: norseAssetProvenance,
    illustrations: storyIllustrations,
  });
  const publicStoryPaths = getPublicStoryPaths().filter((path) => path.mythologyId === 'myth-norse');
  const indexableStoryPaths = getIndexableStoryPaths().filter((path) => path.mythologyId === 'myth-norse');
  const publicStoryRedirectPaths = getPublicStoryRedirectPaths().filter((path) => path.mythologyId === 'myth-norse');

  const sourceIds = new Set(norseSources.map((item) => item.sourceId));
  const manifestIds = new Set(norseStoryManifest.map((item) => item.id));
  const coverageBySourceId = new Map(norseSourceCoverage.map((item) => [item.sourceId, item]));
  const issues = [];
  if (!bundle) issues.push('missing Norse structured content bundle');
  if (sourceIds.size !== norseSources.length) issues.push('duplicate sourceId in norseSources');
  if (manifestIds.size !== norseStoryManifest.length) issues.push('duplicate manifest id in norseStoryManifest');
  if (coverageBySourceId.size !== norseSourceCoverage.length) issues.push('duplicate sourceId in norseSourceCoverage');
  for (const source of norseSources) if (!coverageBySourceId.has(source.sourceId)) issues.push(`missing coverage row: ${source.sourceId}`);
  for (const row of norseSourceCoverage) {
    if (!sourceIds.has(row.sourceId)) issues.push(`coverage references unknown source: ${row.sourceId}`);
    if (row.priority === 'P0' && !['covered', 'context-only', 'excluded-with-reason'].includes(row.status)) issues.push(`P0 source unresolved: ${row.sourceId} (${row.status})`);
    for (const id of row.storyManifestIds) if (!manifestIds.has(id)) issues.push(`coverage references unknown manifest Story: ${id}`);
  }
  for (const story of norseStoryManifest) {
    if (story.priority === 'P0' && !['source-reviewed', 'published'].includes(story.status)) issues.push(`P0 Story is not source-reviewed: ${story.id} (${story.status})`);
    if (!story.sourceScopes.length) issues.push(`Story has no source scope: ${story.id}`);
    for (const source of story.sourceScopes) {
      if (!sourceIds.has(source.sourceId)) issues.push(`Story ${story.id} references unknown source ${source.sourceId}`);
      if (!source.locator.trim()) issues.push(`Story ${story.id} has empty locator`);
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
  for (const note of norseVariantNotes) {
    if (note.priority === 'P0' && note.status !== 'scoped') issues.push(`P0 variant note unresolved: ${note.id}`);
    for (const storyId of note.affectedManifestIds) if (!manifestIds.has(storyId)) issues.push(`variant note references unknown manifest Story: ${note.id} → ${storyId}`);
    for (const ref of note.sourceRefs) if (!ref.sourceId || !sourceIds.has(ref.sourceId)) issues.push(`variant note references unknown source: ${note.id}`);
  }

  const validateSourceRefs = (owner, refs) => {
    for (const ref of refs) {
      if (!ref.sourceId) issues.push(`${owner} has a source reference without sourceId`);
      else if (!sourceIds.has(ref.sourceId)) issues.push(`${owner} references unknown source ${ref.sourceId}`);
      if (!(ref.locator ?? ref.section ?? '').trim()) issues.push(`${owner} has a source reference without locator`);
    }
  };
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
    }
    for (const claim of story.claims ?? []) validateSourceRefs(`Story claim ${claim.id}`, claim.sourceRefs);
  }

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
    editorialReadyStories: (bundle?.stories ?? []).filter((story) => ['source-reviewed', 'visual-ready'].includes(story.editorialStatus ?? '')).length,
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
      norseAssetProvenance.some((asset) => asset.ownerId === worldId && asset.outputSpecId === outputSpecId && asset.reviewStatus === 'approved'),
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
  const storyVisualReadiness = {
    totalSlots: storyVisualSlots.length,
    attributedSlots: storyVisualSlots.filter((slot) => slot.status === 'attributed').length,
    missingSlots: storyVisualSlots.filter((slot) => slot.status === 'missing').length,
    approvedSlots: storyVisualSlots.filter((slot) => slot.assetReviewStatus === 'approved').length,
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
    return ['source-reviewed', 'visual-ready'].includes(story?.editorialStatus ?? '');
  });
  const certification = {
    status: 'in-progress',
    sourceResolution: issues.length === 0,
    semanticDependencyClosure: dependencyGapList.length === 0 && dependencyClosureGaps.length === 0,
    publishedP0Pages: { complete: P0ManifestStoriesWithPublishedPage.length === P0ManifestStories.length, completed: P0ManifestStoriesWithPublishedPage.length, total: P0ManifestStories.length },
    sourceReviewedP0Pages: { complete: P0ManifestStoriesSourceReviewed.length === P0ManifestStories.length, completed: P0ManifestStoriesSourceReviewed.length, total: P0ManifestStories.length },
    visualReadyWorlds: { complete: approvedWorldAssetPairs.length === norseWorldIds.size, completed: approvedWorldAssetPairs.length, total: norseWorldIds.size },
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
      readiness,
      visualReadiness,
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
      `- Unique Story Units：${inventory.uniqueStories}`,
      `- P0 / P1 / P2：${inventory.P0Stories} / ${inventory.P1Stories} / ${inventory.P2Stories}`,
      `- 已完成来源研究的 P0 Story Manifest（研究状态，不代表读者页已审校）：${inventory.researchReadyP0StoryUnits} / ${inventory.P0Stories}`,
      `- 当前已落库静态内容（Character / World / Scene / Object / Story / CharacterRelation / ContentRelation）：${inventory.currentCharacters} / ${inventory.currentWorlds} / ${inventory.currentScenes} / ${inventory.currentObjects} / ${inventory.currentStories} / ${inventory.currentCharacterRelations} / ${inventory.currentContentRelations}`,
      `- Manifest 已明确 World + Scene 依赖计划的现有 Story 单元：${inventory.manifestWorldScenePlanStories} / ${inventory.manifestBackedStories}`,
      `- 网站交付路由（public / indexable / legacy redirect）：${publicStoryPaths.length} / ${indexableStoryPaths.length} / ${publicStoryRedirectPaths.length}`,
      `- 当前 Story editorial readiness（public / structured-or-better / source-reviewed-or-visual-ready / researching / prototype / shared-template）：${readiness.publicStories} / ${readiness.structuredStories} / ${readiness.editorialReadyStories} / ${readiness.researchingStories} / ${readiness.prototypeStories} / ${readiness.templateStories}`,
      `- 仍使用宽泛/Phase 3 占位 locator 的 Story：${readiness.impreciseSourceLocatorStories}`,
      `- Editorial body gate 候选（正文 ≥800 字符、至少 3 个分段、无模板、阅读时长一致）：${readiness.editorialBodyReadyStories} / ${readiness.publicStories}`,
      `- 正文仍低于 Editorial Gate 的 Story：${readiness.editorialBodyShortStories}`,
      `- readingMinutes 不一致的 Story：${readiness.readingTimeMismatchStories}`,
      `- 世界视觉就绪度（独立生成桌面+移动组 / 人工批准组 / 总世界数）：${visualReadiness.independentlyGeneratedWorldPairs} / ${visualReadiness.approvedWorldPairs} / ${visualReadiness.worldCount}`,
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
      `- Status: ${collectionHandoff.status}`,
      `- Eligible cycles: ${collectionHandoff.eligibleCycleIds.length} / ${collectionHandoff.cycles.length}`,
      `- Deferred cycles: ${collectionHandoff.deferredCycleIds.join('、') || 'none'}`,
      '',
      '## Gates',
      '',
      `- P0 source review: ${collectionHandoff.gates.sourceReviewedP0}`,
      `- World visual approval: ${collectionHandoff.gates.visualApprovedWorlds}`,
      `- Story key-moment visual approval: ${collectionHandoff.gates.visualApprovedStoryKeyMoments}`,
      `- Product sign-off: ${collectionHandoff.gates.productSignoff}`,
      '',
      '## Cycle evidence',
      '',
    ];
    for (const cycle of collectionHandoff.cycles) {
      handoffLines.push(
        `### ${cycle.cycleId}`,
        '',
        `- Stories: ${cycle.storyCount}；published: ${cycle.publishedStoryCount}；source-reviewed: ${cycle.sourceReviewedStoryCount}`,
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
      '> 本文件由 `npm run content:coverage:norse` 自动生成，用于 Phase 9 的证据汇总。它不是完成认证，也不能替代人工来源审校、视觉批准或产品验收。',
      '',
      `- 生成时间：${payload.generatedAt}`,
      `- 认证状态：${certification.status}`,
      `- Source Registry / Coverage Rows：${inventory.sources} / ${inventory.coverageRows}`,
      `- Story Manifest（P0 / P1 / P2）：${inventory.uniqueStories}（${inventory.P0Stories} / ${inventory.P1Stories} / ${inventory.P2Stories}）`,
      `- 静态实体（Character / World / Scene / Object / Story）：${inventory.currentCharacters} / ${inventory.currentWorlds} / ${inventory.currentScenes} / ${inventory.currentObjects} / ${inventory.currentStories}`,
      `- Manifest 已明确 World + Scene 依赖计划的现有 Story 单元：${inventory.manifestWorldScenePlanStories} / ${inventory.manifestBackedStories}`,
      `- 网站交付路由（public / indexable / legacy redirect）：${publicStoryPaths.length} / ${indexableStoryPaths.length} / ${publicStoryRedirectPaths.length}`,
      `- Collection Discovery 输入：${collectionHandoff.status}（候选 Cycle ${collectionHandoff.eligibleCycleIds.length} / ${collectionHandoff.cycles.length}）；详见 \`docs/NORSE_COLLECTION_HANDOFF.md\`。`,
      '',
      '## Gate evidence',
      '',
      `- Source resolution：${certification.sourceResolution ? '通过' : '未通过'}（coverage / source / known-issue gate）`,
      `- Semantic dependency closure：${certification.semanticDependencyClosure ? '通过' : '未通过'}（缺口 ${inventory.dependencyGaps}）`,
      `- P0 已有读者页：${certification.publishedP0Pages.completed} / ${certification.publishedP0Pages.total}`,
      `- P0 已通过来源审校的读者页：${certification.sourceReviewedP0Pages.completed} / ${certification.sourceReviewedP0Pages.total}`,
      `- 世界视觉资产已人工批准（独立桌面 + 移动构图）：${certification.visualReadyWorlds.completed} / ${certification.visualReadyWorlds.total}`,
      `- 世界视觉资产已生成但仍为草稿：${visualReadiness.independentlyGeneratedWorldPairs} / ${visualReadiness.worldCount}（草稿资产 ${visualReadiness.draftAiAssets} 个）`,
      `- 仍只有共享 prototype fallback、尚无独立 AI 双端组的世界：${visualReadiness.prototypeOnlyWorlds.length} / ${visualReadiness.worldCount}`,
      '- 逐世界视觉审查队列：`docs/NORSE_VISUAL_REVIEW_QUEUE.md`。',
      '- Story key-moment 审查队列：`docs/NORSE_STORY_VISUAL_REVIEW_QUEUE.md`。',
      '',
      '## Blocking work',
      '',
      `- 尚无读者页的 Manifest Story：${inventory.plannedNewStories}`,
      `- 尚处于 researching 的来源绑定研究稿：${readiness.researchingStories}`,
      `- 仍使用宽泛/Phase 3 占位 locator 的 Story：${readiness.impreciseSourceLocatorStories}`,
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
      '- P2 独立传统保留在 Manifest 中，是否纳入本期 Collection 由完成认证时的 editorial exclusions 明确记录。',
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
    for (const world of [...(bundle?.worlds ?? [])].toSorted((a, b) => a.name.localeCompare(b.name, 'zh-CN'))) {
      const desktop = norseAssetProvenance.find((asset) => asset.ownerId === world.id && asset.outputSpecId === 'desktop-wallpaper' && asset.sourceType === 'ai');
      const mobile = norseAssetProvenance.find((asset) => asset.ownerId === world.id && asset.outputSpecId === 'mobile-wallpaper' && asset.sourceType === 'ai');
      const describe = (asset) => asset ? `${asset.assetPath} · ${asset.reviewStatus}` : '共享 prototype fallback · 未完成独立生成';
      visualReviewQueueLines.push(
        `- **${world.name} / ${world.nameEn}** (\`${world.id}\`)`,
        `  - Desktop: ${describe(desktop)}`,
        `  - Mobile: ${describe(mobile)}`,
        `  - Human QA: ${desktop?.reviewStatus === 'approved' && mobile?.reviewStatus === 'approved' ? 'approved' : 'needs-review'}`,
        `  - Review focus: ${world.canonicalDesign.anchors.join('、')}；检查素材是否仍停留在来源事实、物质证据与 MythCanvas 原创设计的分层边界。`,
        '',
      );
    }
    visualReviewQueueLines.push('## Approval record', '', '- Reviewer: pending', '- Reviewed at: pending', '- Decision: pending', '');
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
      storyVisualReviewQueueLines.push(
        `- **${slot.title}** (\`${slot.slug}\`) · ${slot.status === 'attributed' ? 'attributed' : 'needs-key-moment-asset'}`,
        `  - characters: ${slot.characterIds.join(', ') || 'none'} · worlds: ${slot.worldIds.join(', ') || 'none'} · scenes: ${slot.sceneIds.join(', ') || 'none'} · objects: ${slot.objectIds.join(', ') || 'none'}`,
        `  - heroAssetId: ${slot.heroAssetId ?? 'pending'} · asset review: ${slot.assetReviewStatus}`,
      );
    }
    storyVisualReviewQueueLines.push('', '## Gate', '', '- Reviewer: pending', '- Decision: pending', '- Note: 资产生成、来源边界、桌面/移动构图和产品文案安全区必须分别审查。', '');
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
      const sources = story.sources.map((source) => `${source.sourceId ?? source.title} ${source.locator ?? 'locator required'}`).join('；');
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
        `  - reviewer: ${story.editorialReview?.reviewer ?? 'pending'} · reviewed at: ${story.editorialReview?.reviewedAt ?? 'pending'} · unresolved issues: ${story.editorialReview?.unresolvedIssueIds?.join(', ') || 'none recorded'}`,
      );
    }
    reviewQueueLines.push('', '## Certification note', '', '- 本队列全部清零也不自动构成 Phase 9 完成；最终仍需检查 P0 coverage、关系审计、视觉批准、SEO/无 JS 阅读与 Completion Snapshot 的人工签核。', '');
    fs.writeFileSync(editorialReviewQueuePath, reviewQueueLines.join('\n'), 'utf8');
    const sourcePreflightLines = [
      '# 北欧 Story 来源预审报告',
      '',
      '> 由 `npm run content:coverage:norse` 生成。这里是机器预审，不是人工来源审校：它只检查来源是否登记、是否映射到 Manifest、locator 是否足够具体、正文是否达到结构门槛；不得据此把 Story 标记为 `source-reviewed`。',
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
} finally {
  await vite.close();
}
