import type { Character, CharacterRelation, ContentConcept, SourceRef } from './types';
import { getRelationSemantic } from './relation-semantics';

export type CharacterGraphNodeKind = 'character' | 'concept';

export type CharacterGraphNode = {
  id: string;
  kind: CharacterGraphNodeKind;
  name: string;
  nameEn?: string;
  role?: string;
  slug?: string;
  symbol?: string;
  portrait?: { src: string; width: number; height: number; alt: string };
};

export type CharacterGraphLink = {
  id: string;
  source: string;
  target: string;
  relationType: string;
  category: ReturnType<typeof getRelationSemantic>['category'];
  neutralLabel: string;
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
  /** Kept as strings for V1 clients; scopeOptions is the V2 structured form. */
  availableScopes: readonly string[];
  scopeOptions: readonly GraphScopeOption[];
  interpretationId?: string;
  requiresScopeSelection: boolean;
  nodes: readonly CharacterGraphNode[];
  links: readonly CharacterGraphLink[];
  hiddenNodeCount: number;
  hiddenRelationCount: number;
  canExpand: boolean;
};

export type GraphScopeOption = { id: string; label: string; isDefault: boolean; sourceRefs: readonly SourceRef[] };

export type BuildCharacterGraphInput = {
  focusId: string;
  mythologyId: string;
  characters: readonly Character[];
  concepts?: readonly ContentConcept[];
  relations: readonly CharacterRelation[];
  scope?: string;
  interpretationId?: string;
  depth?: 1 | 2;
  nodeLimit?: number;
};

function endpointIds(relation: CharacterRelation): string[] {
  return [relation.fromCharacterId, relation.toCharacterId ?? relation.toConceptId].filter((id): id is string => Boolean(id));
}

function selectScope(relations: readonly CharacterRelation[], focusId: string, requestedScope?: string) {
  // A Character page chooses among traditions that actually assert a direct
  // relationship for its focus, not every tradition present elsewhere in a mythology.
  const focusRelations = relations.filter((relation) => endpointIds(relation).includes(focusId));
  const scopedFocusRelations = focusRelations.length > 0 ? focusRelations : relations;
  const scopeEntries = Array.from(new Map(scopedFocusRelations
    .filter((relation) => relation.traditionScope)
    .map((relation) => [relation.traditionScope!, relation])).values())
    .sort((a, b) => (a.traditionScope ?? '').localeCompare(b.traditionScope ?? '', 'zh-CN'));
  const scopeOptions = scopeEntries.map((relation): GraphScopeOption => ({ id: relation.traditionScope!, label: relation.traditionScope!, isDefault: relation.isDefault !== false, sourceRefs: relation.sourceRefs }));
  const availableScopes = scopeOptions.map((scope) => scope.id);
  if (requestedScope && availableScopes.includes(requestedScope)) {
    return { availableScopes, scopeOptions, selectedScope: requestedScope, requiresScopeSelection: false };
  }

  const defaultScopes = Array.from(new Set(scopedFocusRelations
    .filter((relation) => relation.isDefault !== false && relation.traditionScope)
    .map((relation) => relation.traditionScope!)));

  if (defaultScopes.length === 1) {
    return { availableScopes, scopeOptions, selectedScope: defaultScopes[0], requiresScopeSelection: false };
  }

  // Zero or multiple default scopes means the graph cannot safely infer which
  // tradition the user wants. This also covers a single explicitly non-default
  // alternate tradition: it must remain reachable through an explicit choice.
  return {
    availableScopes,
    scopeOptions,
    selectedScope: undefined,
    requiresScopeSelection: availableScopes.length > 0,
  };
}

function isIncludedByScope(relation: CharacterRelation, focusId: string, selectedScope?: string, interpretationId?: string, requiresScopeSelection = false): boolean {
  const focusInterpretation = relation.fromCharacterId === focusId ? relation.fromInterpretationId : relation.toCharacterId === focusId ? relation.toInterpretationId : undefined;
  if (focusInterpretation && focusInterpretation !== interpretationId) return false;
  if (!interpretationId && focusInterpretation) return false;
  if (!relation.traditionScope) return relation.isDefault !== false;
  if (requiresScopeSelection && !selectedScope) return false;
  if (!selectedScope) return false;

  // Once a source/tradition scope is explicitly selected, include every active
  // assertion in that scope. `isDefault` only controls compact/default reading;
  // it must not make supported alternate-tradition facts impossible to inspect.
  return relation.traditionScope === selectedScope;
}

function relationToLink(relation: CharacterRelation): CharacterGraphLink | undefined {
  const target = relation.toCharacterId ?? relation.toConceptId;
  if (!target) return undefined;
  const semantic = getRelationSemantic(relation.relationType);
  return {
    id: relation.id,
    source: relation.fromCharacterId,
    target,
    relationType: relation.relationType,
    category: semantic.category,
    neutralLabel: semantic.neutralLabel,
    label: semantic.neutralLabel,
    directional: semantic.directional,
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
  const { availableScopes, scopeOptions, selectedScope, requiresScopeSelection } = selectScope(input.relations, input.focusId, input.scope);
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
      portrait: character.portrait ? { ...character.portrait } : undefined,
    });
  }
  for (const concept of input.concepts ?? []) {
    if (concept.mythologyId !== input.mythologyId) continue;
    knownNodes.set(concept.id, { id: concept.id, kind: 'concept', name: concept.name, slug: concept.slug });
  }

  const scopedRelations = input.relations.filter((relation) =>
    isIncludedByScope(relation, input.focusId, selectedScope, input.interpretationId, requiresScopeSelection)
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
  const hiddenNodeCount = Math.max(0, knownNodes.size - visited.size);
  const hiddenRelationCount = scopedRelations.filter((relation) => endpointIds(relation).some((id) => !visited.has(id))).length;
  const canExpand = depth === 1 && scopedRelations.some((relation) =>
    endpointIds(relation).some((id) => visited.has(id)) && endpointIds(relation).some((id) => !visited.has(id)),
  );

  return {
    focusId: input.focusId,
    mythologyId: input.mythologyId,
    selectedScope,
    availableScopes,
    scopeOptions,
    interpretationId: input.interpretationId,
    requiresScopeSelection,
    nodes,
    links,
    hiddenNodeCount,
    hiddenRelationCount,
    canExpand,
  };
}
