import { describe, expect, it } from 'vitest';
import { greekCharacters, greekRelations } from '../src/content/greek/catalog';
import { buildCharacterGraph } from '../src/lib/content/character-graph';
import type { CharacterRelation } from '../src/lib/content/types';

describe('character graph DTO', () => {
  it('uses the one available default tradition and keeps the force graph DTO immutable in shape', () => {
    const athena = greekCharacters.find((character) => character.slug === 'athena');
    expect(athena).toBeDefined();

    const graph = buildCharacterGraph({
      focusId: athena!.id,
      mythologyId: athena!.mythologyId,
      characters: greekCharacters,
      relations: greekRelations,
    });

    expect(graph.selectedScope).toBe('Greek classical tradition');
    expect(graph.requiresScopeSelection).toBe(false);
    expect(graph.nodes.map((node) => node.id)).toContain(athena!.id);
    expect(graph.links.every((link) => typeof link.source === 'string' && typeof link.target === 'string')).toBe(true);
  });

  it('does not mix multiple default traditions until one is explicitly selected', () => {
    const relations: CharacterRelation[] = [
      { id: 'a', fromCharacterId: 'focus', toCharacterId: 'first', relationType: 'parent', traditionScope: '传统甲', isDefault: true, sourceRefs: [], confidence: 'high' },
      { id: 'b', fromCharacterId: 'focus', toCharacterId: 'second', relationType: 'parent', traditionScope: '传统乙', isDefault: true, sourceRefs: [], confidence: 'high' },
      { id: 'neutral', fromCharacterId: 'focus', toCharacterId: 'neutral', relationType: 'ally', isDefault: true, sourceRefs: [], confidence: 'medium' },
    ];
    const characters = ['focus', 'first', 'second', 'neutral'].map((id) => ({
      id,
      mythologyId: 'test',
      worldIds: [],
      slug: id,
      name: id,
      nameEn: id,
      role: '',
      summary: '',
      symbols: [],
      canonicalDesign: { anchors: [] },
      traditionTags: [],
      sourcePeriods: [],
      sourceRefs: [],
      editorialCollections: [],
    }));

    const undecided = buildCharacterGraph({ focusId: 'focus', mythologyId: 'test', characters, relations });
    expect(undecided.requiresScopeSelection).toBe(true);
    expect(undecided.links.map((link) => link.id)).toEqual(['neutral']);

    const selected = buildCharacterGraph({ focusId: 'focus', mythologyId: 'test', characters, relations, scope: '传统乙' });
    expect(selected.links.map((link) => link.id).sort()).toEqual(['b', 'neutral']);
  });
});
