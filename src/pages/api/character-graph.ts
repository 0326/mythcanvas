import type { APIRoute } from 'astro';
import { buildCharacterGraph } from '../../lib/content/character-graph';
import {
  getCharacterBySlug,
  getCharacterRelationsForMythology,
  getCharactersForMythology,
  getContentConceptsByIds,
} from '../../lib/content/repositories';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const slug = url.searchParams.get('character')?.trim();
  if (!slug) return json({ error: { code: 'MISSING_CHARACTER', message: '缺少角色参数。' } }, 400);

  const depth = url.searchParams.get('depth') === '2' ? 2 : 1;
  const requestedLimit = Number(url.searchParams.get('limit'));
  const nodeLimit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.floor(requestedLimit), 2), 80) : 24;
  const scope = normalizeScope(url.searchParams.get('scope'));
  const db = locals.runtime.env.DB;
  const character = await getCharacterBySlug(db, slug);
  if (!character) return json({ error: { code: 'NOT_FOUND', message: '未找到公开角色。' } }, 404);

  const [characters, relations] = await Promise.all([
    getCharactersForMythology(db, character.mythologyId, { limit: 1000 }),
    getCharacterRelationsForMythology(db, character.mythologyId),
  ]);
  const conceptIds = relations.flatMap((relation) => relation.toConceptId ? [relation.toConceptId] : []);
  const concepts = await getContentConceptsByIds(db, conceptIds);

  return json(buildCharacterGraph({
    focusId: character.id,
    mythologyId: character.mythologyId,
    characters,
    concepts,
    relations,
    scope,
    depth,
    nodeLimit,
  }));
};

function normalizeScope(value: string | null): string | undefined {
  const scope = value?.trim();
  return scope && scope.length <= 120 ? scope : undefined;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
