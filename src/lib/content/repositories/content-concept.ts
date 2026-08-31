import type { ContentConcept, SourceRef } from '../types';
import { parseJson } from './shared';

type ContentConceptRow = Record<string, unknown>;

function mapContentConceptRow(row: ContentConceptRow): ContentConcept {
  return {
    id: String(row.id),
    mythologyId: String(row.mythology_id),
    slug: String(row.slug),
    name: String(row.name),
    summary: String(row.summary ?? ''),
    sourceRefs: parseJson<SourceRef[]>(row.source_refs_json, []),
  };
}

/** Loads only active concepts whose ids are already referenced by public relations. */
export async function getContentConceptsByIds(
  db: D1Database | undefined,
  ids: readonly string[],
): Promise<ContentConcept[]> {
  if (!db || ids.length === 0) return [];
  const uniqueIds = Array.from(new Set(ids)).slice(0, 100);
  const placeholders = uniqueIds.map(() => '?').join(',');
  const rows = await db.prepare(`
    SELECT id, mythology_id, slug, name, summary, source_refs_json
    FROM content_concepts
    WHERE status = 'active' AND id IN (${placeholders})
  `).bind(...uniqueIds).all<ContentConceptRow>();
  return rows.results.map(mapContentConceptRow);
}
