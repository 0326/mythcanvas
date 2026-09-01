import type { Character, CharacterRelation, ContentConcept, Scene, TaxonomyTerm, World } from '../../lib/content/types';
import { sourceRef } from './sources';

const mythologyId = 'myth-maya';
const mayaHero = { src: '/art/maya-cosmic-maize.svg', alt: '玉米、星辰与阶梯神庙构成的玛雅神话视觉入口', width: 1600, height: 900 };
const kiche = "K'iche' Popol Vuh";
const classic = 'Classic Lowland Maya';

type CharacterSeed = readonly [string, string, string, string, string[], string, string[], string[], string[], string];
const makeCharacter = ([slug, name, nameEn, role, symbols, characterType, worldIds, traditionTags, sourcePeriods, locator]: CharacterSeed): Character => ({
  id: `character-${slug}`,
  mythologyId,
  worldIds,
  slug,
  name,
  nameEn,
  role,
  summary: `${name}是${role}。本页明确区分 K’iche’ 叙事、古典期图像证据与后期 Yucatec 名称，不把跨时期对应写成单一正典。`,
  symbols,
  characterType,
  traditionTags,
  sourcePeriods,
  sourceRefs: [sourceRef(traditionTags.includes('classic-lowland') ? 'classicBridge' : 'popolVuh', locator)],
  editorialCollections: ['maya-p0'],
  canonicality: traditionTags.includes('classic-lowland') ? 'layered' : 'primary',
  canonicalDesign: {
    anchors: [...symbols.slice(0, 3), `${name}的来源范围`],
    silhouette: `以${symbols.slice(0, 2).join('与')}形成清晰、可复用的玛雅视觉轮廓`,
    appearance: { body: ['成人或神话角色比例', '保持身份锚点优先'] },
    costumeLanguage: ['来源范围明确的编织物、玉石、贝壳或石材', '不复制现代商业改编'],
    paletteCues: ['玉石绿', '石灰岩白', '玉米金', '黑曜石暗部'],
    signatureMaterials: ['玉石', '石灰岩', '贝壳', '灰泥'],
    temperament: ['神圣', '具有叙事功能的姿态'],
    mythologicalFacts: [`${name}的公开身份按${sourcePeriods[0]}范围呈现。`],
    originalDesignChoices: ['采用 MythCanvas 原创轮廓与材质；不把 Aztec / Mexica 图像借作 Maya 视觉捷径。'],
    avoid: ['Aztec Sun Stone', 'Templo Mayor', 'generic jungle pyramid fantasy', '现代影视或游戏的特定造型', '不可读的伪玛雅文字'],
    canonicalPrompt: `Depict ${nameEn} as an original MythCanvas Maya interpretation. Preserve ${symbols.slice(0, 3).join(', ')} and the source scope ${sourcePeriods[0]}. Use limestone, jade, woven material and restrained sacred color; avoid Aztec or franchise-specific designs.`,
  },
});

