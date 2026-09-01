import type { CharacterInterpretation, CharacterName, ContentClaim } from '../../lib/content/types';
import { sourceRef } from './sources';

export const mayaNames: readonly CharacterName[] = [
  { id: 'name-maya-seven-macaw', characterId: 'character-vucub-caquix', name: 'Seven Macaw', nameEn: 'Seven Macaw', nameKind: 'alias', isPrimaryForScope: true, sourceRefs: [sourceRef('popolVuh', 'Vucub Caquix / Seven Macaw cycle')], confidence: 'high' },
  { id: 'name-maya-chaak-chac', characterId: 'character-chaak', name: 'Chac', nameEn: 'Chac', nameKind: 'alias', isPrimaryForScope: false, sourceRefs: [sourceRef('chilamBalam', 'rain and naming sections')], confidence: 'medium' },
  { id: 'name-maya-kinich', characterId: 'character-kinich-ajaw', name: 'K’inich Ajaw', nameEn: 'K’inich Ajaw', nameKind: 'primary', isPrimaryForScope: true, sourceRefs: [sourceRef('classicBridge', 'Classic solar imagery')], confidence: 'medium' },
];

export const mayaInterpretations: readonly CharacterInterpretation[] = [
  { id: 'interpretation-maya-chaak-codex', characterId: 'character-chaak', slug: 'postclassic-codex-rain', name: 'Codex 雨与历法层', role: '雨、农业与历法材料中的身份解释层', summary: '只覆盖 Postclassic Codex 雨历书材料，不把后期图像回填为所有时期的唯一查克形象。', traditionTags: ['classic-lowland', 'rain-and-storm'], sourcePeriods: ['Postclassic Maya'], sourceRefs: [sourceRef('dresden', 'rain almanac sections')], identityAnchors: ['雨历书', '雨与农业', '来源限定的长鼻意象'], symbols: ['雨', '雷斧', '玉米'], canonicalDesignOverrides: { paletteCues: ['风暴蓝', '玉石绿', '石灰岩白'] }, promptFragment: 'Keep the rain-almanac scope explicit and avoid Aztec Tlaloc conflation.', confidence: 'medium' },
];

export const mayaClaims: readonly ContentClaim[] = [
  { id: 'claim-maya-xibalba-scope', subjectType: 'world', subjectId: 'world-xibalba', claimType: 'identity', summary: '西巴尔巴是《Popol Vuh》/K’iche’ 传统中的地下世界名称，不是所有 Maya 地下世界意象的统一专名。', status: 'supported', traditionScope: "K'iche' Popol Vuh", sourceRefs: [sourceRef('popolVuh', 'Xibalba narrative sections')] },
  { id: 'claim-maya-seven-macaw-boundary', subjectType: 'character', subjectId: 'character-vucub-caquix', claimType: 'identity', summary: 'Seven Macaw 保持为 K’iche’《Popol Vuh》角色；与 Classic Maya Principal Bird Deity 的对应属于待来源化的比较问题。', status: 'contested', traditionScope: "K'iche' Popol Vuh", sourceRefs: [sourceRef('popolVuh', 'Vucub Caquix / Seven Macaw cycle'), sourceRef('classicBridge', 'bird deity identity comparison')] },
  { id: 'claim-maya-maize-boundary', subjectType: 'character', subjectId: 'character-maize-god', claimType: 'identity', summary: '古典期玉米神图像层与《Popol Vuh》胡恩·胡纳普保持分开，不自动合并。', status: 'contested', traditionScope: 'Classic Lowland Maya', sourceRefs: [sourceRef('classicBridge', 'maize emergence imagery')] },
];
