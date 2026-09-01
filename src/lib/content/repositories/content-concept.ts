import type { ContentConcept, SourceRef } from '../types';
import { parseJson, withD1ReadFallback } from './shared';
import { listStructuredMythologyBundles } from '../../../content/registry';

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
  if (ids.length === 0) return [];
  const uniqueIds = Array.from(new Set(ids)).slice(0, 100);
  const staticConcepts = [...new Set(uniqueIds.flatMap((id) => {
    for (const bundle of listStructuredMythologyBundles()) {
      const concept = bundle.concepts?.find((item) => item.id === id);
      if (concept) return [concept];
    }
    return [];
  }))];
  if (!db) return staticConcepts;
  return withD1ReadFallback(async () => {
    const placeholders = uniqueIds.map(() => '?').join(',');
    const rows = await db.prepare(`
      SELECT id, mythology_id, slug, name, summary, source_refs_json
      FROM content_concepts
      WHERE status = 'active' AND id IN (${placeholders})
    `).bind(...uniqueIds).all<ContentConceptRow>();
    const byId = new Map(staticConcepts.map((item) => [item.id, item]));
    rows.results.map(mapContentConceptRow).forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
  }, () => staticConcepts);
}