const seeds: readonly CharacterSeed[] = [
  ['hunahpu', '胡纳普', 'Hunahpu', '《Popol Vuh》中的英雄双子之一', ['吹箭筒', '球场', '日光'], 'hero', ['world-kiche-highlands', 'world-xibalba'], ['kiche-popol-vuh', 'hero-twins'], ['K’iche’ narrative record'], 'Hero Twins narrative'],
  ['xbalanque', '斯巴兰刻', 'Xbalanque', '《Popol Vuh》中的英雄双子之一', ['美洲豹', '球场', '夜色'], 'hero', ['world-kiche-highlands', 'world-xibalba'], ['kiche-popol-vuh', 'hero-twins'], ['K’iche’ narrative record'], 'Hero Twins narrative'],
  ['xquic', '希奎克', 'Xquic', '从西巴尔巴来到人间的母亲角色', ['葫芦树', '逃离', '孕育'], 'mortal', ['world-xibalba', 'world-kiche-highlands'], ['kiche-popol-vuh'], ['K’iche’ narrative record'], 'Xquic episode'],
  ['hun-hunahpu', '胡恩·胡纳普', 'Hun Hunahpu', '第一代球员与英雄双子的父亲', ['球场', '葫芦树', '玉米母题'], 'hero', ['world-kiche-highlands', 'world-xibalba'], ['kiche-popol-vuh'], ['K’iche’ narrative record'], 'First Ballplayers'],
  ['vucub-hunahpu', '武库布·胡纳普', 'Vucub Hunahpu', '第一代球员与胡恩·胡纳普的兄弟', ['球场', '兄弟', '西巴尔巴召唤'], 'hero', ['world-xibalba'], ['kiche-popol-vuh'], ['K’iche’ narrative record'], 'First Ballplayers'],
  ['xmucane', '希穆卡内', 'Xmucane', '创世与祖辈叙事中的老妇人', ['祖母', '玉米', '占卜'], 'deity', ['world-kiche-highlands'], ['kiche-popol-vuh', 'creation'], ['K’iche’ narrative record'], 'Creation and Maize Humanity'],
  ['xpiyacoc', '希皮亚科克', 'Xpiyacoc', '创世与祖辈叙事中的祖父角色', ['占卜', '创造', '祖父'], 'deity', ['world-kiche-highlands'], ['kiche-popol-vuh', 'creation'], ['K’iche’ narrative record'], 'Creation and Maize Humanity'],
  ['vucub-caquix', '武库布·卡基什', 'Vucub Caquix / Seven Macaw', '自称太阳与月亮的虚假光辉者', ['巨型金刚鹦鹉', '宝石牙', '虚假太阳'], 'monster', ['world-kiche-highlands'], ['kiche-popol-vuh', 'false-radiance'], ['K’iche’ narrative record'], 'Seven Macaw cycle'],
  ['zipacna', '齐帕克纳', 'Zipacna', '与山岳和大地力量相连的巨人', ['山岳', '大地', '四百少年'], 'monster', ['world-kiche-highlands'], ['kiche-popol-vuh'], ['K’iche’ narrative record'], 'Zipacna episode'],
  ['cabrakan', '卡布拉坎', 'Cabrakan', '撼动山岳的地震与大地巨人', ['地震', '山岳', '力量'], 'monster', ['world-kiche-highlands'], ['kiche-popol-vuh'], ['K’iche’ narrative record'], 'Cabrakan episode'],
  ['camazotz', '卡马佐茨', 'Camazotz', '蝙蝠屋与西巴尔巴试炼中的蝙蝠存在', ['蝙蝠', '洞穴', '夜行'], 'monster', ['world-xibalba'], ['kiche-popol-vuh', 'xibalba'], ['K’iche’ narrative record'], 'Bat House'],
  ['tohil', '托希尔', 'Tohil', 'K’iche’ 叙事中与火和祖先秩序相连的神祇', ['火', '祭仪', '山地'], 'deity', ['world-kiche-highlands'], ['kiche-popol-vuh', 'maize-cosmos'], ['K’iche’ narrative record'], 'Tohil and first fire'],
  ['awilix', '阿维利克斯', 'Awilix', 'K’iche’ 叙事中与仪式秩序相连的神祇', ['祭仪', '夜色', '山地'], 'deity', ['world-kiche-highlands'], ['kiche-popol-vuh'], ['K’iche’ narrative record'], 'Tohil and first fire'],
  ['jacawitz', '雅卡维茨', 'Jacawitz', 'K’iche’ 叙事中的山地神祇', ['山峰', '火', '祖先'], 'deity', ['world-kiche-highlands'], ['kiche-popol-vuh'], ['K’iche’ narrative record'], 'Tohil and first fire'],
  ['huracan', '胡拉坎', 'Huracan / Heart of Sky', '《Popol Vuh》创世中的风暴与天空力量', ['风暴', '闪电', '天空之心'], 'deity', ['world-kiche-highlands'], ['kiche-popol-vuh', 'creation'], ['K’iche’ narrative record'], 'Creation and animals'],
  ['maize-god', '玛雅玉米神（古典期图像层）', 'Classic Maya Maize Deity', '古典期玉米死亡、出土与王权图像中的解释层', ['玉米', '出土', '王权'], 'deity', ['world-classic-lowlands'], ['classic-lowland', 'maize-cosmos'], ['Classic Maya'], 'Classic iconography bridge'],
  ['chaak', '查克', 'Chaak', '古典期与后古典期证据中的雨、雷与农业神祇', ['雨', '雷斧', '长鼻'], 'deity', ['world-classic-lowlands'], ['classic-lowland', 'rain-and-storm'], ['Classic Maya', 'Postclassic Maya'], 'Rain and storm iconography'],
  ['kawiil', '卡维尔', 'K’awiil', '与闪电、王权与丰饶意象相连的古典期神祇', ['闪电', '权杖', '玉米'], 'deity', ['world-classic-lowlands'], ['classic-lowland', 'rain-and-storm'], ['Classic Maya'], 'Classic iconography bridge'],
  ['kinich-ajaw', '基尼奇·阿哈乌', 'K’inich Ajaw', '太阳与王权图像中的古典期身份层', ['太阳', '王权', '光线'], 'deity', ['world-classic-lowlands'], ['classic-lowland'], ['Classic Maya'], 'Classic solar imagery'],
];

