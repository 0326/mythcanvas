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
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });

try {
  const [{ norseSources }, { norseSourceCoverage }, { norseStoryManifest, norseStoryCycles }, { norseKnownIssues }, { norseVariantNotes }, { norseAssetProvenance }, { getStructuredMythologyBundle }] = await Promise.all([
    vite.ssrLoadModule('/src/content/norse/sources.ts'),
    vite.ssrLoadModule('/src/content/norse/source-coverage.ts'),
    vite.ssrLoadModule('/src/content/norse/story-manifest.ts'),
    vite.ssrLoadModule('/src/content/norse/known-issues.ts'),
    vite.ssrLoadModule('/src/content/norse/variant-notes.ts'),
    vite.ssrLoadModule('/src/content/norse/assets.ts'),
    vite.ssrLoadModule('/src/content/registry.ts'),
  ]);
  const bundle = getStructuredMythologyBundle('myth-norse');

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
  const manifestExistingStories = norseStoryManifest
    .filter((story) => story.existingStoryId)
    .map((story) => ({ manifest: story, story: storyById.get(story.existingStoryId) }));
  const editorialMigrationGaps = manifestExistingStories
    .filter(({ story }) => !story)
    .map(({ manifest }) => manifest.id);
  const templateStoryIds = (bundle?.stories ?? [])
    .filter((story) => story.blocks.some((block) => block.type === 'paragraph' && block.text.includes(prototypeSentence)))
    .map((story) => story.id);
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
    missingManifestBackedStories: editorialMigrationGaps.length,
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
  const visualReadiness = {
    worldCount: norseWorldIds.size,
    independentlyGeneratedWorldPairs: aiWorldAssetPairs.length,
    approvedWorldPairs: approvedWorldAssetPairs.length,
    draftAiAssets: norseAssetProvenance.filter((asset) => asset.sourceType === 'ai' && asset.reviewStatus === 'draft').length,
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
    semanticDependencyClosure: dependencyGapList.length === 0,
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
      editorialMigrationGaps,
      templateStoryIds,
      impreciseSourceLocatorStoryIds,
      knownIssues: norseKnownIssues,
      variantNotes: norseVariantNotes,
      currentStoryMigrationGaps,
      plannedNewStories: norseStoryManifest.filter((story) => !story.existingStoryId && story.status !== 'excluded').map((story) => story.id),
      dependencyGapList,
    },
    certification,
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
      `- 当前 Story editorial readiness（public / structured-or-better / source-reviewed-or-visual-ready / researching / prototype / shared-template）：${readiness.publicStories} / ${readiness.structuredStories} / ${readiness.editorialReadyStories} / ${readiness.researchingStories} / ${readiness.prototypeStories} / ${readiness.templateStories}`,
      `- 仍使用宽泛/Phase 3 占位 locator 的 Story：${readiness.impreciseSourceLocatorStories}`,
      `- 世界视觉就绪度（独立生成桌面+移动组 / 人工批准组 / 总世界数）：${visualReadiness.independentlyGeneratedWorldPairs} / ${visualReadiness.approvedWorldPairs} / ${visualReadiness.worldCount}`,
      `- Manifest 已有 Story 但静态内容缺失：${readiness.missingManifestBackedStories}`,
      `- 现有 Story 迁移决策：${inventory.currentStoryMigrationDecisions} / ${inventory.currentStories}`,
      `- 新增 Story 待办：${inventory.plannedNewStories}`,
      `- Story Manifest 依赖缺口：${inventory.dependencyGaps}（作为 Phase 3–4 的实体补全待办，不是本阶段 gate failure）`,
      `- 已解决 P0 已知问题：${inventory.resolvedP0KnownIssues}`,
      `- 已范围化 P0 版本冲突：${inventory.scopedP0Variants}`,
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
    lines.push('## Gate Issues', '', ...(issues.length ? issues.map((issue) => `- ${issue}`) : ['- 无。']), '');
    fs.writeFileSync(storyMapPath, lines.join('\n'), 'utf8');
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
      '',
      '## Gate evidence',
      '',
      `- Source resolution：${certification.sourceResolution ? '通过' : '未通过'}（coverage / source / known-issue gate）`,
      `- Semantic dependency closure：${certification.semanticDependencyClosure ? '通过' : '未通过'}（缺口 ${inventory.dependencyGaps}）`,
      `- P0 已有读者页：${certification.publishedP0Pages.completed} / ${certification.publishedP0Pages.total}`,
      `- P0 已通过来源审校的读者页：${certification.sourceReviewedP0Pages.completed} / ${certification.sourceReviewedP0Pages.total}`,
      `- 世界视觉资产已人工批准（独立桌面 + 移动构图）：${certification.visualReadyWorlds.completed} / ${certification.visualReadyWorlds.total}`,
      `- 世界视觉资产已生成但仍为草稿：${visualReadiness.independentlyGeneratedWorldPairs} / ${visualReadiness.worldCount}（草稿资产 ${visualReadiness.draftAiAssets} 个）`,
      '',
      '## Blocking work',
      '',
      `- 尚无读者页的 Manifest Story：${inventory.plannedNewStories}`,
      `- 尚处于 researching 的来源绑定研究稿：${readiness.researchingStories}`,
      `- 仍使用宽泛/Phase 3 占位 locator 的 Story：${readiness.impreciseSourceLocatorStories}`,
      `- 仍含共享模板正文的已发布 Story：${readiness.templateStories}`,
      `- 尚未完成 source-reviewed 的 P0 读者页：${certification.sourceReviewedP0Pages.total - certification.sourceReviewedP0Pages.completed}`,
      `- 尚未由人工批准的世界双端视觉组：${certification.visualReadyWorlds.total - certification.visualReadyWorlds.completed}`,
      '- 最终 Snapshot 必须记录人工审校人、日期、未决项和明确批准；自动化不会将上述状态改为完成。',
      '',
      '## Deferred / exclusions',
      '',
      '- P2 独立传统保留在 Manifest 中，是否纳入本期 Collection 由完成认证时的 editorial exclusions 明确记录。',
      '- 英文长文、关键时刻插画和 Collection 编排仅在对应 Story 完成来源审校与视觉批准后进入交付范围。',
      '',
    ];
    fs.writeFileSync(completionSnapshotPath, snapshotLines.join('\n'), 'utf8');
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
      reviewQueueLines.push(`- [${priority}] \`${story.slug}\` · ${story.title} · editorial: \`${story.editorialStatus ?? 'unspecified'}\` · review: \`${reviewStatus}\` · sources: ${sources}`);
    }
    reviewQueueLines.push('', '## Certification note', '', '- 本队列全部清零也不自动构成 Phase 9 完成；最终仍需检查 P0 coverage、关系审计、视觉批准、SEO/无 JS 阅读与 Completion Snapshot 的人工签核。', '');
    fs.writeFileSync(editorialReviewQueuePath, reviewQueueLines.join('\n'), 'utf8');
  }

  console.log(`Norse content coverage: ${inventory.sources} sources, ${inventory.uniqueStories} unique Story units, ${issues.length} issue(s).`);
  if (issues.length) {
    issues.forEach((issue) => console.error(`[norse-content-coverage] ${issue}`));
    process.exitCode = 1;
  }
} finally {
  await vite.close();
}
