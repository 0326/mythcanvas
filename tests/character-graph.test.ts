import { describe, expect, it } from 'vitest';
import { greekCharacters, greekRelations } from '../src/content/greek/catalog';
import { buildCharacterGraph } from '../src/lib/content/character-graph';
import type { CharacterRelation } from '../src/lib/content/types';

const makeCharacters = (ids: readonly string[]) => ids.map((id) => ({
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
    const characters = makeCharacters(['focus', 'first', 'second', 'neutral']);

    const undecided = buildCharacterGraph({ focusId: 'focus', mythologyId: 'test', characters, relations });
    expect(undecided.requiresScopeSelection).toBe(true);
    expect(undecided.links.map((link) => link.id)).toEqual(['neutral']);

    const selected = buildCharacterGraph({ focusId: 'focus', mythologyId: 'test', characters, relations, scope: '传统乙' });
    expect(selected.links.map((link) => link.id).sort()).toEqual(['b', 'neutral']);
  });

  it('keeps non-default alternate traditions reachable through explicit scope selection', () => {
    const relations: CharacterRelation[] = [
      { id: 'default', fromCharacterId: 'focus', toCharacterId: 'default-child', relationType: 'parent', traditionScope: '主传统', isDefault: true, sourceRefs: [], confidence: 'high' },
      { id: 'alternate', fromCharacterId: 'focus', toCharacterId: 'alternate-child', relationType: 'parent', traditionScope: '异说传统', isDefault: false, sourceRefs: [], confidence: 'high' },
      { id: 'alternate-extra', fromCharacterId: 'alternate-child', toCharacterId: 'alternate-grandchild', relationType: 'parent', traditionScope: '异说传统', isDefault: false, sourceRefs: [], confidence: 'medium' },
    ];
    const characters = makeCharacters(['focus', 'default-child', 'alternate-child', 'alternate-grandchild']);

    const defaultView = buildCharacterGraph({ focusId: 'focus', mythologyId: 'test', characters, relations });
    expect(defaultView.selectedScope).toBe('主传统');
    expect(defaultView.links.map((link) => link.id)).toEqual(['default']);

    const alternateView = buildCharacterGraph({
      focusId: 'focus',
      mythologyId: 'test',
      characters,
      relations,
      scope: '异说传统',
      depth: 2,
    });
    expect(alternateView.selectedScope).toBe('异说传统');
    expect(alternateView.links.map((link) => link.id).sort()).toEqual(['alternate', 'alternate-extra']);
  });

  it('requires an explicit choice when the only scoped tradition is non-default', () => {
    const relations: CharacterRelation[] = [
      { id: 'alternate', fromCharacterId: 'focus', toCharacterId: 'other', relationType: 'sibling', traditionScope: '仅异说', isDefault: false, sourceRefs: [], confidence: 'medium' },
    ];
    const characters = makeCharacters(['focus', 'other']);

    const undecided = buildCharacterGraph({ focusId: 'focus', mythologyId: 'test', characters, relations });
    expect(undecided.requiresScopeSelection).toBe(true);
    expect(undecided.availableScopes).toEqual(['仅异说']);
    expect(undecided.links).toEqual([]);

    const selected = buildCharacterGraph({ focusId: 'focus', mythologyId: 'test', characters, relations, scope: '仅异说' });
    expect(selected.requiresScopeSelection).toBe(false);
    expect(selected.links.map((link) => link.id)).toEqual(['alternate']);
  });
});