export const mayaCharacters: readonly Character[] = seeds.map(makeCharacter);

export const mayaWorlds: readonly World[] = [
  { id: 'world-kiche-highlands', mythologyId, slug: 'kiche-highlands', name: '基切高地', nameEn: "K'iche' Highlands", summary: '以《Popol Vuh》K’iche’ 叙事为范围的高地世界；不代表所有 Maya 地区。', canonicalDesign: { anchors: ['火山高地', '云林', '玉米田', '山地黎明'], signatureMaterials: ['石灰岩', '木', '玉石', '编织物'], atmosphere: ['高地云雾', '祖先秩序', '黎明'] }, heroImage: mayaHero },
  { id: 'world-xibalba', mythologyId, slug: 'xibalba', name: '西巴尔巴', nameEn: 'Xibalba', summary: '《Popol Vuh》/K’iche’ 传统中的地下世界与试炼秩序，不作为所有 Maya 地下意象的统一专名。', canonicalDesign: { anchors: ['试炼之屋', '黑暗道路', '球场', '蝙蝠屋'], signatureMaterials: ['黑曜石', '洞穴石灰岩', '暗色灰泥'], atmosphere: ['幽暗', '边界', '试炼'] }, heroImage: mayaHero },
  { id: 'world-classic-lowlands', mythologyId, slug: 'classic-lowlands', name: '古典期低地', nameEn: 'Classic Lowlands', summary: '以碑铭、器物、建筑与图像证据组织的低地 Maya 视觉与身份桥接层；不是一部连续神话文本。', canonicalDesign: { anchors: ['石灰岩神庙', '灰泥立面', '碑铭', '玉石礼仪'], signatureMaterials: ['石灰岩', '灰泥', '玉石', '贝壳'], atmosphere: ['热带低地', '宫廷', '天文秩序'] }, heroImage: mayaHero },
];

