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
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });

try {
  const [{ norseSources }, { norseSourceCoverage }, { norseStoryManifest, norseStoryCycles }, { norseKnownIssues }, { norseVariantNotes }, { getStructuredMythologyBundle }] = await Promise.all([
    vite.ssrLoadModule('/src/content/norse/sources.ts'),
    vite.ssrLoadModule('/src/content/norse/source-coverage.ts'),
    vite.ssrLoadModule('/src/content/norse/story-manifest.ts'),
    vite.ssrLoadModule('/src/content/norse/known-issues.ts'),
    vite.ssrLoadModule('/src/content/norse/variant-notes.ts'),
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
  const readiness = {
    publicStories: (bundle?.stories ?? []).filter((story) => story.publishStatus === 'published').length,
    editorialReadyStories: (bundle?.stories ?? []).filter((story) => ['source-reviewed', 'visual-ready'].includes(story.editorialStatus ?? '')).length,
    prototypeStories: (bundle?.stories ?? []).filter((story) => story.editorialStatus === 'prototype').length,
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
    sourceReviewedP0Stories: norseStoryManifest.filter((story) => story.priority === 'P0' && ['source-reviewed', 'published'].includes(story.status)).length,
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
      knownIssues: norseKnownIssues,
      variantNotes: norseVariantNotes,
      currentStoryMigrationGaps,
      plannedNewStories: norseStoryManifest.filter((story) => !story.existingStoryId && story.status !== 'excluded').map((story) => story.id),
      dependencyGapList,
    },
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
      `- 已 source-reviewed / published 的 P0 Story Manifest：${inventory.sourceReviewedP0Stories} / ${inventory.P0Stories}`,
      `- 当前已落库静态内容（Character / World / Scene / Object / Story / CharacterRelation / ContentRelation）：${inventory.currentCharacters} / ${inventory.currentWorlds} / ${inventory.currentScenes} / ${inventory.currentObjects} / ${inventory.currentStories} / ${inventory.currentCharacterRelations} / ${inventory.currentContentRelations}`,
      `- 当前 Story readiness（public / source-reviewed-or-visual-ready / prototype）：${readiness.publicStories} / ${readiness.editorialReadyStories} / ${readiness.prototypeStories}`,
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
  }

  console.log(`Norse content coverage: ${inventory.sources} sources, ${inventory.uniqueStories} unique Story units, ${issues.length} issue(s).`);
  if (issues.length) {
    issues.forEach((issue) => console.error(`[norse-content-coverage] ${issue}`));
    process.exitCode = 1;
  }
} finally {
  await vite.close();
}
