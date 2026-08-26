import type { APIRoute } from 'astro';
import { getCharacterById } from '../../../lib/content/repositories';
import {
  getCharacterInterpretationProfile,
  getCharacterVariantProfile,
} from '../../../lib/generation/config-repository';
import {
  appendVariantReferenceAsset,
  archiveReferenceAsset,
  insertReferenceAsset,
  listReferenceAssetRecords,
  removeVariantReferenceAsset,
} from '../../../lib/generation/reference-assets';

export const prerender = false;

const ALLOWED_TYPES = new Set([
  'portrait-front',
  'portrait-three-quarter',
  'fullbody-front',
  'fullbody-three-quarter',
  'turnaround',
  'expression-sheet',
  'signature-props',
]);
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);
const MAX_BYTES = 12 * 1024 * 1024;

export const GET: APIRoute = async ({ request, locals }) => {
  if (!isAuthorized(request, locals.runtime.env)) return unauthorized();

  const url = new URL(request.url);
  const characterId = url.searchParams.get('characterId')?.trim() ?? '';
  const variantId = url.searchParams.get('variantId')?.trim() || undefined;
  const interpretationId = url.searchParams.get('interpretationId')?.trim() || undefined;
  if (!characterId) return json({ error: { code: 'MISSING_CHARACTER', message: '请选择角色。' } }, 400);

  const character = await getCharacterById(locals.runtime.env.DB, characterId);
  if (!character) return json({ error: { code: 'CHARACTER_NOT_FOUND', message: '角色不存在。' } }, 404);
  if (interpretationId) {
    try {
      await getCharacterInterpretationProfile(locals.runtime.env.DB, interpretationId, characterId);
    } catch {
      return json({ error: { code: 'INTERPRETATION_NOT_FOUND', message: '传统版本不存在。' } }, 404);
    }
  }
  if (variantId) {
    try {
      await getCharacterVariantProfile(locals.runtime.env.DB, variantId, characterId, interpretationId);
    } catch {
      return json({ error: { code: 'VARIANT_NOT_FOUND', message: '角色形态不存在。' } }, 404);
    }
  }

  const items = await listReferenceAssetRecords(locals.runtime.env.DB, characterId, variantId, interpretationId);
  return json({
    items: items.map((item) => ({ ...item, imageUrl: `/media/${item.assetKey}` })),
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!isAuthorized(request, locals.runtime.env)) return unauthorized();

  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return handleJsonAction(request, locals.runtime.env.DB);
  }

  if (!contentType.includes('multipart/form-data')) {
    return json({ error: { code: 'INVALID_CONTENT_TYPE', message: '请上传图片文件。' } }, 415);
  }

  const form = await request.formData();
  const characterId = stringField(form, 'characterId');
  const variantId = stringField(form, 'variantId') || undefined;
  const interpretationId = stringField(form, 'interpretationId') || undefined;
  const assetType = stringField(form, 'assetType');
  const altText = stringField(form, 'altText').slice(0, 240);
  const file = form.get('file');

  if (!characterId) return json({ error: { code: 'MISSING_CHARACTER', message: '请选择角色。' } }, 400);
  if (!ALLOWED_TYPES.has(assetType)) return json({ error: { code: 'INVALID_ASSET_TYPE', message: '参考图类型无效。' } }, 400);
  if (!(file instanceof File) || file.size === 0) return json({ error: { code: 'MISSING_FILE', message: '请选择图片文件。' } }, 400);
  if (!ALLOWED_MIME.has(file.type)) return json({ error: { code: 'INVALID_FILE_TYPE', message: '仅支持 PNG、JPEG、WebP。' } }, 400);
  if (file.size > MAX_BYTES) return json({ error: { code: 'FILE_TOO_LARGE', message: '单张参考图不能超过 12 MB。' } }, 413);

  const character = await getCharacterById(locals.runtime.env.DB, characterId);
  if (!character) return json({ error: { code: 'CHARACTER_NOT_FOUND', message: '角色不存在。' } }, 404);
  if (interpretationId) {
    try {
      await getCharacterInterpretationProfile(locals.runtime.env.DB, interpretationId, characterId);
    } catch {
      return json({ error: { code: 'INTERPRETATION_NOT_FOUND', message: '传统版本不存在。' } }, 404);
    }
  }
  if (variantId) {
    try {
      await getCharacterVariantProfile(locals.runtime.env.DB, variantId, characterId, interpretationId);
    } catch {
      return json({ error: { code: 'VARIANT_NOT_FOUND', message: '角色形态不存在。' } }, 404);
    }
  }

  const bucket = locals.runtime.env.ARTWORKS;
  if (!bucket || !locals.runtime.env.DB) {
    return json({ error: { code: 'STORAGE_UNAVAILABLE', message: 'D1/R2 尚未配置，无法保存参考图。' } }, 503);
  }

  const id = `ref-${crypto.randomUUID()}`;
  const scope = variantId ?? interpretationId ?? 'canonical';
  const extension = extensionForMime(file.type);
  const assetKey = `references/${safeSegment(characterId)}/${safeSegment(scope)}/${assetType}-${id}.${extension}`;
  const bytes = await file.arrayBuffer();

  await bucket.put(assetKey, bytes, {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: {
      characterId,
      variantId: variantId ?? '',
      interpretationId: interpretationId ?? '',
      assetType,
      referenceId: id,
    },
  });

  try {
    await insertReferenceAsset(locals.runtime.env.DB, {
      id,
      ownerType: variantId ? 'character_variant' : 'character',
      ownerId: variantId ?? characterId,
      characterInterpretationId: interpretationId,
      assetType,
      assetKey,
      mimeType: file.type,
      altText: altText || `${character.name} ${assetType} reference`,
      sourceType: 'platform',
      license: 'MythCanvas internal reference asset',
    });
    if (variantId) await appendVariantReferenceAsset(locals.runtime.env.DB, variantId, id);
  } catch (error) {
    await bucket.delete(assetKey).catch(() => undefined);
    console.error('Failed to register reference asset', error);
    return json({ error: { code: 'REFERENCE_SAVE_FAILED', message: '参考图保存失败，请重试。' } }, 500);
  }

  return json({
    ok: true,
    item: {
      id,
      ownerType: variantId ? 'character_variant' : 'character',
      ownerId: variantId ?? characterId,
      characterInterpretationId: interpretationId,
      assetType,
      assetKey,
      mimeType: file.type,
      altText: altText || `${character.name} ${assetType} reference`,
      imageUrl: `/media/${assetKey}`,
    },
  }, 201);
};

