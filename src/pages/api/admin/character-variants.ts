import type { APIRoute } from 'astro';
import { getCharacterById } from '../../../lib/content/repositories';
import { listCharacterVariantProfiles } from '../../../lib/generation/creator-config';

export const prerender = false;

const VARIANT_TYPES = new Set(['age', 'costume', 'form', 'composite']);

export const GET: APIRoute = async ({ request, locals }) => {
  if (!isAuthorized(request, locals.runtime.env as Record<string, unknown>)) return unauthorized();
  const characterId = new URL(request.url).searchParams.get('characterId')?.trim() ?? '';
  if (!characterId) return json({ error: { code: 'MISSING_CHARACTER', message: '请选择角色。' } }, 400);
  const character = await getCharacterById(locals.runtime.env.DB, characterId);
  if (!character) return json({ error: { code: 'CHARACTER_NOT_FOUND', message: '角色不存在。' } }, 404);
  const items = await listCharacterVariantProfiles(locals.runtime.env.DB, [characterId]);
  return json({ items });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!isAuthorized(request, locals.runtime.env as Record<string, unknown>)) return unauthorized();
  if (!locals.runtime.env.DB) return json({ error: { code: 'DB_UNAVAILABLE', message: 'D1 尚未配置。' } }, 503);

  const payload = await request.json().catch(() => null);
  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const action = stringValue(body.action) || 'create';

  if (action === 'archive') {
    const id = stringValue(body.id);
    if (!id) return json({ error: { code: 'MISSING_ID', message: '缺少角色形态 ID。' } }, 400);
    const result = await locals.runtime.env.DB.prepare(`
      UPDATE character_variants SET status = 'archived', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status != 'archived'
    `).bind(id).run();
    return json({ ok: Boolean(result.meta.changes), message: result.meta.changes ? '角色形态已归档。' : '角色形态不存在或已归档。' });
  }

  if (action !== 'create') return json({ error: { code: 'INVALID_ACTION', message: '操作无效。' } }, 400);

  const characterId = stringValue(body.characterId);
  const name = stringValue(body.name).slice(0, 80);
  const requestedSlug = stringValue(body.slug).slice(0, 80);
  const variantType = stringValue(body.variantType);
  const description = stringValue(body.description).slice(0, 500);
  const promptFragment = stringValue(body.promptFragment).slice(0, 1600);
  const identityOverrides = stringList(body.identityOverrides, 16, 180);

  if (!characterId || !name || !VARIANT_TYPES.has(variantType)) {
    return json({ error: { code: 'INVALID_VARIANT', message: '角色、名称或形态类型无效。' } }, 400);
  }
  const character = await getCharacterById(locals.runtime.env.DB, characterId);
  if (!character) return json({ error: { code: 'CHARACTER_NOT_FOUND', message: '角色不存在。' } }, 404);

  const id = `variant-${crypto.randomUUID()}`;
  const slug = requestedSlug || `${slugify(name)}-${id.slice(-8)}`;
  try {
    await locals.runtime.env.DB.prepare(`
      INSERT INTO character_variants (
        id, character_id, slug, name, variant_type, description,
        traits_json, identity_overrides_json, prompt_fragment, reference_pack_json, status
      ) VALUES (?, ?, ?, ?, ?, ?, '{}', ?, ?, '[]', 'active')
    `).bind(
      id,
      characterId,
      slug,
      name,
      variantType,
      description,
      JSON.stringify(identityOverrides),
      promptFragment,
    ).run();
  } catch (error) {
    console.error('Failed to create character variant', error);
    return json({ error: { code: 'VARIANT_CREATE_FAILED', message: '角色形态创建失败，名称或 slug 可能重复。' } }, 409);
  }

  return json({
    ok: true,
    item: {
      id,
      characterId,
      name,
      variantType,
      description,
      identityOverrides,
      promptFragment,
      referenceAssetIds: [],
    },
  }, 201);
};

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

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function stringList(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'variant';
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
