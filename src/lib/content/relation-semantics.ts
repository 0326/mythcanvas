export type RelationCategory = 'kinship' | 'marriage' | 'authority' | 'alliance' | 'conflict' | 'identity' | 'narrative';

export type RelationSemantic = {
  type: string;
  category: RelationCategory;
  directional: boolean;
  neutralLabel: string;
  fromPerspectiveLabel: string;
  toPerspectiveLabel: string;
};

/**
 * Keep the package contract aligned with the D1 relation_type CHECK constraint.
 * New relation types must be added here and to the corresponding migration.
 */
export const SUPPORTED_RELATION_TYPES = new Set([
  'parent', 'child', 'consort', 'sibling', 'master', 'disciple',
  'ally', 'rival', 'enemy', 'serves', 'rules-over',
  'syncretized-with', 'associated-with', 'created', 'transformed-into',
  'narrative', 'punishes', 'orders-creation', 'defeats', 'exchanges-with',
  'opposes', 'captures', 'aids', 'rides', 'companion', 'encounters',
  'resists', 'departs-from',
]);

const semantics: Record<string, RelationSemantic> = {
  parent: { type: 'parent', category: 'kinship', directional: true, neutralLabel: '亲子', fromPerspectiveLabel: '子女', toPerspectiveLabel: '父母' },
  child: { type: 'child', category: 'kinship', directional: true, neutralLabel: '亲子', fromPerspectiveLabel: '父母', toPerspectiveLabel: '子女' },
  consort: { type: 'consort', category: 'marriage', directional: false, neutralLabel: '配偶', fromPerspectiveLabel: '配偶', toPerspectiveLabel: '配偶' },
  sibling: { type: 'sibling', category: 'kinship', directional: false, neutralLabel: '手足', fromPerspectiveLabel: '手足', toPerspectiveLabel: '手足' },
  master: { type: 'master', category: 'authority', directional: true, neutralLabel: '师承', fromPerspectiveLabel: '弟子', toPerspectiveLabel: '师长' },
  disciple: { type: 'disciple', category: 'authority', directional: true, neutralLabel: '师承', fromPerspectiveLabel: '师长', toPerspectiveLabel: '弟子' },
  ally: { type: 'ally', category: 'alliance', directional: false, neutralLabel: '同盟', fromPerspectiveLabel: '同盟', toPerspectiveLabel: '同盟' },
  rival: { type: 'rival', category: 'conflict', directional: false, neutralLabel: '竞争', fromPerspectiveLabel: '竞争', toPerspectiveLabel: '竞争' },
  enemy: { type: 'enemy', category: 'conflict', directional: false, neutralLabel: '敌对', fromPerspectiveLabel: '敌对', toPerspectiveLabel: '敌对' },
  serves: { type: 'serves', category: 'authority', directional: true, neutralLabel: '侍奉', fromPerspectiveLabel: '侍奉对象', toPerspectiveLabel: '侍奉者' },
  'rules-over': { type: 'rules-over', category: 'authority', directional: true, neutralLabel: '统属', fromPerspectiveLabel: '统治对象', toPerspectiveLabel: '统治者' },
  'syncretized-with': { type: 'syncretized-with', category: 'identity', directional: false, neutralLabel: '神格关联', fromPerspectiveLabel: '神格关联', toPerspectiveLabel: '神格关联' },
  'associated-with': { type: 'associated-with', category: 'identity', directional: false, neutralLabel: '关联', fromPerspectiveLabel: '关联', toPerspectiveLabel: '关联' },
  created: { type: 'created', category: 'narrative', directional: true, neutralLabel: '创造', fromPerspectiveLabel: '被创造者', toPerspectiveLabel: '创造者' },
  'transformed-into': { type: 'transformed-into', category: 'narrative', directional: true, neutralLabel: '化作', fromPerspectiveLabel: '化作对象', toPerspectiveLabel: '原形' },
  narrative: { type: 'narrative', category: 'narrative', directional: true, neutralLabel: '叙事关联', fromPerspectiveLabel: '叙事关联', toPerspectiveLabel: '叙事关联' },
};

export function getRelationSemantic(type: string): RelationSemantic {
  return semantics[type] ?? {
    type,
    category: 'narrative',
    directional: true,
    neutralLabel: type,
    fromPerspectiveLabel: type,
    toPerspectiveLabel: type,
  };
}

export function getRelationLabel(type: string, perspective: 'neutral' | 'from' | 'to' = 'neutral'): string {
  const semantic = getRelationSemantic(type);
  if (perspective === 'from') return semantic.fromPerspectiveLabel;
  if (perspective === 'to') return semantic.toPerspectiveLabel;
  return semantic.neutralLabel;
}