const scene = (slug: string, name: string, nameEn: string, summary: string, worldId?: string): Scene => ({ id: `scene-${slug}`, mythologyId, worldId, slug, name, nameEn, summary, canonicalDesign: { anchors: [name, '来源范围清晰的 Maya 空间意象', '可复用的叙事地标'] }, heroImage: mayaHero });
export const mayaScenes: readonly Scene[] = [
  scene('primordial-water', '原初水域', 'Primordial Water', '《Popol Vuh》创世开端的寂静水域。', 'world-kiche-highlands'),
  scene('seven-macaw-tree', '七金刚鹦鹉之树', 'Seven Macaw Tree', '虚假光辉者栖息并宣称自身为太阳与月亮的树。', 'world-kiche-highlands'),
  scene('first-ballcourt', '第一球场', 'First Ballcourt', '第一代球员与西巴尔巴召唤相连的球场。', 'world-kiche-highlands'),
  scene('calabash-tree', '葫芦树', 'Calabash Tree', '希奎克受孕与跨越边界的葫芦树场景。', 'world-xibalba'),
  scene('road-to-xibalba', '通往西巴尔巴的道路', 'Road to Xibalba', '通往地下世界、由道路和门槛构成的试炼路径。', 'world-xibalba'),
  scene('xibalba-council', '西巴尔巴议庭', 'Xibalba Council', '西巴尔巴诸王设下邀请与陷阱的权力空间。', 'world-xibalba'),
  scene('trial-houses', '试炼之屋', 'Houses of Trial', '黑暗、刀刃、寒冷与火焰等试炼空间的集合。', 'world-xibalba'),
  scene('bat-house', '蝙蝠屋', 'Bat House', '英雄双子在西巴尔巴面对蝙蝠危险的封闭空间。', 'world-xibalba'),
  scene('maize-creation-place', '玉米造人之地', 'Place of Maize Humanity', '白玉米与黄玉米成为人类身体与共同体起点的创世空间。', 'world-kiche-highlands'),
  scene('first-dawn-highlands', '第一次黎明高地', 'Highlands at First Dawn', '第一次黎明照亮高地、神祇与人类秩序的边界。', 'world-kiche-highlands'),
  scene('witz-sacred-mountain', '维茨神山', 'Witz Sacred Mountain', '古典期山岳、洞穴与神圣地景的图像解释层。', 'world-classic-lowlands'),
  scene('codex-rain-almanac', '历书中的雨仪式空间', 'Codex Rain Almanac Space', '后古典期 Codex 雨与历法材料的来源限定场景。', 'world-classic-lowlands'),
];

const taxonomy = (slug: string, name: string, nameEn: string, kind: TaxonomyTerm['kind'], displayOrder: number): TaxonomyTerm => ({ id: `taxonomy-maya-${slug}`, mythologyId, slug, kind, name, nameEn, summary: `${name}相关的玛雅神话内容分组。`, displayOrder });
export const mayaTaxonomy: readonly TaxonomyTerm[] = [
  taxonomy('kiche-popol-vuh', "K’iche’ / Popol Vuh", "K'iche' / Popol Vuh", 'editorial-collection', 10), taxonomy('classic-lowland', '古典期低地', 'Classic Lowland', 'editorial-collection', 20), taxonomy('hero-twins', '英雄双子', 'Hero Twins', 'story-cycle', 30), taxonomy('false-radiance', '虚假光辉', 'False Radiance', 'story-cycle', 40), taxonomy('xibalba', '西巴尔巴试炼', 'Xibalba Trials', 'story-cycle', 50), taxonomy('creation', '创世与造人', 'Creation and Humanity', 'story-cycle', 60), taxonomy('maize-cosmos', '玉米宇宙', 'Maize Cosmos', 'domain', 70), taxonomy('rain-and-storm', '雨与风暴', 'Rain and Storm', 'domain', 80),
];

export const mayaConcepts: readonly ContentConcept[] = [
  { id: 'concept-maya-maize-emergence', mythologyId, slug: 'maize-emergence', name: '古典期玉米出土母题', summary: '古典期图像中围绕玉米神、出土、王权与生命循环组织的解释概念；不等同于《Popol Vuh》中的胡恩·胡纳普。', sourceRefs: [sourceRef('classicBridge', 'maize emergence imagery')] },
  { id: 'concept-maya-rain-almanac', mythologyId, slug: 'rain-almanac', name: 'Codex 雨历书传统', summary: '以 Codex 中的雨、农业与历法材料为范围的仪式 / 宇宙秩序概念。', sourceRefs: [sourceRef('dresden', 'rain almanac sections')] },
  { id: 'concept-maya-identity-bridge', mythologyId, slug: 'identity-bridge', name: '跨时期身份对应', summary: '用于展示古典期图像、后古典期 Codex 与殖民期 Yucatec 名称之间的谨慎对应，不是一个统一神名。', sourceRefs: [sourceRef('chilamBalam', 'naming and ritual sections'), sourceRef('classicBridge', 'identity comparison')] },
];

