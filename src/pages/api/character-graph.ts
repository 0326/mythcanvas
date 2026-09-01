import type { APIRoute } from 'astro';
import { buildCharacterGraph } from '../../lib/content/character-graph';
import {
  getCharacterBySlug,
  getCharactersByIds,
  getDirectCharacterRelations,
  getRelationsForCharacterIds,
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
  const interpretationId = normalizeScope(url.searchParams.get('interpretation'));
  const db = locals.runtime.env.DB;
  const character = await getCharacterBySlug(db, slug);
  if (!character) return json({ error: { code: 'NOT_FOUND', message: '未找到公开角色。' } }, 404);

  const directRelations = await getDirectCharacterRelations(db, character.id);
  const directIds = directRelations.flatMap((relation) => [relation.fromCharacterId, relation.toCharacterId].filter((id): id is string => Boolean(id)));
  const directCharacters = await getCharactersByIds(db, character.mythologyId, [character.id, ...directIds]);
  const firstPass = buildCharacterGraph({ focusId: character.id, mythologyId: character.mythologyId, characters: directCharacters, relations: directRelations, interpretationId, scope, depth: 1, nodeLimit });
  const neighborhoodIds = firstPass.nodes.map((node) => node.kind === 'character' ? node.id : '').filter(Boolean);
  const relations = depth === 2 && !firstPass.requiresScopeSelection
    ? await getRelationsForCharacterIds(db, character.mythologyId, neighborhoodIds)
    : directRelations;
  const relationCharacterIds = relations.flatMap((relation) => [relation.fromCharacterId, relation.toCharacterId].filter((id): id is string => Boolean(id)));
  const characters = await getCharactersByIds(db, character.mythologyId, [character.id, ...relationCharacterIds]);
  const conceptIds = relations.flatMap((relation) => relation.toConceptId ? [relation.toConceptId] : []);
  const concepts = await getContentConceptsByIds(db, conceptIds);

  return json(buildCharacterGraph({
    focusId: character.id,
    mythologyId: character.mythologyId,
    characters,
    concepts,
    relations,
    scope,
    interpretationId,
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
