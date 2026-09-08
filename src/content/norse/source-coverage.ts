import type { ContentSource, ReviewActorType } from '../../lib/content/types';
import { norseStoryManifest, type NorsePriority } from './story-manifest';
import { norseSources } from './sources';

export type NorseCoverageStatus = 'covered' | 'partial' | 'context-only' | 'excluded-with-reason' | 'unreviewed';
export type NorseCoverageReviewKind = 'scope-mapped' | 'human-audited';

export type NorseSourceCoverage = {
  sourceId: string;
  priority: NorsePriority;
  status: NorseCoverageStatus;
  storyManifestIds: readonly string[];
  supportingClaimIds: readonly string[];
  exclusionReason?: string;
  /** Scope mapping is not a claim that every mapped Story has passed editorial review. */
  reviewKind: NorseCoverageReviewKind;
  reviewerType: ReviewActorType;
  reviewer: string;
  reviewedAt: string;
  note: string;
};

const bySource = new Map<string, string[]>();
for (const story of norseStoryManifest) {
  for (const scope of story.sourceScopes) {
    const entries = bySource.get(scope.sourceId) ?? [];
    entries.push(story.id);
    bySource.set(scope.sourceId, entries);
  }
}

const p0SourceIds = new Set([
  'norse-src-voluspa', 'norse-src-havamal', 'norse-src-vafthrudnismal', 'norse-src-grimnismal', 'norse-src-skirnismal', 'norse-src-harbardsljod', 'norse-src-hymiskvida', 'norse-src-lokasenna', 'norse-src-thrymskvida', 'norse-src-alvissmal', 'norse-src-baldrs-draumar', 'norse-src-hyndluljod',
  'norse-src-prose-edda-gylfaginning', 'norse-src-prose-edda-skaldskaparmal',
  'norse-src-haustlong', 'norse-src-thorsdrapa', 'norse-src-husdrapa', 'norse-src-ragnarsdrapa',
  'norse-src-gripisspa', 'norse-src-reginsmal', 'norse-src-fafnismal', 'norse-src-sigrdrifumal', 'norse-src-sigurdarkvida', 'norse-src-gudrunarkvida-1', 'norse-src-gudrunarkvida-2', 'norse-src-helreid-brynhildar', 'norse-src-atlakvida', 'norse-src-volsunga-saga',
]);

const contextOnly = new Map<string, string>([
  ['norse-src-hyndluljod', 'P0 genealogy / Freyja support is tracked as claims and names; no forced standalone Story.'],
  ['norse-src-mjolnir-pendants', 'Material evidence supplies visual context only, not a continuous narrative.'],
  ['norse-src-gotland-picture-stones', 'Material evidence supplies visual context only, not a continuous narrative.'],
  ['norse-src-academic-norse-mythology', 'Modern scholarship explains witness history and conflicts, not a primary myth Story.'],
]);

const priorityFor = (source: ContentSource): NorsePriority => p0SourceIds.has(source.sourceId) ? 'P0' : source.sourceFamily === 'material-culture' || source.sourceFamily === 'academic-secondary' || source.sourceFamily === 'regional-medieval' ? 'P2' : 'P1';

export const norseSourceCoverage: readonly NorseSourceCoverage[] = norseSources.map((source) => {
  const manifestIds = bySource.get(source.sourceId) ?? [];
  const contextReason = contextOnly.get(source.sourceId);
  return {
    sourceId: source.sourceId,
    priority: priorityFor(source),
    status: contextReason ? 'context-only' : manifestIds.length > 0 ? 'covered' : 'excluded-with-reason',
    storyManifestIds: manifestIds,
    supportingClaimIds: [],
    exclusionReason: contextReason ? undefined : manifestIds.length > 0 ? undefined : 'Registered for source completeness; no standalone Story is planned in the frozen Phase-2 scope.',
    reviewKind: 'scope-mapped',
    reviewerType: 'automated',
    reviewer: 'mythcanvas-editorial-baseline',
    reviewedAt: '2026-09-06',
    note: contextReason ?? 'Mapped to the Phase-2 Story Manifest; detailed Story prose and entity closure occur in later phases.',
  };
});
