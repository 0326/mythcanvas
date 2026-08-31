import type { Character, CharacterRelation, ContentConcept, SourceRef } from './types';

export type CharacterGraphNodeKind = 'character' | 'concept';

export type CharacterGraphNode = {
  id: string;
  kind: CharacterGraphNodeKind;
  name: string;
  nameEn?: string;
  role?: string;
  slug?: string;
  symbol?: string;
};

export type CharacterGraphLink = {
  id: string;
  source: string;
  target: string;
  relationType: string;
  label: string;
  directional: boolean;
  traditionScope?: string;
  confidence: CharacterRelation['confidence'];
  sourceRefs: readonly SourceRef[];
};

export type CharacterGraphData = {
  focusId: string;
  mythologyId: string;
  selectedScope?: string;
  availableScopes: readonly string[];
  requiresScopeSelection: boolean;
  nodes: readonly CharacterGraphNode[];
  links: readonly CharacterGraphLink[];
  hiddenRelationCount: number;
  canExpand: boolean;
};

export type BuildCharacterGraphInput = {
  focusId: string;
  mythologyId: string;
  characters: readonly Character[];
  concepts?: readonly ContentConcept[];
  relations: readonly CharacterRelation[];
  scope?: string;
  depth?: 1 | 2;
  nodeLimit?: number;
};

const RELATION_LABELS: Record<string, string> = {
  parent: '父母',
  child: '子女',
  consort: '配偶',
  sibling: '手足',
  master: '师承',
  disciple: '弟子',
  ally: '同盟',
  rival: '竞争',
  enemy: '敌对',
  serves: '侍奉',
  'rules-over': '统属',
  'syncretized-with': '神格关联',
  'associated-with': '关联',
  created: '创造',
  'transformed-into': '化作',
};

const SYMMETRIC_RELATIONS = new Set(['consort', 'sibling', 'ally', 'rival', 'enemy', 'associated-with']);

function endpointIds(relation: CharacterRelation): string[] {
  return [relation.fromCharacterId, relation.toCharacterId ?? relation.toConceptId].filter((id): id is string => Boolean(id));
}

function selectScope(relations: readonly CharacterRelation[], focusId: string, requestedScope?: string) {
  // A Character page chooses among traditions that actually assert a direct
  // relationship for its focus, not every tradition present elsewhere in a mythology.
  const focusRelations = relations.filter((relation) => endpointIds(relation).includes(focusId));
  const scopedFocusRelations = focusRelations.length > 0 ? focusRelations : relations;
  const availableScopes = Array.from(new Set(scopedFocusRelations.flatMap((relation) => relation.traditionScope ? [relation.traditionScope] : []))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
  if (requestedScope && availableScopes.includes(requestedScope)) {
    return { availableScopes, selectedScope: requestedScope, requiresScopeSelection: false };
  }

  const defaultScopes = Array.from(new Set(scopedFocusRelations
    .filter((relation) => relation.isDefault !== false && relation.traditionScope)
    .map((relation) => relation.traditionScope!)));

  return {
    availableScopes,
    selectedScope: defaultScopes.length === 1 ? defaultScopes[0] : undefined,
    requiresScopeSelection: defaultScopes.length > 1,
  };
}

function isIncludedByScope(relation: CharacterRelation, selectedScope?: string, requiresScopeSelection = false): boolean {
  if (relation.isDefault === false) return false;
  if (!relation.traditionScope) return true;
  if (requiresScopeSelection) return false;
  return relation.traditionScope === selectedScope;
}

function relationToLink(relation: CharacterRelation): CharacterGraphLink | undefined {
  const target = relation.toCharacterId ?? relation.toConceptId;
  if (!target) return undefined;
  return {
    id: relation.id,
    source: relation.fromCharacterId,
    target,
    relationType: relation.relationType,
    label: RELATION_LABELS[relation.relationType] ?? relation.relationType,
    directional: !SYMMETRIC_RELATIONS.has(relation.relationType),
    traditionScope: relation.traditionScope,
    confidence: relation.confidence,
    sourceRefs: relation.sourceRefs,
  };
}

/**
 * Builds a small, render-safe neighbourhood. The returned DTO deliberately has
 * string endpoints, because 3d-force-graph mutates graph objects while simulating.
 */
export function buildCharacterGraph(input: BuildCharacterGraphInput): CharacterGraphData {
  const depth = input.depth === 2 ? 2 : 1;
  const nodeLimit = Math.min(Math.max(input.nodeLimit ?? 24, 2), 80);
  const { availableScopes, selectedScope, requiresScopeSelection } = selectScope(input.relations, input.focusId, input.scope);
  const knownNodes = new Map<string, CharacterGraphNode>();

  for (const character of input.characters) {
    if (character.mythologyId !== input.mythologyId) continue;
    knownNodes.set(character.id, {
      id: character.id,
      kind: 'character',
      name: character.name,
      nameEn: character.nameEn,
      role: character.role,
      slug: character.slug,
      symbol: character.symbols[0],
    });
  }
  for (const concept of input.concepts ?? []) {
    if (concept.mythologyId !== input.mythologyId) continue;
    knownNodes.set(concept.id, { id: concept.id, kind: 'concept', name: concept.name, slug: concept.slug });
  }

  const scopedRelations = input.relations.filter((relation) =>
    isIncludedByScope(relation, selectedScope, requiresScopeSelection)
    && endpointIds(relation).every((id) => knownNodes.has(id)),
  );
  const adjacency = new Map<string, CharacterRelation[]>();
  for (const relation of scopedRelations) {
    for (const id of endpointIds(relation)) {
      const list = adjacency.get(id) ?? [];
      list.push(relation);
      adjacency.set(id, list);
    }
  }

  const visited = new Set<string>([input.focusId]);
  const queue: Array<{ id: string; distance: number }> = [{ id: input.focusId, distance: 0 }];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.distance >= depth) continue;
    for (const relation of adjacency.get(current.id) ?? []) {
      for (const nextId of endpointIds(relation)) {
        if (visited.has(nextId) || visited.size >= nodeLimit) continue;
        visited.add(nextId);
        queue.push({ id: nextId, distance: current.distance + 1 });
      }
    }
  }

  const links = scopedRelations
    .filter((relation) => endpointIds(relation).every((id) => visited.has(id)))
    .map(relationToLink)
    .filter((link): link is CharacterGraphLink => Boolean(link));
  const nodes = Array.from(visited)
    .map((id) => knownNodes.get(id))
    .filter((node): node is CharacterGraphNode => Boolean(node));
  const hiddenRelationCount = scopedRelations.filter((relation) => endpointIds(relation).some((id) => !visited.has(id))).length;
  const canExpand = depth === 1 && scopedRelations.some((relation) =>
    endpointIds(relation).some((id) => visited.has(id)) && endpointIds(relation).some((id) => !visited.has(id)),
  );

  return {
    focusId: input.focusId,
    mythologyId: input.mythologyId,
    selectedScope,
    availableScopes,
    requiresScopeSelection,
    nodes,
    links,
    hiddenRelationCount,
    canExpand,
  };
}
