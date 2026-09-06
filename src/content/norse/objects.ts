import type { ContentRelation, MythicObject, MythicObjectType } from '../../lib/content/types';
import { sourceRef } from './sources';

const mythologyId = 'myth-norse';

const object = (
  slug: string,
  name: string,
  nameEn: string,
  nativeName: string,
  objectType: MythicObjectType,
  summary: string,
  sourceRefs: MythicObject['sourceRefs'],
  anchors: readonly string[],
): MythicObject => ({
  id: `object-norse-${slug}`,
  mythologyId,
  slug,
  name,
  nameEn,
  nativeName,
  objectType,
  summary,
  sourceRefs,
  canonicalDesign: {
    anchors,
    signatureMaterials: ['铁', '木材', '织物或金属工艺须有明确来源范围'],
    mythologicalFacts: [summary],
    originalDesignChoices: ['采用 MythCanvas 原创北欧材质与装饰组合；不复制现代影视、游戏或商业卡牌设计。'],
    avoid: ['现代超级英雄道具语言', '无来源的霓虹符文', '现代游戏专属轮廓'],
  },
});

export const norseMythicObjects: readonly MythicObject[] = [
  object('sun-chariot', '太阳之车', 'Chariot of the Sun', 'sólarvagn', 'vehicle', '《欺骗古鲁菲》第十一章叙述索尔驾驭由阿尔瓦克与阿尔斯维德牵引的太阳之车，使太阳沿天穹运行；视觉设计应强调天体运行功能，而不是现代奇幻战车。', [sourceRef('proseEddaGylfaginning', 'ch. 11')], ['索尔', '阿尔瓦克与阿尔斯维德', '太阳运行']),
  object('svalinn', '斯瓦林之盾', 'Svalinn', 'Svalinn', 'artifact', '《格里姆尼尔之歌》第三十八节提到斯瓦林位于太阳之前，阻隔其炽热；它是具有宇宙功能的盾，不应被设计成普通战斗装备。', [sourceRef('grimnismal', 'st. 38')], ['太阳前方的盾', '阻隔炽热', '宇宙秩序']),
  object('mjolnir', '妙尔尼尔', 'Mjölnir', 'Mjǫllnir', 'weapon', '索尔的锤，是守护、婚宴伪装与终局战斗中不可替代的关键物件。', [sourceRef('thrymskvida', 'st. 1–32'), sourceRef('proseEddaSkaldskaparmal', 'ch. 35')], ['短柄锤', '索尔的守护职责', '来源范围明确的北欧金属工艺']),
  object('gungnir', '冈格尼尔', 'Gungnir', 'Gungnir', 'weapon', '奥丁的长矛，作为其身份与战争 / 王权意象的一部分，需按不同来源范围表达。', [sourceRef('proseEddaSkaldskaparmal', 'ch. 43')], ['长矛', '奥丁', '誓约与王权']),
  object('draupnir', '德罗普尼尔', 'Draupnir', 'Draupnir', 'jewel', '会增殖的金环，出现在宝物锻造与巴德尔葬礼相关叙事中。', [sourceRef('proseEddaSkaldskaparmal', 'ch. 35'), sourceRef('proseEddaGylfaginning', 'ch. 49')], ['金环', '增殖', '葬礼赠物']),
  object('gleipnir', '格莱普尼尔', 'Gleipnir', 'Gleipnir', 'artifact', '束缚芬里尔的柔软而不可断裂的系缚，情节意义在于契约、恐惧与提尔失手。', [sourceRef('proseEddaGylfaginning', 'ch. 34')], ['细带', '不可能材料', '束缚芬里尔']),
  object('gjallarhorn', '加拉尔号角', 'Gjallarhorn', 'Gjallarhorn', 'symbolic-object', '海姆达尔在诸神黄昏中吹响的号角，作为公共警报而非普通乐器。', [sourceRef('voluspa', 'st. 46'), sourceRef('proseEddaGylfaginning', 'ch. 27')], ['号角', '海姆达尔', '末日警报']),
  object('brisingamen', '布里辛嘉曼', 'Brísingamen', 'Brísingamen', 'jewel', '芙蕾雅的项链；叙事细节分散且版本复杂，只以明确来源支撑具体说法。', [sourceRef('hyndluljod', 'st. 47'), sourceRef('proseEddaGylfaginning', 'ch. 35')], ['颈饰', '芙蕾雅', '版本范围']),
  object('skidbladnir', '斯基德布拉德尼尔', 'Skíðblaðnir', 'Skíðblaðnir', 'vehicle', '弗雷的可折叠神船，是宝物锻造与丰饶神身份相关的航行物件。', [sourceRef('proseEddaGylfaginning', 'ch. 43'), sourceRef('proseEddaSkaldskaparmal', 'ch. 35')], ['折叠船', '弗雷', '顺风航行']),
  object('gram', '格拉墨', 'Gram', 'Gramr', 'weapon', '沃尔松格英雄传统中的剑，连接西格蒙德、西格尔德、雷金与屠龙叙事。', [sourceRef('reginsmal', 'selected stanzas'), sourceRef('volsungaSaga', 'chs. 13–18')], ['剑', '沃尔松格家系', '屠龙']),
  object('andvaranaut', '安德瓦里之环', 'Andvaranaut', 'Andvaranaut', 'jewel', '被诅咒的金环，是 Ótr、Andvari、Fafnir 与西格尔德故事链的关键。', [sourceRef('reginsmal', 'selected stanzas'), sourceRef('volsungaSaga', 'chs. 14–18')], ['金环', '诅咒宝藏', '英雄悲剧']),
  object('idunn-apples', '伊登的青春苹果', 'Iðunn’s Apples', 'epli Iðunnar', 'food', '伊登守护的苹果，使诸神的青春、秩序与她被掳走的危机相互关联。', [sourceRef('haustlong', 'selected stanzas'), sourceRef('proseEddaSkaldskaparmal', 'ch. 1')], ['苹果', '伊登', '诸神衰老']),
  object('mead-of-poetry', '诗歌蜜酒', 'Mead of Poetry', 'skáldskaparmjöðr', 'substance', '由克瓦希尔之血制成的蜜酒，连接语言、知识、盗取与奥丁的伪装。', [sourceRef('proseEddaSkaldskaparmal', 'ch. 1')], ['蜜酒', '克瓦希尔', '诗歌与知识']),
  object('hringhorni', '赫林霍尔尼葬船', 'Hringhorni', 'Hringhorni', 'vessel', '巴德尔葬礼中的船；必须与诸神黄昏的 Naglfar 明确分开。', [sourceRef('proseEddaGylfaginning', 'ch. 49'), sourceRef('husdrapa', 'selected stanzas')], ['葬船', '巴德尔', '火葬仪式']),
  object('naglfar', '纳吉尔法战船', 'Naglfar', 'Naglfar', 'vessel', '诸神黄昏中出现的死亡之船，不能被误用为巴德尔的葬船。', [sourceRef('voluspa', 'st. 50'), sourceRef('proseEddaGylfaginning', 'ch. 51')], ['战船', '诸神黄昏', '末日航行']),
  object('freyrs-sword', '弗雷之剑', 'Freyr’s Sword', 'sverð Freys', 'weapon', '弗雷放弃的剑在其与苏尔特的终局叙事中具有关键代价意义。', [sourceRef('skirnismal', 'st. 8–10'), sourceRef('proseEddaGylfaginning', 'ch. 37')], ['剑', '弗雷', '失去的武器']),
  object('megingjord', '力量腰带', 'Megingjörð', 'Megingjǫrð', 'artifact', '索尔的力量腰带，属于其装备系统，需避免将其表现成现代超级英雄配件。', [sourceRef('proseEddaGylfaginning', 'ch. 21'), sourceRef('thorsdrapa', 'selected stanzas')], ['腰带', '索尔', '力量']),
  object('jarngreipr', '铁手套', 'Járngreipr', 'Járngreipr', 'artifact', '索尔使用的铁手套，与锤及力量腰带共同组成来源范围内的装备语境。', [sourceRef('proseEddaGylfaginning', 'ch. 21'), sourceRef('thorsdrapa', 'selected stanzas')], ['铁手套', '索尔', '装备系统']),
];

