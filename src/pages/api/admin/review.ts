import type { APIRoute } from 'astro';
import { getGenerationJob } from '../../../lib/cloudflare/generation-repository';
import { getSubmission, listSubmissions } from '../../../lib/social/submissions';

export const prerender = false;

function authorized(request: Request, adminToken: string | undefined): boolean {
  if (!adminToken) return false;
  const header = request.headers.get('authorization') ?? '';
  return header === `Bearer ${adminToken}` || header === `Token ${adminToken}`;
}

function directAdmin(request: Request, env: unknown): boolean {
  // 本地调试后门：仅当 ALLOW_ADMIN_HEADER 显式开启 且 请求来自本机时可用，
  // 避免该变量被误配到生产环境后成为任意访客的鉴权绕过
  const flag = (env as { ALLOW_ADMIN_HEADER?: string }).ALLOW_ADMIN_HEADER;
  if (!flag) return false;
  const hostname = new URL(request.url).hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
  return isLocal && Boolean(request.headers.get('x-admin-force'));
}

/** GET /api/admin/review — 列出待审核（受 ADMIN_TOKEN 保护） */
export const GET: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env as Record<string, unknown>;
  const token = typeof env.ADMIN_TOKEN === 'string' ? env.ADMIN_TOKEN : undefined;
  if (!authorized(request, token) && !directAdmin(request, env)) {
    return json({ error: { code: 'UNAUTHORIZED', message: '需要管理员权限。' } }, 401);
  }
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const submissions = await listSubmissions(locals.runtime.env.DB, status === 'all' ? undefined : (status as never) || 'pending');
  return json({ items: submissions });
};

/** POST /api/admin/review — 审核通过(把 generation 写入 artworks) / 拒绝 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env as Record<string, unknown>;
  const token = typeof env.ADMIN_TOKEN === 'string' ? env.ADMIN_TOKEN : undefined;
  if (!authorized(request, token) && !directAdmin(request, env)) {
    return json({ error: { code: 'UNAUTHORIZED', message: '需要管理员权限。' } }, 401);
  }

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const id = typeof body.id === 'string' ? body.id : '';
  const action = body.action === 'reject' ? 'reject' : 'approve';
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 200) : '';

  if (!id) return json({ error: { code: 'MISSING_ID', message: '缺少审核记录 ID。' } }, 400);

  const submission = await getSubmission(locals.runtime.env.DB, id);
  if (!submission || submission.status !== 'pending') {
    return json({ error: { code: 'NOT_PENDING', message: '该记录不在待审核状态。' } }, 400);
  }

  const job = await getGenerationJob(locals.runtime.env.DB, submission.generationId);

  if (action === 'reject') {
    await updateStatus(locals.runtime.env.DB, id, 'rejected', note);
    return json({ ok: true, message: '已拒绝该作品。' });
  }

  // 通过：构造 artwork 写入
  if (!job || !job.assetKey) {
    return json({ error: { code: 'MISSING_ASSET', message: '生成作品缺少图像资产，无法发布。' } }, 400);
  }

  const artworkId = `artwork-${crypto.randomUUID()}`;
  const slug = slugify(submission.title) || `artwork-${Date.now()}`;
  const width = job.assetWidth ?? 900;
  const height = job.assetHeight ?? 1600;

  await insertArtwork(locals.runtime.env.DB, {
    id: artworkId,
    slug,
    title: submission.title,
    type: job.entityType === 'world' ? 'world' : 'character',
    mythologyId: job.mythologyId,
    worldId: job.entityType === 'world' ? job.entityId : null,
    styleId: job.styleId,
    moodIdsJson: '[]',
    assetKey: job.assetKey,
    assetMime: job.assetMime ?? 'image/png',
    width,
    height,
    altText: submission.altText || submission.title,
    sourceType: 'platform',
    license: 'MythCanvas 平台生成',
    creator: null,
    aiModel: job.provider,
  });

  await linkCharacter(locals.runtime.env.DB, artworkId, job.entityType, job.entityId);
  await updateStatus(locals.runtime.env.DB, id, 'approved', note, artworkId);

  return json({ ok: true, message: '已通过并发布到探索页。', artworkId, slug });
};

function slugify(value: string): string {
  const ascii = value
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return ascii || 'artwork';
}

async function updateStatus(
  db: D1Database | undefined,
  id: string,
  status: string,
  note: string,
  artworkId?: string,
): Promise<void> {
  if (!db) return;
  await db
    .prepare(
      `UPDATE content_submissions SET status = ?, review_note = ?, reviewed_at = ?, artwork_id = COALESCE(?, artwork_id) WHERE id = ?`,
    )
    .bind(status, note || null, new Date().toISOString(), artworkId ?? null, id)
    .run();
}

async function insertArtwork(db: D1Database | undefined, input: Record<string, unknown>): Promise<void> {
  if (!db) return;
  await db
    .prepare(
      `INSERT INTO artworks (id, slug, title, type, mythology_id, world_id, style_id, mood_ids_json, asset_key,
        asset_mime, width, height, alt_text, source_type, license, creator, ai_model, review_status, publish_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 'published')`,
    )
    .bind(
      input.id, input.slug, input.title, input.type, input.mythologyId, input.worldId, input.styleId,
      input.moodIdsJson, input.assetKey, input.assetMime, input.width, input.height, input.altText,
      input.sourceType, input.license, input.creator, input.aiModel,
    )
    .run();
}

async function linkCharacter(
  db: D1Database | undefined,
  artworkId: string,
  entityType: string,
  entityId: string,
): Promise<void> {
  if (!db || entityType !== 'character') return;
  await db
    .prepare('INSERT OR IGNORE INTO artwork_characters (artwork_id, character_id) VALUES (?, ?)')
    .bind(artworkId, entityId)
    .run();
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}