import type { GenerationJob } from '../generation/types';

export async function insertGenerationJob(db: D1Database | undefined, job: GenerationJob, userId?: string): Promise<boolean> {
  if (!db) return false;

  await db.prepare(`
    INSERT INTO generation_jobs (
      id, status, entity_type, entity_id, mythology_id, style_id, scene, composition, ratio,
      description, prompt, provider, provider_request_id, asset_key, asset_mime, asset_width,
      asset_height, error_code, error_message, source_generation_id, is_public, user_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    job.id,
    job.status,
    job.entityType,
    job.entityId,
    job.mythologyId,
    job.styleId,
    job.scene,
    job.composition,
    job.ratio,
    job.description,
    job.prompt,
    job.provider,
    job.providerRequestId ?? null,
    job.assetKey ?? null,
    job.assetMime ?? null,
    job.assetWidth ?? null,
    job.assetHeight ?? null,
    job.errorCode ?? null,
    job.errorMessage ?? null,
    job.sourceGenerationId ?? null,
    job.isPublic ? 1 : 0,
    userId ?? null,
    job.createdAt,
    job.updatedAt,
  ).run();

  return true;
}

/** 列出某个用户最近的生成记录（已完成 ≥ succeeded 优先，含素材） */
export async function listGenerationsByUser(
  db: D1Database | undefined,
  userId: string,
  limit = 50,
): Promise<GenerationJob[]> {
  if (!db) return [];
  const rows = await db
    .prepare(`
      SELECT id, status, entity_type, entity_id, mythology_id, style_id, scene, composition, ratio,
             description, prompt, provider, provider_request_id, asset_key, asset_mime, asset_width,
             asset_height, error_code, error_message, source_generation_id, is_public, user_id, created_at, updated_at
      FROM generation_jobs
      WHERE user_id = ?
      ORDER BY created_at DESC LIMIT ?
    `)
    .bind(userId, String(limit))
    .all();
  return rows.results.map(mapJobRow);
}

export async function markGenerationGenerating(
  db: D1Database | undefined,
  id: string,
  provider: string,
): Promise<void> {
  if (!db) return;
  await db.prepare(`
    UPDATE generation_jobs
    SET status = 'generating', provider = ?, updated_at = ?
    WHERE id = ?
  `).bind(provider, new Date().toISOString(), id).run();
}

export async function completeGenerationJob(
  db: D1Database | undefined,
  input: {
    id: string;
    provider: string;
    providerRequestId?: string;
    assetKey?: string;
    mimeType: string;
    width: number;
    height: number;
  },
): Promise<void> {
  if (!db) return;
  await db.prepare(`
    UPDATE generation_jobs
    SET status = 'succeeded', provider = ?, provider_request_id = ?, asset_key = ?, asset_mime = ?,
        asset_width = ?, asset_height = ?, error_code = NULL, error_message = NULL, updated_at = ?
    WHERE id = ?
  `).bind(
    input.provider,
    input.providerRequestId ?? null,
    input.assetKey ?? null,
    input.mimeType,
    input.width,
    input.height,
    new Date().toISOString(),
    input.id,
  ).run();
}

export async function failGenerationJob(
  db: D1Database | undefined,
  id: string,
  code: string,
  message: string,
): Promise<void> {
  if (!db) return;
  await db.prepare(`
    UPDATE generation_jobs
    SET status = 'failed', error_code = ?, error_message = ?, updated_at = ?
    WHERE id = ?
  `).bind(code, message.slice(0, 500), new Date().toISOString(), id).run();
}

export async function getGenerationJob(db: D1Database | undefined, id: string): Promise<GenerationJob | null> {
  if (!db) return null;
  const row = await db.prepare(`
    SELECT id, status, entity_type, entity_id, mythology_id, style_id, scene, composition, ratio,
           description, prompt, provider, provider_request_id, asset_key, asset_mime, asset_width,
           asset_height, error_code, error_message, source_generation_id, is_public, user_id, created_at, updated_at
    FROM generation_jobs
    WHERE id = ?
  `).bind(id).first<Record<string, unknown>>();

  if (!row) return null;
  return mapJobRow(row);
}

function mapJobRow(row: Record<string, unknown>): GenerationJob {
  return {
    id: String(row.id),
    status: String(row.status) as GenerationJob['status'],
    entityType: String(row.entity_type) as GenerationJob['entityType'],
    entityId: String(row.entity_id),
    mythologyId: String(row.mythology_id),
    styleId: String(row.style_id),
    scene: String(row.scene),
    composition: String(row.composition),
    ratio: String(row.ratio),
    description: String(row.description ?? ''),
    prompt: String(row.prompt),
    provider: String(row.provider),
    providerRequestId: optionalString(row.provider_request_id),
    assetKey: optionalString(row.asset_key),
    assetMime: optionalString(row.asset_mime),
    assetWidth: optionalNumber(row.asset_width),
    assetHeight: optionalNumber(row.asset_height),
    errorCode: optionalString(row.error_code),
    errorMessage: optionalString(row.error_message),
    sourceGenerationId: optionalString(row.source_generation_id),
    isPublic: Number(row.is_public) === 1,
    userId: optionalString(row.user_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function optionalString(value: unknown): string | undefined {
  return value == null ? undefined : String(value);
}

function optionalNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