const relation = (id: string, fromCharacterId: string, toCharacterId: string, relationType: string, ref: ReturnType<typeof sourceRef>, traditionScope = kiche, isDefault = true): CharacterRelation => ({ id, fromCharacterId, toCharacterId, relationType, assertionKey: `${fromCharacterId}|${toCharacterId}|${relationType}`, traditionScope, isDefault, sourceRefs: [ref], confidence: 'high' });
const conceptRelation = (id: string, fromCharacterId: string, toConceptId: string, relationType: string, ref: ReturnType<typeof sourceRef>, traditionScope: string, confidence: CharacterRelation['confidence'] = 'medium'): CharacterRelation => ({ id, fromCharacterId, toConceptId, relationType, assertionKey: `${fromCharacterId}|${toConceptId}|${relationType}`, traditionScope, isDefault: false, sourceRefs: [ref], confidence });

export const mayaRelations: readonly CharacterRelation[] = [
  relation('maya-parent-xmucane-hun-hunahpu', 'character-xmucane', 'character-hun-hunahpu', 'parent', sourceRef('popolVuh', '祖辈与第一代球员段落')),
  relation('maya-parent-xpiyacoc-hun-hunahpu', 'character-xpiyacoc', 'character-hun-hunahpu', 'parent', sourceRef('popolVuh', '祖辈与第一代球员段落')),
  relation('maya-parent-xmucane-vucub-hunahpu', 'character-xmucane', 'character-vucub-hunahpu', 'parent', sourceRef('popolVuh', '祖辈与第一代球员段落')),
  relation('maya-parent-hun-hunahpu-hunahpu', 'character-hun-hunahpu', 'character-hunahpu', 'parent', sourceRef('popolVuh', 'Hero Twins birth and lineage')),
  relation('maya-parent-xquic-hunahpu', 'character-xquic', 'character-hunahpu', 'parent', sourceRef('popolVuh', 'Xquic and the twins')),
  relation('maya-parent-xquic-xbalanque', 'character-xquic', 'character-xbalanque', 'parent', sourceRef('popolVuh', 'Xquic and the twins')),
  relation('maya-sibling-hunahpu-xbalanque', 'character-hunahpu', 'character-xbalanque', 'sibling', sourceRef('popolVuh', 'Hero Twins narrative')),
  relation('maya-parent-vucub-caquix-zipacna', 'character-vucub-caquix', 'character-zipacna', 'parent', sourceRef('popolVuh', 'Seven Macaw cycle')),
  relation('maya-parent-vucub-caquix-cabrakan', 'character-vucub-caquix', 'character-cabrakan', 'parent', sourceRef('popolVuh', 'Seven Macaw cycle')),
  relation('maya-enemy-hunahpu-vucub-caquix', 'character-hunahpu', 'character-vucub-caquix', 'enemy', sourceRef('popolVuh', 'Seven Macaw cycle')),
  relation('maya-enemy-xbalanque-vucub-caquix', 'character-xbalanque', 'character-vucub-caquix', 'enemy', sourceRef('popolVuh', 'Seven Macaw cycle')),
  relation('maya-defeats-hunahpu-camazotz', 'character-hunahpu', 'character-camazotz', 'defeats', sourceRef('popolVuh', 'Bat House trial'), kiche, false),
  relation('maya-ally-tohil-awilix', 'character-tohil', 'character-awilix', 'ally', sourceRef('popolVuh', 'Tohil, Awilix and Jacawitz'), kiche),
  relation('maya-ally-tohil-jacawitz', 'character-tohil', 'character-jacawitz', 'ally', sourceRef('popolVuh', 'Tohil, Awilix and Jacawitz'), kiche),
  conceptRelation('maya-concept-maize-god-emergence', 'character-maize-god', 'concept-maya-maize-emergence', 'associated-with', sourceRef('classicBridge', 'maize emergence imagery'), classic, 'medium'),
  conceptRelation('maya-concept-chaak-rain-almanac', 'character-chaak', 'concept-maya-rain-almanac', 'associated-with', sourceRef('dresden', 'rain almanac sections'), 'Postclassic Maya codical tradition', 'high'),
  conceptRelation('maya-concept-kawiil-identity-bridge', 'character-kawiil', 'concept-maya-identity-bridge', 'associated-with', sourceRef('classicBridge', 'K’awiil identity comparison'), classic, 'contested'),
];