const relation = (
  id: string,
  from: ContentRelation['from'],
  to: ContentRelation['to'],
  relationType: string,
  sourceRefs: ContentRelation['sourceRefs'],
  traditionScope: string,
): ContentRelation => ({ id, mythologyId, from, to, relationType, sourceRefs, traditionScope, confidence: 'high' });

export const norseContentRelations: readonly ContentRelation[] = [
  relation('norse-object-sun-chariot-sol', { type: 'mythic-object', id: 'object-norse-sun-chariot' }, { type: 'character', id: 'character-sol' }, 'driven-by', [sourceRef('proseEddaGylfaginning', 'ch. 11')], 'Gylfaginning celestial tradition'),
  relation('norse-object-svalinn-sun-cycle', { type: 'mythic-object', id: 'object-norse-svalinn' }, { type: 'story', id: 'story-sun-and-moon-chase' }, 'protective-object-in', [sourceRef('grimnismal', 'st. 38')], 'Grímnismál celestial tradition'),
  relation('norse-object-mjolnir-thor', { type: 'mythic-object', id: 'object-norse-mjolnir' }, { type: 'character', id: 'character-thor' }, 'wielded-by', [sourceRef('thrymskvida', 'st. 1–32')], 'Þrymskviða tradition'),
  relation('norse-object-hringhorni-baldr', { type: 'mythic-object', id: 'object-norse-hringhorni' }, { type: 'character', id: 'character-baldr' }, 'funerary-vessel-for', [sourceRef('proseEddaGylfaginning', 'ch. 49')], 'Gylfaginning tradition'),
  relation('norse-object-naglfar-ragnarok', { type: 'mythic-object', id: 'object-norse-naglfar' }, { type: 'story', id: 'story-ragnarok' }, 'appears-in', [sourceRef('voluspa', 'st. 50')], 'Völuspá tradition'),
  relation('norse-object-gleipnir-fenrir', { type: 'mythic-object', id: 'object-norse-gleipnir' }, { type: 'character', id: 'character-fenrir' }, 'binds', [sourceRef('proseEddaGylfaginning', 'ch. 34')], 'Gylfaginning binding tradition'),
  relation('norse-object-gram-sigurd', { type: 'mythic-object', id: 'object-norse-gram' }, { type: 'character', id: 'character-sigurd' }, 'wielded-by', [sourceRef('reginsmal', 'selected stanzas')], 'Eddic heroic tradition'),
];