async function handleJsonAction(request: Request, db: D1Database | undefined): Promise<Response> {
  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const action = typeof body.action === 'string' ? body.action : '';
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const variantId = typeof body.variantId === 'string' ? body.variantId.trim() : '';

  if (action !== 'archive' || !id) {
    return json({ error: { code: 'INVALID_ACTION', message: '操作参数无效。' } }, 400);
  }

  const changed = await archiveReferenceAsset(db, id);
  if (variantId) await removeVariantReferenceAsset(db, variantId, id);
  return json({ ok: changed, message: changed ? '参考图已归档。' : '参考图不存在或已归档。' });
}

function isAuthorized(request: Request, env: Record<string, unknown>): boolean {
  const token = typeof env.ADMIN_TOKEN === 'string' ? env.ADMIN_TOKEN : undefined;
  const header = request.headers.get('authorization') ?? '';
  if (token && (header === `Bearer ${token}` || header === `Token ${token}`)) return true;
  const hostname = new URL(request.url).hostname;
  const local = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
  return local && Boolean(env.ALLOW_ADMIN_HEADER) && Boolean(request.headers.get('x-admin-force'));
}

function unauthorized(): Response {
  return json({ error: { code: 'UNAUTHORIZED', message: '需要管理员权限。' } }, 401);
}

function stringField(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
}

function extensionForMime(mimeType: string): string {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/webp') return 'webp';
  return 'png';
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
